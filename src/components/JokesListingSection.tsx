"use client";

import { useState } from "react";
import type { Joke } from "@/types/content";
import { jokeCategories } from "@/data/categories";
import { CategoryChips } from "@/components/CategoryChips";
import { SortButtons } from "@/components/SortLinks";
import { sortJokesOrMemes, type SortOption } from "@/lib/sort";
import { LoadMoreList } from "@/components/LoadMoreList";
import { JokeCard } from "@/components/JokeCard";

// A client component (not a server one reading searchParams) so this page
// stays fully static — see SortLinks for why sort is local state rather
// than a URL param. Because the initial render already has the full,
// correctly-sorted (trending-by-default) list, the static export build
// bakes the real content into the HTML instead of an empty Suspense
// fallback, so search engines and no-JS visitors still see every joke.
export function JokesListingSection({
  jokes,
  activeCategory,
}: {
  jokes: Joke[];
  activeCategory?: string;
}) {
  const [sort, setSort] = useState<SortOption>("trending");
  const sorted = sortJokesOrMemes(jokes, sort);
  const items = sorted.map((joke) => <JokeCard key={joke.id} joke={joke} />);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <CategoryChips categories={jokeCategories} active={activeCategory} allHref="/jokes" />
        <SortButtons active={sort} onChange={setSort} />
      </div>
      <p className="mt-3 text-sm text-foreground-muted">{jokes.length} jokes mile</p>
      <div className="mt-4">
        <LoadMoreList
          items={items}
          batchSize={9}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
          emptyMessage="Is category mein abhi jokes nahi hain. Jald hi aayenge!"
        />
      </div>
    </div>
  );
}
