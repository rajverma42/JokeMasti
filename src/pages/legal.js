import { esc, prettyDate } from '../lib/util.js';
import { head, page, breadcrumbs, breadcrumbSchema } from '../templates/layout.js';
import { icon } from '../templates/icons.js';

function legalPage(ctx, { path, title, description, crumbLabel, bodyHtml, updated }) {
  const { site } = ctx;
  const crumbs = [{ name: 'Home', url: '/' }, { name: crumbLabel }];
  const body = `
${breadcrumbs(crumbs)}
<section class="section section--tight">
  <div class="wrap">
    <div class="prose">
      <h1>${esc(title)}</h1>
      ${updated ? `<p class="muted small">Last updated: ${esc(prettyDate(updated))}</p>` : ''}
      ${bodyHtml}
    </div>
  </div>
</section>`;
  const headHtml = head(site, {
    title,
    description,
    path,
    ld: [breadcrumbSchema(site, crumbs)],
  });
  return page(site, path, headHtml, body);
}

export function buildAbout(ctx) {
  const { site } = ctx;
  return legalPage(ctx, {
    path: '/about-us/',
    title: 'About Us',
    description: `${site.name} ke baare mein jaaniye — humara maqsad, content policy aur team.`,
    crumbLabel: 'About Us',
    updated: '2026-09-01',
    bodyHtml: `
<p>${esc(site.name)} ek Indian entertainment platform hai jahan aapko roz naye Hindi jokes, Hinglish chutkule aur English jokes milte hain — bina kisi login ya sign-up ke.</p>
<p>Humara maqsad simple hai: aapke din mein thodi hasi jodna. Chaahe aap college jaa rahe ho, office mein break le rahe ho, ya family group mein kuch mazedaar bhejna chahte ho — ${esc(site.name)} par aapko sab kuch ek jagah milega.</p>
<h2>Hum Kya Offer Karte Hain</h2>
<ul>
<li>Hindi, Hinglish aur English mein original jokes</li>
<li>Har festival ke liye jokes aur ready-to-send wishes</li>
<li>WhatsApp-ready status, shayari aur funny messages</li>
<li>Ek-tap copy, share aur download — koi jhanjhat nahi</li>
</ul>
<h2>Content Policy</h2>
<p>Hum ye poori koshish karte hain ki hamara content clean, family-friendly aur respectful rahe. Hum kisi bhi tarah ke hateful, illegal ya copyrighted material ko publish nahi karte. Agar aapko koi content inappropriate lage, toh humein <a href="/contact-us/">Contact Us</a> page se batayein.</p>
<h2>Hamara Vaada</h2>
<p>Koi mandatory login nahi, koi fake reviews nahi, koi misleading claims nahi — bas asli, original entertainment content.</p>`,
  });
}

export function buildContact(ctx) {
  const { site } = ctx;
  return legalPage(ctx, {
    path: '/contact-us/',
    title: 'Contact Us',
    description: `${site.name} team se contact kijiye — feedback, content suggestions ya kisi bhi sawaal ke liye.`,
    crumbLabel: 'Contact Us',
    updated: '2026-09-01',
    bodyHtml: `
<p>Aapka feedback humare liye zaroori hai. Chahe aapke paas koi joke idea ho, kisi content ke baare mein shikayat ho, ya bas hume "hi" bolna ho — neeche diye form se ya email par sidha likhiye.</p>

<div class="panel mt-6" style="max-width:560px">
  <h3>Message Bhejiye</h3>
  <form action="mailto:${esc(site.contactEmail)}" method="GET" enctype="text/plain">
    <div class="field">
      <label for="c-name">Naam</label>
      <input class="input" type="text" id="c-name" name="name" required autocomplete="name">
    </div>
    <div class="field">
      <label for="c-email">Email (reply ke liye)</label>
      <input class="input" type="email" id="c-email" name="email" required autocomplete="email">
    </div>
    <div class="field">
      <label for="c-subject">Subject</label>
      <input class="input" type="text" id="c-subject" name="subject" value="JokeMasti — New Message">
    </div>
    <div class="field">
      <label for="c-msg">Message</label>
      <textarea class="textarea" id="c-msg" name="body" required></textarea>
    </div>
    <button class="btn btn--primary btn--block" type="submit">${icon('mail')} Bhejiye</button>
    <p class="form-note mt-4">Ye button aapka default email app kholega, message pehle se bhara hua hoga.</p>
  </form>
</div>

<h2 class="mt-8">Seedha Email Kijiye</h2>
<p>Aap seedha likh sakte hain: <a href="mailto:${esc(site.contactEmail)}">${esc(site.contactEmail)}</a></p>
<p class="muted small">Hum poori koshish karte hain ki 2-3 working days mein reply mil jaaye.</p>`,
  });
}

export function buildPrivacy(ctx) {
  const { site } = ctx;
  return legalPage(ctx, {
    path: '/privacy-policy/',
    title: 'Privacy Policy',
    description: `${site.name} ki privacy policy — hum aapka data kaise handle karte hain, cookies, analytics aur advertising.`,
    crumbLabel: 'Privacy Policy',
    updated: '2026-09-01',
    bodyHtml: `
<p>Ye Privacy Policy batati hai ki ${esc(site.name)} (“hum”, “humara”) aapki jaankari ko kaise handle karta hai jab aap humari website use karte hain.</p>

<h2>1. Hum Kya Collect Nahi Karte</h2>
<p>${esc(site.name)} ka use karne ke liye koi sign-up ya login zaroori nahi hai. Hum aapka naam, phone number, ya kisi bhi tarah ki personal identity zabardasti collect nahi karte.</p>

<h2>2. Local Browser Storage</h2>
<p>Kuch features — jaise bookmarks, dark/light mode preference, aur recent searches — aapke browser ke <strong>localStorage</strong> mein save hote hain. Ye data sirf aapke device par rehta hai, humare servers par nahi bheja jaata, aur hum ise access nahi kar sakte.</p>

<h2>3. Cookies aur Analytics</h2>
<p>Hum website performance samajhne ke liye anonymous analytics tools use kar sakte hain (jaise page views ya popular content). Ye tools cookies ya similar technologies use kar sakte hain. Aap apne browser settings se cookies block ya delete kar sakte hain.</p>

<h2>4. Advertising</h2>
<p>Hamari website par third-party advertising (jaise Google AdSense) dikhayi de sakti hai. Ye advertising partners cookies ya device identifiers use karke aapko relevant ads dikha sakte hain, based on aapki pehle ki browsing activity. Aap Google Ads Settings se personalized advertising opt-out kar sakte hain.</p>

<h2>5. Third-Party Links</h2>
<p>Jab aap WhatsApp, Telegram, Facebook ya X par content share karte hain, toh wo platforms apni alag privacy policies follow karte hain. Hum unke data practices ke liye responsible nahi hain.</p>

<h2>6. Children's Privacy</h2>
<p>Humari website general audience ke liye hai aur hum knowingly bachchon se personal information collect nahi karte.</p>

<h2>7. Changes to This Policy</h2>
<p>Hum is policy ko time-to-time update kar sakte hain. Koi bhi badlaav is page par post kiya jaayega.</p>

<h2>8. Contact Us</h2>
<p>Privacy se related kisi bhi sawaal ke liye, humein <a href="/contact-us/">yahan</a> se contact kijiye ya email karein: ${esc(site.contactEmail)}</p>

<hr>
<p class="small muted">Disclaimer: Ye policy general informational purpose ke liye hai aur legal advice nahi hai. Kisi specific legal sawaal ke liye qualified lawyer se consult kijiye.</p>`,
  });
}

export function buildTerms(ctx) {
  const { site } = ctx;
  return legalPage(ctx, {
    path: '/terms-and-conditions/',
    title: 'Terms & Conditions',
    description: `${site.name} use karne ke Terms & Conditions.`,
    crumbLabel: 'Terms & Conditions',
    updated: '2026-09-01',
    bodyHtml: `
<p>${esc(site.name)} par aane aur use karne se pehle, kripya ye terms dhyaan se padhein. Website use karke, aap in terms se agree karte hain.</p>

<h2>1. Website Ka Use</h2>
<p>${esc(site.name)} personal, non-commercial entertainment ke liye hai. Aap yahan ke content ko copy, download aur share kar sakte hain apne personal use ke liye ya social platforms par share karne ke liye.</p>

<h2>2. Content Ownership</h2>
<p>Is website ka original content (jokes text, design) ${esc(site.name)} ka hai, jab tak alag se mention na ho. Aap content ko bina permission ke commercially resell ya redistribute nahi kar sakte.</p>

<h2>3. User Conduct</h2>
<p>Aap website ka use kisi illegal, hateful, ya harmful purpose ke liye nahi kar sakte. Automated scraping ya website ko disrupt karne ki koshish allowed nahi hai.</p>

<h2>4. No Account Required</h2>
<p>Hamari core services (jokes browse karna, copy, share, bookmark) ke liye koi account zaroori nahi hai. Bookmarks aapke browser mein local rehte hain.</p>

<h2>5. Third-Party Links &amp; Ads</h2>
<p>Website par third-party links aur advertisements ho sakte hain. Hum in third-party sites ke content ya practices ke liye responsible nahi hain.</p>

<h2>6. Disclaimer of Warranties</h2>
<p>Website "as-is" basis par provide ki jaati hai. Hum guarantee nahi karte ki service hamesha error-free ya uninterrupted rahegi.</p>

<h2>7. Limitation of Liability</h2>
<p>${esc(site.name)} kisi bhi direct ya indirect damage ke liye liable nahi hoga jo website ke use se ho sakta hai.</p>

<h2>8. Changes to Terms</h2>
<p>Hum in terms ko kabhi bhi update kar sakte hain. Continued use of the website iska matlab hoga ki aap updated terms se agree karte hain.</p>

<h2>9. Contact</h2>
<p>Sawaal ke liye <a href="/contact-us/">Contact Us</a> page dekhein.</p>`,
  });
}

export function buildDisclaimer(ctx) {
  const { site } = ctx;
  return legalPage(ctx, {
    path: '/disclaimer/',
    title: 'Disclaimer',
    description: `${site.name} par diye gaye content ka disclaimer.`,
    crumbLabel: 'Disclaimer',
    updated: '2026-09-01',
    bodyHtml: `
<h2>Entertainment Purpose Only</h2>
<p>${esc(site.name)} par mojood saara content — jokes, status aur wishes — sirf entertainment purpose ke liye hai. Content ko kisi bhi tarah se factual statement, professional advice, ya kisi vyakti/samuday ke baare mein real opinion nahi samjha jaana chahiye.</p>

<h2>No Targeting Intended</h2>
<p>Humari jokes kisi specific dharm, jaati, gender, ya samuday ko target karne ke liye nahi banaye gaye hain. Agar phir bhi koi content aapko offensive lage, kripya humein <a href="/contact-us/">contact</a> karein — hum use review karenge.</p>

<h2>Original Content</h2>
<p>Is website par diya gaya content original hai, jo hamari team ne likha hai. Hum kisi third-party copyrighted material ko bina permission publish nahi karte.</p>

<h2>External Links</h2>
<p>Jab aap WhatsApp, Telegram, Facebook, ya X jaise platforms par redirect hote hain, wo apni policies follow karte hain — humara unpar koi control nahi hai.</p>

<h2>No Guarantee</h2>
<p>Hum content ki accuracy, timeliness, ya completeness ki guarantee nahi dete, halaanki hum ise up-to-date aur relevant rakhne ki poori koshish karte hain.</p>`,
  });
}

export function buildCopyright(ctx) {
  const { site } = ctx;
  return legalPage(ctx, {
    path: '/copyright-policy/',
    title: 'Copyright Policy',
    description: `${site.name} ki copyright policy aur intellectual property guidelines.`,
    crumbLabel: 'Copyright Policy',
    updated: '2026-09-01',
    bodyHtml: `
<h2>Our Content</h2>
<p>${esc(site.name)} par diye gaye saare jokes text original hain, jo hamari team ne likhe hain, jab tak alag se credit na diya gaya ho. In par ${esc(site.name)} ka copyright hai.</p>

<h2>Personal Use</h2>
<p>Aap hamara content apne personal use ke liye copy, download aur social media (WhatsApp, Instagram, Facebook, etc.) par share kar sakte hain. Commercial redistribution ya resale ke liye written permission chahiye.</p>

<h2>Copyright Infringement Claims</h2>
<p>Agar aapko lagta hai ki humari website par koi content aapke copyright ka ullanghan karta hai, kripya humein neeche di gayi jaankari ke saath contact karein:</p>
<ul>
<li>Aapke copyrighted work ka description</li>
<li>Website par us content ka exact URL/location</li>
<li>Aapki contact jaankari</li>
<li>Ek statement ki aap good faith mein believe karte hain ki use unauthorized hai</li>
</ul>
<p>Hum valid claims ko promptly review aur address karenge.</p>

<h2>Contact for Copyright Matters</h2>
<p>Email: <a href="mailto:${esc(site.contactEmail)}">${esc(site.contactEmail)}</a></p>`,
  });
}
