import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { jokes } from "@/data/jokes";
import { memes } from "@/data/memes";
import { jokeCategories, memeCategories } from "@/data/categories";
import { festivals } from "@/data/festivals";

// Required for `output: "export"` (see next.config.ts) — metadata routes
// like this one otherwise default to dynamic, which static export forbids.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${base}/jokes`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/memes`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/funny-images`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/trending`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${base}/festival`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/whatsapp`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/search`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${base}/privacy-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/disclaimer`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/copyright-policy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  const jokeCategoryRoutes: MetadataRoute.Sitemap = jokeCategories.map((c) => ({
    url: `${base}/jokes/${c.slug}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.7,
  }));

  const memeCategoryRoutes: MetadataRoute.Sitemap = memeCategories.map((c) => ({
    url: `${base}/memes/${c.slug}`,
    lastModified: now,
    changeFrequency: "daily",
    priority: 0.7,
  }));

  const festivalRoutes: MetadataRoute.Sitemap = festivals.map((f) => ({
    url: `${base}/festival/${f.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const jokeRoutes: MetadataRoute.Sitemap = jokes.map((j) => ({
    url: `${base}/joke/${j.slug}`,
    lastModified: new Date(j.createdAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const memeRoutes: MetadataRoute.Sitemap = memes.map((m) => ({
    url: `${base}/meme/${m.slug}`,
    lastModified: new Date(m.createdAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [
    ...staticRoutes,
    ...jokeCategoryRoutes,
    ...memeCategoryRoutes,
    ...festivalRoutes,
    ...jokeRoutes,
    ...memeRoutes,
  ];
}
