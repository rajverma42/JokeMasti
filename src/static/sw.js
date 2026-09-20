/*!
 * JokeMasti service worker.
 * Strategy: network-first for pages (with offline fallback),
 * stale-while-revalidate for static assets (css/js/images).
 *
 * Every path below is derived from self.registration.scope rather than
 * hardcoded as root-absolute ("/foo"), so this file works unmodified
 * whether the site is served from the domain root or from a repo subpath
 * (e.g. GitHub Pages' /JokeMasti/) — the scope already carries that
 * prefix, since it's the directory this script was registered from.
 */
var VERSION = 'jm-v1';
var SHELL_CACHE = VERSION + '-shell';
var RUNTIME_CACHE = VERSION + '-runtime';
var SCOPE = self.registration.scope; // e.g. "https://host/" or ".../JokeMasti/"
var OFFLINE_URL = new URL('offline.html', SCOPE).href;

var SHELL_FILES = [
  SCOPE,
  OFFLINE_URL,
  new URL('assets/css/style.css', SCOPE).href,
  new URL('assets/js/app.js', SCOPE).href,
  new URL('assets/img/icon-192.png', SCOPE).href,
  new URL('manifest.json', SCOPE).href,
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then(function (cache) {
        return cache.addAll(SHELL_FILES);
      })
      .then(function () {
        return self.skipWaiting();
      })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches
      .keys()
      .then(function (keys) {
        return Promise.all(
          keys
            .filter(function (k) {
              return k.indexOf(VERSION) !== 0;
            })
            .map(function (k) {
              return caches.delete(k);
            })
        );
      })
      .then(function () {
        return self.clients.claim();
      })
  );
});

function isStaticAsset(url) {
  return /\.(css|js|png|jpg|jpeg|webp|svg|woff2?|ico)$/.test(url.pathname);
}

self.addEventListener('fetch', function (event) {
  var req = event.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.origin !== location.origin) return;

  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then(function (res) {
          var copy = res.clone();
          caches.open(RUNTIME_CACHE).then(function (cache) {
            cache.put(req, copy);
          });
          return res;
        })
        .catch(function () {
          return caches.match(req).then(function (cached) {
            return cached || caches.match(OFFLINE_URL);
          });
        })
    );
    return;
  }

  if (isStaticAsset(url)) {
    event.respondWith(
      caches.match(req).then(function (cached) {
        var network = fetch(req)
          .then(function (res) {
            if (res && res.status === 200) {
              var copy = res.clone();
              caches.open(RUNTIME_CACHE).then(function (cache) {
                cache.put(req, copy);
              });
            }
            return res;
          })
          .catch(function () {
            return cached;
          });
        return cached || network;
      })
    );
  }
});
