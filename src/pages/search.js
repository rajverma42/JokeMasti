import { head, page, adSlot, breadcrumbs, breadcrumbSchema } from '../templates/layout.js';
import { searchBox } from '../templates/components.js';

export function buildSearch(ctx) {
  const { site } = ctx;
  const crumbs = [{ name: 'Home', url: '/' }, { name: 'Search' }];
  const body = `
${breadcrumbs(crumbs)}
<section class="section section--tight">
  <div class="wrap">
    <h1>Search Jokes</h1>
    <p class="lead mb-6">Jokes, categories aur tags mein search kijiye — sab kuch aapke browser mein, turant.</p>
    <div style="max-width:620px">${searchBox({ large: true })}</div>

    <div id="recent-searches" class="mt-6" hidden>
      <h3 class="small muted mb-2">Recent Searches</h3>
      <div class="chips" id="recent-searches-list"></div>
    </div>

    ${adSlot('ad-search-top', 'leader', 'Advertisement')}

    <div id="search-status" class="mt-6" aria-live="polite"></div>
    <div id="search-results" class="mt-6"></div>

    <noscript><p class="mt-6 muted">Search ke liye JavaScript on kijiye, ya <a href="/jokes/">sab jokes</a> browse kijiye.</p></noscript>
  </div>
</section>`;
  const headHtml = head(site, {
    title: 'Search Jokes & Categories',
    description: 'JokeMasti par jokes, categories aur tags search kijiye — fast, client-side, no login required.',
    path: '/search/',
    noindex: true,
    ld: [breadcrumbSchema(site, crumbs)],
  });
  return page(site, '/search/', headHtml, body);
}
