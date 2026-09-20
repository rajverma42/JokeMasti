// Generates the JokeMasti logo mark, PWA icons and the default Open Graph
// image. Run with: node scripts/generate-brand-assets.mjs
// All assets are original, procedurally generated SVG -> raster (no third
// party images), so there are no licensing concerns.
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");

const BRAND_GRADIENT = `
  <linearGradient id="brand" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="#FF6B35" />
    <stop offset="55%" stop-color="#FF3D77" />
    <stop offset="100%" stop-color="#7C3AED" />
  </linearGradient>
`;

function markSvg(size) {
  const r = size * 0.22;
  return `
  <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>${BRAND_GRADIENT}</defs>
    <rect width="${size}" height="${size}" rx="${r}" fill="url(#brand)" />
    <circle cx="${size * 0.32}" cy="${size * 0.42}" r="${size * 0.05}" fill="#ffffff" />
    <circle cx="${size * 0.68}" cy="${size * 0.42}" r="${size * 0.05}" fill="#ffffff" />
    <path d="M ${size * 0.28} ${size * 0.6} Q ${size * 0.5} ${size * 0.84} ${size * 0.72} ${size * 0.6}"
      stroke="#ffffff" stroke-width="${size * 0.055}" stroke-linecap="round" fill="none" />
  </svg>`;
}

async function makePng(svg, size, outPath) {
  await sharp(Buffer.from(svg)).resize(size, size).png().toFile(outPath);
  console.log("wrote", path.relative(ROOT, outPath));
}

async function main() {
  await mkdir(path.join(ROOT, "public/icons"), { recursive: true });
  await mkdir(path.join(ROOT, "public/og"), { recursive: true });
  await mkdir(path.join(ROOT, "src/app"), { recursive: true });

  await makePng(markSvg(512), 512, path.join(ROOT, "public/icons/icon-512.png"));
  await makePng(markSvg(512), 192, path.join(ROOT, "public/icons/icon-192.png"));
  await makePng(markSvg(512), 180, path.join(ROOT, "public/icons/apple-touch-icon.png"));
  await makePng(markSvg(512), 256, path.join(ROOT, "src/app/icon.png"));

  // Maskable icon: keep the mark inside the safe zone (center 80%).
  const maskable = `
  <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <defs>${BRAND_GRADIENT}</defs>
    <rect width="512" height="512" fill="url(#brand)" />
    <g transform="translate(51,51) scale(0.8)">
      <circle cx="163.8" cy="215" r="25.6" fill="#ffffff" />
      <circle cx="348.2" cy="215" r="25.6" fill="#ffffff" />
      <path d="M 143 307 Q 256 430 369 307" stroke="#ffffff" stroke-width="28" stroke-linecap="round" fill="none" />
    </g>
  </svg>`;
  await makePng(maskable, 512, path.join(ROOT, "public/icons/icon-maskable-512.png"));

  // Default Open Graph image (1200x630)
  const ogSvg = `
  <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
    <defs>
      ${BRAND_GRADIENT}
      <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#000000" stop-opacity="0" />
        <stop offset="100%" stop-color="#000000" stop-opacity="0.25" />
      </linearGradient>
    </defs>
    <rect width="1200" height="630" fill="url(#brand)" />
    <rect width="1200" height="630" fill="url(#fade)" />
    <circle cx="1080" cy="90" r="200" fill="#ffffff" opacity="0.08" />
    <circle cx="90" cy="560" r="160" fill="#ffffff" opacity="0.08" />
    <g transform="translate(100,150)">
      <rect width="150" height="150" rx="34" fill="#ffffff" opacity="0.16" />
      <circle cx="48" cy="63" r="15" fill="#ffffff" />
      <circle cx="102" cy="63" r="15" fill="#ffffff" />
      <path d="M 42 90 Q 75 126 108 90" stroke="#ffffff" stroke-width="16" stroke-linecap="round" fill="none" />
    </g>
    <text x="100" y="370" font-family="Liberation Sans, DejaVu Sans, sans-serif" font-weight="700" font-size="92" fill="#ffffff">JokeMasti</text>
    <text x="100" y="430" font-family="Liberation Sans, DejaVu Sans, sans-serif" font-weight="400" font-size="38" fill="#fff0e8">Hasi Ka Daily Dose!</text>
    <text x="100" y="500" font-family="Liberation Sans, DejaVu Sans, sans-serif" font-weight="400" font-size="26" fill="#ffe6d9">Hindi Jokes • Memes • Funny Images • Trending Desi Entertainment</text>
  </svg>`;
  await sharp(Buffer.from(ogSvg)).resize(1200, 630).png().toFile(path.join(ROOT, "public/og/default.png"));
  console.log("wrote public/og/default.png");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
