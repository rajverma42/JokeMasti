import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllMemes, getMemeBySlug, getMemesByCategory } from "@/data/memes";
import { getMemeCategory } from "@/data/categories";
import { ShareMenu } from "@/components/ShareMenu";
import { BookmarkButton } from "@/components/BookmarkButton";
import { LikeButton } from "@/components/LikeButton";
import { MemeImageActions } from "@/components/MemeImageActions";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { AdSlot } from "@/components/AdSlot";
import { JsonLd } from "@/components/JsonLd";
import { MemeCard } from "@/components/MemeCard";
import { buildMetadata, imageObjectJsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import { formatDate } from "@/lib/utils";

export function generateStaticParams() {
  return getAllMemes().map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const meme = getMemeBySlug(slug);
  if (!meme) return {};
  return buildMetadata({
    title: meme.title,
    description: meme.description,
    path: `/meme/${meme.slug}`,
    image: meme.image,
  });
}

export default async function MemeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const meme = getMemeBySlug(slug);
  if (!meme) notFound();

  const category = getMemeCategory(meme.category);
  const url = `${siteConfig.url}/meme/${meme.slug}`;
  const categoryMemes = getMemesByCategory(meme.category);
  const related = categoryMemes.filter((m) => m.slug !== meme.slug).slice(0, 4);

  const allMemes = getAllMemes();
  const currentIndex = allMemes.findIndex((m) => m.slug === meme.slug);
  const prev = allMemes[(currentIndex - 1 + allMemes.length) % allMemes.length];
  const next = allMemes[(currentIndex + 1) % allMemes.length];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <JsonLd
        data={imageObjectJsonLd({
          name: meme.title,
          description: meme.description,
          contentUrl: `${siteConfig.url}${meme.image}`,
          path: `/meme/${meme.slug}`,
          datePublished: meme.createdAt,
          width: meme.width,
          height: meme.height,
        })}
      />
      <Breadcrumbs
        items={[
          { name: "Memes", path: "/memes" },
          { name: category?.name || meme.category, path: `/memes/${meme.category}` },
          { name: meme.title, path: `/meme/${meme.slug}` },
        ]}
      />

      <article className="overflow-hidden rounded-3xl border border-border bg-surface shadow-sm">
        <div className="relative bg-surface-muted">
          <Image
            src={meme.image}
            alt={meme.title}
            width={meme.width}
            height={meme.height}
            sizes="(max-width: 768px) 100vw, 700px"
            className="mx-auto h-auto w-full max-w-xl"
            priority
          />
        </div>
        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <Link
              href={`/memes/${meme.category}`}
              className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 font-semibold text-brand-600"
            >
              <span aria-hidden="true">{category?.emoji}</span> {category?.name}
            </Link>
            <span className="text-foreground-muted">{formatDate(meme.createdAt)}</span>
          </div>
          <h1 className="mt-3 text-2xl font-extrabold leading-snug sm:text-3xl">{meme.title}</h1>
          <p className="mt-2 text-foreground-muted">{meme.description}</p>

          {meme.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {meme.tags.map((tag) => (
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
              <LikeButton id={meme.id} type="meme" baseLikes={meme.likes} size="md" />
              <BookmarkButton slug={meme.slug} type="meme" size="md" />
            </div>
            <div className="flex items-center gap-2">
              <MemeImageActions image={meme.image} category={meme.category} id={meme.id} size="md" />
              <ShareMenu title={meme.title} text={meme.description} url={url} size="md" />
            </div>
          </div>
        </div>
      </article>

      <nav aria-label="Meme navigation" className="mt-4 flex items-center justify-between gap-3">
        <Link
          href={`/meme/${prev.slug}`}
          className="flex-1 rounded-2xl border border-border bg-surface px-4 py-3 text-sm hover:border-brand-500/40"
        >
          <span className="block text-xs text-foreground-muted">← Previous</span>
          <span className="block truncate font-medium">{prev.title}</span>
        </Link>
        <Link
          href={`/meme/${next.slug}`}
          className="flex-1 rounded-2xl border border-border bg-surface px-4 py-3 text-right text-sm hover:border-brand-500/40"
        >
          <span className="block text-xs text-foreground-muted">Next →</span>
          <span className="block truncate font-medium">{next.title}</span>
        </Link>
      </nav>

      <AdSlot label="After Content" className="my-8" minHeight={100} />

      {related.length > 0 && (
        <section aria-labelledby="related-heading" className="mt-4">
          <h2 id="related-heading" className="mb-4 text-xl font-bold">
            Related {category?.name}
          </h2>
          <div className="columns-2 gap-4 sm:columns-3">
            {related.map((m) => (
              <div key={m.id} className="mb-4 break-inside-avoid">
                <MemeCard meme={m} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
