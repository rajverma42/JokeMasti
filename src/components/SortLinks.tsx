import Link from "next/link";

export type SortOption = "latest" | "popular" | "trending";

const OPTIONS: { value: SortOption; label: string }[] = [
  { value: "trending", label: "🔥 Trending" },
  { value: "latest", label: "🆕 Latest" },
  { value: "popular", label: "❤️ Popular" },
];

export function SortLinks({
  basePath,
  active,
  extraParams = {},
}: {
  basePath: string;
  active: SortOption;
  extraParams?: Record<string, string | undefined>;
}) {
  function buildHref(sort: SortOption) {
    const params = new URLSearchParams();
    Object.entries(extraParams).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    if (sort !== "trending") params.set("sort", sort);
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Sort by">
      {OPTIONS.map((opt) => (
        <Link
          key={opt.value}
          href={buildHref(opt.value)}
          className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
            active === opt.value
              ? "bg-brand-500 text-white"
              : "border border-border bg-surface text-foreground-muted hover:text-foreground"
          }`}
          aria-current={active === opt.value ? "true" : undefined}
        >
          {opt.label}
        </Link>
      ))}
    </div>
  );
}

export function sortJokesOrMemes<T extends { likes: number; shares: number; views: number; createdAt: string }>(
  items: T[],
  sort: SortOption
): T[] {
  const copy = [...items];
  if (sort === "latest") {
    return copy.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  if (sort === "popular") {
    return copy.sort((a, b) => b.likes - a.likes);
  }
  // trending: weighted engagement score
  return copy.sort(
    (a, b) =>
      b.likes * 2 + b.shares * 3 + b.views * 0.05 - (a.likes * 2 + a.shares * 3 + a.views * 0.05)
  );
}
