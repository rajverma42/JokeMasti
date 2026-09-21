import { esc, byDate, clip } from '../lib/util.js';
import { head, page, adSlot, breadcrumbs, breadcrumbSchema } from '../templates/layout.js';
import { memeCard, chip, pagination, toolbar, emptyState, pagerNav, shareIcons } from '../templates/components.js';
import { icon } from '../templates/icons.js';

const SORTS = [
  { value: 'latest', label: 'Latest' },
  { value: 'popular', label: 'Popular' },
  { value: 'trending', label: 'Trending' },
];

function catChips(categories, activeSlug) {
  return `<div class="chips chips--scroll">
    ${chip('Sab Memes', '/memes/', { active: !activeSlug })}
    ${categories.map((c) => chip(c.name, `/memes/${c.slug}/`, { active: c.slug === activeSlug, emoji: c.emoji })).join('')}
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
        ? `<div class="meme-grid" data-sortable>${sorted.map((m) => memeCard(m)).join('')}</div>`
        : emptyState({
            title: 'Koi meme nahi mila',
            text: 'Is category mein abhi memes add ho rahe hain. Thodi der baad dobara dekhiye.',
            cta: { href: '/memes/', label: 'Sab Memes Dekhiye' },
          })
    }
    ${pagination(basePath, pageNum, totalPages)}
  </div>
</section>
${adSlot('ad-memes-listing', 'leader', 'Advertisement')}`;
}

export function buildMemesIndex(ctx, pageNum, totalPages) {
  const { site, memes, categories } = ctx;
  const perPage = site.memesPerPage;
  const sorted = [...memes].sort(byDate);
  const items = sorted.slice((pageNum - 1) * perPage, pageNum * perPage);
  const crumbs = [{ name: 'Home', url: '/' }, { name: 'Memes' }];
  const path = pageNum === 1 ? '/memes/' : `/memes/page/${pageNum}/`;
  const body = listingBody({
    site,
    title: '😂 Funny Memes — Desi & Trending',
    intro: 'Original desi memes, trending memes aur funny images — free download, WhatsApp-ready, koi login nahi.',
    crumbs,
    chips: catChips(categories.memes),
    items,
    pageNum,
    totalPages,
    basePath: '/memes/',
  });
  const headHtml = head(site, {
    title: pageNum > 1 ? `Memes — Page ${pageNum}` : 'Memes — Desi & Trending Funny Memes',
    description: 'Original desi memes, trending memes aur festival memes. Free download, WhatsApp share, no login.',
    path,
    ld: [breadcrumbSchema(site, crumbs)],
  });
  return page(site, '/memes/', headHtml, body);
}

export function buildMemeCategory(ctx, cat, pageNum, totalPages) {
  const { site, categories } = ctx;
  const all = ctx.memesByCategory.get(cat.slug) || [];
  const perPage = site.memesPerPage;
  const sorted = [...all].sort(byDate);
  const items = sorted.slice((pageNum - 1) * perPage, pageNum * perPage);
  const crumbs = [
    { name: 'Home', url: '/' },
    { name: 'Memes', url: '/memes/' },
    { name: cat.name },
  ];
  const basePath = `/memes/${cat.slug}/`;
  const path = pageNum === 1 ? basePath : `${basePath}page/${pageNum}/`;
  const body = listingBody({
    site,
    title: `${cat.emoji} ${cat.name}`,
    intro: cat.intro,
    crumbs,
    chips: catChips(categories.memes, cat.slug),
    items,
    pageNum,
    totalPages,
    basePath,
  });
  const headHtml = head(site, {
    title: pageNum > 1 ? `${cat.title} — Page ${pageNum}` : cat.title,
    description: cat.description,
    path,
    image: sorted[0]?.image,
    ld: [breadcrumbSchema(site, crumbs)],
  });
  return page(site, '/memes/', headHtml, body);
}

export function buildMemeDetail(ctx, meme, { prev, next, related }) {
  const { site } = ctx;
  const crumbs = [
    { name: 'Home', url: '/' },
    { name: 'Memes', url: '/memes/' },
    { name: meme.catMeta?.name || 'Meme', url: `/memes/${meme.category}/` },
    { name: meme.title },
  ];
  const shareUrl = site.url.replace(/\/$/, '') + meme.url;
  const body = `
${breadcrumbs(crumbs)}
<article class="section section--tight">
  <div class="wrap">
    <div class="detail">
      <div>
        <div class="detail__media">
          <img src="${esc(meme.image)}" width="1000" height="1250" alt="${esc(meme.title)}" loading="eager" fetchpriority="high">
        </div>
      </div>
      <div class="detail__meta">
        <a href="/memes/${esc(meme.category)}/" class="badge badge--brand">${meme.catMeta?.emoji || ''} ${esc(meme.catMeta?.name || '')}</a>
        <h1>${esc(meme.title)}</h1>
        <p class="lead">${esc(meme.description)}</p>

        <div class="stat-row">
          <div class="stat"><span class="stat__n like-count" data-live-likes="${esc(meme.id)}">${meme.likes || 0}</span><span class="stat__l">Likes</span></div>
          <div class="stat"><span class="stat__n">${meme.shares || 0}</span><span class="stat__l">Shares</span></div>
          <div class="stat"><span class="stat__n">${meme.downloads || 0}</span><span class="stat__l">Downloads</span></div>
          <div class="stat"><span class="stat__n">${meme.views || 0}</span><span class="stat__l">Views</span></div>
        </div>

        <div class="actions">
          <a class="btn btn--primary" href="${esc(meme.image)}" download="${esc(meme.slug)}.webp" data-action="download" data-id="${esc(meme.id)}">${icon('download')} Download</a>
          <button class="btn btn--ghost" type="button" data-action="copy-image" data-image="${esc(meme.image)}" data-id="${esc(meme.id)}">${icon('copy')} Copy Image</button>
          <button class="act act--like" type="button" data-action="like" data-type="meme" data-id="${esc(meme.id)}" aria-pressed="false">${icon('heart')}<span>Like</span></button>
          <button class="act act--save" type="button" data-action="bookmark" data-type="meme" data-id="${esc(meme.id)}" aria-pressed="false">${icon('bookmark')}<span>Save</span></button>
        </div>

        <div class="panel">
          <h3>Share Kijiye</h3>
          <div class="share-grid">
            ${shareIcons(shareUrl, meme.title, { size: 'share' })}
            <button class="share-btn sb-native" type="button" data-action="share-native" data-url="${esc(shareUrl)}" data-text="${esc(meme.title)}">${icon('share')}<span>Share</span></button>
            <button class="share-btn sb-copy" type="button" data-action="copy-link" data-url="${esc(shareUrl)}">${icon('link')}<span>Copy Link</span></button>
          </div>
        </div>

        ${meme.tags?.length ? `<div class="chips">${meme.tags.map((t) => `<a class="tag" href="/search/?q=${encodeURIComponent(t)}">#${esc(t)}</a>`).join('')}</div>` : ''}
      </div>
    </div>

    ${adSlot('ad-meme-detail', 'rect', 'Advertisement')}

    ${
      related.length
        ? `<div class="mt-8">
      <h2>Related Memes</h2>
      <div class="meme-grid mt-6">${related.map((m) => memeCard(m)).join('')}</div>
    </div>`
        : ''
    }

    ${pagerNav(prev, next, 'Meme')}
  </div>
</article>`;

  const headHtml = head(site, {
    title: `${meme.title} — Meme`,
    description: clip(meme.description, 155),
    path: meme.url,
    image: meme.image,
    type: 'article',
    ld: [
      breadcrumbSchema(site, crumbs),
      {
        '@context': 'https://schema.org',
        '@type': 'ImageObject',
        name: meme.title,
        description: meme.description,
        contentUrl: site.url.replace(/\/$/, '') + meme.image,
        thumbnailUrl: site.url.replace(/\/$/, '') + meme.thumb,
        uploadDate: meme.createdAt,
        url: shareUrl,
        width: 1000,
        height: 1250,
        keywords: meme.tags?.join(', '),
        creditText: site.name,
        creator: { '@type': 'Organization', name: site.name },
      },
    ],
  });
  return page(site, '/memes/', headHtml, body);
}
