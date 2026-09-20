import Link from "next/link";
import type { Joke } from "@/types/content";
import { CopyButton } from "@/components/CopyButton";
import { ShareMenu } from "@/components/ShareMenu";
import { siteConfig } from "@/lib/site";

export function JokeOfDay({ joke }: { joke: Joke }) {
  const url = `${siteConfig.url}/joke/${joke.slug}`;

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-500 via-pink-500 to-accent-500 p-6 text-white shadow-lg sm:p-8">
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute -bottom-14 -left-8 h-40 w-40 rounded-full bg-white/10" />
      <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-semibold">
        😂 Joke of the Day
      </p>
      <Link href={`/joke/${joke.slug}`}>
        <h2 className="text-xl font-bold leading-snug sm:text-2xl">{joke.title}</h2>
        <p className="mt-2 whitespace-pre-line text-base leading-relaxed text-white/90 sm:text-lg">
          {joke.text}
        </p>
      </Link>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <CopyButton
          text={`${joke.text}\n\n— ${siteConfig.name} (${url})`}
          variant="inverted"
        />
        <ShareMenu title={joke.title} text={joke.text} url={url} />
        <Link
          href={`/joke/${joke.slug}`}
          className="ml-auto text-sm font-semibold underline-offset-4 hover:underline"
        >
          Read more →
        </Link>
      </div>
    </section>
  );
}
