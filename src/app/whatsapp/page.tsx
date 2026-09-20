import type { Metadata } from "next";
import { getWhatsappJokes } from "@/data/jokes";
import { getFunnyImages } from "@/data/memes";
import { getWhatsappContentByType } from "@/data/whatsappContent";
import { JokeCard } from "@/components/JokeCard";
import { MemeGrid } from "@/components/MemeGrid";
import { WhatsappItemCard } from "@/components/WhatsappItemCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { AdSlot } from "@/components/AdSlot";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "WhatsApp Jokes, Status & Shayari",
  description:
    "WhatsApp jokes, funny status, good morning/night wishes, friendship status aur shayari — ek tap mein WhatsApp pe share karo.",
  path: "/whatsapp",
});

const SECTION_ANCHORS = [
  { id: "jokes", label: "WhatsApp Jokes" },
  { id: "status", label: "WhatsApp Status" },
  { id: "funny-status", label: "Funny Status" },
  { id: "funny-images", label: "Funny Images" },
  { id: "good-morning", label: "Good Morning" },
  { id: "good-night", label: "Good Night" },
  { id: "friendship-status", label: "Friendship Status" },
  { id: "shayari", label: "Funny Shayari" },
];

export default function WhatsappPage() {
  const jokes = getWhatsappJokes();
  const funnyImages = getFunnyImages();
  const status = getWhatsappContentByType("status");
  const funnyStatus = getWhatsappContentByType("funny-status");
  const goodMorning = getWhatsappContentByType("good-morning");
  const goodNight = getWhatsappContentByType("good-night");
  const friendshipStatus = getWhatsappContentByType("friendship-status");
  const shayari = getWhatsappContentByType("shayari");

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <Breadcrumbs items={[{ name: "WhatsApp", path: "/whatsapp" }]} />
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">💬 WhatsApp Corner</h1>
      <p className="mt-2 max-w-2xl text-foreground-muted">
        Jokes, status, shayari aur funny images — sabke liye ek prominent &ldquo;Share on WhatsApp&rdquo; button.
      </p>

      <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar">
        {SECTION_ANCHORS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="shrink-0 rounded-full border border-border bg-surface px-3 py-1.5 text-sm font-medium text-foreground-muted hover:text-brand-600"
          >
            {s.label}
          </a>
        ))}
      </div>

      <AdSlot label="WhatsApp Top" className="my-6" minHeight={100} />

      <section id="jokes" className="scroll-mt-24 pt-4">
        <h2 className="mb-4 text-xl font-bold">😂 WhatsApp Jokes</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {jokes.slice(0, 6).map((j) => (
            <JokeCard key={j.id} joke={j} />
          ))}
        </div>
      </section>

      <section id="status" className="scroll-mt-24 pt-10">
        <h2 className="mb-4 text-xl font-bold">💬 WhatsApp Status</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {status.map((s) => (
            <WhatsappItemCard key={s.id} text={s.text} />
          ))}
        </div>
      </section>

      <section id="funny-status" className="scroll-mt-24 pt-10">
        <h2 className="mb-4 text-xl font-bold">😜 Funny Status</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {funnyStatus.map((s) => (
            <WhatsappItemCard key={s.id} text={s.text} />
          ))}
        </div>
      </section>

      <AdSlot label="WhatsApp Mid" className="my-8" minHeight={100} />

      <section id="funny-images" className="scroll-mt-24 pt-4">
        <h2 className="mb-4 text-xl font-bold">🖼️ Funny Images</h2>
        <MemeGrid memes={funnyImages} />
      </section>

      <section id="good-morning" className="scroll-mt-24 pt-10">
        <h2 className="mb-4 text-xl font-bold">☀️ Good Morning Funny</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {goodMorning.map((s) => (
            <WhatsappItemCard key={s.id} text={s.text} />
          ))}
        </div>
      </section>

      <section id="good-night" className="scroll-mt-24 pt-10">
        <h2 className="mb-4 text-xl font-bold">🌙 Good Night Funny</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {goodNight.map((s) => (
            <WhatsappItemCard key={s.id} text={s.text} />
          ))}
        </div>
      </section>

      <section id="friendship-status" className="scroll-mt-24 pt-10">
        <h2 className="mb-4 text-xl font-bold">🤝 Friendship Status</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {friendshipStatus.map((s) => (
            <WhatsappItemCard key={s.id} text={s.text} />
          ))}
        </div>
      </section>

      <section id="shayari" className="scroll-mt-24 pt-10">
        <h2 className="mb-4 text-xl font-bold">✍️ Funny Shayari</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {shayari.map((s) => (
            <WhatsappItemCard key={s.id} text={s.text} />
          ))}
        </div>
      </section>

      <AdSlot label="WhatsApp Bottom" className="my-8" minHeight={100} />
    </div>
  );
}
