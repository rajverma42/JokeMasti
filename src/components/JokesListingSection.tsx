import type { Joke } from "@/types/content";
import { jokeCategories } from "@/data/categories";
import { CategoryChips } from "@/components/CategoryChips";
import { SortLinks, sortJokesOrMemes, type SortOption } from "@/components/SortLinks";
import { LoadMoreList } from "@/components/LoadMoreList";
import { JokeCard } from "@/components/JokeCard";

export function JokesListingSection({
  jokes,
  activeCategory,
  sort,
  basePath,
}: {
  jokes: Joke[];
  activeCategory?: string;
  sort: SortOption;
  basePath: string;
}) {
  const sorted = sortJokesOrMemes(jokes, sort);
  const items = sorted.map((joke) => <JokeCard key={joke.id} joke={joke} />);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <CategoryChips categories={jokeCategories} active={activeCategory} allHref="/jokes" />
        <SortLinks basePath={basePath} active={sort} />
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
