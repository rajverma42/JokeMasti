import { head, page } from '../templates/layout.js';
import { icon } from '../templates/icons.js';

export function build404(ctx) {
  const { site } = ctx;
  const body = `
<section class="section">
  <div class="wrap">
    <div class="empty" style="max-width:560px;margin-inline:auto">
      <div class="empty__emoji" aria-hidden="true">😂</div>
      <h1 style="font-size:1.5rem">Oops! Ye page toh gayab ho gaya 😂</h1>
      <p>Jo page aap dhoond rahe hain wo maujood nahi hai — shayad move ho gaya ya kabhi tha hi nahi. Chaliye, aapko kahin aur le chalte hain.</p>
      <div class="actions center mt-6" style="justify-content:center">
        <a class="btn btn--primary" href="/">${icon('home')} Go Home</a>
        <a class="btn btn--ghost" href="/jokes/">${icon('smile')} Browse Jokes</a>
        <a class="btn btn--ghost" href="/festival/">${icon('image')} Browse Festivals</a>
      </div>
    </div>
  </div>
</section>`;
  const headHtml = head(site, {
    title: '404 — Page Nahi Mila',
    description: 'Ye page maujood nahi hai. JokeMasti par jokes aur festival wishes browse kijiye.',
    path: '/404.html',
    noindex: true,
  });
  return page(site, '/404.html', headHtml, body);
}

export function buildOffline(ctx) {
  const { site } = ctx;
  const body = `
<section class="section">
  <div class="wrap">
    <div class="empty" style="max-width:560px;margin-inline:auto">
      <div class="empty__emoji" aria-hidden="true">📡</div>
      <h1 style="font-size:1.5rem">Aap Offline Hain</h1>
      <p>Internet connection check kijiye aur dobara try kijiye. Pehle se dekhe hue kuch pages abhi bhi kaam kar sakte hain.</p>
      <div class="actions center mt-6" style="justify-content:center">
        <button class="btn btn--primary" type="button" onclick="location.reload()">${icon('arrow')} Dobara Try Kijiye</button>
        <a class="btn btn--ghost" href="/">${icon('home')} Go Home</a>
      </div>
    </div>
  </div>
</section>`;
  const headHtml = head(site, {
    title: 'Aap Offline Hain',
    description: 'Internet connection check kijiye.',
    path: '/offline.html',
    noindex: true,
  });
  return page(site, '/offline.html', headHtml, body);
}
