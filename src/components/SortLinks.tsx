"use client";

import { type SortOption } from "@/lib/sort";

const OPTIONS: { value: SortOption; label: string }[] = [
  { value: "trending", label: "🔥 Trending" },
  { value: "latest", label: "🆕 Latest" },
  { value: "popular", label: "❤️ Popular" },
];

// Plain client-side buttons rather than <Link href="?sort=..."> — sort
// order is a display preference over data that's already loaded, not a
// distinct page worth its own URL/crawl target, and driving it off
// useSearchParams would force the whole jokes/memes listing behind a
// Suspense boundary. Under the GitHub Pages static export build that
// causes Next to ship an *empty* fallback in the prerendered HTML instead
// of the real, indexable list (see JokesListingSection/MemesListingSection)
// — a real SEO regression for pages meant to be crawled. Local useState in
// the parent, changed here via onChange, keeps the full list server-
// rendered/static while sorting still updates instantly for users with JS.
export function SortButtons({
  active,
  onChange,
}: {
  active: SortOption;
  onChange: (sort: SortOption) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Sort by">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
            active === opt.value
              ? "bg-brand-500 text-white"
              : "border border-border bg-surface text-foreground-muted hover:text-foreground"
          }`}
          aria-current={active === opt.value ? "true" : undefined}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
