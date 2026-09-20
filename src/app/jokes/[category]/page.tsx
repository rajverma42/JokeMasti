import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getJokeCategory, jokeCategories } from "@/data/categories";
import { getJokesByCategory } from "@/data/jokes";
import { JokesListingSection } from "@/components/JokesListingSection";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { AdSlot } from "@/components/AdSlot";
import { buildMetadata } from "@/lib/seo";
import type { SortOption } from "@/components/SortLinks";

export function generateStaticParams() {
  return jokeCategories.map((c) => ({ category: c.slug }));
}

function parseSort(value: string | string[] | undefined): SortOption {
  return value === "latest" || value === "popular" ? value : "trending";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const cat = getJokeCategory(category);
  if (!cat) return {};
  return buildMetadata({
    title: `${cat.name} — Best ${cat.name} Collection`,
    description: `${cat.description} Copy, share aur WhatsApp pe bhejo JokeMasti ke ${cat.name}.`,
    path: `/jokes/${cat.slug}`,
  });
}

export default async function JokeCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { category } = await params;
  const cat = getJokeCategory(category);
  if (!cat) notFound();

  const sp = await searchParams;
  const sort = parseSort(sp.sort);
  const jokes = getJokesByCategory(category);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Breadcrumbs items={[{ name: "Jokes", path: "/jokes" }, { name: cat.name, path: `/jokes/${cat.slug}` }]} />
      <h1 className="flex items-center gap-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
        <span aria-hidden="true">{cat.emoji}</span> {cat.name}
      </h1>
      <p className="mt-2 max-w-2xl text-foreground-muted">{cat.description}</p>

      <AdSlot label="Category Top" className="my-6" minHeight={100} />

      <div className="mt-6">
        <JokesListingSection
          jokes={jokes}
          activeCategory={cat.slug}
          sort={sort}
          basePath={`/jokes/${cat.slug}`}
        />
      </div>

      <AdSlot label="Category Bottom" className="my-8" minHeight={100} />
    </div>
  );
}
