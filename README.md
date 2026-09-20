# JokeMasti — Hasi Ka Daily Dose! 😄

A fast, mobile-first entertainment platform for India: Hindi/Hinglish/English jokes,
desi & festival memes, funny images, WhatsApp status/shayari, and more. Built with
Next.js (App Router), TypeScript and Tailwind CSS. No login, no database, no AI —
content lives in static, typed data files and the whole thing ships as static/ISR
pages for speed and SEO.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Local dev server |
| `npm run build` | Production build (also runs the TypeScript check) |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run generate:brand` | Regenerate the logo, PWA icons and default OG image (`scripts/generate-brand-assets.mjs`) |
| `npm run generate:memes` | Regenerate all meme images from `src/data/memeSource.mjs` (`scripts/generate-memes.mjs`) |

## Project structure

```
src/
  app/                 Routes (App Router). Pages, sitemap.ts, robots.ts, manifest.ts.
  components/          Reusable UI (cards, buttons, header/footer, share/copy/bookmark widgets…)
  data/                Typed content: jokes.ts, memes.ts, categories.ts, festivals.ts,
                        whatsappContent.ts, festivalWishes.ts. This is the "database".
  lib/                 site config, localStorage helpers, search (Fuse.js), share helpers,
                        SEO/JSON-LD builders, small utils.
  types/                Shared content types (Joke, Meme, Category, Festival…).
scripts/
  generate-brand-assets.mjs   Procedurally renders the logo/icons/OG image (sharp).
  generate-memes.mjs          Procedurally renders every meme image as an original,
                               gradient-card WebP (no scraped/third-party images).
public/
  images/memes/        Generated meme images + thumbnails.
  icons/, og/           PWA icons and the default OG image.
  sw.js                 Service worker (offline fallback + static asset caching).
```

## Content model

Everything content-related is static, typed TypeScript data — no CMS, no database,
no AI in the loop. Adding a joke or meme is just adding an entry to `src/data/jokes.ts`
or `src/data/memeSource.mjs` (run `npm run generate:memes` after adding a meme so its
image gets rendered) — the relevant listing, detail, category, festival, trending and
sitemap pages pick it up automatically.

## Notable design choices

- **Meme images are generated, not scraped.** `scripts/generate-memes.mjs` renders
  each meme as an SVG → WebP gradient card with the caption baked in, so every image
  on the site is original artwork.
- **No backend, but real interactivity.** Bookmarks, likes, theme and recent searches
  persist in `localStorage` (see `src/lib/storage.ts` + `src/lib/hooks.ts`, which use
  `useSyncExternalStore` to read them safely under SSR).
- **Ad slots** (`src/components/AdSlot.tsx`) are clearly labelled placeholder
  containers ready for an AdSense snippet — no fake ads are rendered.
- **SEO**: per-page metadata, canonical URLs, Open Graph/Twitter cards (jokes get a
  dynamically generated share image via `next/og`), JSON-LD (WebSite+SearchAction,
  Organization, BreadcrumbList, Article, ImageObject), `sitemap.xml`, `robots.txt`.
- **PWA**: `manifest.webmanifest`, a minimal service worker with an offline fallback
  page, and an install prompt.
