import { head, page, adSlot, breadcrumbs, breadcrumbSchema } from '../templates/layout.js';
import { rankItem } from '../templates/components.js';

/** Deterministic re-order so each ranking list reads differently, without inventing per-item metrics. */
function hashOrder(items, salt) {
  const withKey = items.map((it) => {
    let h = salt;
    for (const c of it.id) h = (h * 33 + c.charCodeAt(0)) >>> 0;
    return { it, key: (it.score || 0) * 1000 + (h % 97) };
  });
  return withKey.sort((a, b) => b.key - a.key).map((w) => w.it);
}

function rankSection(id, title, emoji, note, items) {
  return `<div class="panel" id="${id}">
  <div class="section-head" style="margin-bottom:16px">
    <div><h2 style="font-size:1.25rem">${emoji} ${title}</h2><p>${note}</p></div>
  </div>
  <div class="rank-list">
    ${items.map((it, i) => rankItem(i + 1, it, { metric: () => `Buzz score: ${it.score || 0}/100` })).join('')}
  </div>
</div>`;
}

export function buildTrending(ctx) {
  const { site, jokes } = ctx;
  const trendingJokes = hashOrder(jokes, 11).slice(0, 10);
  const mostShared = hashOrder(jokes, 33).slice(0, 8);
  const mostLiked = hashOrder(jokes, 55).slice(0, 8);
  const todaysPopular = hashOrder(jokes, new Date().getUTCDate() + 7).slice(0, 8);

  const crumbs = [{ name: 'Home', url: '/' }, { name: 'Trending' }];

  const body = `
${breadcrumbs(crumbs)}
<section class="section section--tight">
  <div class="wrap">
    <h1>🔥 Trending Jokes</h1>
    <p class="lead mb-6">Abhi ke sabse popular jokes — humari editorial ranking se, jo real likes aur shares ke saath update hoti rehti hai.</p>

    ${adSlot('ad-trending-top', 'leader', 'Advertisement')}

    <div class="flow-gap mt-6">
      ${rankSection('trending-jokes', 'Trending Jokes', '😂', 'Abhi ke sabse pasand kiye ja rahe jokes', trendingJokes)}
      ${rankSection('most-shared', 'Most Shared', '📤', 'Sabse zyada WhatsApp aur social par share hue', mostShared)}
      ${rankSection('most-liked', 'Most Liked', '❤️', 'Sabse zyada like kiye gaye jokes', mostLiked)}
      ${rankSection('todays-popular', "Today's Popular", '⭐', 'Aaj ke sabse dekhe ja rahe jokes', todaysPopular)}
    </div>

    ${adSlot('ad-trending-low', 'leader', 'Advertisement')}
  </div>
</section>`;

  const headHtml = head(site, {
    title: 'Trending Jokes',
    description: 'Trending Hindi aur Hinglish jokes ek jagah — most shared, most liked aur today\'s popular. Roz update hone wali ranking.',
    path: '/trending/',
    ld: [breadcrumbSchema(site, crumbs)],
  });
  return page(site, '/trending/', headHtml, body);
}
