export const siteConfig = {
  name: "JokeMasti",
  tagline: "Hasi Ka Daily Dose!",
  description:
    "Best Hindi Jokes, Hinglish Jokes, English Jokes, Funny Memes, Desi Memes aur Funny Images. Har din naya entertainment — JokeMasti pe.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://jokemasti.in",
  locale: "en_IN",
  twitterHandle: "@jokemasti",
  keywords: [
    "hindi jokes",
    "hinglish jokes",
    "funny memes",
    "desi memes",
    "whatsapp jokes",
    "funny images",
    "trending memes india",
    "festival jokes",
    "jokemasti",
  ],
};

export type SiteConfig = typeof siteConfig;

// When the app is deployed under a subpath (e.g. GitHub Pages project sites
// serve from https://<user>.github.io/<repo>/, not the domain root),
// next.config.ts sets Next's `basePath` to that same subpath so every
// framework-generated URL (next/link, next/image local imports, the
// metadata API) already includes it automatically. Derived here from the
// same siteConfig.url so the two never drift apart.
//
// That automatic handling does NOT cover plain public/-folder string paths
// used as a raw <img>/<Image> src, a fetch()/download URL, or a service
// worker registration path — those are just strings to Next, so anywhere
// one of those is built from data (e.g. a Meme's `image`/`thumbnail`
// field) it must be passed through withBasePath() before use.
export const basePath = (() => {
  try {
    const pathname = new URL(siteConfig.url).pathname.replace(/\/+$/, "");
    return pathname;
  } catch {
    return "";
  }
})();

export function withBasePath(path: string): string {
  if (!basePath || !path.startsWith("/")) return path;
  return `${basePath}${path}`;
}
