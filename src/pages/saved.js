import { head, page, adSlot, breadcrumbs, breadcrumbSchema } from '../templates/layout.js';
import { icon } from '../templates/icons.js';

export function buildSaved(ctx) {
  const { site } = ctx;
  const crumbs = [{ name: 'Home', url: '/' }, { name: 'Saved' }];
  const body = `
${breadcrumbs(crumbs)}
<section class="section section--tight">
  <div class="wrap">
    <h1>${icon('bookmark')} Saved Jokes</h1>
    <p class="lead mb-6">Aapke bookmark kiye hue jokes — sirf is browser mein save hote hain, koi account nahi chahiye.</p>

    <div id="saved-empty" hidden></div>
    <div id="saved-jokes" class="grid-jokes mt-6"></div>

    ${adSlot('ad-saved', 'leader', 'Advertisement')}

    <noscript><p class="mt-6 muted">Saved content dekhne ke liye JavaScript on kijiye.</p></noscript>
  </div>
</section>`;
  const headHtml = head(site, {
    title: 'Saved Jokes',
    description: 'Aapke bookmark kiye hue jokes — local browser storage mein, bina login ke.',
    path: '/saved/',
    noindex: true,
    ld: [breadcrumbSchema(site, crumbs)],
  });
  return page(site, '/saved/', headHtml, body);
}
