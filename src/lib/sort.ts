// Plain (non-"use client") module: this utility is called from both server
// components (home, trending pages) and the client-side listing sections,
// so it can't live in a "use client" file (see components/SortLinks.tsx).
export type SortOption = "latest" | "popular" | "trending";

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
