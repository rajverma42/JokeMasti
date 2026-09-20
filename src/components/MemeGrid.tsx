import type { Meme } from "@/types/content";
import { MemeCard } from "@/components/MemeCard";

export function MemeGrid({ memes }: { memes: Meme[] }) {
  if (memes.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-border p-8 text-center text-foreground-muted">
        Koi meme nahi mila. Kisi aur category try karo!
      </p>
    );
  }

  return (
    <div className="columns-2 gap-4 [column-fill:_balance] sm:columns-2 md:columns-3 lg:columns-4">
      {memes.map((meme, i) => (
        <div key={meme.id} className="mb-4">
          <MemeCard meme={meme} priority={i < 4} />
        </div>
      ))}
    </div>
  );
}
