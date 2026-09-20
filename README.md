# JokeMasti — Hasi Ka Daily Dose! 😂

A production-quality, mobile-first Hindi/Hinglish/English jokes platform for
Indian users. Fully static, framework-free, fast, SEO-optimised, ad-ready,
and installable as a PWA. No login, no database, no AI, no paid APIs
required to run it.

## What's in here

- **277 statically generated pages** — home, jokes (14 categories, paginated,
  + 208 individual joke pages), trending, 16 festival hub/detail pages, a
  WhatsApp status/shayari corner, search, saved/bookmarks, 6 legal pages, and
  404/offline fallbacks.
- **Client-side search, copy, share (WhatsApp/Telegram/Facebook/X/native),
  bookmark and like**, all in one ~20KB vanilla JS file — no frameworks, no
  build step needed to run it in a browser.
- **PWA**: manifest, service worker (network-first pages, cache-first
  assets), offline fallback page, install prompt.
- **SEO**: unique title/description/canonical per page, Open Graph + Twitter
  cards, JSON-LD (Organization, WebSite+SearchAction, BreadcrumbList,
  CreativeWork on jokes), auto-generated `sitemap.xml` + `robots.txt`, clean
  semantic URLs.
- **AdSense-ready** ad containers on every page — disabled by default so
  nothing loads until you flip a switch (see below).

> **Note on Memes**: the Memes feature (meme pages, nav links, meme cards,
> Trending/Saved integration) has been removed from the live site. The
> underlying data (`data/memes.json`, `data/categories.json`'s `memes`
> array) and the artwork generator (`scripts/generate_images.py`) are kept
> in the repo, unused, so the feature can be re-built later without
> recreating that content from scratch — see `src/pages/memes.js` (also
> kept, unused) for the original page-builder logic.

## Project structure

```
data/               Content — the only place you edit to add/change jokes, festivals, categories
  jokes/*.json         One file per joke category
  memes.json            Unused — kept for a possible future re-enable of Memes
  categories.json       Category metadata (name, emoji, SEO copy) for jokes (its `memes` array is unused)
  festivals.json         16 festivals: intro copy + wishes
  status.json             WhatsApp status/shayari/good-morning/good-night content
  site.json                 Site-wide config: name, tagline, URLs, ads, pagination

src/
  lib/                 Pure data + string helpers (no HTML)
  templates/            layout.js (head/header/footer/page shell), components.js (cards, buttons…), icons.js (inline SVG sprite)
  pages/                One file per route family — returns full HTML strings (memes.js is unused, kept for reference)
  assets/css/style.css   The entire design system (one file, mobile-first)
  assets/js/app.js        All client behaviour (theme, search, share, bookmarks, sort, install, SW registration)
  static/sw.js             Service worker source

scripts/
  generate_images.py     Unused — renders original meme artwork + brand/icon assets (Pillow); still used for the brand icons/OG image
  check-links.js          Crawls dist/ and verifies every internal href/src resolves
  screenshot.mjs           Playwright visual QA across mobile/desktop/dark mode

build.js               The static site generator — reads data/, writes dist/
dist/                  Build output (gitignored) — deploy this folder as-is
```

## Building it

```bash
npm run build      # generates dist/ (~277 pages) from data/
npm run check       # crawls dist/ for broken internal links/assets
npm run images        # regenerate brand icons/OG image (also renders meme artwork, currently unused)
```

Requires Node 18+. Regenerating images requires Python 3 + Pillow
(`pip install pillow --break-system-packages`) and the Poppins font family
(already used from `/usr/share/fonts` in the reference environment — point
`FONT_DIR` in the script at your own font if it's elsewhere).

## Adding content

Everything is data-driven — you never touch HTML to add a joke.

**Add a joke**: append an object to the right file in `data/jokes/`:

```json
{
  "id": "jk-hi-017",
  "slug": "a-unique-url-slug",
  "title": "Joke Title",
  "text": "Line one.\nLine two. 😂",
  "category": "hindi-jokes",
  "tags": ["tag1", "tag2"],
  "language": "hi",
  "createdAt": "2026-09-21",
  "score": 85
}
```

`language` is `"hi"` (Devanagari), `"hinglish"`, or `"en"` — it controls the
`lang` attribute for accessible text-to-speech. `score` (0–100) is an
editorial quality/ranking signal used for "Popular"/"Trending" sorting; it's
never shown to users as a fake engagement count.

**Add a category or festival**: edit `data/categories.json` /
`data/festivals.json` — pages are generated automatically.

## Honest metrics, by design

Like/share/download/view counts start at **0** everywhere — nothing is
pre-inflated. The Trending page ranks by an editorial "Buzz score" rather
than inventing specific share/like counts, so nothing on the site claims
social proof that doesn't exist yet. Likes and bookmarks a visitor makes are
stored only in their own browser (`localStorage`) — there's no backend, so
nothing is shared across users or sent anywhere.

## Going live with ads (Google AdSense)

Ad containers are on every page already, clearly labelled, and never shift
layout — but they render as empty placeholders until you turn ads on. Edit
`data/site.json`:

```json
"ads": {
  "enabled": true,
  "client": "ca-pub-XXXXXXXXXXXXXXXX"
}
```

Run `npm run build` again — every ad slot becomes a real
`<ins class="adsbygoogle">` unit, the AdSense loader script is added
automatically, and `app.js` pushes each unit on page load. No other code
changes needed.

## Deploying

The output is a plain static folder — any static host works.

- **Netlify / Vercel**: connect the repo; `netlify.toml` / `vercel.json` are
  already set up (build command `npm run build`, publish dir `dist`, cache
  headers, security headers, clean URLs, automatic 404 page).
- **GitHub Pages**: `.github/workflows/deploy-pages.yml` builds and publishes
  `dist/` on every push to `main` — the one prerequisite is a repo setting
  this workflow can't flip on its own: **Settings → Pages → Build and
  deployment → Source → "GitHub Actions"** (it starts as "Deploy from a
  branch", which just runs GitHub's own Jekyll pipeline over whatever's in
  the repo root instead of running this build). A GitHub Pages *project*
  site (`https://<user>.github.io/<repo>/`) is served from a subpath, not
  the domain root, so the workflow passes a `SITE_URL` env var that
  `build.js` uses to compute the right base path for every internal link,
  asset path, and the service worker/manifest — see the "Base path" log
  line it prints. Deploying elsewhere under a subpath (not the domain
  root)? Set `SITE_URL` the same way when you run `node build.js` yourself.
- **Cloudflare Pages / any other static host**: run `npm run build` (add
  `SITE_URL=https://your-domain` only if serving from a subpath — omit it
  for a normal domain-root deploy) and upload the contents of `dist/` —
  directory-style URLs (`/jokes/hindi-jokes/`) and `404.html` are both
  handled natively by every major static host without extra config.

Before going live, update `data/site.json` → `url` to your real domain (it
feeds canonical URLs, the sitemap, and structured data) — or override it
per-build with the `SITE_URL` env var described above without editing the
file, e.g. for a staging deploy.

## Performance notes

- Single ~27KB CSS file, single ~24KB deferred JS file, no external fonts
  (system font stack — zero font-loading cost, native Devanagari support)
  and no third-party libraries.
- Every image ships with explicit `width`/`height` (no layout shift) and
  `loading="lazy"` off the initial viewport.
- Pages are pre-rendered HTML — there's no client-side render step for the
  first paint; JS only adds interactivity on top.

## What's intentionally out of scope for v1

- No server/database — content lives in JSON and is compiled at build time.
  Swapping in a CMS or DB later means changing `src/lib/data.js`'s loaders;
  every page builder already consumes a plain in-memory content graph, so
  the rest of the codebase doesn't need to change.
- No AI features — search is a plain client-side keyword index.
- The contact form uses a `mailto:` submit (opens the visitor's mail app
  pre-filled) since there's no backend. Swap the form's `action` for a form
  service (Netlify Forms, Formspree, etc.) if you want submissions to land
  somewhere without opening the visitor's email client.
