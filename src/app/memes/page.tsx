import type { Metadata } from "next";
import { getAllMemes } from "@/data/memes";
import { MemesListingSection } from "@/components/MemesListingSection";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { AdSlot } from "@/components/AdSlot";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Funny Memes, Desi Memes & Trending Memes",
  description:
    "Browse the full JokeMasti meme gallery — Animal Memes, Desi Memes, Trending Memes aur Festival Memes. Download, share aur copy in one tap.",
  path: "/memes",
});

export default function MemesPage() {
  const memes = getAllMemes();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Breadcrumbs items={[{ name: "Memes", path: "/memes" }]} />
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Memes</h1>
      <p className="mt-2 max-w-2xl text-foreground-muted">
        Desi, animal, trending aur festival memes — sab download aur share karne layak.
      </p>

      <AdSlot label="Category Top" className="my-6" minHeight={100} />

      <div className="mt-6">
        <MemesListingSection memes={memes} />
      </div>

      <AdSlot label="Category Bottom" className="my-8" minHeight={100} />
    </div>
  );
}
