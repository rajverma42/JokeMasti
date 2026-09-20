import Image from "next/image";
import Link from "next/link";
import type { Meme } from "@/types/content";
import { LikeButton } from "@/components/LikeButton";
import { BookmarkButton } from "@/components/BookmarkButton";
import { ShareMenu } from "@/components/ShareMenu";
import { MemeImageActions } from "@/components/MemeImageActions";
import { siteConfig } from "@/lib/site";

export function MemeCard({ meme, priority = false }: { meme: Meme; priority?: boolean }) {
  const url = `${siteConfig.url}/meme/${meme.slug}`;

  return (
    <article className="group flex break-inside-avoid flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-sm transition-shadow hover:shadow-md">
      <Link href={`/meme/${meme.slug}`} className="relative block overflow-hidden bg-surface-muted">
        <Image
          src={meme.thumbnail}
          alt={meme.title}
          width={360}
          height={450}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="h-auto w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          priority={priority}
        />
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-3.5">
        <Link href={`/meme/${meme.slug}`}>
          <h3 className="text-sm font-semibold leading-snug group-hover:text-brand-600 sm:text-base">
            {meme.title}
          </h3>
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-1.5">
            <LikeButton id={meme.id} type="meme" baseLikes={meme.likes} />
            <BookmarkButton slug={meme.slug} type="meme" />
          </div>
          <div className="flex items-center gap-1.5">
            <MemeImageActions image={meme.image} category={meme.category} id={meme.id} />
            <ShareMenu title={meme.title} text={meme.description} url={url} />
          </div>
        </div>
      </div>
    </article>
  );
}
