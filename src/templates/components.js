import { esc, escJs, prettyDate } from '../lib/util.js';
import { icon } from './icons.js';

const waText = (t) => `https://wa.me/?text=${encodeURIComponent(t)}`;
const tgText = (u, t) => `https://t.me/share/url?url=${encodeURIComponent(u)}&text=${encodeURIComponent(t)}`;
const fbUrl = (u) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(u)}`;
const xUrl = (u, t) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(u)}&text=${encodeURIComponent(t)}`;

export function shareIcons(url, text, { size = 'act' } = {}) {
  const cls = size === 'act' ? 'act' : 'share-btn';
  return `<a class="${cls} ${size === 'act' ? 'act--wa' : 'sb-wa'}" href="${esc(waText(text + ' ' + url))}" target="_blank" rel="noopener noreferrer nofollow" aria-label="WhatsApp par share karein">${icon('whatsapp')}${size === 'act' ? '<span>WhatsApp</span>' : '<span>WhatsApp</span>'}</a>
<a class="${cls} ${size === 'act' ? 'act--tg' : 'sb-tg'}" href="${esc(tgText(url, text))}" target="_blank" rel="noopener noreferrer nofollow" aria-label="Telegram par share karein">${icon('telegram')}<span>Telegram</span></a>
<a class="${cls} ${size === 'act' ? 'act--fb' : 'sb-fb'}" href="${esc(fbUrl(url))}" target="_blank" rel="noopener noreferrer nofollow" aria-label="Facebook par share karein">${icon('facebook')}<span>Facebook</span></a>
<a class="${cls} ${size === 'act' ? 'act--x' : 'sb-x'}" href="${esc(xUrl(url, text))}" target="_blank" rel="noopener noreferrer nofollow" aria-label="X par share karein">${icon('x')}<span>X</span></a>`;
}

/** Joke card. `variant`: 'default' | 'feature' | 'compact' */
export function jokeCard(j, { variant = 'default', headingTag = 'h3' } = {}) {
  const feature = variant === 'feature';
  const H = headingTag;
  return `<article class="card joke-card${feature ? ' joke-card--feature' : ''}" data-joke-card data-id="${esc(j.id)}" data-text="${esc(j.text)}" data-title="${esc(j.title)}" data-url="${esc(j.url)}" data-score="${j.score || 0}" data-date="${esc(j.createdAt || '')}">
  <div class="joke-card__top">
    ${j.catMeta ? `<a href="/jokes/${esc(j.category)}/" class="badge badge--brand">${j.catMeta.emoji} ${esc(j.catMeta.name)}</a>` : ''}
    ${feature ? '<span class="badge badge--gold">⭐ Joke of the Day</span>' : ''}
  </div>
  <${H} class="joke-card__title"><a href="${esc(j.url)}">${esc(j.title)}</a></${H}>
  <p class="joke-text"${j.language === 'hi' ? ' lang="hi"' : ''}>${esc(j.text)}</p>
  ${j.tags?.length ? `<div class="chips">${j.tags.slice(0, 4).map((t) => `<a class="tag" href="/search/?q=${encodeURIComponent(t)}">#${esc(t)}</a>`).join('')}</div>` : ''}
  <div class="joke-card__foot">
    <div class="actions">
      <button class="act act--copy" type="button" data-action="copy-joke" aria-label="Joke copy karein">${icon('copy')}<span>Copy</span></button>
      <button class="act act--like" type="button" data-action="like" data-type="joke" data-id="${esc(j.id)}" aria-pressed="false" aria-label="Joke pasand karein">${icon('heart')}<span class="like-count">${j.likes || 0}</span></button>
      <button class="act act--save" type="button" data-action="bookmark" data-type="joke" data-id="${esc(j.id)}" aria-pressed="false" aria-label="Joke save karein">${icon('bookmark')}</button>
      <button class="act act--wa" type="button" data-action="share-wa" aria-label="WhatsApp par share karein">${icon('whatsapp')}<span>WhatsApp</span></button>
      <button class="act act--share" type="button" data-action="share-more" aria-label="Aur options se share karein">${icon('share')}<span>Share</span></button>
    </div>
  </div>
</article>`;
}

export function categoryCard(c, kind = 'jokes', count) {
  const href = `/jokes/${c.slug}/`;
  return `<a class="cat-card" href="${esc(href)}">
  <span class="cat-card__emoji" aria-hidden="true">${c.emoji}</span>
  <span class="cat-card__name">${esc(c.name)}</span>
  ${count != null ? `<span class="cat-card__count">${count} jokes</span>` : ''}
</a>`;
}

export function festivalCard(f) {
  return `<a class="cat-card" href="/festival/${esc(f.slug)}/">
  <span class="cat-card__emoji" aria-hidden="true">${f.emoji}</span>
  <span class="cat-card__name">${esc(f.name)}</span>
  <span class="cat-card__count">${esc(f.when)}</span>
</a>`;
}

export function chip(label, href, { active = false, emoji = '' } = {}) {
  return `<a class="chip${active ? ' is-active' : ''}" href="${esc(href)}"${active ? ' aria-current="page"' : ''}>${emoji ? emoji + ' ' : ''}${esc(label)}</a>`;
}

export function pagination(basePath, current, total) {
  if (total <= 1) return '';
  const urlFor = (n) => (n === 1 ? basePath : `${basePath}page/${n}/`);
  const items = [];
  const push = (n) =>
    items.push(
      n === current
        ? `<span aria-current="page">${n}</span>`
        : `<a href="${esc(urlFor(n))}">${n}</a>`
    );
  const gap = () => items.push('<span class="gap">…</span>');

  if (current > 1) items.push(`<a href="${esc(urlFor(current - 1))}" aria-label="Pichla page">${icon('left')}</a>`);
  push(1);
  if (current > 3) gap();
  for (let n = Math.max(2, current - 1); n <= Math.min(total - 1, current + 1); n++) push(n);
  if (current < total - 2) gap();
  if (total > 1) push(total);
  if (current < total) items.push(`<a href="${esc(urlFor(current + 1))}" aria-label="Agla page">${icon('right')}</a>`);

  return `<nav class="pagination" aria-label="Pagination">${items.join('')}</nav>`;
}

export function toolbar({ sortOptions, activeSort = 'latest', basePath = '' } = {}) {
  return `<div class="toolbar">
  <div class="toolbar__sort">
    <label for="sort-select" class="tiny muted">Sort:</label>
    <select class="select" id="sort-select" data-sort-select data-base="${esc(basePath)}">
      ${sortOptions
        .map((o) => `<option value="${esc(o.value)}"${o.value === activeSort ? ' selected' : ''}>${esc(o.label)}</option>`)
        .join('')}
    </select>
  </div>
</div>`;
}

export function rankItem(rank, item, { metric } = {}) {
  return `<div class="rank-item">
  <span class="rank-num">${rank}</span>
  <div class="rank-body">
    <a class="t" href="${esc(item.url)}">${esc(item.title)}</a>
    <p class="x">${esc(item.text)}</p>
    ${metric ? `<span class="tiny muted">${esc(metric(item))}</span>` : ''}
  </div>
</div>`;
}

export function tabs(items, active) {
  return `<div class="tabs" role="tablist">${items
    .map(
      (t) =>
        `<a class="tab" role="tab" href="${esc(t.href)}" aria-selected="${t.value === active}">${esc(t.label)}</a>`
    )
    .join('')}</div>`;
}

export function searchBox({ large = false, value = '' } = {}) {
  return `<div class="searchbox">
  <form action="/search/" method="get" role="search" id="${large ? 'hero-search' : 'nav-search'}-form">
    <div class="searchbox__field${value ? ' has-value' : ''}">
      ${icon('search')}
      <label class="sr-only" for="${large ? 'hero-search' : 'nav-search'}-input">Search Jokes</label>
      <input type="search" name="q" id="${large ? 'hero-search' : 'nav-search'}-input" placeholder="Search Jokes…" autocomplete="off" value="${esc(value)}" aria-describedby="search-suggest">
      <button type="button" class="searchbox__clear" data-action="clear-search" aria-label="Search saaf karein">${icon('close')}</button>
    </div>
  </form>
  <div class="suggest" id="search-suggest" hidden></div>
</div>`;
}

export function emptyState({ emoji = '🤷', title, text, cta }) {
  return `<div class="empty">
  <div class="empty__emoji" aria-hidden="true">${emoji}</div>
  <h2>${esc(title)}</h2>
  <p>${esc(text)}</p>
  ${cta ? `<div class="mt-6"><a class="btn btn--primary" href="${esc(cta.href)}">${esc(cta.label)}</a></div>` : ''}
</div>`;
}

export function pagerNav(prev, next, labelPrefix = '') {
  if (!prev && !next) return '';
  return `<div class="pager-nav">
  ${prev ? `<a href="${esc(prev.url)}"><span class="dir">${icon('left')} Previous ${esc(labelPrefix)}</span><span class="t">${esc(prev.title)}</span></a>` : '<span></span>'}
  ${next ? `<a href="${esc(next.url)}"><span class="dir">Next ${esc(labelPrefix)} ${icon('right')}</span><span class="t">${esc(next.title)}</span></a>` : '<span></span>'}
</div>`;
}

export { escJs, prettyDate };
