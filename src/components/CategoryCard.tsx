import Link from "next/link";
import type { Category } from "@/types/content";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={category.href}
      className="group flex flex-col items-center gap-2 rounded-2xl border border-border bg-surface p-4 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand-500/30 hover:shadow-md sm:p-5"
    >
      <span
        aria-hidden="true"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-2xl transition-transform group-hover:scale-110 sm:h-14 sm:w-14 sm:text-3xl"
      >
        {category.emoji}
      </span>
      <span className="text-sm font-semibold leading-tight sm:text-base">{category.name}</span>
    </Link>
  );
}
