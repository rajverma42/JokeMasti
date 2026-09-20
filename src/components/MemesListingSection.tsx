import type { Meme } from "@/types/content";
import { memeCategories } from "@/data/categories";
import { CategoryChips } from "@/components/CategoryChips";
import { SortLinks, sortJokesOrMemes, type SortOption } from "@/components/SortLinks";
import { LoadMoreList } from "@/components/LoadMoreList";
import { MemeCard } from "@/components/MemeCard";

export function MemesListingSection({
  memes,
  activeCategory,
  sort,
  basePath,
  allHref = "/memes",
}: {
  memes: Meme[];
  activeCategory?: string;
  sort: SortOption;
  basePath: string;
  allHref?: string;
}) {
  const sorted = sortJokesOrMemes(memes, sort);
  const items = sorted.map((meme, i) => <MemeCard key={meme.id} meme={meme} priority={i < 4} />);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <CategoryChips categories={memeCategories} active={activeCategory} allHref={allHref} />
        <SortLinks basePath={basePath} active={sort} />
      </div>
      <p className="mt-3 text-sm text-foreground-muted">{memes.length} memes mile</p>
      <div className="mt-4">
        <LoadMoreList
          items={items}
          batchSize={12}
          className="columns-2 gap-4 sm:columns-2 md:columns-3 lg:columns-4"
          wrapClassName="mb-4 break-inside-avoid"
          emptyMessage="Is category mein abhi memes nahi hain. Jald hi aayenge!"
        />
      </div>
    </div>
  );
}
