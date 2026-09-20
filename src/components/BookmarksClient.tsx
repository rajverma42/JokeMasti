"use client";

import { useEffect, useState } from "react";
import { getBookmarkedJokes, getBookmarkedMemes } from "@/lib/storage";
import { getAllJokes } from "@/data/jokes";
import { getAllMemes } from "@/data/memes";
import { JokeCard } from "@/components/JokeCard";
import { MemeGrid } from "@/components/MemeGrid";
import Link from "next/link";

export function BookmarksClient() {
  const [jokeSlugs, setJokeSlugs] = useState<string[] | null>(null);
  const [memeSlugs, setMemeSlugs] = useState<string[] | null>(null);

  useEffect(() => {
    function refresh() {
      setJokeSlugs(getBookmarkedJokes());
      setMemeSlugs(getBookmarkedMemes());
    }
    refresh();
    window.addEventListener("jm:bookmarks-changed", refresh);
    return () => window.removeEventListener("jm:bookmarks-changed", refresh);
  }, []);

  if (jokeSlugs === null || memeSlugs === null) {
    return <p className="text-foreground-muted">Loading your bookmarks…</p>;
  }

  const allJokes = getAllJokes();
  const allMemes = getAllMemes();
  const jokes = jokeSlugs.map((s) => allJokes.find((j) => j.slug === s)).filter((j) => !!j);
  const memes = memeSlugs.map((s) => allMemes.find((m) => m.slug === s)).filter((m) => !!m);

  if (jokes.length === 0 && memes.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-10 text-center text-foreground-muted">
        <p className="text-3xl">🔖</p>
        <p className="mt-2 font-semibold">Abhi koi bookmark nahi hai</p>
        <p className="mt-1 text-sm">
          Jokes aur memes pe bookmark icon 📑 tap karo, wo yahan save ho jaayenge — no login zaroori nahi.
        </p>
        <div className="mt-4 flex justify-center gap-3">
          <Link href="/jokes" className="rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white">
            Browse Jokes
          </Link>
          <Link href="/memes" className="rounded-full border border-border px-4 py-2 text-sm font-semibold">
            Browse Memes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      {jokes.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-bold">😂 Saved Jokes ({jokes.length})</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {jokes.map((j) => (
              <JokeCard key={j.id} joke={j} />
            ))}
          </div>
        </section>
      )}
      {memes.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-bold">🖼️ Saved Memes ({memes.length})</h2>
          <MemeGrid memes={memes} />
        </section>
      )}
    </div>
  );
}
