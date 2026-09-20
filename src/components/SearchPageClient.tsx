"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { searchContent, trendingKeywords } from "@/lib/search";
import { addRecentSearch } from "@/lib/storage";
import { SearchBar } from "@/components/SearchBar";

// Reads ?q= itself via useSearchParams (see JokesListingSection for why:
// this keeps /search a plain static page, which the GitHub Pages static
// export build requires — there's no server at request time to read
// searchParams from).
export function SearchPageClient() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const results = q ? searchContent(q, 40) : [];

  useEffect(() => {
    if (q.trim()) addRecentSearch(q);
  }, [q]);

  return (
    <>
      <div className="mt-4 max-w-xl">
        <SearchBar variant="hero" placeholder="Search Jokes & Memes" autoFocus={!q} />
      </div>

      {q ? (
        <>
          <p className="mb-4 mt-6 text-foreground-muted">
            Search Results for &ldquo;<span className="font-semibold text-foreground">{q}</span>&rdquo; — {results.length} found
          </p>
          {results.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-8 text-center text-foreground-muted">
              <p>Kuch nahi mila. Spelling check karo ya trending keywords try karo:</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {trendingKeywords.map((kw) => (
                  <Link
                    key={kw}
                    href={`/search?q=${encodeURIComponent(kw)}`}
                    className="rounded-full bg-surface-muted px-3 py-1 text-xs hover:bg-brand-50 hover:text-brand-600"
                  >
                    🔥 {kw}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <ul className="flex flex-col gap-2.5">
              {results.map((r) => (
                <li key={`${r.type}-${r.id}`}>
                  <Link
                    href={r.href}
                    className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-3 shadow-sm hover:shadow-md"
                  >
                    {r.image ? (
                      <Image src={r.image} alt="" width={48} height={60} className="h-12 w-10 rounded-lg object-cover" />
                    ) : (
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-50 text-lg">
                        {r.emoji || (r.type === "joke" ? "😂" : "🖼️")}
                      </span>
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold">{r.title}</span>
                      {r.subtitle && (
                        <span className="block truncate text-sm text-foreground-muted">{r.subtitle}</span>
                      )}
                    </span>
                    <span className="shrink-0 rounded-full bg-surface-muted px-2 py-0.5 text-xs capitalize text-foreground-muted">
                      {r.type}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <div className="mt-6">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-foreground-muted">
            Trending Searches
          </p>
          <div className="flex flex-wrap gap-2">
            {trendingKeywords.map((kw) => (
              <Link
                key={kw}
                href={`/search?q=${encodeURIComponent(kw)}`}
                className="rounded-full border border-border bg-surface px-3.5 py-1.5 text-sm hover:text-brand-600"
              >
                🔥 {kw}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
