import type { Metadata } from "next";
import { getAllJokes } from "@/data/jokes";
import { JokesListingSection } from "@/components/JokesListingSection";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { AdSlot } from "@/components/AdSlot";
import { buildMetadata } from "@/lib/seo";
import type { SortOption } from "@/components/SortLinks";

export const metadata: Metadata = buildMetadata({
  title: "Hindi Jokes, Funny Jokes & More",
  description:
    "Browse the full JokeMasti jokes collection — Hindi, Hinglish and English jokes across Funny, Desi, WhatsApp, Love, Family, School, Office, Friendship and Clean categories.",
  path: "/jokes",
});

function parseSort(value: string | string[] | undefined): SortOption {
  return value === "latest" || value === "popular" ? value : "trending";
}

export default async function JokesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const sort = parseSort(params.sort);
  const jokes = getAllJokes();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Breadcrumbs items={[{ name: "Jokes", path: "/jokes" }]} />
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Jokes</h1>
      <p className="mt-2 max-w-2xl text-foreground-muted">
        Hindi, Hinglish aur English jokes — sabse latest, popular aur trending, sab ek jagah.
      </p>

      <AdSlot label="Category Top" className="my-6" minHeight={100} />

      <div className="mt-6">
        <JokesListingSection jokes={jokes} sort={sort} basePath="/jokes" />
      </div>

      <AdSlot label="Category Bottom" className="my-8" minHeight={100} />
    </div>
  );
}
