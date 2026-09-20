import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-6xl">🕵️‍♂️😂</p>
      <h1 className="mt-4 text-2xl font-extrabold sm:text-3xl">
        Oops! Ye page toh gayab ho gaya 😂
      </h1>
      <p className="mt-3 text-foreground-muted">
        Lagta hai ye joke bhi kahin chhup gaya hai. Chinta mat karo, hum aapke liye bohot saare aur jokes
        aur memes laaye hain.
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-full bg-brand-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-600"
        >
          🏠 Go Home
        </Link>
        <Link
          href="/jokes"
          className="rounded-full border border-border bg-surface px-5 py-3 text-sm font-semibold transition-colors hover:bg-surface-muted"
        >
          😂 Browse Jokes
        </Link>
        <Link
          href="/memes"
          className="rounded-full border border-border bg-surface px-5 py-3 text-sm font-semibold transition-colors hover:bg-surface-muted"
        >
          🖼️ Browse Memes
        </Link>
      </div>
    </div>
  );
}
