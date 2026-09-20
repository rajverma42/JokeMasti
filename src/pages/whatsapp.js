import { esc } from '../lib/util.js';
import { head, page, adSlot, breadcrumbs, breadcrumbSchema } from '../templates/layout.js';
import { icon } from '../templates/icons.js';

const KINDS = [
  { key: 'whatsapp-status', label: 'WhatsApp Status', emoji: '💬' },
  { key: 'funny-status', label: 'Funny Status', emoji: '😜' },
  { key: 'good-morning', label: 'Good Morning Funny', emoji: '🌅' },
  { key: 'good-night', label: 'Good Night Funny', emoji: '🌙' },
  { key: 'friendship-status', label: 'Friendship Status', emoji: '🎗️' },
  { key: 'funny-shayari', label: 'Funny Shayari', emoji: '✍️' },
];

function statusCard(s) {
  return `<article class="card joke-card" data-joke-card data-id="${esc(s.id)}" data-text="${esc(s.text)}" data-title="${esc(s.title)}" data-url="/whatsapp/#${esc(s.id)}">
  <p class="joke-text">${esc(s.text)}</p>
  <div class="joke-card__foot">
    <div class="actions">
      <button class="act act--copy" type="button" data-action="copy-joke" aria-label="Copy karein">${icon('copy')}<span>Copy</span></button>
      <button class="act act--wa" type="button" data-action="share-wa" aria-label="WhatsApp par bhejein">${icon('whatsapp')}<span>Share on WhatsApp</span></button>
    </div>
  </div>
</article>`;
}

export function buildWhatsapp(ctx) {
  const { site, status } = ctx;
  const byKind = new Map(KINDS.map((k) => [k.key, status.filter((s) => s.kind === k.key)]));
  const crumbs = [{ name: 'Home', url: '/' }, { name: 'WhatsApp Corner' }];

  const body = `
${breadcrumbs(crumbs)}
<section class="section section--tight">
  <div class="wrap">
    <h1>💬 WhatsApp Corner</h1>
    <p class="lead mb-4">WhatsApp Status, Funny Shayari, Good Morning/Night messages aur Friendship Status — sab kuch copy aur direct-share ready.</p>
    <div class="chips chips--scroll mb-6">
      ${KINDS.map((k) => `<a class="chip" href="#${k.key}">${k.emoji} ${esc(k.label)}</a>`).join('')}
      <a class="chip" href="/jokes/whatsapp-jokes/">💬 WhatsApp Jokes</a>
    </div>

    ${adSlot('ad-whatsapp-top', 'leader', 'Advertisement')}

    ${KINDS.map(
      (k) => `
    <div id="${k.key}" class="mt-8">
      <div class="section-head"><div><h2>${k.emoji} ${esc(k.label)}</h2></div></div>
      <div class="grid-jokes">${(byKind.get(k.key) || []).map(statusCard).join('')}</div>
    </div>`
    ).join('')}

    ${adSlot('ad-whatsapp-low', 'leader', 'Advertisement')}
  </div>
</section>`;

  const headHtml = head(site, {
    title: 'WhatsApp Status, Shayari & Funny Messages',
    description: 'WhatsApp Status, Funny Shayari, Good Morning/Night messages aur Friendship Status — copy kijiye aur seedha WhatsApp par share kijiye.',
    path: '/whatsapp/',
    ld: [breadcrumbSchema(site, crumbs)],
  });
  return page(site, '/whatsapp/', headHtml, body);
}
