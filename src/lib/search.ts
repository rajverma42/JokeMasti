import Fuse from "fuse.js";
import { jokes } from "@/data/jokes";
import { memes } from "@/data/memes";
import { allCategories } from "@/data/categories";

export type SearchResultType = "joke" | "meme" | "category";

export interface SearchResult {
  type: SearchResultType;
  id: string;
  title: string;
  subtitle?: string;
  href: string;
  emoji?: string;
  image?: string;
}

const jokeResults: SearchResult[] = jokes.map((j) => ({
  type: "joke",
  id: j.id,
  title: j.title,
  subtitle: j.text.replace(/\n/g, " "),
  href: `/joke/${j.slug}`,
}));

const memeResults: SearchResult[] = memes.map((m) => ({
  type: "meme",
  id: m.id,
  title: m.title,
  subtitle: m.description,
  href: `/meme/${m.slug}`,
  image: m.thumbnail,
}));

const categoryResults: SearchResult[] = allCategories.map((c) => ({
  type: "category",
  id: c.slug,
  title: c.name,
  subtitle: c.description,
  href: c.href,
  emoji: c.emoji,
}));

const searchIndex: SearchResult[] = [...categoryResults, ...jokeResults, ...memeResults];

const fuse = new Fuse(searchIndex, {
  keys: [
    { name: "title", weight: 0.5 },
    { name: "subtitle", weight: 0.3 },
  ],
  threshold: 0.34,
  ignoreLocation: true,
  minMatchCharLength: 2,
});

// Separate tag-aware fuse over raw content for richer matching (tags, category slugs)
interface Taggable {
  slug: string;
  title: string;
  tags: string[];
  category: string;
}

const tagFuseSource: Taggable[] = [
  ...jokes.map((j) => ({ slug: j.slug, title: j.title, tags: j.tags, category: j.category })),
  ...memes.map((m) => ({ slug: m.slug, title: m.title, tags: m.tags, category: m.category })),
];

const tagFuse = new Fuse(tagFuseSource, {
  keys: ["tags", "category"],
  threshold: 0.2,
});

export function searchContent(query: string, limit = 20): SearchResult[] {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const primary = fuse.search(trimmed).map((r) => r.item);
  const tagMatches = tagFuse.search(trimmed).map((r) => r.item.slug);
  const tagResults = searchIndex.filter(
    (item) =>
      (item.type === "joke" || item.type === "meme") &&
      tagMatches.includes(item.href.split("/").pop() || "")
  );

  const merged: SearchResult[] = [];
  const seen = new Set<string>();
  for (const item of [...primary, ...tagResults]) {
    const key = `${item.type}:${item.id}`;
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(item);
  }
  return merged.slice(0, limit);
}

export const trendingKeywords = [
  "Teacher Student",
  "WhatsApp Jokes",
  "Diwali Memes",
  "Office Jokes",
  "Desi Memes",
  "Good Morning Status",
  "Love Jokes",
  "Animal Memes",
];
