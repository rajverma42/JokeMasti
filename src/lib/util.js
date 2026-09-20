/** Small shared helpers. No dependencies. */

/** Escape for HTML text nodes and double-quoted attributes. */
export const esc = (s = '') =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

/** Escape for a value embedded in a JS string inside <script>. */
export const escJs = (s = '') =>
  JSON.stringify(s).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');

/** Escape a JSON-LD payload so no </script> can break out. */
export const jsonLd = (obj) =>
  JSON.stringify(obj).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');

export const slugify = (s = '') =>
  String(s)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

/** Plain text of a joke, newlines collapsed — for meta descriptions. */
export const flat = (s = '') => String(s).replace(/\s*\n\s*/g, ' ').trim();

export const clip = (s = '', n = 155) => {
  const t = flat(s);
  if (t.length <= n) return t;
  return t.slice(0, n - 1).replace(/\s+\S*$/, '') + '…';
};

export const chunk = (arr, n) => {
  const out = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const prettyDate = (iso) => {
  const d = new Date(iso + 'T00:00:00Z');
  if (Number.isNaN(d.getTime())) return '';
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
};

/**
 * Deterministic daily pick — same for every visitor on a given date,
 * rotates as the date changes. No randomness, no fake freshness.
 */
export const dailyPick = (items, dateStr, salt = 0) => {
  if (!items.length) return null;
  let h = salt * 2654435761;
  for (const c of dateStr) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return items[h % items.length];
};

export const byScore = (a, b) => (b.score || 0) - (a.score || 0);
export const byDate = (a, b) =>
  String(b.createdAt || '').localeCompare(String(a.createdAt || '')) || byScore(a, b);
