#!/usr/bin/env node
/**
 * JokeMasti static site builder.
 * Reads /data/*.json, renders every route through the page builders in
 * /src/pages, and writes a fully static, crawlable site to /dist.
 *
 * Usage: node build.js
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { loadContent, jokeOfDay } from './src/lib/data.js';
import { byDate, flat, slugify } from './src/lib/util.js';

import { setAdConfig } from './src/templates/layout.js';
import { buildHome } from './src/pages/home.js';
import { buildJokesIndex, buildJokeCategory, buildJokeDetail, paginate } from './src/pages/jokes.js';
import { buildTrending } from './src/pages/trending.js';
import { buildFestivalHub, buildFestivalDetail } from './src/pages/festival.js';
import { buildWhatsapp } from './src/pages/whatsapp.js';
import { buildSearch } from './src/pages/search.js';
import { buildSaved } from './src/pages/saved.js';
import {
  buildAbout,
  buildContact,
  buildPrivacy,
  buildTerms,
  buildDisclaimer,
  buildCopyright,
} from './src/pages/legal.js';
import { build404, buildOffline } from './src/pages/errors.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = __dirname;
const DIST = path.join(ROOT, 'dist');
const SRC = path.join(ROOT, 'src');

// ---------------------------------------------------------------- fs helpers
function rmrf(p) {
  fs.rmSync(p, { recursive: true, force: true });
}
function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}
function copyDir(from, to, { skip = [] } = {}) {
  ensureDir(to);
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    if (skip.includes(entry.name)) continue;
    const s = path.join(from, entry.name);
    const d = path.join(to, entry.name);
    if (entry.isDirectory()) copyDir(s, d, { skip });
    else fs.copyFileSync(s, d);
  }
}

/**
 * Conservative CSS minifier: strips comments and collapses whitespace runs
 * to a single space (never removes whitespace entirely), so encoded data-URI
 * strings inside url(...) stay intact. Then tightens spacing around the
 * syntax characters that are always safe to touch (no ':' or ';' occurs
 * inside our own data-URI values).
 */
function minifyCss(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}:;,])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim();
}

/**
 * Conservative JS minifier for our own hand-authored app.js: drops full-line
 * "//" comments and safe trailing "// ..." comments (skipping "://" so URL
 * strings like https://wa.me/... are never touched), then collapses blank
 * lines. No token/whitespace-in-statement changes, so ASI can't break.
 */
function minifyJs(js) {
  return js
    .split('\n')
    .map((line) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed === '/**' || trimmed === '*/') {
        return trimmed.startsWith('//') ? '' : line;
      }
      return line.replace(/(?<!:)\/\/.*$/, '').replace(/\s+$/, '');
    })
    .filter((line, i, arr) => !(line.trim() === '' && arr[i - 1]?.trim() === ''))
    .join('\n')
    .trim();
}

const urls = []; // { loc, lastmod, priority, changefreq } — collected as pages are written

/**
 * Subpath the deployed site is served from (e.g. "/JokeMasti" for a GitHub
 * Pages project site), derived from SITE_URL's own path so it can never
 * drift from the canonical/OG/sitemap URLs built elsewhere from that same
 * value — see main(). Empty string for a domain-root deploy (the default).
 * Every href/src/action in generated HTML is site-root-relative
 * ("/jokes/…"); writePage() rewrites those to carry this prefix, since
 * that's the one place every page's final HTML already passes through.
 */
let BASE_PATH = '';

function computeBasePath(url) {
  if (!url) return '';
  try {
    return new URL(url).pathname.replace(/\/+$/, '');
  } catch {
    return '';
  }
}

/** Rewrites root-relative href/src/action attribute values to carry BASE_PATH. */
function applyBasePath(html) {
  if (!BASE_PATH) return html;
  return html.replace(/\b(href|src|action)=(["'])\//g, `$1=$2${BASE_PATH}/`);
}

/** Writes an HTML page at a route path. Route paths end in "/" (→ index.html) or ".html". */
function writePage(routePath, html, { sitemap = true, priority = 0.6, changefreq = 'weekly', lastmod } = {}) {
  let filePath;
  if (routePath.endsWith('.html')) {
    filePath = path.join(DIST, routePath.replace(/^\//, ''));
  } else {
    filePath = path.join(DIST, routePath.replace(/^\//, ''), 'index.html');
  }
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, applyBasePath(html));
  if (sitemap && !routePath.endsWith('.html')) {
    urls.push({ loc: routePath, priority, changefreq, lastmod });
  }
}

function writeFile(routePath, content) {
  const filePath = path.join(DIST, routePath.replace(/^\//, ''));
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content);
}

// ---------------------------------------------------------------- build
function main() {
  console.log('→ Cleaning dist/');
  rmrf(DIST);
  ensureDir(DIST);

  console.log('→ Copying + minifying static assets');
  copyDir(path.join(SRC, 'assets'), path.join(DIST, 'assets'), { skip: ['memes'] });
  const cssPath = path.join(DIST, 'assets', 'css', 'style.css');
  const jsPath = path.join(DIST, 'assets', 'js', 'app.js');
  const rawCss = fs.readFileSync(cssPath, 'utf8');
  const rawJs = fs.readFileSync(jsPath, 'utf8');
  fs.writeFileSync(cssPath, minifyCss(rawCss));
  fs.writeFileSync(jsPath, minifyJs(rawJs));
  console.log(
    `  style.css ${(rawCss.length / 1024).toFixed(1)}kb → ${(fs.statSync(cssPath).size / 1024).toFixed(1)}kb`
  );
  console.log(`  app.js ${(rawJs.length / 1024).toFixed(1)}kb → ${(fs.statSync(jsPath).size / 1024).toFixed(1)}kb`);
  fs.writeFileSync(path.join(DIST, 'sw.js'), minifyJs(fs.readFileSync(path.join(SRC, 'static', 'sw.js'), 'utf8')));

  console.log('→ Loading content');
  const ctx = loadContent();
  // Overriding site.url at build time (rather than editing data/site.json)
  // keeps that file the portable "real" config while letting CI target
  // whatever's actually being deployed to — a GitHub Pages preview,
  // eventual custom domain, etc. Every canonical/OG/JSON-LD/sitemap URL is
  // built from ctx.site.url downstream, so this one override keeps all of
  // them — and BASE_PATH, derived from the same value — in agreement.
  if (process.env.SITE_URL) ctx.site.url = process.env.SITE_URL;
  BASE_PATH = computeBasePath(ctx.site.url);
  if (BASE_PATH) console.log(`  Base path: ${BASE_PATH} (subpath deploy)`);
  setAdConfig(ctx.site);
  console.log(
    ctx.site.ads?.enabled
      ? `  AdSense: enabled (client ${ctx.site.ads.client})`
      : '  AdSense: disabled — ad slots render as labelled placeholders (set ads.enabled + ads.client in data/site.json to go live)'
  );
  const today = new Date().toISOString().slice(0, 10);
  ctx.jotd = jokeOfDay(ctx.jokes, today);

  const perPage = ctx.site.perPage;

  // ---- Home
  console.log('→ Building home');
  writePage('/', buildHome(ctx), { priority: 1.0, changefreq: 'daily' });

  // ---- Jokes index (paginated)
  console.log('→ Building jokes index + categories');
  const jokeTotalPages = paginate(perPage, ctx.jokes.length);
  for (let p = 1; p <= jokeTotalPages; p++) {
    const route = p === 1 ? '/jokes/' : `/jokes/page/${p}/`;
    writePage(route, buildJokesIndex(ctx, p, jokeTotalPages), { priority: 0.9, changefreq: 'daily' });
  }

  // ---- Joke categories (paginated)
  for (const cat of ctx.categories.jokes) {
    const list = ctx.jokesByCategory.get(cat.slug) || [];
    const totalPages = paginate(perPage, list.length);
    for (let p = 1; p <= totalPages; p++) {
      const base = `/jokes/${cat.slug}/`;
      const route = p === 1 ? base : `${base}page/${p}/`;
      writePage(route, buildJokeCategory(ctx, cat, p, totalPages), { priority: 0.8, changefreq: 'daily' });
    }
  }

  // ---- Joke detail pages
  console.log('→ Building joke detail pages (' + ctx.jokes.length + ')');
  for (const cat of ctx.categories.jokes) {
    const list = (ctx.jokesByCategory.get(cat.slug) || []).slice().sort(byDate);
    list.forEach((joke, i) => {
      const prev = list[i - 1] || null;
      const next = list[i + 1] || null;
      const related = list.filter((j) => j.id !== joke.id).slice(0, 4);
      writePage(joke.url, buildJokeDetail(ctx, joke, { prev, next, related }), {
        priority: 0.6,
        changefreq: 'monthly',
        lastmod: joke.createdAt,
      });
    });
  }

  // ---- Trending
  console.log('→ Building trending, festivals, whatsapp');
  writePage('/trending/', buildTrending(ctx), { priority: 0.8, changefreq: 'daily' });

  // ---- Festivals
  writePage('/festival/', buildFestivalHub(ctx), { priority: 0.8, changefreq: 'weekly' });
  for (const fest of ctx.festivals) {
    writePage(`/festival/${fest.slug}/`, buildFestivalDetail(ctx, fest), { priority: 0.7, changefreq: 'weekly' });
  }

  // ---- WhatsApp corner
  writePage('/whatsapp/', buildWhatsapp(ctx), { priority: 0.7, changefreq: 'weekly' });

  // ---- Search & Saved (noindex, but still build so links work + offline caches)
  console.log('→ Building search, saved, legal, error pages');
  writePage('/search/', buildSearch(ctx), { sitemap: false });
  writePage('/saved/', buildSaved(ctx), { sitemap: false });

  // ---- Legal
  writePage('/about-us/', buildAbout(ctx), { priority: 0.4, changefreq: 'yearly' });
  writePage('/contact-us/', buildContact(ctx), { priority: 0.4, changefreq: 'yearly' });
  writePage('/privacy-policy/', buildPrivacy(ctx), { priority: 0.3, changefreq: 'yearly' });
  writePage('/terms-and-conditions/', buildTerms(ctx), { priority: 0.3, changefreq: 'yearly' });
  writePage('/disclaimer/', buildDisclaimer(ctx), { priority: 0.3, changefreq: 'yearly' });
  writePage('/copyright-policy/', buildCopyright(ctx), { priority: 0.3, changefreq: 'yearly' });

  // ---- Errors
  writePage('/404.html', build404(ctx), { sitemap: false });
  writePage('/offline.html', buildOffline(ctx), { sitemap: false });

  // ---- Search index (client-side search dataset)
  console.log('→ Writing search-index.json');
  const searchIndex = [
    ...ctx.jokes.map((j) => ({
      t: 'joke',
      id: j.id,
      n: j.title,
      d: flat(j.text).slice(0, 140),
      u: j.url,
      c: j.catMeta?.name || '',
      s: [j.title, j.text, j.category, (j.tags || []).join(' ')].join(' ').toLowerCase(),
      p: j.score || 0,
    })),
  ];
  writeFile('/search-index.json', JSON.stringify(searchIndex));

  // ---- manifest.json
  console.log('→ Writing manifest.json');
  const site = ctx.site;
  // Per the Web App Manifest spec, start_url/scope/icon src resolve
  // relative to the manifest file's own URL — not the page, and not
  // BASE_PATH (a separate mechanism applyBasePath() doesn't touch, since
  // this is written via writeFile(), not writePage()). Leaving off the
  // leading "/" here makes them resolve correctly whether the manifest
  // ends up served at the domain root or under a repo subpath.
  const manifest = {
    name: `${site.name} — ${site.tagline}`,
    short_name: site.shortName,
    description: site.description,
    start_url: './?source=pwa',
    scope: './',
    display: 'standalone',
    background_color: site.backgroundColor,
    theme_color: site.themeColor,
    orientation: 'portrait-primary',
    lang: 'hi-IN',
    categories: ['entertainment', 'lifestyle'],
    icons: [
      { src: 'assets/img/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: 'assets/img/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: 'assets/img/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
  writeFile('/manifest.json', JSON.stringify(manifest, null, 2));

  // ---- sitemap.xml
  console.log('→ Writing sitemap.xml (' + urls.length + ' urls)');
  const base = site.url.replace(/\/$/, '');
  writeSitemap(base, urls);

  // ---- robots.txt
  console.log('→ Writing robots.txt');
  writeFile(
    '/robots.txt',
    `User-agent: *
Allow: /
Disallow: /search/
Disallow: /saved/

Sitemap: ${base}/sitemap.xml
`
  );

  // ---- .nojekyll
  // GitHub Pages runs a Jekyll build over the output by default, which
  // ignores files/folders starting with "_" and can otherwise interfere
  // with an already-final static export. This file disables it.
  writeFile('/.nojekyll', '');

  console.log('\n✔ Build complete → ' + path.relative(ROOT, DIST) + '/');
  console.log('  Pages: ' + urls.length + ' indexable routes');
  console.log('  Jokes: ' + ctx.jokes.length + '  Festivals: ' + ctx.festivals.length);
}

function writeSitemap(base, list) {
  const XML_NS = 'http://www.sitemaps.org/schemas/sitemap/0.9';
  const body = list
    .map((u) => {
      const loc = base + u.loc;
      const lastmod = u.lastmod || new Date().toISOString().slice(0, 10);
      return `  <url>\n    <loc>${xmlEscape(loc)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority.toFixed(1)}</priority>\n  </url>`;
    })
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="${XML_NS}">\n${body}\n</urlset>\n`;
  writeFile('/sitemap.xml', xml);
}

function xmlEscape(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

main();
