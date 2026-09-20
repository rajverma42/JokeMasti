"use client";

import { toggleJokeBookmark, toggleMemeBookmark } from "@/lib/storage";
import { useBookmarked } from "@/lib/hooks";
import { showToast } from "@/lib/toast";
import { cn } from "@/lib/utils";

interface BookmarkButtonProps {
  slug: string;
  type: "joke" | "meme";
  size?: "sm" | "md";
}

export function BookmarkButton({ slug, type, size = "sm" }: BookmarkButtonProps) {
  const bookmarked = useBookmarked(slug, type);

  function handleClick() {
    const next = type === "joke" ? toggleJokeBookmark(slug) : toggleMemeBookmark(slug);
    showToast(next ? "✓ Saved to bookmarks" : "Removed from bookmarks");
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={bookmarked}
      aria-label={bookmarked ? "Remove bookmark" : "Save bookmark"}
      title={bookmarked ? "Remove bookmark" : "Save bookmark"}
      className={cn(
        "inline-flex items-center justify-center rounded-full border border-border bg-surface transition-colors hover:text-brand-500",
        size === "sm" ? "h-9 w-9 text-base" : "h-11 w-11 text-lg",
        bookmarked && "border-brand-500/40 bg-brand-50 text-brand-600"
      )}
    >
      <span aria-hidden="true">{bookmarked ? "🔖" : "📑"}</span>
    </button>
  );
}
