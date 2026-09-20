import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

// Required for `output: "export"` (see next.config.ts) — metadata routes
// like this one otherwise default to dynamic, which static export forbids.
export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} — ${siteConfig.tagline}`,
    short_name: siteConfig.name,
    description: siteConfig.description,
    // Per the Web App Manifest spec, start_url and icon src are resolved
    // relative to the manifest file's own URL — not the page, and not
    // Next's basePath (Next doesn't post-process this route's output the
    // way it does next/link or the Metadata API). Leaving off the leading
    // "/" here makes them resolve correctly whether the manifest itself
    // ends up served at the domain root or under a repo subpath (e.g.
    // GitHub Pages' /JokeMasti/manifest.webmanifest).
    start_url: "./?source=pwa",
    display: "standalone",
    background_color: "#fafaf9",
    theme_color: "#ff6b35",
    orientation: "portrait-primary",
    lang: "en-IN",
    categories: ["entertainment", "lifestyle", "social"],
    icons: [
      { src: "icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
