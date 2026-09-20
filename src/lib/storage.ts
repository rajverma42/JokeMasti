"use client";

// All persistence here is browser localStorage only — there is no backend,
// no account and nothing is ever sent off-device. Every read/write is
// wrapped in try/catch because storage can throw (private browsing,
// blocked site data, disabled storage) and the site must keep working.

const KEYS = {
  theme: "jm:theme",
  bookmarksJokes: "jm:bookmarks:jokes",
  bookmarksMemes: "jm:bookmarks:memes",
  recentSearches: "jm:recent-searches",
  likedJokes: "jm:liked:jokes",
  likedMemes: "jm:liked:memes",
} as const;

export type Theme = "light" | "dark" | "system";

export const STORAGE_EVENTS = {
  theme: "jm:theme-changed",
  bookmarks: "jm:bookmarks-changed",
  likes: "jm:likes-changed",
  recentSearches: "jm:recent-searches-changed",
} as const;

// Caches the last parsed value per key, keyed by the raw string it came
// from, so repeated reads with unchanged localStorage content return the
// *same* array/object reference. This matters because array/object
// snapshots feed useSyncExternalStore (see lib/hooks.ts) — if getSnapshot
// returned a freshly-parsed array every call, React would see a "new"
// value on every render and loop forever re-rendering.
const parseCache = new Map<string, { raw: string; value: unknown }>();

// Stable empty-array reference: an inline `[]` fallback would be a *new*
// array on every call, which breaks the useSyncExternalStore snapshots in
// lib/hooks.ts (see readJSON's comment above) whenever the underlying key
// hasn't been written yet.
const EMPTY_ARRAY: readonly string[] = [];

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const cached = parseCache.get(key);
    if (cached && cached.raw === raw) return cached.value as T;
    const parsed = JSON.parse(raw) as T;
    parseCache.set(key, { raw, value: parsed });
    return parsed;
  } catch {
    return fallback;
  }
}

function writeJSON(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage unavailable — silently no-op, page still works
  }
}

// ---------------- Theme ----------------
export function getStoredTheme(): Theme {
  if (typeof window === "undefined") return "system";
  try {
    return (window.localStorage.getItem(KEYS.theme) as Theme) || "system";
  } catch {
    return "system";
  }
}

export function setStoredTheme(theme: Theme) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEYS.theme, theme);
  } catch {
    // ignore
  }
  window.dispatchEvent(new CustomEvent(STORAGE_EVENTS.theme));
}

// ---------------- Bookmarks ----------------
export function getBookmarkedJokes(): string[] {
  return readJSON<string[]>(KEYS.bookmarksJokes, EMPTY_ARRAY as string[]);
}

export function getBookmarkedMemes(): string[] {
  return readJSON<string[]>(KEYS.bookmarksMemes, EMPTY_ARRAY as string[]);
}

export function isJokeBookmarked(slug: string): boolean {
  return getBookmarkedJokes().includes(slug);
}

export function isMemeBookmarked(slug: string): boolean {
  return getBookmarkedMemes().includes(slug);
}

export function toggleJokeBookmark(slug: string): boolean {
  const current = getBookmarkedJokes();
  const exists = current.includes(slug);
  const next = exists ? current.filter((s) => s !== slug) : [slug, ...current];
  writeJSON(KEYS.bookmarksJokes, next);
  window.dispatchEvent(new CustomEvent(STORAGE_EVENTS.bookmarks));
  return !exists;
}

export function toggleMemeBookmark(slug: string): boolean {
  const current = getBookmarkedMemes();
  const exists = current.includes(slug);
  const next = exists ? current.filter((s) => s !== slug) : [slug, ...current];
  writeJSON(KEYS.bookmarksMemes, next);
  window.dispatchEvent(new CustomEvent(STORAGE_EVENTS.bookmarks));
  return !exists;
}

// ---------------- Recent searches ----------------
const MAX_RECENT_SEARCHES = 8;

export function getRecentSearches(): string[] {
  return readJSON<string[]>(KEYS.recentSearches, EMPTY_ARRAY as string[]);
}

export function addRecentSearch(query: string) {
  const trimmed = query.trim();
  if (!trimmed) return;
  const current = getRecentSearches().filter(
    (q) => q.toLowerCase() !== trimmed.toLowerCase()
  );
  const next = [trimmed, ...current].slice(0, MAX_RECENT_SEARCHES);
  writeJSON(KEYS.recentSearches, next);
  window.dispatchEvent(new CustomEvent(STORAGE_EVENTS.recentSearches));
}

export function clearRecentSearches() {
  writeJSON(KEYS.recentSearches, []);
  window.dispatchEvent(new CustomEvent(STORAGE_EVENTS.recentSearches));
}

// ---------------- Likes (local, optimistic) ----------------
export function isJokeLiked(id: string): boolean {
  return readJSON<string[]>(KEYS.likedJokes, EMPTY_ARRAY as string[]).includes(id);
}

export function isMemeLiked(id: string): boolean {
  return readJSON<string[]>(KEYS.likedMemes, EMPTY_ARRAY as string[]).includes(id);
}

export function toggleJokeLike(id: string): boolean {
  const current = readJSON<string[]>(KEYS.likedJokes, EMPTY_ARRAY as string[]);
  const exists = current.includes(id);
  const next = exists ? current.filter((s) => s !== id) : [...current, id];
  writeJSON(KEYS.likedJokes, next);
  window.dispatchEvent(new CustomEvent(STORAGE_EVENTS.likes));
  return !exists;
}

export function toggleMemeLike(id: string): boolean {
  const current = readJSON<string[]>(KEYS.likedMemes, EMPTY_ARRAY as string[]);
  const exists = current.includes(id);
  const next = exists ? current.filter((s) => s !== id) : [...current, id];
  writeJSON(KEYS.likedMemes, next);
  window.dispatchEvent(new CustomEvent(STORAGE_EVENTS.likes));
  return !exists;
}
