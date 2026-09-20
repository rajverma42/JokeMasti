import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchPageClient } from "@/components/SearchPageClient";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { AdSlot } from "@/components/AdSlot";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Search Jokes & Memes",
  description: "Search Hindi jokes, memes, categories aur tags across JokeMasti.",
  path: "/search",
  noIndex: true,
});

export default function SearchPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <Breadcrumbs items={[{ name: "Search", path: "/search" }]} />
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">🔍 Search</h1>

      <AdSlot label="Search Top" className="my-6" minHeight={100} />

      <Suspense fallback={null}>
        <SearchPageClient />
      </Suspense>

      <AdSlot label="Search Bottom" className="my-8" minHeight={100} />
    </div>
  );
}
