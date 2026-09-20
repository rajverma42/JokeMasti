// JokeMasti service worker — minimal, safe caching for an offline fallback
// and faster repeat visits. Keeps things simple: navigations go
// network-first with an offline fallback; static assets (Next's hashed
// _next/static files, images, icons) go cache-first since their filenames
// are content-hashed and therefore safe to cache long-term.
//
// Every path below is derived from self.registration.scope rather than
// hardcoded as root-absolute ("/foo"), so this file works unmodified
// whether the site is served from the domain root or from a repo subpath
// (e.g. GitHub Pages' /JokeMasti/) — the scope already carries that
// prefix, since it's the directory this script was registered from.
const CACHE_NAME = "jokemasti-v1";
const SCOPE_PATH = new URL(self.registration.scope).pathname; // e.g. "/" or "/JokeMasti/"
const OFFLINE_URL = new URL("offline", self.registration.scope).pathname;
const PRECACHE_URLS = [
  OFFLINE_URL,
  `${SCOPE_PATH}icons/icon-192.png`,
  `${SCOPE_PATH}manifest.webmanifest`,
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

function isStaticAsset(url) {
  const path = url.pathname;
  return (
    path.startsWith(`${SCOPE_PATH}_next/static/`) ||
    path.startsWith(`${SCOPE_PATH}icons/`) ||
    path.startsWith(`${SCOPE_PATH}images/`) ||
    path.startsWith(`${SCOPE_PATH}og/`) ||
    /\.(?:png|jpg|jpeg|webp|avif|svg|ico|woff2?)$/.test(path)
  );
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(async () => {
        const cache = await caches.open(CACHE_NAME);
        return (await cache.match(request)) || (await cache.match(OFFLINE_URL));
      })
    );
    return;
  }

  if (isStaticAsset(url)) {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;
        try {
          const response = await fetch(request);
          if (response.ok) cache.put(request, response.clone());
          return response;
        } catch {
          return cached || Response.error();
        }
      })
    );
  }
});
