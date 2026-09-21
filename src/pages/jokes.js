import { esc, chunk, byDate, byScore, clip } from '../lib/util.js';
import { head, page, adSlot, breadcrumbs, breadcrumbSchema } from '../templates/layout.js';
import {
  jokeCard,
  chip,
  pagination,
  toolbar,
  emptyState,
  pagerNav,
  shareIcons,
} from '../templates/components.js';
import { icon } from '../templates/icons.js';

const SORTS = [
  { value: 'latest', label: 'Latest' },
  { value: 'popular', label: 'Popular' },
  { value: 'trending', label: 'Trending' },
];

function catChips(categories, activeSlug) {
  return `<div class="chips chips--scroll">
    ${chip('Sab Jokes', '/jokes/', { active: !activeSlug })}
    ${categories.map((c) => chip(c.name, `/jokes/${c.slug}/`, { active: c.slug === activeSlug, emoji: c.emoji })).join('')}
  </div>`;
}

function listingBody({ site, title, intro, crumbs, chips, items, pageNum, totalPages, basePath }) {
  const sorted = [...items].sort(byDate);
  return `
${breadcrumbs(crumbs)}
<section class="section section--tight">
  <div class="wrap">
    <h1>${esc(title)}</h1>
    ${intro ? `<p class="lead mb-4">${esc(intro)}</p>` : ''}
    ${chips}
    ${toolbar({ sortOptions: SORTS, basePath })}
    ${
      sorted.length
        ? `<div class="grid-jokes" data-sortable>${sorted.map((j) => jokeCard(j)).join('')}</div>`
        : emptyState({
            title: 'Koi joke nahi mila',
            text: 'Is category mein abhi jokes add ho rahe hain. Thodi der baad dobara dekhiye.',
            cta: { href: '/jokes/', label: 'Sab Jokes Dekhiye' },
          })
    }
    ${pagination(basePath, pageNum, totalPages)}
  </div>
</section>
${adSlot('ad-jokes-listing', 'leader', 'Advertisement')}`;
}

export function buildJokesIndex(ctx, pageNum, totalPages) {
  const { site, jokes, categories } = ctx;
  const perPage = site.perPage;
  const sorted = [...jokes].sort(byDate);
  const items = sorted.slice((pageNum - 1) * perPage, pageNum * perPage);
  const crumbs = [
    { name: 'Home', url: '/' },
    { name: 'Jokes' },
  ];
  const path = pageNum === 1 ? '/jokes/' : `/jokes/page/${pageNum}/`;
  const body = listingBody({
    site,
    title: 'Hindi & Hinglish Jokes — Latest Chutkule',
    intro: 'Sabse naye aur funny jokes ek jagah — Hindi, Hinglish aur English mein. Copy kijiye, WhatsApp par bhejiye, ya bookmark kar lijiye.',
    crumbs,
    chips: catChips(categories.jokes),
    items,
    pageNum,
    totalPages,
    basePath: '/jokes/',
  });
  const headHtml = head(site, {
    title: pageNum > 1 ? `Jokes — Page ${pageNum}` : 'Jokes — Latest Hindi & Funny Chutkule',
    description: 'Latest Hindi, Hinglish aur English jokes. Ek tap mein copy, share aur bookmark kijiye — bina login ke.',
    path,
    ld: [breadcrumbSchema(site, crumbs)],
  });
  return page(site, '/jokes/', headHtml, body);
}

export function buildJokeCategory(ctx, cat, pageNum, totalPages) {
  const { site, categories } = ctx;
  const all = ctx.jokesByCategory.get(cat.slug) || [];
  const perPage = site.perPage;
  const sorted = [...all].sort(byDate);
  const items = sorted.slice((pageNum - 1) * perPage, pageNum * perPage);
  const crumbs = [
    { name: 'Home', url: '/' },
    { name: 'Jokes', url: '/jokes/' },
    { name: cat.name },
  ];
  const basePath = `/jokes/${cat.slug}/`;
  const path = pageNum === 1 ? basePath : `${basePath}page/${pageNum}/`;
  const body = listingBody({
    site,
    title: `${cat.emoji} ${cat.name}`,
    intro: cat.intro,
    crumbs,
    chips: catChips(categories.jokes, cat.slug),
    items,
    pageNum,
    totalPages,
    basePath,
  });
  const headHtml = head(site, {
    title: pageNum > 1 ? `${cat.title} — Page ${pageNum}` : cat.title,
    description: cat.description,
    path,
    ld: [breadcrumbSchema(site, crumbs)],
  });
  return page(site, '/jokes/', headHtml, body);
}

export function buildJokeDetail(ctx, joke, { prev, next, related }) {
  const { site } = ctx;
  const crumbs = [
    { name: 'Home', url: '/' },
    { name: 'Jokes', url: '/jokes/' },
    { name: joke.catMeta?.name || 'Joke', url: `/jokes/${joke.category}/` },
    { name: joke.title },
  ];
  const shareUrl = site.url.replace(/\/$/, '') + joke.url;
  const body = `
${breadcrumbs(crumbs)}
<article class="section section--tight">
  <div class="wrap">
    <div class="two-col">
      <div>
        <a href="/jokes/${esc(joke.category)}/" class="badge badge--brand mb-4">${joke.catMeta?.emoji || ''} ${esc(joke.catMeta?.name || '')}</a>
        <h1 class="mt-6">${esc(joke.title)}</h1>
        <div class="card joke-card mt-6" data-joke-card data-id="${esc(joke.id)}" data-text="${esc(joke.text)}" data-title="${esc(joke.title)}" data-url="${esc(joke.url)}">
          <p class="joke-text" style="font-size:1.18rem"${joke.language === 'hi' ? ' lang="hi"' : ''}>${esc(joke.text)}</p>
          <div class="joke-card__foot">
            <div class="actions">
              <button class="act act--copy" type="button" data-action="copy-joke" aria-label="Joke copy karein">${icon('copy')}<span>Copy Joke</span></button>
              <button class="act act--like" type="button" data-action="like" data-type="joke" data-id="${esc(joke.id)}" aria-pressed="false">${icon('heart')}<span class="like-count">${joke.likes || 0}</span></button>
              <button class="act act--save" type="button" data-action="bookmark" data-type="joke" data-id="${esc(joke.id)}" aria-pressed="false">${icon('bookmark')}<span>Save</span></button>
            </div>
          </div>
        </div>

        <div class="panel mt-8">
          <h3>Share Kijiye</h3>
          <div class="share-grid">
            ${shareIcons(shareUrl, joke.text, { size: 'share' })}
            <button class="share-btn sb-native" type="button" data-action="share-native" data-url="${esc(shareUrl)}" data-text="${esc(joke.text)}">${icon('share')}<span>Share</span></button>
            <button class="share-btn sb-copy" type="button" data-action="copy-link" data-url="${esc(shareUrl)}">${icon('link')}<span>Copy Link</span></button>
          </div>
        </div>

        ${joke.tags?.length ? `<div class="chips mt-6">${joke.tags.map((t) => `<a class="tag" href="/search/?q=${encodeURIComponent(t)}">#${esc(t)}</a>`).join('')}</div>` : ''}

        ${adSlot('ad-joke-detail', 'rect', 'Advertisement')}

        ${
          related.length
            ? `<div class="mt-8">
          <h2>Related Jokes</h2>
          <div class="grid-jokes mt-6">${related.map((j) => jokeCard(j)).join('')}</div>
        </div>`
            : ''
        }

        ${pagerNav(prev, next, 'Joke')}
      </div>

      <aside class="sidebar">
        <div class="panel">
          <h3>😂 Categories</h3>
          <ul>
            ${ctx.categories.jokes
              .slice(0, 8)
              .map((c) => `<li><a href="/jokes/${c.slug}/">${c.emoji} ${esc(c.name)}</a></li>`)
              .join('')}
          </ul>
        </div>
        ${adSlot('ad-joke-sidebar', 'rect', 'Advertisement')}
      </aside>
    </div>
  </div>
</article>`;

  const headHtml = head(site, {
    title: joke.title,
    description: clip(joke.text, 155),
    path: joke.url,
    type: 'article',
    ld: [
      breadcrumbSchema(site, crumbs),
      {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: joke.title,
        text: joke.text,
        dateCreated: joke.createdAt,
        inLanguage: joke.language === 'hi' ? 'hi' : joke.language === 'en' ? 'en' : 'hi',
        url: shareUrl,
        genre: joke.catMeta?.name,
        keywords: joke.tags?.join(', '),
        isPartOf: { '@type': 'WebSite', name: site.name, url: site.url },
      },
    ],
  });
  return page(site, '/jokes/', headHtml, body);
}

export function paginate(perPage, total) {
  return Math.max(1, Math.ceil(total / perPage));
}
