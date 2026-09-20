"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { searchContent, trendingKeywords } from "@/lib/search";
import { addRecentSearch } from "@/lib/storage";
import { useRecentSearches } from "@/lib/hooks";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  variant?: "hero" | "header";
  placeholder?: string;
  autoFocus?: boolean;
  onNavigate?: () => void;
}

export function SearchBar({
  variant = "header",
  placeholder = "Search Jokes & Memes",
  autoFocus = false,
  onNavigate,
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const recent = useRecentSearches();
  const results = useMemo(
    () => (query.trim().length >= 2 ? searchContent(query, 6) : []),
    [query]
  );
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function goToSearch(q: string) {
    const trimmed = q.trim();
    if (!trimmed) return;
    addRecentSearch(trimmed);
    setOpen(false);
    onNavigate?.();
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    goToSearch(query);
  }

  const showDropdown = open && (results.length > 0 || query.trim().length < 2);

  return (
    <div ref={rootRef} className="relative w-full">
      <form onSubmit={handleSubmit} role="search" aria-label="Site search">
        <div
          className={cn(
            "flex items-center gap-2 rounded-full border border-border bg-surface px-4 shadow-sm",
            variant === "hero" ? "h-14 sm:h-16" : "h-11"
          )}
        >
          <span aria-hidden="true" className="text-foreground-muted">
            🔍
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setOpen(true)}
            autoFocus={autoFocus}
            placeholder={placeholder}
            aria-label={placeholder}
            className={cn(
              "flex-1 bg-transparent outline-none placeholder:text-foreground-muted",
              variant === "hero" ? "text-base sm:text-lg" : "text-sm"
            )}
          />
          <button
            type="submit"
            className={cn(
              "shrink-0 rounded-full bg-brand-500 font-semibold text-white transition-colors hover:bg-brand-600",
              variant === "hero" ? "px-5 py-2.5 text-sm sm:text-base" : "px-3.5 py-1.5 text-xs"
            )}
          >
            Search
          </button>
        </div>
      </form>

      {showDropdown && (
        <div className="absolute inset-x-0 top-full z-40 mt-2 max-h-[70vh] overflow-y-auto rounded-2xl border border-border bg-surface p-3 shadow-xl">
          {results.length > 0 ? (
            <ul className="flex flex-col gap-1">
              {results.map((r) => (
                <li key={`${r.type}-${r.id}`}>
                  <Link
                    href={r.href}
                    onClick={() => {
                      addRecentSearch(query);
                      setOpen(false);
                      onNavigate?.();
                    }}
                    className="flex items-center gap-3 rounded-xl p-2 hover:bg-surface-muted"
                  >
                    {r.image ? (
                      <Image src={r.image} alt="" width={40} height={50} className="h-10 w-8 rounded object-cover" />
                    ) : (
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-base">
                        {r.emoji || (r.type === "joke" ? "😂" : "🖼️")}
                      </span>
                    )}
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">{r.title}</span>
                      {r.subtitle && (
                        <span className="block truncate text-xs text-foreground-muted">{r.subtitle}</span>
                      )}
                    </span>
                  </Link>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={() => goToSearch(query)}
                  className="mt-1 w-full rounded-xl p-2 text-center text-sm font-semibold text-brand-600 hover:bg-surface-muted"
                >
                  See all results for &ldquo;{query}&rdquo;
                </button>
              </li>
            </ul>
          ) : (
            <div className="flex flex-col gap-4">
              {recent.length > 0 && (
                <div>
                  <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-foreground-muted">
                    Recent Searches
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {recent.map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => goToSearch(q)}
                        className="rounded-full bg-surface-muted px-3 py-1 text-xs hover:bg-brand-50 hover:text-brand-600"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-foreground-muted">
                  Trending Searches
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {trendingKeywords.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => goToSearch(q)}
                      className="rounded-full bg-surface-muted px-3 py-1 text-xs hover:bg-brand-50 hover:text-brand-600"
                    >
                      🔥 {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
