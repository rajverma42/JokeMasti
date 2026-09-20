import { esc, jsonLd } from '../lib/util.js';
import { icon, SPRITE } from './icons.js';

const SITE_URL = (site) => site.url.replace(/\/$/, '');
const abs = (site, p = '/') => SITE_URL(site) + p;

/**
 * <head> block: unique title/description, canonical, OG, Twitter card,
 * and whatever JSON-LD blocks the page passes in.
 */
export function head(site, opts = {}) {
  const {
    title,
    description,
    path: pth = '/',
    image,
    type = 'website',
    noindex = false,
    ld = [],
  } = opts;
  const fullTitle = title ? `${title} | ${site.name}` : `${site.name} — ${site.tagline}`;
  const desc = description || site.description;
  const canonical = abs(site, pth);
  const ogImage = image ? (image.startsWith('http') ? image : abs(site, image)) : abs(site, '/assets/img/og-default.jpg');

  return `<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${esc(canonical)}">
${noindex ? '<meta name="robots" content="noindex,follow">' : '<meta name="robots" content="index,follow,max-image-preview:large">'}
<meta property="og:type" content="${esc(type)}">
<meta property="og:site_name" content="${esc(site.name)}">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${esc(canonical)}">
<meta property="og:image" content="${esc(ogImage)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="${esc(site.locale)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(fullTitle)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${esc(ogImage)}">
${site.twitterHandle ? `<meta name="twitter:site" content="${esc(site.twitterHandle)}">` : ''}
${ld.map((block) => `<script type="application/ld+json">${jsonLd(block)}</script>`).join('\n')}`;
}

export function orgSchema(site) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.name,
    url: SITE_URL(site),
    logo: abs(site, '/assets/img/icon-512.png'),
    description: site.description,
  };
}

export function websiteSchema(site) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.name,
    url: SITE_URL(site),
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${SITE_URL(site)}/search/?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function breadcrumbSchema(site, crumbs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: c.url ? abs(site, c.url) : undefined,
    })),
  };
}

export function breadcrumbs(crumbs) {
  return `<nav class="crumbs wrap" aria-label="Breadcrumb"><ol>${crumbs
    .map((c, i) => {
      const last = i === crumbs.length - 1;
      const sep = i > 0 ? '<li class="sep" aria-hidden="true">/</li>' : '';
      return `${sep}<li${last ? ' aria-current="page"' : ''}>${
        last || !c.url ? esc(c.name) : `<a href="${esc(c.url)}">${esc(c.name)}</a>`
      }</li>`;
    })
    .join('')}</ol></nav>`;
}

const NAV = [
  { href: '/', label: 'Home', match: '/' },
  { href: '/jokes/', label: 'Jokes', match: '/jokes/' },
  { href: '/trending/', label: 'Trending', match: '/trending/' },
  { href: '/festival/', label: 'Festivals', match: '/festival/' },
];

const DRAWER_MORE = [
  { href: '/whatsapp/', label: 'WhatsApp Corner' },
  { href: '/saved/', label: 'Saved / Bookmarks' },
  { href: '/search/', label: 'Search' },
];

function isActive(href, currentPath) {
  if (href === '/') return currentPath === '/';
  return currentPath === href || currentPath.startsWith(href);
}

export function header(site, currentPath) {
  return `<header class="site-header">
  <div class="wrap header-inner">
    <a href="/" class="logo" aria-label="${esc(site.name)} home">
      <span class="logo-mark" aria-hidden="true">😄</span>
      <span class="logo-text"><span class="logo-name">${esc(site.name)}</span><span class="logo-tag">${esc(site.tagline)}</span></span>
    </a>
    <nav class="nav" aria-label="Primary">
      <ul>
        ${NAV.map(
          (n) =>
            `<li><a href="${n.href}"${isActive(n.match, currentPath) ? ' aria-current="page"' : ''}>${esc(n.label)}</a></li>`
        ).join('')}
      </ul>
    </nav>
    <div class="header-actions">
      <a class="icon-btn" href="/search/" aria-label="Search jokes">${icon('search')}</a>
      <button class="icon-btn" id="theme-btn" type="button" aria-label="Toggle theme">
        ${icon('sun', 'ico-light')}${icon('moon', 'ico-dark')}
      </button>
      <button class="icon-btn burger" id="drawer-open" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-drawer">
        ${icon('menu')}
      </button>
    </div>
  </div>
</header>
<div class="drawer" id="mobile-drawer" data-open="false">
  <button class="drawer-scrim" id="drawer-close" type="button" aria-label="Close menu"></button>
  <div class="drawer-panel" role="dialog" aria-modal="true" aria-label="Menu">
    <div class="drawer-head">
      <span class="logo-name">${esc(site.name)}</span>
      <button class="icon-btn" id="drawer-close-x" type="button" aria-label="Close menu">${icon('close')}</button>
    </div>
    <nav aria-label="Mobile primary">
      <ul>
        ${NAV.map(
          (n) =>
            `<li><a href="${n.href}"${isActive(n.match, currentPath) ? ' aria-current="page"' : ''}>${icon(navIcon(n.label))}<span>${esc(n.label)}</span></a></li>`
        ).join('')}
      </ul>
      <p class="drawer-label">More</p>
      <ul>
        ${DRAWER_MORE.map((n) => `<li><a href="${n.href}">${icon(navIcon(n.label))}<span>${esc(n.label)}</span></a></li>`).join('')}
      </ul>
    </nav>
  </div>
</div>`;
}

function navIcon(label) {
  const map = {
    Home: 'home',
    Jokes: 'smile',
    Trending: 'fire',
    Festivals: 'sparkle',
    'WhatsApp Corner': 'whatsapp',
    'Saved / Bookmarks': 'bookmark',
    Search: 'search',
  };
  return map[label] || 'star';
}

export function footer(site, categories) {
  const year = new Date().getFullYear();
  return `<footer class="site-footer">
  <div class="wrap">
    <div class="footer-grid">
      <div class="footer-brand">
        <a href="/" class="logo"><span class="logo-mark" aria-hidden="true">😄</span><span class="logo-text"><span class="logo-name">${esc(site.name)}</span><span class="logo-tag">${esc(site.tagline)}</span></span></a>
        <p>${esc(site.description)}</p>
      </div>
      <div class="footer-col">
        <h3>Explore</h3>
        <ul>
          <li><a href="/jokes/">Jokes</a></li>
          <li><a href="/trending/">Trending</a></li>
          <li><a href="/festival/">Festivals</a></li>
          <li><a href="/whatsapp/">WhatsApp Corner</a></li>
          <li><a href="/saved/">Saved / Bookmarks</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h3>Categories</h3>
        <ul>
          <li><a href="/jokes/hindi-jokes/">Hindi Jokes</a></li>
          <li><a href="/jokes/whatsapp-jokes/">WhatsApp Jokes</a></li>
          <li><a href="/jokes/friendship-jokes/">Friendship</a></li>
          <li><a href="/jokes/love-jokes/">Love</a></li>
          <li><a href="/jokes/school-jokes/">School</a></li>
          <li><a href="/jokes/office-jokes/">Office</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h3>Legal</h3>
        <ul>
          <li><a href="/about-us/">About Us</a></li>
          <li><a href="/contact-us/">Contact Us</a></li>
          <li><a href="/privacy-policy/">Privacy Policy</a></li>
          <li><a href="/terms-and-conditions/">Terms &amp; Conditions</a></li>
          <li><a href="/disclaimer/">Disclaimer</a></li>
          <li><a href="/copyright-policy/">Copyright Policy</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© ${year} ${esc(site.name)}. All Rights Reserved.</p>
      <p class="muted">Made with 😂 for India</p>
    </div>
  </div>
</footer>`;
}

let AD_CONFIG = { enabled: false, client: '' };
/** Called once from build.js so every adSlot() render reflects data/site.json's ads block. */
export function setAdConfig(site) {
  AD_CONFIG = { enabled: !!site.ads?.enabled && !!site.ads?.client, client: site.ads?.client || '' };
}
export function adConfig() {
  return AD_CONFIG;
}

/**
 * A defined, non-intrusive ad container. When ads are disabled (the default —
 * see data/site.json → ads.enabled) it renders as a clearly labelled empty
 * placeholder so the layout never shifts once a real unit is switched on.
 * When enabled, it renders a real <ins class="adsbygoogle"> unit; set the
 * slot's real AdSense slot ID via the `slotId` param before going live.
 */
export function adSlot(id, variant = 'leader', label = 'Advertisement', slotId = '') {
  if (AD_CONFIG.enabled) {
    return `<div class="ad-slot ad-slot--${variant} ad-slot--live" id="${esc(id)}">
  <ins class="adsbygoogle"
       style="display:block"
       data-ad-client="${esc(AD_CONFIG.client)}"
       data-ad-slot="${esc(slotId || id)}"
       data-ad-format="auto"
       data-full-width-responsive="true"></ins>
</div>`;
  }
  return `<div class="ad-slot ad-slot--${variant}" id="${esc(id)}" data-ad-slot="${esc(id)}" aria-label="${esc(label)}">
  <span>${esc(label)}</span>
  <span class="ad-slot__note">Ad space — AdSense unit renders here</span>
</div>`;
}

export function toastHost() {
  return `<div class="toast-host" id="toast-host" aria-live="polite" role="status"></div>`;
}

export function installBar() {
  return `<div class="install-bar" id="install-bar">
  <p>${icon('download')} Install ${esc('JokeMasti')} app</p>
  <button class="btn btn--primary btn--sm" id="install-btn" type="button">Install</button>
  <button class="icon-btn" id="install-dismiss" type="button" aria-label="Dismiss">${icon('close')}</button>
</div>`;
}

export function offlineBanner() {
  return `<div class="offline-banner" role="status">📡 Aap offline hain — kuch content local cache se dikh raha hai.</div>`;
}

/** Wraps a page body in the full HTML document shell. */
export function page(site, currentPath, headHtml, bodyHtml, opts = {}) {
  const { bodyClass = '' } = opts;
  return `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="${esc(site.themeColor)}">
<script>(function(){try{var t=localStorage.getItem('jm_theme');if(t==='dark'||t==='light'){document.documentElement.setAttribute('data-theme',t);}}catch(e){}})();</script>
${headHtml}
<link rel="icon" href="/assets/img/favicon-32.png" sizes="32x32">
<link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">
<link rel="manifest" href="/manifest.json">
<link rel="stylesheet" href="/assets/css/style.css">
${
  AD_CONFIG.enabled
    ? `<link rel="preconnect" href="https://pagead2.googlesyndication.com" crossorigin>
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${esc(AD_CONFIG.client)}" crossorigin="anonymous"></script>`
    : ''
}
</head>
<body class="${esc(bodyClass)}">
${SPRITE}
<a href="#main" class="skip-link">Seedha content par jaayein</a>
${offlineBanner()}
${header(site, currentPath)}
<main id="main">
${bodyHtml}
</main>
${footer(site, {})}
${toastHost()}
${installBar()}
<script src="/assets/js/app.js" defer></script>
</body>
</html>`;
}
