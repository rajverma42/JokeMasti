export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(n);
}

export function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

/** Deterministic pick from an array based on the calendar day, so "of the
 * day" content is stable for everyone on a given date and changes once a
 * day — no client-side randomness, no fake live counters. */
export function pickOfTheDay<T>(items: T[], seedOffset = 0): T {
  const day = Math.floor(Date.now() / 86_400_000) + seedOffset;
  const index = ((day % items.length) + items.length) % items.length;
  return items[index];
}

export function buildMemeFilename(category: string, id: string, ext = "webp"): string {
  const num = id.replace(/\D/g, "").padStart(3, "0");
  return `funny-${category}-meme-${num}.${ext}`;
}

export function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trimEnd()}…`;
}
