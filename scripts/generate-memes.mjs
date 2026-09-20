// Rasterizes every entry in memeSource into a real, original WebP meme
// image (full size + thumbnail). No external/scraped images are used —
// each meme is a procedurally generated gradient card with the caption
// text, so there is zero copyright risk.
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { memeSource } from "../src/data/memeSource.mjs";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT_DIR = path.join(ROOT, "public/images/memes");
const THUMB_DIR = path.join(OUT_DIR, "thumbs");

const W = 1080;
const H = 1350;

const GRADIENTS = {
  animal: ["#0EA383", "#0B6E4F"],
  desi: ["#FF6B35", "#C6273E"],
  trending: ["#FF3D77", "#7C3AED"],
  festival: ["#F59E0B", "#DB2777"],
  default: ["#4F46E5", "#7C3AED"],
};

const FESTIVAL_GRADIENTS = {
  diwali: ["#F59E0B", "#B45309"],
  holi: ["#EC4899", "#8B5CF6"],
  "raksha-bandhan": ["#F97316", "#DB2777"],
  "independence-day": ["#F97316", "#16A34A"],
  "republic-day": ["#F97316", "#1D4ED8"],
  christmas: ["#DC2626", "#166534"],
  "new-year": ["#7C3AED", "#2563EB"],
  eid: ["#059669", "#047857"],
  "makar-sankranti": ["#2563EB", "#F59E0B"],
  navratri: ["#DB2777", "#7C3AED"],
  "durga-puja": ["#DC2626", "#B45309"],
  "chhath-puja": ["#F97316", "#F59E0B"],
  "valentines-day": ["#E11D48", "#EC4899"],
  "friendship-day": ["#F59E0B", "#EA580C"],
  "mothers-day": ["#EC4899", "#A855F7"],
  "fathers-day": ["#0EA5E9", "#1E3A8A"],
};

function escapeXml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function wrapLines(rawLines, maxCharsPerLine) {
  const lines = [];
  for (const raw of rawLines) {
    const words = raw.split(" ");
    let current = "";
    for (const word of words) {
      const attempt = current ? `${current} ${word}` : word;
      if (attempt.length > maxCharsPerLine && current) {
        lines.push(current);
        current = word;
      } else {
        current = attempt;
      }
    }
    if (current) lines.push(current);
  }
  return lines;
}

function buildSvg({ caption, category, festival }) {
  const [c1, c2] = FESTIVAL_GRADIENTS[festival] || GRADIENTS[category] || GRADIENTS.default;
  const rawLines = caption.split("\n");
  const lines = wrapLines(rawLines, 18).slice(0, 6);
  const fontSize = lines.length > 4 ? 62 : 76;
  const lineHeight = fontSize * 1.22;
  const totalHeight = lines.length * lineHeight;
  const startY = H / 2 - totalHeight / 2 + fontSize * 0.75;

  const textSpans = lines
    .map((line, i) => `<tspan x="${W / 2}" y="${startY + i * lineHeight}">${escapeXml(line)}</tspan>`)
    .join("");

  return `
  <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${c1}" />
        <stop offset="100%" stop-color="${c2}" />
      </linearGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#bg)" />
    <circle cx="${W * 0.88}" cy="${H * 0.1}" r="220" fill="#ffffff" opacity="0.08" />
    <circle cx="${W * 0.08}" cy="${H * 0.92}" r="180" fill="#ffffff" opacity="0.08" />
    <rect x="48" y="48" width="230" height="72" rx="36" fill="#00000030" />
    <text x="72" y="94" font-family="Liberation Sans, DejaVu Sans, sans-serif" font-weight="700" font-size="30" fill="#ffffff">JokeMasti</text>
    <text text-anchor="middle" font-family="Liberation Sans, DejaVu Sans, sans-serif" font-weight="700" font-size="${fontSize}" fill="#ffffff" style="paint-order: stroke; stroke: rgba(0,0,0,0.18); stroke-width: 2px;">
      ${textSpans}
    </text>
    <rect x="0" y="${H - 90}" width="${W}" height="90" fill="#00000025" />
    <text x="${W / 2}" y="${H - 34}" text-anchor="middle" font-family="Liberation Sans, DejaVu Sans, sans-serif" font-size="26" fill="#ffffffcc">jokemasti.in • Hasi Ka Daily Dose!</text>
  </svg>`;
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  await mkdir(THUMB_DIR, { recursive: true });

  for (const entry of memeSource) {
    const svg = buildSvg(entry);
    const buf = Buffer.from(svg);
    const fullPath = path.join(OUT_DIR, `${entry.slug}.webp`);
    const thumbPath = path.join(THUMB_DIR, `${entry.slug}.webp`);
    await sharp(buf).resize(W, H).webp({ quality: 82 }).toFile(fullPath);
    await sharp(buf).resize(360, 450).webp({ quality: 75 }).toFile(thumbPath);
    console.log("generated", entry.slug);
  }
  console.log(`Done. ${memeSource.length} meme images generated.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
