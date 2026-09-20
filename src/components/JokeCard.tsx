import Link from "next/link";
import type { Joke } from "@/types/content";
import { CopyButton } from "@/components/CopyButton";
import { ShareMenu } from "@/components/ShareMenu";
import { BookmarkButton } from "@/components/BookmarkButton";
import { LikeButton } from "@/components/LikeButton";
import { siteConfig } from "@/lib/site";
import { jokeCategories } from "@/data/categories";

export function JokeCard({ joke }: { joke: Joke }) {
  const category = jokeCategories.find((c) => c.slug === joke.category);
  const url = `${siteConfig.url}/joke/${joke.slug}`;

  return (
    <article className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center justify-between gap-2">
        <Link
          href={`/jokes/${joke.category}`}
          className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-600"
        >
          <span aria-hidden="true">{category?.emoji}</span>
          {category?.name}
        </Link>
        <span className="text-xs text-foreground-muted">{joke.language === "hindi" ? "हिंदी" : joke.language === "english" ? "English" : "Hinglish"}</span>
      </div>

      <Link href={`/joke/${joke.slug}`} className="group">
        <h3 className="text-lg font-semibold leading-snug group-hover:text-brand-600">
          {joke.title}
        </h3>
        <p className="mt-1.5 whitespace-pre-line text-[15px] leading-relaxed text-foreground-muted line-clamp-3">
          {joke.text}
        </p>
      </Link>

      {joke.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {joke.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="rounded-full bg-surface-muted px-2 py-0.5 text-xs text-foreground-muted">
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-1 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3">
        <div className="flex items-center gap-2">
          <LikeButton id={joke.id} type="joke" baseLikes={joke.likes} />
          <BookmarkButton slug={joke.slug} type="joke" />
        </div>
        <div className="flex items-center gap-2">
          <CopyButton text={`${joke.text}\n\n— ${siteConfig.name} (${url})`} />
          <ShareMenu title={joke.title} text={joke.text} url={url} />
        </div>
      </div>
    </article>
  );
}
