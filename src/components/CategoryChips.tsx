import Link from "next/link";
import type { Category } from "@/types/content";

export function CategoryChips({
  categories,
  active,
  allHref,
}: {
  categories: Category[];
  active?: string;
  allHref: string;
}) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
      <Link
        href={allHref}
        className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
          !active
            ? "bg-foreground text-background"
            : "border border-border bg-surface text-foreground-muted hover:text-foreground"
        }`}
      >
        All
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat.slug}
          href={cat.href}
          className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
            active === cat.slug
              ? "bg-foreground text-background"
              : "border border-border bg-surface text-foreground-muted hover:text-foreground"
          }`}
        >
          <span aria-hidden="true">{cat.emoji}</span> {cat.name}
        </Link>
      ))}
    </div>
  );
}
