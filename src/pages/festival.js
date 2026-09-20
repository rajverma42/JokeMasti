import { esc } from '../lib/util.js';
import { head, page, adSlot, breadcrumbs, breadcrumbSchema } from '../templates/layout.js';
import { festivalCard, jokeCard, emptyState } from '../templates/components.js';
import { icon } from '../templates/icons.js';

export function buildFestivalHub(ctx) {
  const { site, festivals } = ctx;
  const crumbs = [{ name: 'Home', url: '/' }, { name: 'Festivals' }];
  const body = `
${breadcrumbs(crumbs)}
<section class="section section--tight">
  <div class="wrap">
    <h1>🎉 Festival Jokes &amp; Wishes</h1>
    <p class="lead mb-6">Har Indian tyohaar ke liye jokes aur ready-to-send wishes — ek jagah. Apna festival chuniye.</p>
    ${adSlot('ad-festival-hub-top', 'leader', 'Advertisement')}
    <div class="cat-grid mt-6">${festivals.map(festivalCard).join('')}</div>
    ${adSlot('ad-festival-hub-low', 'leader', 'Advertisement')}
  </div>
</section>`;
  const headHtml = head(site, {
    title: 'Festival Jokes & Wishes',
    description: 'Diwali, Holi, Rakhi, Eid, New Year aur baaki sabhi tyoharon ke liye jokes aur wishes. Free download aur share.',
    path: '/festival/',
    ld: [breadcrumbSchema(site, crumbs)],
  });
  return page(site, '/festival/', headHtml, body);
}

export function buildFestivalDetail(ctx, fest) {
  const { site } = ctx;
  const jokes = (ctx.jokesByFestival.get(fest.slug) || []).slice(0, 8);
  const crumbs = [
    { name: 'Home', url: '/' },
    { name: 'Festivals', url: '/festival/' },
    { name: fest.name },
  ];

  const body = `
${breadcrumbs(crumbs)}
<section class="section section--tight">
  <div class="wrap">
    <span class="badge badge--violet">${fest.emoji} ${esc(fest.when)}</span>
    <h1 class="mt-6">${fest.emoji} ${esc(fest.name)} Jokes &amp; Wishes</h1>
    <p class="lead mb-6">${esc(fest.intro)}</p>

    ${adSlot('ad-festival-top', 'leader', 'Advertisement')}

    <h2 class="mt-8">Funny Wishes — Copy &amp; Bhejiye</h2>
    <div class="grid-jokes mt-6">
      ${fest.wishes
        .map(
          (w, i) => `<article class="card joke-card" data-joke-card data-id="wish-${esc(fest.slug)}-${i}" data-text="${esc(w)}" data-title="${esc(fest.name)} Wish" data-url="/festival/${esc(fest.slug)}/">
        <p class="joke-text">${esc(w)}</p>
        <div class="joke-card__foot">
          <div class="actions">
            <button class="act act--copy" type="button" data-action="copy-joke" aria-label="Wish copy karein">${icon('copy')}<span>Copy</span></button>
            <button class="act act--wa" type="button" data-action="share-wa" aria-label="WhatsApp par bhejein">${icon('whatsapp')}<span>WhatsApp</span></button>
          </div>
        </div>
      </article>`
        )
        .join('')}
    </div>

    <div class="section-head mt-8">
      <div><h2>${fest.emoji} ${esc(fest.name)} Jokes</h2></div>
      <a class="link-more" href="/jokes/festival-jokes/">Aur Festival Jokes →</a>
    </div>
    ${
      jokes.length
        ? `<div class="grid-jokes">${jokes.map((j) => jokeCard(j)).join('')}</div>`
        : emptyState({ title: 'Jaldi aa raha hai', text: `${fest.name} ke jokes jald add honge.` })
    }

    ${adSlot('ad-festival-mid', 'leader', 'Advertisement')}

    ${adSlot('ad-festival-low', 'leader', 'Advertisement')}
  </div>
</section>`;

  const headHtml = head(site, {
    title: fest.title,
    description: fest.description,
    path: `/festival/${fest.slug}/`,
    ld: [breadcrumbSchema(site, crumbs)],
  });
  return page(site, '/festival/', headHtml, body);
}
