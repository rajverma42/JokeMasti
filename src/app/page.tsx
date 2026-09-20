import Link from "next/link";
import { allCategories } from "@/data/categories";
import { getFeaturedJokes, getAllJokes } from "@/data/jokes";
import { getFeaturedMemes, getAllMemes } from "@/data/memes";
import { festivals } from "@/data/festivals";
import { CategoryCard } from "@/components/CategoryCard";
import { JokeOfDay } from "@/components/JokeOfDay";
import { MemeOfDay } from "@/components/MemeOfDay";
import { JokeCard } from "@/components/JokeCard";
import { MemeCard } from "@/components/MemeCard";
import { SearchBar } from "@/components/SearchBar";
import { AdSlot } from "@/components/AdSlot";
import { trendingKeywords } from "@/lib/search";
import { pickOfTheDay } from "@/lib/utils";
import { sortJokesOrMemes } from "@/lib/sort";

export default function Home() {
  const jokeOfDay = pickOfTheDay(getFeaturedJokes(), 0);
  const memeOfDay = pickOfTheDay(getFeaturedMemes(), 7);

  const trendingJokes = sortJokesOrMemes(getAllJokes(), "trending").slice(0, 3);
  const trendingMemes = sortJokesOrMemes(getAllMemes(), "trending").slice(0, 4);
  const upcomingFestivals = festivals.slice(0, 6);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-background">
        <div className="mx-auto max-w-5xl px-4 py-12 text-center sm:px-6 sm:py-16">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
            Aaj Kuch Funny Ho Jaye! 😄
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-base text-foreground-muted sm:text-lg">
            Best Hindi Jokes, Memes aur Funny Images — Har Din Naya Entertainment.
          </p>
          <div className="mx-auto mt-6 max-w-xl">
            <SearchBar variant="hero" placeholder="Search Jokes & Memes" />
          </div>
          <div className="mx-auto mt-4 flex max-w-2xl flex-wrap justify-center gap-2">
            {trendingKeywords.slice(0, 5).map((kw) => (
              <Link
                key={kw}
                href={`/search?q=${encodeURIComponent(kw)}`}
                className="rounded-full border border-border bg-surface px-3 py-1 text-xs font-medium text-foreground-muted hover:text-brand-600"
              >
                🔥 {kw}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <AdSlot label="Top Banner" className="my-6" minHeight={100} />

        {/* Categories */}
        <section aria-labelledby="categories-heading" className="mt-2">
          <h2 id="categories-heading" className="mb-4 text-xl font-bold sm:text-2xl">
            Browse Categories
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
            {allCategories.map((cat) => (
              <CategoryCard key={`${cat.type}-${cat.slug}`} category={cat} />
            ))}
          </div>
        </section>

        {/* Of the day */}
        <section aria-labelledby="of-the-day-heading" className="mt-12">
          <h2 id="of-the-day-heading" className="sr-only">
            Joke and Meme of the Day
          </h2>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <JokeOfDay joke={jokeOfDay} />
            <MemeOfDay meme={memeOfDay} />
          </div>
        </section>

        <AdSlot label="Mid Content" className="my-10" minHeight={100} />

        {/* Trending preview */}
        <section aria-labelledby="trending-heading" className="mt-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 id="trending-heading" className="text-xl font-bold sm:text-2xl">
              🔥 Trending Now
            </h2>
            <Link href="/trending" className="text-sm font-semibold text-brand-600 hover:underline">
              See all →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {trendingJokes.map((joke) => (
              <JokeCard key={joke.id} joke={joke} />
            ))}
          </div>
          <div className="mt-4 columns-2 gap-4 sm:columns-2 md:columns-4">
            {trendingMemes.map((meme, i) => (
              <div key={meme.id} className="mb-4 break-inside-avoid">
                <MemeCard meme={meme} priority={i < 2} />
              </div>
            ))}
          </div>
        </section>

        {/* Festival preview */}
        <section aria-labelledby="festival-heading" className="mt-12">
          <div className="mb-4 flex items-center justify-between">
            <h2 id="festival-heading" className="text-xl font-bold sm:text-2xl">
              🎉 Festival Special
            </h2>
            <Link href="/festival" className="text-sm font-semibold text-brand-600 hover:underline">
              See all →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
            {upcomingFestivals.map((f) => (
              <Link
                key={f.slug}
                href={`/festival/${f.slug}`}
                className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-surface p-4 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <span aria-hidden="true" className="text-3xl">{f.emoji}</span>
                <span className="text-sm font-semibold">{f.name}</span>
              </Link>
            ))}
          </div>
        </section>

        <AdSlot label="Lower Content" className="my-10" minHeight={100} />

        {/* WhatsApp CTA */}
        <section className="mb-12 flex flex-col items-center gap-3 rounded-3xl bg-[#25D366]/10 p-8 text-center">
          <span aria-hidden="true" className="text-4xl">💬</span>
          <h2 className="text-xl font-bold sm:text-2xl">WhatsApp Status &amp; Shayari</h2>
          <p className="max-w-lg text-foreground-muted">
            Funny status, good morning/night wishes aur shayari — ek tap mein WhatsApp pe share karo.
          </p>
          <Link
            href="/whatsapp"
            className="mt-2 rounded-full bg-[#25D366] px-6 py-3 font-semibold text-white shadow-sm transition-transform hover:scale-105"
          >
            Explore WhatsApp Section →
          </Link>
        </section>
      </div>
    </div>
  );
}
