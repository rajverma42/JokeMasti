import Image from "next/image";
import Link from "next/link";
import type { Meme } from "@/types/content";
import { ShareMenu } from "@/components/ShareMenu";
import { MemeImageActions } from "@/components/MemeImageActions";
import { siteConfig, withBasePath } from "@/lib/site";

export function MemeOfDay({ meme }: { meme: Meme }) {
  const url = `${siteConfig.url}/meme/${meme.slug}`;

  return (
    <section className="flex flex-col gap-5 rounded-3xl border border-border bg-surface p-5 shadow-sm sm:flex-row sm:items-center sm:p-6">
      <Link href={`/meme/${meme.slug}`} className="mx-auto w-40 shrink-0 sm:mx-0 sm:w-48">
        <Image
          src={withBasePath(meme.thumbnail)}
          alt={meme.title}
          width={360}
          height={450}
          className="w-full rounded-2xl object-cover shadow"
          priority
        />
      </Link>
      <div className="flex flex-1 flex-col gap-2">
        <p className="inline-flex w-fit items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-600">
          🔥 Meme of the Day
        </p>
        <Link href={`/meme/${meme.slug}`}>
          <h2 className="text-xl font-bold leading-snug sm:text-2xl">{meme.title}</h2>
          <p className="mt-1 text-foreground-muted">{meme.description}</p>
        </Link>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <MemeImageActions image={meme.image} category={meme.category} id={meme.id} size="md" />
          <ShareMenu title={meme.title} text={meme.description} url={url} size="md" />
          <Link href={`/meme/${meme.slug}`} className="ml-auto text-sm font-semibold text-brand-600 hover:underline">
            View meme →
          </Link>
        </div>
      </div>
    </section>
  );
}
