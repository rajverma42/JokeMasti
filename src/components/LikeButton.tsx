"use client";

import { toggleJokeLike, toggleMemeLike } from "@/lib/storage";
import { useLiked } from "@/lib/hooks";
import { formatCount, cn } from "@/lib/utils";

interface LikeButtonProps {
  id: string;
  type: "joke" | "meme";
  baseLikes: number;
  size?: "sm" | "md";
}

export function LikeButton({ id, type, baseLikes, size = "sm" }: LikeButtonProps) {
  const liked = useLiked(id, type);

  function handleClick() {
    if (type === "joke") toggleJokeLike(id);
    else toggleMemeLike(id);
  }

  const count = baseLikes + (liked ? 1 : 0);

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={liked}
      aria-label={liked ? "Unlike" : "Like"}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border transition-colors",
        size === "sm" ? "px-3 py-1.5 text-sm" : "px-4 py-2 text-base",
        liked
          ? "border-pink-500/40 bg-pink-500/10 text-pink-500"
          : "bg-surface text-foreground-muted hover:text-pink-500"
      )}
    >
      <span aria-hidden="true">{liked ? "❤️" : "🤍"}</span>
      <span>{formatCount(count)}</span>
    </button>
  );
}
