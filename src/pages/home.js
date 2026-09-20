import { esc } from '../lib/util.js';
import { head, page, adSlot, websiteSchema, orgSchema } from '../templates/layout.js';
import { jokeCard, categoryCard, searchBox, festivalCard } from '../templates/components.js';
import { icon } from '../templates/icons.js';

const TRENDING_KEYWORDS = ['Teacher', 'Mummy', 'Office', 'Diwali', 'WhatsApp', 'Monday', 'Chai', 'Dosti'];

export function buildHome(ctx) {
  const { site, categories, jokes, jotd } = ctx;

  const jokeCats = categories.jokes.filter((c) => c.home);
  const latestJokes = [...jokes].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 6);
  const trendingJokes = [...jokes]
    .filter((j) => j.id !== jotd?.id)
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, 6);
  const featFestivals = ctx.festivals.slice(0, 6);

  const body = `
<section class="hero">
  <div class="wrap hero__inner">
    <span class="hero__kicker">😂 ${esc(site.tagline)}</span>
    <h1>Aaj Kuch <em>Funny</em> Ho Jaye!</h1>
    <p class="hero__sub">Best Hindi, Hinglish aur English Jokes — Har Din Naya Entertainment. Bina login, bina jhanjhat — bas copy, share aur WhatsApp par bhejiye.</p>
    <div class="hero__search">${searchBox({ large: true })}</div>
    <div class="chips hero__suggest">
      <span class="tiny">Trending:</span>
      ${TRENDING_KEYWORDS.map((k) => `<a class="chip" href="/search/?q=${encodeURIComponent(k)}">${esc(k)}</a>`).join('')}
    </div>
  </div>
</section>

<section class="section section--tight">
  <div class="wrap">
    <div class="section-head">
      <div><h2>Categories Ghumiye</h2><p>Apni pasand ka mood chuniye</p></div>
    </div>
    <div class="cat-grid">
      ${jokeCats.map((c) => categoryCard(c, 'jokes', ctx.jokesByCategory.get(c.slug)?.length)).join('')}
      <a class="cat-card" href="/whatsapp/"><span class="cat-card__emoji">💬</span><span class="cat-card__name">WhatsApp Corner</span><span class="cat-card__count">Status &amp; Shayari</span></a>
    </div>
  </div>
</section>

${adSlot('ad-home-top', 'leader', 'Advertisement')}

<section class="section section--alt section--tight">
  <div class="wrap">
    <div class="section-head">
      <div><h2>😂 Joke of the Day</h2><p>Aaj ka special chutkula</p></div>
      <a class="link-more" href="/jokes/">Aur Jokes →</a>
    </div>
    ${jotd ? jokeCard(jotd, { variant: 'feature', headingTag: 'h3' }) : ''}
  </div>
</section>

<section class="section section--tight">
  <div class="wrap">
    <div class="section-head">
      <div><h2>Latest Jokes</h2><p>Sabse naye chutkule, seedha aapke liye</p></div>
      <a class="link-more" href="/jokes/">Sab Dekhiye →</a>
    </div>
    <div class="grid-jokes">${latestJokes.map((j) => jokeCard(j)).join('')}</div>
  </div>
</section>

${adSlot('ad-home-mid', 'leader', 'Advertisement')}

<section class="section section--alt section--tight">
  <div class="wrap">
    <div class="section-head">
      <div><h2>🔥 Trending Jokes</h2><p>Abhi ke sabse pasand kiye ja rahe jokes</p></div>
      <a class="link-more" href="/trending/">Sab Dekhiye →</a>
    </div>
    <div class="grid-jokes">${trendingJokes.map((j) => jokeCard(j)).join('')}</div>
  </div>
</section>

<section class="section section--tight">
  <div class="wrap">
    <div class="section-head">
      <div><h2>🎉 Festival Corner</h2><p>Har tyohaar ke liye jokes aur wishes</p></div>
      <a class="link-more" href="/festival/">Sab Festivals →</a>
    </div>
    <div class="cat-grid">${featFestivals.map(festivalCard).join('')}</div>
  </div>
</section>

${adSlot('ad-home-low', 'leader', 'Advertisement')}

<section class="section section--alt section--tight">
  <div class="wrap">
    <div class="panel center" style="max-width:680px;margin-inline:auto">
      <h2 style="margin-bottom:8px">Bookmark Kariye, Kabhi Bhi Dekhiye</h2>
      <p class="muted mb-4">Apni favourite jokes save kijiye — koi login nahi chahiye, sab kuch aapke browser mein rehta hai.</p>
      <a class="btn btn--primary" href="/saved/">${icon('bookmark')} Saved Jokes Dekhiye</a>
    </div>
  </div>
</section>`;

  const headHtml = head(site, {
    path: '/',
    ld: [orgSchema(site), websiteSchema(site)],
  });

  return page(site, '/', headHtml, body);
}
