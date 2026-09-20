import type { NextConfig } from "next";

// Static export (for GitHub Pages, which can only serve static files — no
// Node server, so no SSR/ISR/next/image optimization API) is opt-in via
// STATIC_EXPORT=true, set only in the Pages deploy workflow. Local dev,
// `npm run build`/`npm start`, and any future Node-capable host (Vercel,
// etc.) are unaffected and keep the full dynamic Next.js build.
const isStaticExport = process.env.STATIC_EXPORT === "true";

// When exporting for GitHub Pages the site is served from a repo subpath
// (https://<user>.github.io/<repo>/), not the domain root. Derive that
// subpath from NEXT_PUBLIC_SITE_URL (set alongside STATIC_EXPORT in the
// workflow) so basePath and every canonical/OG/JSON-LD URL built from
// siteConfig.url (see src/lib/site.ts) agree with each other automatically.
function getBasePath(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL;
  if (!url) return "";
  try {
    const pathname = new URL(url).pathname.replace(/\/+$/, "");
    return pathname === "" ? "" : pathname;
  } catch {
    return "";
  }
}

const basePath = isStaticExport ? getBasePath() : "";

const nextConfig: NextConfig = {
  output: isStaticExport ? "export" : undefined,
  basePath: basePath || undefined,
  images: {
    unoptimized: isStaticExport,
  },
  // Static hosts (GitHub Pages included) serve exported routes as
  // "route/index.html"; without this, Next writes "route.html" instead
  // while still generating trailing-slash URLs for <Link> prefetching,
  // so prefetches 404 even though direct navigation still resolves.
  // This is Next's own documented recommendation for `output: "export"`.
  trailingSlash: isStaticExport,
};

export default nextConfig;
