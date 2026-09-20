import { CopyButton } from "@/components/CopyButton";

export function WhatsappItemCard({ text }: { text: string }) {
  const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4 shadow-sm">
      <p className="whitespace-pre-line text-[15px] leading-relaxed">{text}</p>
      <div className="flex items-center gap-2 border-t border-border pt-3">
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-transform hover:scale-[1.03]"
        >
          <span aria-hidden="true">📱</span> Share on WhatsApp
        </a>
        <CopyButton text={text} successMessage="✓ Copied!" />
      </div>
    </div>
  );
}
