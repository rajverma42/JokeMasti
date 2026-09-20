import Image from "next/image";
import Link from "next/link";
import { formatCount } from "@/lib/utils";

interface RankRowProps {
  rank: number;
  href: string;
  title: string;
  subtitle?: string;
  image?: string;
  statLabel: string;
  statValue: number;
  emoji?: string;
}

const RANK_COLORS: Record<number, string> = {
  1: "bg-amber-400 text-amber-950",
  2: "bg-zinc-300 text-zinc-800",
  3: "bg-amber-700 text-amber-50",
};

export function RankRow({ rank, href, title, subtitle, image, statLabel, statValue, emoji }: RankRowProps) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-2xl border border-border bg-surface p-3 shadow-sm transition-shadow hover:shadow-md sm:p-4"
    >
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-extrabold ${
          RANK_COLORS[rank] || "bg-surface-muted text-foreground-muted"
        }`}
      >
        {rank}
      </span>
      {image ? (
        <Image src={image} alt="" width={48} height={60} className="h-12 w-10 shrink-0 rounded-lg object-cover" />
      ) : (
        <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-lg">
          {emoji || "😂"}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block truncate font-semibold">{title}</span>
        {subtitle && <span className="block truncate text-sm text-foreground-muted">{subtitle}</span>}
      </span>
      <span className="shrink-0 text-right text-sm font-medium text-foreground-muted">
        {formatCount(statValue)}
        <span className="block text-xs">{statLabel}</span>
      </span>
    </Link>
  );
}
