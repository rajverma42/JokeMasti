import { chromium } from '/home/claude/.npm-global/lib/node_modules/playwright/index.mjs';

const BASE = 'http://localhost:8080';
const OUT = process.argv[2] || '/tmp/shots';
import fs from 'node:fs';
fs.mkdirSync(OUT, { recursive: true });

const pages = [
  ['home', '/'],
  ['jokes-index', '/jokes/'],
  ['joke-category', '/jokes/hindi-jokes/'],
  ['joke-detail', '/joke/mummy-ka-wifi-joke/'],
  ['memes-index', '/memes/'],
  ['meme-detail', '/meme/ghar-ka-dabba-meme/'],
  ['trending', '/trending/'],
  ['festival-hub', '/festival/'],
  ['festival-detail', '/festival/diwali/'],
  ['whatsapp', '/whatsapp/'],
  ['search', '/search/?q=teacher'],
  ['saved', '/saved/'],
  ['about', '/about-us/'],
  ['404', '/this-page-does-not-exist/'],
];

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });

for (const viewport of [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'desktop', width: 1440, height: 900 },
]) {
  const ctx = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } });
  for (const [name, url] of pages) {
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(String(e)));
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    try {
      await page.goto(BASE + url, { waitUntil: 'networkidle', timeout: 15000 });
      await page.waitForTimeout(150);
      await page.screenshot({ path: `${OUT}/${viewport.name}-${name}.png`, fullPage: viewport.name === 'desktop' ? false : true });
    } catch (e) {
      errors.push('NAV: ' + e.message);
    }
    if (errors.length) console.log(`[${viewport.name}] ${name} (${url}) errors:`, errors);
    await page.close();
  }
  await ctx.close();
}

// Dark mode check
const darkCtx = await browser.newContext({ viewport: { width: 390, height: 844 }, colorScheme: 'dark' });
const dp = await darkCtx.newPage();
await dp.goto(BASE + '/', { waitUntil: 'networkidle' });
await dp.screenshot({ path: `${OUT}/mobile-home-darkmode.png`, fullPage: true });
await dp.goto(BASE + '/meme/ghar-ka-dabba-meme/', { waitUntil: 'networkidle' });
await dp.screenshot({ path: `${OUT}/mobile-meme-detail-darkmode.png`, fullPage: true });
await darkCtx.close();

// Drawer open state
const dc = await browser.newContext({ viewport: { width: 390, height: 844 } });
const dpg = await dc.newPage();
await dpg.goto(BASE + '/', { waitUntil: 'networkidle' });
await dpg.click('#drawer-open');
await dpg.waitForTimeout(300);
await dpg.screenshot({ path: `${OUT}/mobile-drawer-open.png` });
await dc.close();

await browser.close();
console.log('done ->', OUT);
