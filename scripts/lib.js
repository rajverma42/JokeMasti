'use strict';
const fs = require('fs');
const path = require('path');

const slugify = s => String(s).toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').replace(/-{2,}/g, '-');
const normText = s => String(s).toLowerCase().replace(/[\s\p{P}\p{S}]+/gu, '');
const REQUIRED = ['id', 'title', 'language', 'category', 'text', 'createdAt'];
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function loadAll(root) {
  const read = p => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
  const errors = [], warnings = [];
  const site = read('data/site.json');
  const languages = read('data/languages.json');
  const allCategories = read('data/categories.json');
  const templates = read('data/templates.json');
  const categories = allCategories.filter(c => c.enabled !== false);
  const catBySlug = new Map(categories.map(c => [c.slug, c]));
  const allCatSlugs = new Set(allCategories.map(c => c.slug));

  const jokes = [], ids = new Set(), texts = new Map(), titles = new Map(), slugs = new Set();
  for (const l of languages) {
    const file = path.join(root, 'data/jokes', l.file);
    if (!fs.existsSync(file)) { warnings.push(`${l.file}: missing (language "${l.name}" will be empty)`); continue; }
    let arr;
    try { arr = JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { errors.push(`${l.file}: invalid JSON (${e.message})`); continue; }
    if (!Array.isArray(arr)) { errors.push(`${l.file}: must contain an array`); continue; }
    arr.forEach((j, n) => {
      const where = `${l.file}#${n + 1}${j && j.id ? ` (${j.id})` : ''}`;
      const missing = REQUIRED.filter(k => !j || j[k] == null || String(j[k]).trim() === '');
      if (missing.length) { errors.push(`${where}: missing ${missing.join(', ')}`); return; }
      if (j.status === 'draft') return;
      if (!/^JM-[A-Z]{2}-\d{4,}$/.test(j.id)) errors.push(`${where}: id must look like JM-XX-0001`);
      if (ids.has(j.id)) errors.push(`${where}: duplicate id`);
      ids.add(j.id);
      if (j.language !== l.code) errors.push(`${where}: language "${j.language}" but file is for "${l.code}"`);
      const c = catBySlug.get(j.category);
      if (!c) {
        if (allCatSlugs.has(j.category)) { warnings.push(`${where}: category "${j.category}" is disabled, joke skipped`); return; }
        errors.push(`${where}: unknown category "${j.category}"`); return;
      }
      if (c.href || (c.rule && c.rule.type === 'all')) errors.push(`${where}: "${j.category}" is a collection, not a primary category`);
      if (!DATE_RE.test(j.createdAt) || (j.updatedAt && !DATE_RE.test(j.updatedAt))) errors.push(`${where}: dates must be YYYY-MM-DD`);
      const nt = normText(j.text);
      if (texts.has(nt)) errors.push(`${where}: same text as ${texts.get(nt)}`); else texts.set(nt, j.id);
      const tk = `${j.language}|${j.title.trim().toLowerCase()}`;
      if (titles.has(tk)) warnings.push(`${where}: same title as ${titles.get(tk)} (page titles will repeat)`); else titles.set(tk, j.id);
      const p = Number(j.popularity);
      const base = slugify(j.title);
      const slug = `${base.length >= 3 ? base.slice(0, 60).replace(/-+$/, '') : `${j.category}-joke`}-${j.id.toLowerCase()}`;
      if (slugs.has(slug)) errors.push(`${where}: duplicate URL slug ${slug}`); slugs.add(slug);
      jokes.push({
        ...j,
        title: j.title.trim(),
        text: j.text.replace(/\r\n/g, '\n').trim(),
        tags: [...new Set((j.tags || []).map(slugify).filter(Boolean))],
        popularity: Number.isFinite(p) ? Math.min(100, Math.max(1, p)) : 50,
        updatedAt: j.updatedAt || j.createdAt,
        slug,
        path: `/joke/${slug}/`,
      });
    });
  }
  const seenCats = new Set();
  for (const c of allCategories) { if (seenCats.has(c.slug)) errors.push(`categories.json: duplicate slug ${c.slug}`); seenCats.add(c.slug); }
  return { site, languages, categories, allCategories, templates, jokes, errors, warnings, slugify };
}
module.exports = { loadAll, slugify };
