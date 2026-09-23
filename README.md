# JokeMasti — Har Din Hasi Ka Dose!

A fast, static, multi-language jokes website. No backend, no database, no login, no paid APIs.
Jokes live in JSON files; a small Node script (zero dependencies) turns them into plain HTML pages
that any static host can serve.

## Quick start

```bash
node -v            # Node 18 or newer
npm run build      # validates data, then writes the site to dist/
npm run serve      # preview at http://localhost:8080
npm run validate   # content report + error check only
```

`dist/` is included in this download, already built, so you can upload it as-is.

## Before you go live

Edit `data/site.json`:

| Field | What to set |
|---|---|
| `url` | Your real site address, no trailing slash, e.g. `https://jokemasti.com`. Canonical URLs, share links, sitemap and Open Graph tags all use it. |
| `email`, `copyrightEmail` | Addresses you actually read. They appear on Contact, Privacy and Copyright pages. |
| `legalLastUpdated` | Date shown on legal pages. |

Then run `npm run build` again. Have the Privacy Policy and Terms reviewed for your jurisdiction before
you enable ads or analytics.

## Deploying

| Host | Setup |
|---|---|
| **Cloudflare Pages** | Build command `npm run build`, output directory `dist`. `_headers` is applied automatically. |
| **Netlify** | `netlify.toml` is included. `_headers` is applied automatically. |
| **Vercel** | `vercel.json` is included (build command, output dir, headers). |
| **GitHub Pages** | Push to `main`, set *Settings → Pages → Source* to **GitHub Actions**. `.github/workflows/deploy.yml` builds and publishes. |

**GitHub Pages without a custom domain** serves the site from a sub-path (`https://you.github.io/jokemasti`).
Set `"url": "https://you.github.io/jokemasti"` in `site.json`; every internal link, the service worker
and the manifest pick up the `/jokemasti` prefix automatically.

## Adding jokes

Jokes are in `data/jokes/<language>.json`, one array per language (`en.json`, `hi.json`, `hinglish.json`, `bn.json` …).

```json
{
  "id": "JM-HI-0080",
  "title": "छोटा शीर्षक",
  "language": "hi",
  "category": "teacher-student",
  "text": "टीचर: ...\nछात्र: ...",
  "tags": ["school", "exam"],
  "popularity": 75,
  "source": "original",
  "createdAt": "2026-10-01",
  "updatedAt": "2026-10-01"
}
```

Rules the validator enforces:

- **IDs never change and are never reused.** Format `JM-XX-0001`, where `XX` is the language prefix
  (EN, HI, HG = Hinglish, BN, MR, GU, PA, TA, TE, KN, ML, OR, AS, UR). Use the next number in the file.
  The ID is part of the joke's URL, so changing it breaks links.
- `language` must match the file. `category` must be a slug from `data/categories.json`.
- The same joke text can't appear twice (compared ignoring spaces and punctuation).
- Use `\n` for a new line (each line becomes its own paragraph, good for dialogue).
- `popularity` is an editor score from 1–100. It drives the Popular list and the Trending score.
- `"status": "draft"` hides a joke from the build.
- Optional: `"featured": true` (+15 trending bonus), `"reviewStatus"`, `"source": "traditional"` for
  retellings of folk jokes with no known author.

Removing a joke: delete it from the file. Its page disappears on the next build, and people who saved it
see a short note on the Saved Jokes page.

### Categories, languages, templates

- `data/categories.json` — 30 categories. `href` makes a category a shortcut to another page
  (Hindi, English, Short). `rule` makes it a collection (`maxLength`, `tag`, or `all`).
  `"enabled": false` hides it — Dark Humor is disabled until there is a reviewed, clearly labelled set.
- `data/languages.json` — `htmlLang` and `dir` are used for correct fonts, screen readers and RTL (Urdu).
- `data/templates.json` — the 15 formats shown on `/joke-templates/`.

## Content status

This release ships **303 jokes**: English 110, Hindi 79, Hinglish 70, and 4 each in Bengali, Marathi,
Gujarati, Punjabi, Tamil, Telugu, Kannada, Malayalam, Odia, Assamese and Urdu. The target is 1,000+,
added in batches.

- **Regional jokes need native-speaker review.** All 44 carry `"reviewStatus": "pending-native-review"`.
  `npm run validate` reports how many are left. Language pages with pending jokes show a small "tell us"
  note.
- 38 jokes are marked `"source": "traditional"` — our wording of widely told folk jokes.
- Santa Banta jokes are written as two silly friends with no reference to religion or community.

## Ads (AdSense-ready, off by default)

Ad containers are already placed on the home page, listings, category/language pages and joke pages.
While ads are off they render as empty hidden elements, so nothing fake is ever shown.

1. Get approved by AdSense.
2. In `data/site.json` set `"ads": { "enabled": true, "client": "ca-pub-XXXXXXXXXXXXXXX", "slots": { ... } }`
   and fill in the ad-unit IDs for the positions you want. Positions with an empty ID stay empty.
3. Rebuild. Slots show an "Advertisement" label, reserve height to avoid layout shift, and load the
   AdSense script only when the first slot scrolls near view.
4. Add an `ads.txt` file to `src/static/` (it's copied to the site root).
5. If you serve visitors in the EEA/UK, use a Google-certified consent tool before ads load.

## What's where

```
data/                 site, languages, categories, templates, jokes/*.json
scripts/build.js      generates every page into dist/
scripts/lib.js        loading + validation shared by build and validate
scripts/validate.js   content report
scripts/serve.js      local preview server
src/assets/           styles.css, app.js, icons.svg (content-hashed on build)
src/static/           favicon, PWA icons, OG image (copied as-is)
src/sw.template.js    service worker template
```

### Pages generated

Home, `/jokes/` (paginated `/jokes/page/2/`), `/jokes/short/`, `/languages/`, `/jokes/{language}/`,
`/jokes/{language}/{category}/` (when a combo has 3+ jokes), `/categories/`, `/category/{slug}/`,
`/tags/`, `/tag/{tag}/` (3+ jokes), `/popular/`, `/trending/`, `/joke/{title-slug}-{id}/`,
`/joke-of-the-day/`, `/random-joke/`, `/saved-jokes/` (noindex), `/search/` (noindex),
`/joke-templates/`, About, Contact, Privacy Policy, Terms, Disclaimer, Copyright, `/offline/`, `404.html`,
plus `sitemap.xml`, `robots.txt`, `manifest.json`, `sw.js`.

### How the "live" features work without a server

- **Search & filters** download one small index (`/assets/search-index.*.json`) on first use and run in
  the browser. Results update the URL (`?q=exam&lang=hi&sort=trending`) so they can be shared.
  Static paginated lists remain for search engines and no-JS visitors.
- **Joke of the Day** = `daysSince1970(local date) % totalJokes` over jokes sorted by ID. Same joke for
  everyone on the same date. Adding jokes changes the rotation from that day on.
- **Trending** = editor score + up to 30 points for jokes added in the last 30 days + 15 if featured.
  The formula is explained on the Trending page. There are no like or share counts anywhere.
- **Saved jokes & theme** use `localStorage` (`jm:saved`, `jm:theme`). Nothing leaves the device.
- **Contact form** opens the visitor's email app via `mailto:`. It does not pretend to send anything.
- **Offline**: visited pages and site assets are cached; uncached pages show `/offline/`.

## Note on the brief

The specification document was cut off in section 45 ("Content Administration without Admin Panel").
This build covers it as: JSON files + `npm run validate` + rebuild, with stable IDs and the rules above.
If that section had more requirements, they still need to be added.
