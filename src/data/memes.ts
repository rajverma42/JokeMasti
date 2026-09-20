import { memeSource } from "@/data/memeSource.mjs";
import type { Meme, MemeCategorySlug } from "@/types/content";

export const memes: Meme[] = memeSource.map((m) => ({
  id: m.id,
  slug: m.slug,
  title: m.title,
  description: m.description,
  image: `/images/memes/${m.slug}.webp`,
  thumbnail: `/images/memes/thumbs/${m.slug}.webp`,
  width: 1080,
  height: 1350,
  category: m.category as MemeCategorySlug,
  tags: m.tags,
  createdAt: m.createdAt,
  likes: m.likes,
  shares: m.shares,
  downloads: m.downloads,
  views: m.views,
  festival: m.festival,
  funnyImage: m.funnyImage,
  featured: m.featured,
}));

export function getAllMemes() {
  return memes;
}

export function getMemeBySlug(slug: string) {
  return memes.find((m) => m.slug === slug);
}

export function getMemesByCategory(category: string) {
  return memes.filter((m) => m.category === category);
}

export function getMemesByFestival(festival: string) {
  return memes.filter((m) => m.festival === festival);
}

export function getFeaturedMemes() {
  return memes.filter((m) => m.featured);
}

export function getFunnyImages() {
  return memes.filter((m) => m.funnyImage);
}
