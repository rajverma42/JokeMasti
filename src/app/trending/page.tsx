import type { Metadata } from "next";
import { getAllJokes } from "@/data/jokes";
import { getAllMemes } from "@/data/memes";
import { jokeCategories, memeCategories } from "@/data/categories";
import { RankRow } from "@/components/RankRow";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { AdSlot } from "@/components/AdSlot";
import { buildMetadata } from "@/lib/seo";
import { sortJokesOrMemes } from "@/lib/sort";
import type { Joke, Meme } from "@/types/content";

export const metadata: Metadata = buildMetadata({
  title: "Trending Jokes & Memes Today",
  description:
    "Sabse trending Hindi jokes aur memes — most shared, most downloaded, most liked aur aaj ke popular jokes/memes, ek hi jagah.",
  path: "/trending",
});

function jokeEmoji(category: string) {
  return jokeCategories.find((c) => c.slug === category)?.emoji;
}
function memeEmoji(category: string) {
  return memeCategories.find((c) => c.slug === category)?.emoji;
}

function JokeRankSection({ title, emoji, items }: { title: string; emoji: string; items: (Joke & { statValue: number; statLabel: string })[] }) {
  return (
    <section className="mt-10">
      <h2 className="mb-4 text-xl font-bold">
        <span aria-hidden="true">{emoji}</span> {title}
      </h2>
      <div className="flex flex-col gap-2.5">
        {items.map((j, i) => (
          <RankRow
            key={j.id}
            rank={i + 1}
            href={`/joke/${j.slug}`}
            title={j.title}
            subtitle={j.text.replace(/\n/g, " ")}
            emoji={jokeEmoji(j.category)}
            statLabel={j.statLabel}
            statValue={j.statValue}
          />
        ))}
      </div>
    </section>
  );
}

function MemeRankSection({ title, emoji, items }: { title: string; emoji: string; items: (Meme & { statValue: number; statLabel: string })[] }) {
  return (
    <section className="mt-10">
      <h2 className="mb-4 text-xl font-bold">
        <span aria-hidden="true">{emoji}</span> {title}
      </h2>
      <div className="flex flex-col gap-2.5">
        {items.map((m, i) => (
          <RankRow
            key={m.id}
            rank={i + 1}
            href={`/meme/${m.slug}`}
            title={m.title}
            subtitle={m.description}
            image={m.thumbnail}
            emoji={memeEmoji(m.category)}
            statLabel={m.statLabel}
            statValue={m.statValue}
          />
        ))}
      </div>
    </section>
  );
}

export default function TrendingPage() {
  const jokes = getAllJokes();
  const memes = getAllMemes();

  const trendingJokes = sortJokesOrMemes(jokes, "trending")
    .slice(0, 5)
    .map((j) => ({ ...j, statValue: j.likes, statLabel: "likes" }));
  const trendingMemes = sortJokesOrMemes(memes, "trending")
    .slice(0, 5)
    .map((m) => ({ ...m, statValue: m.likes, statLabel: "likes" }));

  const mostSharedJokes = [...jokes]
    .sort((a, b) => b.shares - a.shares)
    .slice(0, 5)
    .map((j) => ({ ...j, statValue: j.shares, statLabel: "shares" }));

  const mostDownloadedMemes = [...memes]
    .sort((a, b) => b.downloads - a.downloads)
    .slice(0, 5)
    .map((m) => ({ ...m, statValue: m.downloads, statLabel: "downloads" }));

  const mostLikedJokes = [...jokes]
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 5)
    .map((j) => ({ ...j, statValue: j.likes, statLabel: "likes" }));

  const todaysPopularMemes = [...memes]
    .sort((a, b) => b.views - a.views)
    .slice(0, 5)
    .map((m) => ({ ...m, statValue: m.views, statLabel: "views" }));

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Breadcrumbs items={[{ name: "Trending", path: "/trending" }]} />
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">🔥 Trending</h1>
      <p className="mt-2 max-w-2xl text-foreground-muted">
        Abhi sabse zyada like, share aur download ho rahe jokes aur memes.
      </p>

      <AdSlot label="Trending Top" className="my-6" minHeight={100} />

      <JokeRankSection title="Trending Jokes" emoji="😂" items={trendingJokes} />
      <MemeRankSection title="Trending Memes" emoji="🖼️" items={trendingMemes} />
      <JokeRankSection title="Most Shared" emoji="📤" items={mostSharedJokes} />
      <MemeRankSection title="Most Downloaded" emoji="⬇️" items={mostDownloadedMemes} />
      <JokeRankSection title="Most Liked" emoji="❤️" items={mostLikedJokes} />
      <MemeRankSection title="Today's Popular" emoji="⭐" items={todaysPopularMemes} />

      <AdSlot label="Trending Bottom" className="my-8" minHeight={100} />
    </div>
  );
}
