import type { Metadata } from "next";
import Link from "next/link";
import { festivals } from "@/data/festivals";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { AdSlot } from "@/components/AdSlot";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Festival Jokes, Memes & Wishes",
  description:
    "Diwali, Holi, Eid, Christmas, New Year aur har Indian festival ke funny jokes, memes aur shareable wishes — sab ek jagah JokeMasti pe.",
  path: "/festival",
});

export default function FestivalIndexPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Breadcrumbs items={[{ name: "Festivals", path: "/festival" }]} />
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">🎉 Festival Special</h1>
      <p className="mt-2 max-w-2xl text-foreground-muted">
        Har tyohaar ke funny jokes, memes aur shareable wishes — apne favourite festival pe click karo.
      </p>

      <AdSlot label="Festival Top" className="my-6" minHeight={100} />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {festivals.map((f) => (
          <Link
            key={f.slug}
            href={`/festival/${f.slug}`}
            className="group flex flex-col items-center gap-2 rounded-2xl border border-border bg-surface p-5 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:border-brand-500/30 hover:shadow-md"
          >
            <span aria-hidden="true" className="text-3xl transition-transform group-hover:scale-110">
              {f.emoji}
            </span>
            <span className="font-semibold">{f.name}</span>
            <span className="text-xs text-foreground-muted">{f.dateHint}</span>
          </Link>
        ))}
      </div>

      <AdSlot label="Festival Bottom" className="my-8" minHeight={100} />
    </div>
  );
}
