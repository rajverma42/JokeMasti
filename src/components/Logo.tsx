import Link from "next/link";
import { siteConfig } from "@/lib/site";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2 shrink-0" aria-label={`${siteConfig.name} home`}>
      <span
        aria-hidden="true"
        className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 via-pink-500 to-accent-500 text-lg shadow-sm"
      >
        😄
      </span>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="text-lg font-extrabold tracking-tight">{siteConfig.name}</span>
          <span className="hidden text-[11px] font-medium text-foreground-muted sm:block">{siteConfig.tagline}</span>
        </span>
      )}
    </Link>
  );
}
