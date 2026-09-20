import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { festivals, getFestival } from "@/data/festivals";
import { getJokesByFestival } from "@/data/jokes";
import { getMemesByFestival } from "@/data/memes";
import { getWishesByFestival } from "@/data/festivalWishes";
import { JokeCard } from "@/components/JokeCard";
import { MemeGrid } from "@/components/MemeGrid";
import { WishCard } from "@/components/WishCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { AdSlot } from "@/components/AdSlot";
import { buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return festivals.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const festival = getFestival(slug);
  if (!festival) return {};
  return buildMetadata({
    title: `${festival.name} Jokes, Memes & Wishes`,
    description: `${festival.description} Funny ${festival.name} jokes, memes aur shareable wishes — copy aur WhatsApp pe bhejo.`,
    path: `/festival/${festival.slug}`,
  });
}

export default async function FestivalDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const festival = getFestival(slug);
  if (!festival) notFound();

  const jokes = getJokesByFestival(festival.slug);
  const memes = getMemesByFestival(festival.slug);
  const wishes = getWishesByFestival(festival.slug);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <Breadcrumbs items={[{ name: "Festivals", path: "/festival" }, { name: festival.name, path: `/festival/${festival.slug}` }]} />
      <h1 className="flex items-center gap-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
        <span aria-hidden="true">{festival.emoji}</span> {festival.name}
      </h1>
      <p className="mt-2 max-w-2xl text-foreground-muted">{festival.description}</p>

      <AdSlot label="Festival Top" className="my-6" minHeight={100} />

      {wishes.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-4 text-xl font-bold">✨ Funny Wishes</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {wishes.map((w, i) => (
              <WishCard key={i} text={w.text} />
            ))}
          </div>
        </section>
      )}

      {memes.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-bold">🖼️ Shareable {festival.name} Memes</h2>
          <MemeGrid memes={memes} />
        </section>
      )}

      <AdSlot label="Festival Mid" className="my-8" minHeight={100} />

      {jokes.length > 0 && (
        <section className="mt-4">
          <h2 className="mb-4 text-xl font-bold">😂 {festival.name} Jokes</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {jokes.map((j) => (
              <JokeCard key={j.id} joke={j} />
            ))}
          </div>
        </section>
      )}

      {jokes.length === 0 && memes.length === 0 && wishes.length === 0 && (
        <p className="mt-8 rounded-2xl border border-dashed border-border p-8 text-center text-foreground-muted">
          {festival.name} ka content jald hi aa raha hai!
        </p>
      )}

      <AdSlot label="Festival Bottom" className="my-8" minHeight={100} />
    </div>
  );
}
