/**
 * Loads every JSON content file once, cross-links jokes/memes to their
 * category metadata, and builds the lookup indices the page builders need.
 * Pure data layer — no HTML here.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { slugify, dailyPick } from './util.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..');
const DATA = path.join(ROOT, 'data');

const readJson = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));

export function loadSite() {
  return readJson(path.join(DATA, 'site.json'));
}

export function loadCategories() {
  return readJson(path.join(DATA, 'categories.json'));
}

export function loadFestivals() {
  return readJson(path.join(DATA, 'festivals.json'));
}

export function loadStatus() {
  return readJson(path.join(DATA, 'status.json'));
}

export function loadJokes() {
  const dir = path.join(DATA, 'jokes');
  const all = [];
  for (const file of fs.readdirSync(dir).sort()) {
    if (!file.endsWith('.json')) continue;
    all.push(...readJson(path.join(dir, file)));
  }
  return all;
}

export function loadMemes() {
  return readJson(path.join(DATA, 'memes.json'));
}

/** Builds the full in-memory content graph used across every page builder. */
export function loadContent() {
  const site = loadSite();
  const categories = loadCategories();
  const festivals = loadFestivals();
  const status = loadStatus();
  const jokes = loadJokes();
  const memes = loadMemes();

  const jokeCatBySlug = new Map(categories.jokes.map((c) => [c.slug, c]));
  const memeCatBySlug = new Map(categories.memes.map((c) => [c.slug, c]));
  const festivalBySlug = new Map(festivals.map((f) => [f.slug, f]));

  for (const j of jokes) {
    j.type = 'joke';
    j.catMeta = jokeCatBySlug.get(j.category) || null;
    j.url = `/joke/${j.slug}/`;
    j.image = null;
  }
  for (const m of memes) {
    m.type = 'meme';
    m.catMeta = memeCatBySlug.get(m.category) || null;
    m.url = `/meme/${m.slug}/`;
    m.image = `/assets/img/memes/${m.slug}.webp`;
    m.thumb = `/assets/img/memes/${m.slug}-thumb.webp`;
  }

  const jokesByCategory = new Map();
  for (const c of categories.jokes) jokesByCategory.set(c.slug, []);
  for (const j of jokes) {
    if (!jokesByCategory.has(j.category)) jokesByCategory.set(j.category, []);
    jokesByCategory.get(j.category).push(j);
  }

  const memesByCategory = new Map();
  for (const c of categories.memes) memesByCategory.set(c.slug, []);
  for (const m of memes) {
    if (!memesByCategory.has(m.category)) memesByCategory.set(m.category, []);
    memesByCategory.get(m.category).push(m);
  }

  const jokesByFestival = new Map();
  const memesByFestival = new Map();
  for (const f of festivals) {
    jokesByFestival.set(f.slug, jokes.filter((j) => j.festival === f.slug));
    memesByFestival.set(f.slug, memes.filter((m) => m.festival === f.slug));
  }

  const jokeBySlug = new Map(jokes.map((j) => [j.slug, j]));
  const memeBySlug = new Map(memes.map((m) => [m.slug, m]));

  const allTags = new Set();
  for (const j of jokes) j.tags.forEach((t) => allTags.add(t));
  for (const m of memes) m.tags.forEach((t) => allTags.add(t));

  return {
    site,
    categories,
    festivals,
    status,
    jokes,
    memes,
    jokeCatBySlug,
    memeCatBySlug,
    festivalBySlug,
    jokesByCategory,
    memesByCategory,
    jokesByFestival,
    memesByFestival,
    jokeBySlug,
    memeBySlug,
    allTags: [...allTags].sort(),
  };
}

/** Deterministic Joke/Meme of the Day, rotates once per calendar date. */
export function jokeOfDay(jokes, dateStr) {
  const pool = jokes.filter((j) => j.category !== 'festival-jokes');
  return dailyPick(pool, dateStr, 1);
}
export function memeOfDay(memes, dateStr) {
  return dailyPick(memes, dateStr, 2);
}

export function slugifyTag(t) {
  return slugify(t);
}
