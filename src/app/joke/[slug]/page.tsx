import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllJokes, getJokeBySlug, getJokesByCategory } from "@/data/jokes";
import { getJokeCategory } from "@/data/categories";
import { CopyButton } from "@/components/CopyButton";
import { ShareMenu } from "@/components/ShareMenu";
import { BookmarkButton } from "@/components/BookmarkButton";
import { LikeButton } from "@/components/LikeButton";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { AdSlot } from "@/components/AdSlot";
import { JsonLd } from "@/components/JsonLd";
import { JokeCard } from "@/components/JokeCard";
import { buildMetadata, articleJsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { formatDate } from "@/lib/utils";

export function generateStaticParams() {
  return getAllJokes().map((j) => ({ slug: j.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const joke = getJokeBySlug(slug);
  if (!joke) return {};
  return buildMetadata({
    title: joke.title,
    description: joke.text.replace(/\n/g, " ").slice(0, 155),
    path: `/joke/${joke.slug}`,
    type: "article",
  });
}

export default async function JokeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const joke = getJokeBySlug(slug);
  if (!joke) notFound();

  const category = getJokeCategory(joke.category);
  const url = `${siteConfig.url}/joke/${joke.slug}`;
  const related = getJokesByCategory(joke.category)
    .filter((j) => j.slug !== joke.slug)
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <JsonLd
        data={articleJsonLd({
          headline: joke.title,
          description: joke.text.replace(/\n/g, " "),
          path: `/joke/${joke.slug}`,
          datePublished: joke.createdAt,
        })}
      />
      <Breadcrumbs
        items={[
          { name: "Jokes", path: "/jokes" },
          { name: category?.name || joke.category, path: `/jokes/${joke.category}` },
          { name: joke.title, path: `/joke/${joke.slug}` },
        ]}
      />

      <article className="rounded-3xl border border-border bg-surface p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <Link
            href={`/jokes/${joke.category}`}
            className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 font-semibold text-brand-600"
          >
            <span aria-hidden="true">{category?.emoji}</span> {category?.name}
          </Link>
          <span className="text-foreground-muted">{formatDate(joke.createdAt)}</span>
        </div>

        <h1 className="mt-4 text-2xl font-extrabold leading-snug sm:text-3xl">{joke.title}</h1>
        <p className="mt-4 whitespace-pre-line text-lg leading-relaxed text-foreground sm:text-xl">
          {joke.text}
        </p>

        {joke.tags.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-1.5">
            {joke.tags.map((tag) => (
              <Link
                key={tag}
                href={`/search?q=${encodeURIComponent(tag)}`}
                className="rounded-full bg-surface-muted px-2.5 py-1 text-xs text-foreground-muted hover:text-brand-600"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
          <div className="flex items-center gap-2">
            <LikeButton id={joke.id} type="joke" baseLikes={joke.likes} size="md" />
            <BookmarkButton slug={joke.slug} type="joke" size="md" />
          </div>
          <div className="flex items-center gap-2">
            <CopyButton text={`${joke.text}\n\n— ${siteConfig.name} (${url})`} />
            <ShareMenu title={joke.title} text={joke.text} url={url} size="md" />
          </div>
        </div>
      </article>

      <AdSlot label="After Content" className="my-8" minHeight={100} />

      {related.length > 0 && (
        <section aria-labelledby="related-heading" className="mt-4">
          <h2 id="related-heading" className="mb-4 text-xl font-bold">
            Related {category?.name}
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {related.map((j) => (
              <JokeCard key={j.id} joke={j} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
