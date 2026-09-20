import type { Metadata } from "next";
import { getFunnyImages } from "@/data/memes";
import { MemeGrid } from "@/components/MemeGrid";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { AdSlot } from "@/components/AdSlot";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Funny Images — Download & Share",
  description:
    "Hand-picked funny images from JokeMasti — perfect for WhatsApp status aur social sharing. Download in one tap.",
  path: "/funny-images",
});

export default function FunnyImagesPage() {
  const images = getFunnyImages();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Breadcrumbs items={[{ name: "Funny Images", path: "/funny-images" }]} />
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">😆 Funny Images</h1>
      <p className="mt-2 max-w-2xl text-foreground-muted">
        Sabse relatable aur shareable funny images — WhatsApp status ke liye perfect.
      </p>

      <AdSlot label="Category Top" className="my-6" minHeight={100} />

      <MemeGrid memes={images} />

      <AdSlot label="Category Bottom" className="my-8" minHeight={100} />
    </div>
  );
}
