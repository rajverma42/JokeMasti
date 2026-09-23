#!/usr/bin/env node
/* JokeMasti static site builder. No dependencies. Usage: node scripts/build.js */
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { loadAll } = require('./lib');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const OUT = path.join(ROOT, 'dist');

const { site, languages, categories, allCategories, templates, jokes, errors, warnings } = loadAll(ROOT);
warnings.forEach(w => console.warn('warn:', w));
if (errors.length) { errors.forEach(e => console.error('error:', e)); process.exit(1); }

const SITE_URL = (process.env.SITE_URL || site.url).replace(/\/$/, '');
const SITE_URL_OBJ = new URL(SITE_URL + '/');
const BASE = SITE_URL_OBJ.pathname.replace(/\/$/, '');
const u = p => BASE + p;
// abs() always wraps u(p), which is already BASE-prefixed — using the
// origin here (not SITE_URL) avoids doubling BASE when SITE_URL itself
// points at a sub-path, e.g. a GitHub Pages project site.
const abs = p => SITE_URL_OBJ.origin + p;
const BUILD_DATE = process.env.BUILD_DATE || new Date().toISOString().slice(0, 10);
const YEAR = BUILD_DATE.slice(0, 4);
const PER = site.perPage || 24;
const SHORT = site.shortMaxChars || 160;
const MEDIUM = site.mediumMaxChars || 360;

// ---------- helpers ----------
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const enc = encodeURIComponent;
const trunc = (s, n) => { const a = [...String(s).replace(/\s+/g, ' ').trim()]; return a.length <= n ? a.join('') : a.slice(0, n - 1).join('').replace(/[\s,.;:!?-]+$/, '') + '…'; };
const paras = t => t.split('\n').filter(l => l.trim()).map(l => `<p>${esc(l)}</p>`).join('');
const plural = (n, w) => `${n} ${w}${n === 1 ? '' : 's'}`;
const hash = buf => crypto.createHash('sha256').update(buf).digest('hex').slice(0, 10);
const dayNumber = iso => { const [y, m, d] = iso.split('-').map(Number); return Math.floor(Date.UTC(y, m - 1, d) / 864e5); };

function rmrf(p) { fs.rmSync(p, { recursive: true, force: true }); }
function writeFile(rel, content) { const f = path.join(OUT, rel); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, content); }
const sitemap = [];
function writePage(p, html, { index = true, lastmod = BUILD_DATE } = {}) {
  writeFile(p.endsWith('.html') ? p : p + 'index.html', html);
  if (index) sitemap.push({ loc: abs(u(p)), lastmod });
}
function copyDir(from, to) {
  for (const e of fs.readdirSync(from, { withFileTypes: true })) {
    const a = path.join(from, e.name), b = path.join(to, e.name);
    if (e.isDirectory()) { fs.mkdirSync(b, { recursive: true }); copyDir(a, b); } else fs.copyFileSync(a, b);
  }
}

// ---------- derived data ----------
const langByCode = new Map(languages.map(l => [l.code, l]));
const catBySlug = new Map(categories.map(c => [c.slug, c]));
const langOrder = new Map(languages.map((l, i) => [l.code, i]));

jokes.sort((a, b) => (langOrder.get(a.language) - langOrder.get(b.language)) || a.id.localeCompare(b.id));
const ageDays = j => Math.max(0, (dayNumber(BUILD_DATE) - dayNumber(j.createdAt)));
jokes.forEach((j, i) => {
  j.lang = langByCode.get(j.language);
  j.cat = catBySlug.get(j.category);
  j.len = [...j.text].length;
  j.short = j.len <= SHORT || j.category === 'one-liner';
  j.lengthBucket = j.len <= SHORT ? 'short' : j.len <= MEDIUM ? 'medium' : 'long';
  j.trend = Math.round(j.popularity + Math.max(0, 30 - ageDays(j)) + (j.featured ? 15 : 0));
  j.prev = jokes[i - 1] || null;
  j.next = jokes[i + 1] || null;
});
const byPopular = (a, b) => (b.popularity - a.popularity) || a.id.localeCompare(b.id);
const byTrend = (a, b) => (b.trend - a.trend) || byPopular(a, b);
const byNewest = (a, b) => b.createdAt.localeCompare(a.createdAt) || byPopular(a, b);
const popular = [...jokes].sort(byPopular);
const trending = [...jokes].sort(byTrend);
const newest = [...jokes].sort(byNewest);

function inCategory(j, c) {
  if (j.category === c.slug) return true;
  const r = c.rule; if (!r) return false;
  if (r.type === 'all') return true;
  if (r.type === 'maxLength') return j.len <= r.value;
  if (r.type === 'tag') return j.tags.includes(r.value);
  return false;
}
const pageCats = categories.filter(c => !c.href);
const catJokes = new Map(pageCats.map(c => [c.slug, popular.filter(j => inCategory(j, c))]));
const langJokes = new Map(languages.map(l => [l.code, popular.filter(j => j.language === l.code)]));
const catHref = c => u(c.href || `/category/${c.slug}/`);
const langHref = l => u(`/jokes/${l.slug}/`);
const catCount = c => c.href === '/jokes/short/' ? jokes.filter(j => j.short).length
  : c.href ? (langJokes.get(languages.find(l => c.href === `/jokes/${l.slug}/`)?.code) || []).length
  : catJokes.get(c.slug).length;

// language + category combos
const langCat = new Map(); // key lang|cat -> jokes
for (const l of languages) for (const c of pageCats) {
  if (c.rule) continue;
  const list = langJokes.get(l.code).filter(j => j.category === c.slug);
  if (list.length >= (site.minJokesForLanguageCategoryPage || 3)) langCat.set(`${l.code}|${c.slug}`, list);
}
const langCatPath = (l, c) => `/jokes/${l.slug}/${c.slug}/`;

// tags
const tagMap = new Map();
for (const j of popular) for (const t of j.tags) { if (!tagMap.has(t)) tagMap.set(t, []); tagMap.get(t).push(j); }
const tagPages = new Map([...tagMap].filter(([, l]) => l.length >= (site.minJokesForTagPage || 3)).sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0])));
const tagName = t => t.replace(/-/g, ' ');

// ---------- assets (content-hashed) ----------
rmrf(OUT); fs.mkdirSync(OUT, { recursive: true });
copyDir(path.join(SRC, 'static'), OUT);
function minCss(s) { return s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').replace(/\s*([{};,>])\s*/g, '$1').replace(/;}/g, '}').trim(); }
function minJs(s) { return s.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('//')).join('\n'); }
const assets = {};
function emitAsset(name, content) {
  const ext = path.extname(name), base = path.basename(name, ext);
  const file = `/assets/${base}.${hash(content)}${ext}`;
  writeFile(file, content); assets[name] = u(file); return assets[name];
}
emitAsset('styles.css', minCss(fs.readFileSync(path.join(SRC, 'assets/styles.css'), 'utf8')));
emitAsset('app.js', minJs(fs.readFileSync(path.join(SRC, 'assets/app.js'), 'utf8')));
emitAsset('icons.svg', fs.readFileSync(path.join(SRC, 'assets/icons.svg'), 'utf8').replace(/>\s+</g, '><'));

// search index (lean keys)
const index = {
  v: 1,
  langs: Object.fromEntries(languages.map(l => [l.code, { n: l.name, s: l.slug, d: l.dir, h: l.htmlLang }])),
  cats: Object.fromEntries(pageCats.map(c => [c.slug, { n: c.name, e: c.emoji }])),
  tags: [...tagPages.keys()],
  jokes: [...jokes].sort((a, b) => a.id.localeCompare(b.id)).map(j => ({ i: j.id, t: j.title, x: j.text, l: j.language, c: j.category, g: j.tags, u: j.path, p: j.popularity, r: j.trend, d: j.createdAt, n: j.len })),
};
emitAsset('search-index.json', JSON.stringify(index));
const jotdPool = index.jokes;
const jotdFor = iso => jokes.find(j => j.id === jotdPool[dayNumber(iso) % jotdPool.length].i);

// ---------- components ----------
const icon = (n, cls = 'i') => `<svg class="${cls}" aria-hidden="true" focusable="false"><use href="${assets['icons.svg']}#${n}"/></svg>`;
const LOGO = `<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">${fs.readFileSync(path.join(SRC, 'static/favicon.svg'), 'utf8').replace(/^<svg[^>]*>|<\/svg>\s*$/g, '')}</svg>`;

function shareLinks(j) {
  const url = abs(u(j.path)), text = j.text, full = `${text}\n\nRead more:\n${url}`;
  return {
    whatsapp: `https://wa.me/?text=${enc(full)}`,
    telegram: `https://t.me/share/url?url=${enc(url)}&text=${enc(text)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`,
    x: `https://x.com/intent/tweet?text=${enc(trunc(text, 200))}&url=${enc(url)}`,
    reddit: `https://www.reddit.com/submit?url=${enc(url)}&title=${enc(j.title)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`,
    email: `mailto:?subject=${enc(j.title + ' | ' + site.name)}&body=${enc(full)}`,
    sms: `sms:?&body=${enc(full)}`,
  };
}
const ext = 'target="_blank" rel="noopener noreferrer"';

function tagLinks(j) {
  if (!j.tags.length) return '';
  return `<div class="joke-tags">${j.tags.map(t => tagPages.has(t) ? `<a href="${u(`/tag/${t}/`)}">#${esc(t)}</a>` : `<span>#${esc(t)}</span>`).join('')}</div>`;
}
function card(j, h = 'h3') {
  const s = shareLinks(j);
  return `<article class="joke-card" data-joke data-id="${j.id}" data-url="${esc(abs(u(j.path)))}" data-title="${esc(j.title)}">
<${h} class="joke-title"><a href="${u(j.path)}">${esc(j.title)}</a></${h}>
<div class="joke-text" lang="${j.lang.htmlLang}" dir="${j.lang.dir}">${paras(j.text)}</div>
<div class="joke-meta"><a class="chip" href="${langHref(j.lang)}">${esc(j.lang.name)}</a><a class="chip" href="${catHref(j.cat)}">${esc(j.cat.name)}</a></div>
${tagLinks(j)}
<div class="joke-actions">
<button type="button" class="btn btn-sm" data-action="copy">${icon('copy')}<span>Copy</span></button>
<a class="btn btn-sm btn-wa" href="${esc(s.whatsapp)}" ${ext} data-action="whatsapp">${icon('whatsapp')}<span>WhatsApp</span></a>
<button type="button" class="btn btn-sm" data-action="save" aria-pressed="false">${icon('bookmark')}<span>Save</span></button>
<span class="actions-more">
<button type="button" class="icon-btn" data-action="share" aria-label="Share">${icon('share')}</button>
<button type="button" class="icon-btn" data-action="telegram" aria-label="Share on Telegram">${icon('telegram')}</button>
<button type="button" class="icon-btn" data-action="facebook" aria-label="Share on Facebook">${icon('facebook')}</button>
<button type="button" class="icon-btn" data-action="x" aria-label="Share on X">${icon('x')}</button>
<button type="button" class="icon-btn" data-action="more" aria-label="More share options">${icon('more')}</button>
</span>
</div>
</article>`;
}

function adSlot(name) {
  const on = site.ads && site.ads.enabled;
  const slot = (site.ads && site.ads.slots && site.ads.slots[name]) || '';
  return `<aside class="ad-slot" data-ad-position="${name}" data-ad-slot="${esc(slot)}" aria-label="Advertisement"${on ? '' : ' hidden'}>${on ? '<span class="ad-label">Advertisement</span>' : ''}</aside>`;
}
function grid(list, { ads = false, h = 'h3' } = {}) {
  const parts = [];
  list.forEach((j, i) => {
    if (ads && i === 4) parts.push(adSlot('list-after-first'));
    if (ads && i === 14) parts.push(adSlot('list-mid'));
    parts.push(card(j, h));
  });
  return `<div class="joke-grid">${parts.join('\n')}</div>`;
}
function pager(basePath, page, total) {
  if (total <= 1) return '';
  const href = p => u(p === 1 ? basePath : `${basePath}page/${p}/`);
  const items = [];
  if (page > 1) items.push(`<li><a href="${href(page - 1)}" rel="prev" aria-label="Previous page">${icon('chevron-left')}</a></li>`);
  const shown = new Set([1, total, page - 1, page, page + 1].filter(p => p >= 1 && p <= total));
  let last = 0;
  [...shown].sort((a, b) => a - b).forEach(p => {
    if (p - last > 1) items.push('<li><span class="gap" aria-hidden="true">…</span></li>');
    items.push(p === page ? `<li><span aria-current="page">${p}</span></li>` : `<li><a href="${href(p)}" aria-label="Page ${p}">${p}</a></li>`);
    last = p;
  });
  if (page < total) items.push(`<li><a href="${href(page + 1)}" rel="next" aria-label="Next page">${icon('chevron-right')}</a></li>`);
  return `<nav class="pager" aria-label="Pagination"><ul>${items.join('')}</ul></nav>`;
}
function breadcrumbs(items) {
  // items: [{name, path}] last one is current
  const html = `<nav class="breadcrumbs container" aria-label="Breadcrumb"><ol>${items.map((it, i) => i === items.length - 1
    ? `<li><span aria-current="page">${esc(it.name)}</span></li>` : `<li><a href="${u(it.path)}">${esc(it.name)}</a></li>`).join('')}</ol></nav>`;
  const schema = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: abs(u(it.path)) })) };
  return { html, schema };
}
const HOME = { name: 'Home', path: '/' };

function filtersForm({ lockLang = null, lockCat = null, sort = 'popular' } = {}) {
  const pool = popular.filter(j => (!lockLang || j.language === lockLang) && (!lockCat || inCategory(j, catBySlug.get(lockCat))));
  const langOpts = languages.map(l => [l, pool.filter(j => j.language === l.code).length]).filter(([, n]) => n);
  const catOpts = pageCats.filter(c => !c.rule).map(c => [c, pool.filter(j => j.category === c.slug).length]).filter(([, n]) => n);
  const sel = v => v === sort ? ' selected' : '';
  return `<form class="filters" data-filters${lockLang ? ` data-lock-lang="${lockLang}"` : ''}${lockCat ? ` data-lock-cat="${lockCat}"` : ''} data-default-sort="${sort}" action="${u('/search/')}" method="get" role="search" aria-label="Filter jokes">
<div class="filter-grid">
<label class="f-q">Search<input type="search" name="q" placeholder="Search jokes..." autocomplete="off" enterkeyhint="search"></label>
${lockLang ? '' : `<label>Language<select name="lang"><option value="">All languages</option>${langOpts.map(([l, n]) => `<option value="${l.code}">${esc(l.name)} (${n})</option>`).join('')}</select></label>`}
${lockCat ? '' : `<label>Category<select name="cat"><option value="">All categories</option>${catOpts.map(([c, n]) => `<option value="${c.slug}">${esc(c.name)} (${n})</option>`).join('')}</select></label>`}
<label>Length<select name="len"><option value="">Any length</option><option value="short">Short</option><option value="medium">Medium</option><option value="long">Long</option></select></label>
<label>Sort by<select name="sort"><option value="popular"${sel('popular')}>Popular</option><option value="trending"${sel('trending')}>Trending</option><option value="newest"${sel('newest')}>Newest</option><option value="shortest"${sel('shortest')}>Shortest</option><option value="longest"${sel('longest')}>Longest</option></select></label>
</div>
<div class="filter-actions"><button type="submit" class="btn btn-primary btn-sm">Apply filters</button><button type="reset" class="btn btn-sm">Clear</button></div>
<noscript><p class="muted">Filters need JavaScript. The full list below works without it.</p></noscript>
</form>
<div data-results hidden aria-live="polite"></div>`;
}
function sharePage(title, p) {
  const url = abs(u(p));
  return `<div class="btn-row" data-share-page data-url="${esc(url)}" data-title="${esc(title)}" style="margin-top:12px">
<a class="btn btn-sm btn-wa" href="https://wa.me/?text=${enc(`${title}\n${url}`)}" ${ext}>${icon('whatsapp')}<span>Share on WhatsApp</span></a>
<button type="button" class="btn btn-sm" data-action="share-page">${icon('share')}<span>Share page</span></button>
<button type="button" class="btn btn-sm" data-action="copy-page-link">${icon('link')}<span>Copy link</span></button>
</div>`;
}
function state(emoji, title, text, buttons = '') {
  return `<div class="state"><div class="state-emoji" aria-hidden="true">${emoji}</div><h2>${esc(title)}</h2><p class="muted">${esc(text)}</p>${buttons ? `<div class="btn-row">${buttons}</div>` : ''}</div>`;
}

// ---------- layout ----------
const NAV = [['Home', '/'], ['All Jokes', '/jokes/'], ['Categories', '/categories/'], ['Languages', '/languages/'], ['Popular', '/popular/'], ['Trending', '/trending/'], ['Joke of the Day', '/joke-of-the-day/']];
const NAV_EXTRA = [['Random Joke', '/random-joke/'], ['Short Jokes', '/jokes/short/'], ['Saved Jokes', '/saved-jokes/'], ['Joke Templates', '/joke-templates/']];
function header(current) {
  const li = ([n, p]) => `<li><a href="${u(p)}"${p === current ? ' aria-current="page"' : ''}>${n}</a></li>`;
  return `<header class="site-header">
<div class="container header-inner">
<a class="brand" href="${u('/')}" aria-label="${site.name} home">${LOGO}<span class="brand-name">${site.name}</span></a>
<nav id="primary-nav" class="primary-nav" aria-label="Main">
<ul>${NAV.map(li).join('')}</ul>
<ul class="nav-extra">${NAV_EXTRA.map(li).join('')}<li><button type="button" class="nav-theme-btn" data-theme-toggle>${icon('system')}<span data-theme-label>Theme: System</span></button></li></ul>
</nav>
<div class="header-actions">
<button type="button" class="icon-btn" data-open-search aria-label="Search jokes">${icon('search')}</button>
<button type="button" class="icon-btn theme-toggle" data-theme-toggle aria-label="Theme: System. Change theme">${icon('system')}</button>
<button type="button" class="icon-btn menu-btn" aria-controls="primary-nav" aria-expanded="false" aria-label="Open menu">${icon('menu')}</button>
</div>
</div>
</header>`;
}
function footer() {
  const top = pageCats.filter(c => !c.rule).slice(0, 8);
  return `<footer class="site-footer">
<div class="container">
<div class="footer-grid">
<div class="footer-brand"><a class="brand" href="${u('/')}" aria-label="${site.name} home">${LOGO}<span class="brand-name">${site.name}</span></a><p class="muted" style="margin-top:10px">${esc(site.tagline)} Clean, original jokes in ${languages.length} languages to read, copy and share.</p></div>
<div><h2>Categories</h2><ul>${top.map(c => `<li><a href="${catHref(c)}">${esc(c.name)}</a></li>`).join('')}<li><a href="${u('/categories/')}">All categories</a></li></ul></div>
<div><h2>Explore</h2><ul>${[['All Jokes', '/jokes/'], ['Languages', '/languages/'], ['Short Jokes', '/jokes/short/'], ['Random Joke', '/random-joke/'], ['Joke of the Day', '/joke-of-the-day/'], ['Joke Templates', '/joke-templates/'], ['Tags', '/tags/'], ['Saved Jokes', '/saved-jokes/']].map(([n, p]) => `<li><a href="${u(p)}">${n}</a></li>`).join('')}</ul></div>
<div><h2>About</h2><ul>${[['About', '/about/'], ['Contact', '/contact/'], ['Privacy Policy', '/privacy-policy/'], ['Terms', '/terms/'], ['Disclaimer', '/disclaimer/'], ['Copyright', '/copyright/']].map(([n, p]) => `<li><a href="${u(p)}">${n}</a></li>`).join('')}</ul></div>
</div>
<div class="footer-bottom"><span>© ${YEAR} ${site.name}</span><span>Made for sharing smiles.</span></div>
</div>
</footer>`;
}
const DIALOGS = () => `<dialog id="search-dialog" class="search-dialog" aria-label="Search jokes">
<div class="dialog-head"><form class="dialog-search" action="${u('/search/')}" method="get" role="search">${icon('search')}<label for="dlg-q" class="sr-only">Search jokes</label><input id="dlg-q" type="search" name="q" placeholder="Search jokes..." autocomplete="off" enterkeyhint="search"></form><button type="button" class="icon-btn" data-close-dialog aria-label="Close search">${icon('close')}</button></div>
<div class="dialog-body" id="dlg-body" aria-live="polite"></div>
</dialog>
<dialog id="share-dialog" aria-labelledby="share-title">
<div class="dialog-head"><h2 id="share-title">Share this joke</h2><button type="button" class="icon-btn" data-close-dialog aria-label="Close share options">${icon('close')}</button></div>
<div class="dialog-body"><div class="share-grid" id="share-grid"></div></div>
</dialog>
<div id="toast" class="toast" role="status" aria-live="polite"></div>`;

const jsConfig = () => JSON.stringify({
  base: BASE, site: SITE_URL, name: site.name, icons: assets['icons.svg'], index: assets['search-index.json'],
  perPage: PER, shortMax: SHORT, mediumMax: MEDIUM, copyLink: !!site.copyIncludesLink,
  ads: { enabled: !!(site.ads && site.ads.enabled), client: (site.ads && site.ads.client) || '' },
});
function layout(o) {
  const title = o.fullTitle || `${o.title} | ${site.name}`;
  const canonical = o.path ? abs(u(o.path)) : null;
  const schemas = (o.schema || []).map(s => `<script type="application/ld+json">${JSON.stringify(s).replace(/</g, '\\u003c')}</script>`).join('\n');
  return `<!doctype html>
<html lang="${o.lang || 'en'}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(o.description)}">
${canonical ? `<link rel="canonical" href="${esc(canonical)}">` : ''}
${o.noindex ? '<meta name="robots" content="noindex, follow">' : '<meta name="robots" content="index, follow, max-image-preview:large">'}
${o.prevLink ? `<link rel="prev" href="${esc(abs(u(o.prevLink)))}">` : ''}${o.nextLink ? `<link rel="next" href="${esc(abs(u(o.nextLink)))}">` : ''}
<meta property="og:site_name" content="${site.name}">
<meta property="og:type" content="${o.ogType || 'website'}">
<meta property="og:title" content="${esc(o.ogTitle || o.title)}">
<meta property="og:description" content="${esc(o.description)}">
${canonical ? `<meta property="og:url" content="${esc(canonical)}">` : ''}
<meta property="og:image" content="${abs(u('/og-default.png'))}">
<meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${site.name} — ${esc(site.tagline)}">
<meta property="og:locale" content="en_IN">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(o.ogTitle || o.title)}">
<meta name="twitter:description" content="${esc(o.description)}">
<meta name="twitter:image" content="${abs(u('/og-default.png'))}">
<meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#1b1e2b" media="(prefers-color-scheme: dark)">
<link rel="icon" href="${u('/favicon.svg')}" type="image/svg+xml">
<link rel="icon" href="${u('/icons/icon-32.png')}" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="${u('/icons/apple-touch-icon.png')}">
<link rel="manifest" href="${u('/manifest.json')}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@600;700;800&display=swap" media="print" onload="this.media='all'">
<link rel="stylesheet" href="${assets['styles.css']}">
<script>window.JM=${jsConfig()};try{var t=localStorage.getItem('jm:theme');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t)}catch(e){}</script>
<script src="${assets['app.js']}" defer></script>
${schemas}
</head>
<body${o.page ? ` data-page="${o.page}"` : ''}>
<a class="skip-link" href="#main">Skip to content</a>
${header(o.nav)}
<main id="main" tabindex="-1">
${o.crumbs ? o.crumbs.html : ''}
${o.body}
</main>
${footer()}
${DIALOGS()}
</body>
</html>`;
}
function page(p, o, opts) {
  const schema = [...(o.schema || [])];
  if (o.crumbs) schema.push(o.crumbs.schema);
  writePage(p, layout({ ...o, path: p, schema }), { index: !o.noindex, ...(opts || {}) });
}
const ORG = { '@type': 'Organization', '@id': abs(u('/#org')), name: site.name, url: abs(u('/')), logo: abs(u('/icons/icon-512.png')), email: site.email };
const collection = (name, p, desc) => ({ '@context': 'https://schema.org', '@type': 'CollectionPage', name, description: desc, url: abs(u(p)), isPartOf: { '@type': 'WebSite', name: site.name, url: abs(u('/')) } });

// paginated listing generator
function listing({ basePath, list, title, h1, description, crumbsFor, intro = '', filters = '', top = '', bottom = '', nav, schemaName }) {
  const total = Math.max(1, Math.ceil(list.length / PER));
  for (let p = 1; p <= total; p++) {
    const pth = p === 1 ? basePath : `${basePath}page/${p}/`;
    const slice = list.slice((p - 1) * PER, p * PER);
    const t = p === 1 ? title : `${title} – Page ${p}`;
    const d = p === 1 ? description : `${description} Page ${p} of ${total}.`;
    const crumbs = breadcrumbs(p === 1 ? crumbsFor : [...crumbsFor.slice(0, -1), { ...crumbsFor[crumbsFor.length - 1], path: basePath }, { name: `Page ${p}`, path: pth }]);
    const body = `<div class="container">
<header class="page-head"><h1>${esc(h1)}${p > 1 ? ` <span class="muted" style="font-size:.5em">page ${p}</span>` : ''}</h1>${intro}</header>
${top}
${filters}
<div data-static-list>
<p class="filter-status"><span>${plural(list.length, 'joke')}${total > 1 ? `, page ${p} of ${total}` : ''}</span></p>
${slice.length ? grid(slice, { ads: true }) : state('🤔', 'No jokes here yet', 'New jokes are added regularly. Try another category.', `<a class="btn btn-primary" href="${u('/jokes/')}">Explore jokes</a>`)}
${adSlot('list-before-pagination')}
${pager(basePath, p, total)}
</div>
${bottom}
</div>`;
    page(pth, { title: t, description: d, crumbs, body, nav, prevLink: p > 1 ? (p === 2 ? basePath : `${basePath}page/${p - 1}/`) : null, nextLink: p < total ? `${basePath}page/${p + 1}/` : null, schema: [collection(schemaName || h1, pth, d)] });
  }
}

// ---------- pages ----------
function catTiles(list) {
  return `<ul class="tile-grid">${list.map(c => `<li><a class="tile" href="${catHref(c)}"><span class="tile-emoji" aria-hidden="true">${c.emoji}</span><span class="tile-body"><span class="tile-name">${esc(c.name)}</span><span class="tile-count">${plural(catCount(c), 'joke')}</span></span></a></li>`).join('')}</ul>`;
}
function langTiles(list) {
  return `<ul class="tile-grid">${list.map(l => `<li><a class="tile" href="${langHref(l)}"><span class="tile-native" lang="${l.htmlLang}" dir="${l.dir}" aria-hidden="true">${esc([...l.nativeName].slice(0, 2).join(''))}</span><span class="tile-body"><span class="tile-name">${esc(l.name)} Jokes</span><span class="tile-count" lang="${l.htmlLang}" dir="${l.dir}">${esc(l.nativeName)}</span><span class="tile-count">${plural(langJokes.get(l.code).length, 'joke')}</span></span></a></li>`).join('')}</ul>`;
}
const jotdFallback = jotdFor(BUILD_DATE);

// Home
{
  const body = `<section class="hero"><div class="container hero-grid">
<div>
<h1>Best Jokes in Every Language</h1>
<p class="lead">Read, copy and share funny jokes with your friends.</p>
<form class="bubble-search" action="${u('/search/')}" method="get" role="search">${icon('search')}<label for="hero-q" class="sr-only">Search jokes</label><input id="hero-q" type="search" name="q" placeholder="Search jokes..." autocomplete="off" enterkeyhint="search"><button type="submit">Search</button></form>
<div class="btn-row"><a class="btn btn-primary btn-lg" href="${u('/jokes/')}">Explore Jokes</a><a class="btn btn-lg" href="${u('/categories/')}">Browse Categories</a></div>
<ul class="chip-list hero-langs" aria-label="Popular languages">${languages.slice(0, 6).map(l => `<li><a class="chip" href="${langHref(l)}">${esc(l.name)}</a></li>`).join('')}<li><a class="chip" href="${u('/languages/')}">+${languages.length - 6} more</a></li></ul>
</div>
<div class="jotd-hero"><h2 class="jotd-label">😂 Joke of the Day</h2><div data-jotd>${card(jotdFallback, 'h3')}</div><p style="margin:10px 0 0"><a href="${u('/joke-of-the-day/')}">Open today's joke</a></p></div>
</div></section>
<div class="container">${adSlot('home-below-hero')}
<section class="section"><div class="section-head"><h2>Joke categories</h2><a href="${u('/categories/')}">All categories</a></div>${catTiles(categories.slice(0, 15))}</section>
<section class="section"><div class="section-head"><h2>Trending jokes</h2><a href="${u('/trending/')}">See trending</a></div>${grid(trending.slice(0, 6))}</section>
${adSlot('home-mid')}
<section class="section"><div class="section-head"><h2>Jokes in your language</h2><a href="${u('/languages/')}">All languages</a></div>${langTiles(languages)}</section>
<section class="section"><div class="section-head"><h2>Short jokes for WhatsApp</h2><a href="${u('/jokes/short/')}">More short jokes</a></div>${grid(popular.filter(j => j.short).slice(0, 6))}</section>
<section class="section"><div class="state" style="text-align:left"><h2>Can't decide?</h2><p class="muted">Let us pick one for you, or browse joke formats and write your own.</p><div class="btn-row" style="justify-content:flex-start"><a class="btn btn-yellow btn-lg" href="${u('/random-joke/')}">${icon('shuffle')}Give Me a Random Joke 😂</a><a class="btn btn-lg" href="${u('/joke-templates/')}">Joke templates</a></div></div></section>
${adSlot('home-before-footer')}
</div>`;
  page('/', {
    fullTitle: `${site.name} – Best Jokes in Hindi, English & ${languages.length - 2} More Languages | ${site.tagline}`,
    title: `${site.name} – ${site.tagline}`,
    description: `Read, copy and share ${jokes.length}+ clean jokes in Hindi, English, Hinglish and ${languages.length - 3} Indian languages. Funny, desi, school, office and family jokes, updated regularly.`,
    body, nav: '/',
    schema: [{ '@context': 'https://schema.org', '@graph': [
      { '@type': 'WebSite', '@id': abs(u('/#website')), name: site.name, url: abs(u('/')), description: site.tagline, publisher: { '@id': ORG['@id'] }, potentialAction: { '@type': 'SearchAction', target: { '@type': 'EntryPoint', urlTemplate: abs(u('/search/')) + '?q={search_term_string}' }, 'query-input': 'required name=search_term_string' } },
      ORG] }],
  });
}

// All jokes
listing({
  basePath: '/jokes/', list: popular, nav: '/jokes/',
  title: 'All Jokes – Funny Jokes in 14 Languages', h1: 'All Jokes',
  description: `Browse all ${jokes.length} JokeMasti jokes. Filter by language, category and length, then copy or share your favourites.`,
  intro: `<p class="lead">Every joke on ${site.name}, sorted by popularity. Use the filters to narrow it down.</p>`,
  crumbsFor: [HOME, { name: 'All Jokes', path: '/jokes/' }],
  filters: filtersForm({}),
});

// Short jokes
listing({
  basePath: '/jokes/short/', list: popular.filter(j => j.short),
  title: 'Short Jokes – One-Liners & Quick Jokes for WhatsApp', h1: 'Short Jokes',
  description: 'Short jokes, one-liners and quick jokes that fit perfectly in a WhatsApp message, Instagram caption, Telegram post or status.',
  intro: `<p class="lead">One-liners and quick jokes under ${SHORT} characters. Perfect for WhatsApp, Telegram, Instagram captions and status updates.</p>`,
  crumbsFor: [HOME, { name: 'All Jokes', path: '/jokes/' }, { name: 'Short Jokes', path: '/jokes/short/' }],
});

// Languages index + language pages + language-category pages
page('/languages/', {
  title: 'Jokes by Language – Hindi, English, Hinglish & Indian Languages',
  description: `Read jokes in ${languages.map(l => l.name).slice(0, 6).join(', ')} and ${languages.length - 6} more languages. Pick a language to start laughing.`,
  crumbs: breadcrumbs([HOME, { name: 'Languages', path: '/languages/' }]), nav: '/languages/',
  body: `<div class="container"><header class="page-head"><h1>Jokes by Language</h1><p class="lead">Pick your language. Each page has its own categories, search and sharing.</p></header>${langTiles(languages)}</div>`,
  schema: [collection('Jokes by Language', '/languages/', 'Jokes grouped by language.')],
});
for (const l of languages) {
  const list = langJokes.get(l.code);
  const cats = pageCats.filter(c => !c.rule).map(c => [c, list.filter(j => j.category === c.slug).length]).filter(([, n]) => n);
  const chips = `<section aria-labelledby="lc-${l.code}"><h2 id="lc-${l.code}" class="sr-only">${l.name} joke categories</h2><ul class="chip-list" style="margin-bottom:8px">${cats.map(([c, n]) => {
    const key = `${l.code}|${c.slug}`;
    return `<li><a class="chip" href="${langCat.has(key) ? u(langCatPath(l, c)) : catHref(c)}">${c.emoji} ${esc(c.name)} <span class="muted">${n}</span></a></li>`;
  }).join('')}</ul></section>`;
  const others = popular.filter(j => j.language !== l.code).slice(0, 3);
  const review = list.some(j => j.reviewStatus === 'pending-native-review') ? `<p class="notice">This collection is growing. If you're a native ${esc(l.name)} speaker and spot something that could be better, <a href="${u('/contact/')}">tell us</a>.</p>` : '';
  listing({
    basePath: `/jokes/${l.slug}/`, list,
    title: `${l.name} Jokes – Funny ${l.name} Jokes to Read & Share`, h1: `${l.name} Jokes`,
    description: `Read funny ${l.name} jokes (${l.nativeName}). Copy and share ${plural(list.length, 'clean joke')} in ${l.name} on WhatsApp, Telegram and more.`,
    intro: `<p class="lead"><span lang="${l.htmlLang}" dir="${l.dir}">${esc(l.nativeName)}</span> — clean ${esc(l.name)} jokes to read, copy and share.</p>${sharePage(`${l.name} Jokes on ${site.name}`, `/jokes/${l.slug}/`)}`,
    top: chips + review + adSlot('category-top'),
    crumbsFor: [HOME, { name: 'Languages', path: '/languages/' }, { name: `${l.name} Jokes`, path: `/jokes/${l.slug}/` }],
    filters: filtersForm({ lockLang: l.code }),
    bottom: `${adSlot('category-bottom')}<section class="section"><div class="section-head"><h2>Popular in other languages</h2><a href="${u('/languages/')}">All languages</a></div>${grid(others)}</section>`,
  });
}
for (const [key, list] of langCat) {
  const [lc, cs] = key.split('|'); const l = langByCode.get(lc), c = catBySlug.get(cs);
  const p = langCatPath(l, c);
  const siblings = [...langCat.keys()].filter(k => k.startsWith(lc + '|') && k !== key).map(k => catBySlug.get(k.split('|')[1]));
  listing({
    basePath: p, list,
    title: `Funny ${c.name} in ${l.name}`, h1: `${c.name} in ${l.name}`,
    description: `Read funny ${c.name.toLowerCase()} in ${l.name}. Copy and share your favourite jokes with friends.`,
    intro: `<p class="lead">${esc(c.description)}</p>`,
    crumbsFor: [HOME, { name: `${l.name} Jokes`, path: `/jokes/${l.slug}/` }, { name: c.name, path: p }],
    top: siblings.length ? `<ul class="chip-list" style="margin-bottom:8px">${siblings.map(s => `<li><a class="chip" href="${u(langCatPath(l, s))}">${s.emoji} ${esc(s.name)}</a></li>`).join('')}<li><a class="chip" href="${catHref(c)}">${esc(c.name)} in all languages</a></li></ul>` : '',
  });
}

// Categories index + category pages
page('/categories/', {
  title: 'Joke Categories – Funny, Desi, School, Office, Family & More',
  description: `Browse ${categories.length} joke categories on ${site.name}: funny, desi, teacher student, husband wife, office, doctor patient, kids jokes and more.`,
  crumbs: breadcrumbs([HOME, { name: 'Categories', path: '/categories/' }]), nav: '/categories/',
  body: `<div class="container"><header class="page-head"><h1>Joke Categories</h1><p class="lead">Find the right joke for the right moment.</p></header>${catTiles(categories)}</div>`,
  schema: [collection('Joke Categories', '/categories/', 'All joke categories.')],
});
for (const c of pageCats) {
  const list = catJokes.get(c.slug);
  const langsHere = languages.filter(l => langCat.has(`${l.code}|${c.slug}`));
  const others = pageCats.filter(o => o !== c && !o.rule);
  const start = Math.min(Math.max(0, pageCats.indexOf(c) - 2), Math.max(0, others.length - 6));
  const relatedCats = c.related ? c.related.map(s => catBySlug.get(s)).filter(Boolean) : others.slice(start, start + 6);
  listing({
    basePath: `/category/${c.slug}/`, list,
    title: `${c.name} – Funny ${c.name} in Hindi, English & More`, h1: c.name,
    description: `${c.description} Read, copy and share ${plural(list.length, 'joke')} on ${site.name}.`,
    intro: `<p class="lead">${esc(c.description)}</p>`,
    crumbsFor: [HOME, { name: 'Categories', path: '/categories/' }, { name: c.name, path: `/category/${c.slug}/` }],
    top: (langsHere.length ? `<ul class="chip-list" style="margin-bottom:8px" aria-label="${esc(c.name)} by language">${langsHere.map(l => `<li><a class="chip" href="${u(langCatPath(l, c))}">${esc(c.name)} in ${esc(l.name)}</a></li>`).join('')}</ul>` : '') + adSlot('category-top'),
    filters: filtersForm({ lockCat: c.slug }),
    bottom: `${adSlot('category-bottom')}<section class="section"><div class="section-head"><h2>Related categories</h2><a href="${u('/categories/')}">All categories</a></div>${catTiles(relatedCats)}</section>`,
  });
}

// Tags
page('/tags/', {
  title: 'Joke Tags – Browse Jokes by Topic', description: `Browse jokes by topic: ${[...tagPages.keys()].slice(0, 8).join(', ')} and more.`,
  crumbs: breadcrumbs([HOME, { name: 'Tags', path: '/tags/' }]),
  body: `<div class="container"><header class="page-head"><h1>Joke Tags</h1><p class="lead">Topics that show up again and again.</p></header><ul class="chip-list">${[...tagPages].map(([t, l]) => `<li><a class="chip" href="${u(`/tag/${t}/`)}">#${esc(t)} <span class="muted">${l.length}</span></a></li>`).join('')}</ul></div>`,
});
for (const [t, list] of tagPages) {
  const name = tagName(t);
  listing({
    basePath: `/tag/${t}/`, list,
    title: `${name[0].toUpperCase() + name.slice(1)} Jokes – #${t}`, h1: `#${t} jokes`,
    description: `Funny jokes about ${name}. Read, copy and share ${plural(list.length, 'joke')} tagged #${t} on ${site.name}.`,
    crumbsFor: [HOME, { name: 'Tags', path: '/tags/' }, { name: `#${t}`, path: `/tag/${t}/` }],
  });
}

// Popular, trending
page('/popular/', {
  title: 'Popular Jokes – Most Loved Jokes on JokeMasti', nav: '/popular/',
  description: 'The most popular jokes on JokeMasti across Hindi, English, Hinglish and regional languages, ranked by our editors.',
  crumbs: breadcrumbs([HOME, { name: 'Popular', path: '/popular/' }]),
  body: `<div class="container"><header class="page-head"><h1>Popular Jokes</h1><p class="lead">Our editors' favourite jokes across every language.</p></header><p class="notice">How this works: each joke has an editor score from 1 to 100. This list is sorted by that score. It is not based on user votes, and we don't show like counts.</p>${grid(popular.slice(0, 48), { ads: true })}<p style="margin-top:20px"><a class="btn" href="${u('/jokes/')}">See all ${jokes.length} jokes</a></p></div>`,
  schema: [collection('Popular Jokes', '/popular/', 'Editor-ranked popular jokes.')],
});
page('/trending/', {
  title: 'Trending Jokes – What’s Hot on JokeMasti Right Now', nav: '/trending/',
  description: 'Trending, popular and latest jokes on JokeMasti. A transparent ranking that mixes editor scores with how recently a joke was added.',
  crumbs: breadcrumbs([HOME, { name: 'Trending', path: '/trending/' }]),
  body: `<div class="container"><header class="page-head"><h1>Trending Jokes</h1><p class="lead">Fresh picks, favourites and the newest additions.</p></header>
<p class="notice">How trending works: editor score + a bonus for jokes added in the last 30 days (+15 for featured jokes). There's no tracking of individual readers, and we don't publish share counts because we don't collect them.</p>
<section class="section" id="trending"><h2>Trending jokes</h2>${grid(trending.slice(0, 12))}</section>
${adSlot('list-mid')}
<section class="section" id="popular"><div class="section-head"><h2>Popular jokes</h2><a href="${u('/popular/')}">All popular jokes</a></div>${grid(popular.slice(0, 9))}</section>
<section class="section" id="latest"><h2>Latest jokes</h2>${grid(newest.slice(0, 9))}</section></div>`,
  schema: [collection('Trending Jokes', '/trending/', 'Trending, popular and latest jokes.')],
});

// Joke detail pages
for (const j of jokes) {
  const l = j.lang, c = j.cat, s = shareLinks(j);
  const lcKey = `${l.code}|${c.slug}`;
  const catCrumb = langCat.has(lcKey) ? { name: c.name, path: langCatPath(l, c) } : { name: c.name, path: `/category/${c.slug}/` };
  const crumbs = breadcrumbs([HOME, { name: `${l.name} Jokes`, path: `/jokes/${l.slug}/` }, catCrumb, { name: j.title, path: j.path }]);
  const seen = new Set([j.id]);
  const pick = arr => arr.filter(x => !seen.has(x.id) && seen.add(x.id));
  const related = [...pick(popular.filter(x => x.category === c.slug && x.language === l.code)), ...pick(popular.filter(x => x.category === c.slug)), ...pick(popular.filter(x => x.language === l.code))].slice(0, 6);
  const excerpt = trunc(j.text.replace(/\n/g, ' '), 110);
  const desc = trunc(`${excerpt} Read and share this ${c.name.toLowerCase().replace(/ jokes$/, '')} joke in ${l.name} on ${site.name}.`, 170);
  const body = `<div class="container">
<article class="joke-detail" data-joke data-id="${j.id}" data-url="${esc(abs(u(j.path)))}" data-title="${esc(j.title)}">
<h1 lang="${l.htmlLang}" dir="${l.dir}">${esc(j.title)}</h1>
<div class="joke-text" lang="${l.htmlLang}" dir="${l.dir}">${paras(j.text)}</div>
<div class="joke-meta"><a class="chip" href="${langHref(l)}">${esc(l.name)}</a><a class="chip" href="${catHref(c)}">${esc(c.name)}</a></div>
${tagLinks(j)}
<div class="detail-actions">
<a class="btn btn-wa" href="${esc(s.whatsapp)}" ${ext}>${icon('whatsapp')}Share on WhatsApp</a>
<button type="button" class="btn btn-primary" data-action="copy">${icon('copy')}<span>Copy Joke</span></button>
<button type="button" class="btn" data-action="share">${icon('share')}<span>Share</span></button>
<a class="btn" href="${esc(s.telegram)}" ${ext}>${icon('telegram')}Telegram</a>
<a class="btn" href="${esc(s.facebook)}" ${ext}>${icon('facebook')}Facebook</a>
<a class="btn" href="${esc(s.x)}" ${ext}>${icon('x')}X</a>
<button type="button" class="btn" data-action="more">${icon('more')}<span>More options</span></button>
<button type="button" class="btn" data-action="save" aria-pressed="false">${icon('bookmark')}<span>Save Joke</span></button>
</div>
</article>
<nav class="prev-next" aria-label="Previous and next joke">
${j.prev ? `<a class="prev" href="${u(j.prev.path)}" rel="prev"><small>${icon('chevron-left')}Previous joke</small><span>${esc(j.prev.title)}</span></a>` : '<span></span>'}
${j.next ? `<a class="next" href="${u(j.next.path)}" rel="next"><small>Next joke${icon('chevron-right')}</small><span>${esc(j.next.title)}</span></a>` : ''}
</nav>
${adSlot('joke-above-related')}
<section class="section"><div class="section-head"><h2>More Funny Jokes</h2><a href="${catHref(c)}">More ${esc(c.name)}</a></div>${grid(related)}</section>
${adSlot('joke-mid')}
<section class="section"><h2>Keep laughing</h2><ul class="chip-list">
<li><a class="chip" href="${catHref(c)}">${c.emoji} More ${esc(c.name)}</a></li>
<li><a class="chip" href="${langHref(l)}">More ${esc(l.name)} Jokes</a></li>
${langCat.has(lcKey) ? `<li><a class="chip" href="${u(langCatPath(l, c))}">${esc(c.name)} in ${esc(l.name)}</a></li>` : ''}
<li><a class="chip" href="${u('/popular/')}">Popular jokes</a></li>
<li><a class="chip" href="${u('/trending/#latest')}">Latest jokes</a></li>
<li><a class="chip" href="${u('/random-joke/')}">Random joke</a></li>
</ul></section>
${adSlot('joke-before-footer')}
</div>`;
  page(j.path, {
    title: `${j.title} – ${l.name} ${c.name}`, ogTitle: j.title, description: desc, crumbs, body, lang: 'en', ogType: 'article',
    schema: [{ '@context': 'https://schema.org', '@type': 'CreativeWork', '@id': abs(u(j.path)) + '#joke', name: j.title, text: j.text, inLanguage: l.htmlLang, genre: 'Humor', keywords: j.tags.join(', '), about: c.name, identifier: j.id, dateCreated: j.createdAt, dateModified: j.updatedAt, url: abs(u(j.path)), isAccessibleForFree: true, publisher: { '@type': 'Organization', name: site.name, url: abs(u('/')) }, isPartOf: { '@type': 'WebSite', name: site.name, url: abs(u('/')) } }],
  }, { lastmod: j.updatedAt });
}

// Joke of the day / random / saved / search / templates
page('/joke-of-the-day/', {
  title: 'Joke of the Day – A New Joke Every Day', nav: '/joke-of-the-day/',
  description: `One hand-picked joke every day on ${site.name}. Come back tomorrow for a new one, or share today's joke with friends.`,
  crumbs: breadcrumbs([HOME, { name: 'Joke of the Day', path: '/joke-of-the-day/' }]),
  body: `<div class="container"><header class="page-head"><h1>😂 Joke of the Day</h1><p class="lead" data-jotd-date>A new joke every day. Everyone sees the same joke on the same date.</p></header>
<div style="max-width:780px" data-jotd data-jotd-heading="h2">${card(jotdFallback, 'h2')}</div>
<div class="btn-row" style="margin-top:20px"><a class="btn btn-yellow" href="${u('/random-joke/')}">${icon('shuffle')}Random joke</a><a class="btn" href="${u('/jokes/')}">All jokes</a></div>
${adSlot('joke-above-related')}
<section class="section"><h2>More popular jokes</h2>${grid(popular.slice(0, 6))}</section></div>`,
});
page('/random-joke/', {
  title: 'Random Joke Generator – Get a Random Funny Joke',
  description: `Tap the button for a random joke from ${jokes.length}+ clean jokes in ${languages.length} languages. Copy it, share it, save it.`,
  crumbs: breadcrumbs([HOME, { name: 'Random Joke', path: '/random-joke/' }]),
  body: `<div class="container"><header class="page-head"><h1>Random Joke</h1><p class="lead">One tap, one joke. Pick a language if you like.</p></header>
<div class="btn-row" style="align-items:flex-end;margin-bottom:18px">
<button type="button" class="btn btn-yellow btn-lg" data-random-btn>${icon('shuffle')}Give Me a Random Joke 😂</button>
<label class="form-field" style="margin:0;font-size:.85rem">Language<select data-random-lang><option value="">Any language</option>${languages.map(l => `<option value="${l.code}">${esc(l.name)}</option>`).join('')}</select></label>
</div>
<div style="max-width:780px" data-random-out aria-live="polite">${card(trending[0], 'h2')}</div>
${adSlot('joke-above-related')}</div>`,
});
page('/saved-jokes/', {
  title: 'Saved Jokes', noindex: true,
  description: 'Jokes you saved on this device. Saved jokes stay in your browser, no account needed.',
  crumbs: breadcrumbs([HOME, { name: 'Saved Jokes', path: '/saved-jokes/' }]),
  body: `<div class="container"><header class="page-head"><h1>Saved Jokes</h1><p class="lead">Saved on this device only. Clearing your browser data removes them.</p></header>
<div data-saved><div class="joke-grid"><div class="skeleton"></div><div class="skeleton"></div></div></div>
<noscript>${state('🔖', 'Saving jokes needs JavaScript', 'Turn on JavaScript to save and view jokes on this device.', `<a class="btn btn-primary" href="${u('/jokes/')}">Explore Jokes</a>`)}</noscript></div>`,
});
page('/search/', {
  title: 'Search Jokes', noindex: true,
  description: `Search ${jokes.length}+ jokes by keyword, category, language or tag.`,
  crumbs: breadcrumbs([HOME, { name: 'Search', path: '/search/' }]),
  body: `<div class="container"><header class="page-head"><h1>Search Jokes</h1><p class="lead">Try a topic like “teacher”, “exam” or “पति”, or pick filters.</p></header>${filtersForm({ sort: 'popular' })}
<div data-search-empty>${state('🔎', 'Type something to search', 'Search looks through joke titles, text, categories, languages and tags.')}</div></div>`,
});
page('/joke-templates/', {
  title: 'Joke Templates – 15 Joke Formats with Examples',
  description: 'Learn 15 classic joke formats — Q&A, teacher student, knock-knock, one-liner, funny dialogue and more — with examples and matching categories.',
  crumbs: breadcrumbs([HOME, { name: 'Joke Templates', path: '/joke-templates/' }]),
  body: `<div class="container"><header class="page-head"><h1>Joke Templates</h1><p class="lead">The shapes that most jokes take. Use them to understand why a joke works, or to write your own.</p></header>
<div class="template-list">${templates.map(t => `<section class="template" id="${t.slug}"><h2 style="font-size:1.3rem">${esc(t.name)}</h2>
<dl><dt>Format</dt><dd><pre>${esc(t.format)}</pre></dd><dt>Example</dt><dd><pre>${esc(t.example)}</pre></dd><dt>Tip</dt><dd><p>${esc(t.tip)}</p></dd><dt>Recommended categories</dt><dd><ul class="chip-list" style="margin-top:6px">${t.categories.map(s => catBySlug.get(s)).filter(Boolean).map(c => `<li><a class="chip" href="${catHref(c)}">${esc(c.name)}</a></li>`).join('')}</ul></dd></dl></section>`).join('')}</div>
<p class="notice" style="margin-top:24px">Wrote something funny? Send it through the <a href="${u('/contact/')}">contact page</a>. Only send jokes you wrote yourself.</p></div>`,
});

// Legal & info pages
const L = site.legalLastUpdated;
const mail = e => `<a href="mailto:${e}">${e}</a>`;
function info(p, title, h1, description, html, extra = {}) {
  page(p, { title, description, crumbs: breadcrumbs([HOME, { name: h1, path: p }]), body: `<div class="container"><header class="page-head"><h1>${esc(h1)}</h1></header><div class="prose">${html}</div></div>`, ...extra });
}
info('/about/', `About ${site.name}`, `About ${site.name}`, `${site.name} is a free, clean jokes website with original jokes in ${languages.length} languages. No login, no fake likes, just jokes.`, `
<p class="lead">${site.name} is a simple place to find a clean joke, copy it and send it to someone who needs a laugh. ${esc(site.tagline)}</p>
<h2>What you'll find here</h2><p>${jokes.length} jokes across ${categories.length - 1} categories in ${languages.length} languages, with more added in batches. Most jokes are written by our team. Some follow traditional folk formats that have been told for generations; we write our own versions of those and label them in our data.</p>
<h2>What you won't find</h2><ul><li>Accounts, logins or paid plans.</li><li>Made-up like counts or fake popularity numbers.</li><li>Jokes that target religion, caste, region, gender, body type or disability.</li><li>Jokes copied from other websites.</li></ul>
<h2>How ranking works</h2><p>Popular jokes are sorted by an editor score. Trending adds a bonus for recently added jokes. Joke of the Day is picked by date, so everyone sees the same joke on the same day.</p>
<h2>Regional languages</h2><p>Our Hindi, English and Hinglish collections are the largest. Bengali, Marathi, Gujarati, Punjabi, Tamil, Telugu, Kannada, Malayalam, Odia, Assamese and Urdu collections are growing, and native-speaker review is ongoing. Suggestions are welcome on the <a href="${u('/contact/')}">contact page</a>.</p>`);
info('/contact/', `Contact ${site.name}`, 'Contact Us', `Contact ${site.name} with feedback, joke suggestions, corrections or copyright concerns.`, `
<div class="contact-grid" style="max-width:none"><div>
<p>The quickest way to reach us is email: ${mail(site.email)}. For copyright concerns, see the <a href="${u('/copyright/')}">copyright page</a>.</p>
<form data-contact-form novalidate>
<div class="form-field"><label for="cf-name">Name</label><input id="cf-name" name="name" autocomplete="name" required></div>
<div class="form-field"><label for="cf-email">Email</label><input id="cf-email" name="email" type="email" autocomplete="email" required></div>
<div class="form-field"><label for="cf-subject">Subject</label><select id="cf-subject" name="subject"><option>General feedback</option><option>Joke suggestion</option><option>Correction or translation fix</option><option>Report a joke</option><option>Advertising</option></select></div>
<div class="form-field"><label for="cf-message">Message</label><textarea id="cf-message" name="message" required></textarea></div>
<p class="muted" style="font-size:.9rem">This form opens your email app with your message filled in. Nothing is sent or stored by this website.</p>
<p data-form-error class="notice" hidden role="alert"></p>
<button type="submit" class="btn btn-primary">${icon('mail')}Open in email app</button>
</form></div>
<div><h2 style="margin-top:0">Before you write</h2><ul><li>Joke suggestions must be your own writing.</li><li>To report a joke, include its link.</li><li>We reply by email, usually within a few working days.</li></ul></div></div>`);
info('/privacy-policy/', 'Privacy Policy', 'Privacy Policy', `How ${site.name} handles information: local storage, cookies, analytics, advertising and social sharing.`, `
<p class="muted">Last updated: ${L}</p>
<p>This policy explains what information ${site.name} (“we”) handles when you use this website. It is written in plain language. If anything is unclear, email ${mail(site.email)}.</p>
<h2>No accounts</h2><p>${site.name} has no login, registration or user accounts. We do not ask for your name, phone number or address to use the site.</p>
<h2>Local storage on your device</h2><p>We use your browser's localStorage to remember your theme choice (light, dark or system) and the jokes you save. This data stays on your device and is not sent to us. You can remove it at any time by clearing your browser's site data.</p>
<h2>Offline support</h2><p>A service worker stores copies of site files and pages you visit so the site loads faster and works offline. These copies stay in your browser.</p>
<h2>Basic technical information</h2><p>Like any website, our hosting provider may process technical information such as IP address, browser type, requested pages and time of request to deliver the site and protect it from abuse. Please see your hosting provider's own policy for retention details.</p>
<h2>Fonts</h2><p>Headings use a font loaded from Google Fonts, which means your browser requests it from Google's servers.</p>
<h2>Analytics</h2><p>At the time of writing, this site does not run analytics. If we add analytics, we will update this section to name the provider and describe what it collects.</p>
<h2>Advertising and cookies</h2><p>This site is prepared to show ads, for example through Google AdSense. When ads are enabled, third-party vendors, including Google, may use cookies or similar technologies to serve ads based on your visits to this and other websites. You can learn about and manage personalised ads through Google's Ads Settings. Where the law requires consent for such cookies, we will ask for it before loading ads.</p>
<h2>Social sharing</h2><p>Share buttons are plain links. Nothing is sent to WhatsApp, Telegram, Facebook, X, Reddit, LinkedIn or your email or SMS app until you tap a button, and you confirm the share in that app. Once you share, that service's own privacy policy applies.</p>
<h2>Contact form</h2><p>The contact form opens your own email app. We only receive what you choose to send, and we use it only to reply to you.</p>
<h2>Children</h2><p>The site is suitable for a general audience and does not knowingly collect personal information from children.</p>
<h2>Changes</h2><p>We may update this policy. The date at the top shows the latest version.</p>`);
info('/terms/', 'Terms of Use', 'Terms of Use', `The terms for using ${site.name}, including acceptable use, sharing, content and limitations.`, `
<p class="muted">Last updated: ${L}</p>
<p>By using ${site.name}, you agree to these terms. If you don't agree, please don't use the site.</p>
<h2>Using the jokes</h2><p>You may read, copy and share individual jokes for personal, non-commercial purposes, such as sending them to friends or posting them on your social profile. A link back to ${site.name} is appreciated.</p>
<h2>What you may not do</h2><ul><li>Copy the joke collection in bulk, scrape the site, or republish it as your own.</li><li>Use the site or its content to harass, defame or harm anyone.</li><li>Try to disrupt, overload or break the site.</li></ul>
<h2>Content</h2><p>Jokes are meant as light-hearted humour and are not statements of fact. Names such as Santa, Banta, Pappu or Chintu are fictional characters. We work to keep content clean and respectful, and we review reports.</p>
<h2>Links to other services</h2><p>Share buttons and links take you to third-party services that have their own terms.</p>
<h2>No warranty</h2><p>The site is provided “as is”. We try to keep it available and accurate but can't guarantee that it always will be.</p>
<h2>Changes</h2><p>We may update these terms. Continued use after changes means you accept them. Questions: ${mail(site.email)}.</p>`);
info('/disclaimer/', 'Disclaimer', 'Disclaimer', `${site.name} jokes are for entertainment only. Read our disclaimer about content, characters and external links.`, `
<p class="muted">Last updated: ${L}</p>
<p>All content on ${site.name} is for entertainment only.</p>
<h2>Fiction, not fact</h2><p>Characters and situations in jokes are fictional. Any resemblance to real people is coincidental. Nothing here is medical, legal, financial or professional advice — including the doctor jokes.</p>
<h2>Respectful humour</h2><p>We aim for humour that everyone can enjoy. If a joke seems hurtful, please report it through the <a href="${u('/contact/')}">contact page</a> and we'll review it.</p>
<h2>Translations and regional content</h2><p>Regional language collections are growing and may contain wording that a native speaker would improve. Corrections are welcome.</p>
<h2>External links and ads</h2><p>We are not responsible for the content of external sites or advertisements. Ads, when shown, are labelled as such.</p>`);
info('/copyright/', 'Copyright & Content Removal', 'Copyright & Content Removal', `How to report copyright concerns or request removal of content on ${site.name}.`, `
<p class="muted">Last updated: ${L}</p>
<h2>Our content</h2><p>Most jokes on ${site.name} are written by our team. Some are our own retellings of traditional jokes that have circulated for generations and have no known author; these are marked as “traditional” in our data. We do not scrape or copy other websites' collections. We don't claim ownership of traditional joke formats.</p>
<h2>Reporting a concern</h2><p>If you believe content on this site infringes your copyright, email ${mail(site.copyrightEmail)} with:</p>
<ol><li>Your name and contact details.</li><li>A description of your original work and where it was first published.</li><li>The ${site.name} link(s) to the content you're concerned about.</li><li>A statement that you believe in good faith the use is not authorised.</li><li>A statement that the information in your notice is accurate and that you are the owner or authorised to act for the owner.</li></ol>
<h2>What happens next</h2><p>We review every notice. Where a concern appears valid, we remove or change the content, usually within a few working days, and reply to let you know.</p>
<h2>Other removal requests</h2><p>For content that you feel is offensive, inaccurate, or mentions you personally, email ${mail(site.email)} with the link and a short explanation.</p>`);

// Offline & 404
page('/offline/', {
  title: 'You are offline', noindex: true, description: 'You are offline.',
  body: `<div class="container" style="padding-top:32px">${state('📴', "You're offline", 'This page is not saved on your device yet. Pages you opened before and your saved jokes still work.', `<a class="btn btn-primary" href="${u('/saved-jokes/')}">Saved jokes</a><a class="btn" href="${u('/')}">Home</a>`)}</div>`,
});
writePage('/404.html', layout({
  title: 'Page not found', noindex: true, description: 'This page does not exist.', schema: [],
  body: `<div class="container" style="text-align:center;padding-top:24px"><div class="big-emoji" aria-hidden="true">🙈</div><h1>Oops! Ye Joke Toh Gayab Ho Gaya 😂</h1><p class="lead" style="margin:0 auto 20px">The page you're looking for doesn't exist or has moved. Let's get you back to the laughs.</p>
<div class="btn-row" style="justify-content:center"><a class="btn btn-primary btn-lg" href="${u('/')}">Home</a><a class="btn btn-lg" href="${u('/jokes/')}">All Jokes</a><a class="btn btn-yellow btn-lg" href="${u('/random-joke/')}">${icon('shuffle')}Random Joke</a></div></div>`,
}), { index: false });

// ---------- PWA, robots, sitemap, headers ----------
writeFile('/manifest.json', JSON.stringify({
  name: `${site.name} – ${site.tagline}`, short_name: site.name, description: 'Clean jokes in 14 languages to read, copy and share.',
  start_url: u('/'), scope: u('/'), display: 'standalone', background_color: '#f3f5f9', theme_color: '#ffc93c', lang: 'en', dir: 'ltr', categories: ['entertainment'],
  icons: [
    { src: u('/icons/icon-192.png'), sizes: '192x192', type: 'image/png' },
    { src: u('/icons/icon-512.png'), sizes: '512x512', type: 'image/png' },
    { src: u('/icons/icon-maskable-512.png'), sizes: '512x512', type: 'image/png', purpose: 'maskable' },
  ],
  shortcuts: [{ name: 'Joke of the Day', url: u('/joke-of-the-day/') }, { name: 'Random Joke', url: u('/random-joke/') }, { name: 'Saved Jokes', url: u('/saved-jokes/') }],
}, null, 2));
const swVersion = hash(Object.values(assets).join('|') + BUILD_DATE + jokes.length);
writeFile('/sw.js', fs.readFileSync(path.join(SRC, 'sw.template.js'), 'utf8')
  .replace('__VERSION__', swVersion).replace(/__BASE__/g, BASE)
  .replace('__PRECACHE__', JSON.stringify([u('/offline/'), assets['styles.css'], assets['app.js'], assets['icons.svg'], u('/favicon.svg')])));
writeFile('/robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${abs(u('/sitemap.xml'))}\n`);
writeFile('/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemap.map(s => `<url><loc>${esc(s.loc)}</loc><lastmod>${s.lastmod}</lastmod></url>`).join('\n')}\n</urlset>\n`);
writeFile('/_headers', `/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: SAMEORIGIN
  Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
/assets/*
  Cache-Control: public, max-age=31536000, immutable
/sw.js
  Cache-Control: no-cache
/manifest.json
  Cache-Control: public, max-age=86400
`);
writeFile('/.nojekyll', '');

console.log(`Built ${jokes.length} jokes, ${sitemap.length} indexable pages, ${tagPages.size} tag pages, ${langCat.size} language-category pages -> dist/`);
