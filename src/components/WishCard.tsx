import { CopyButton } from "@/components/CopyButton";
import { ShareMenu } from "@/components/ShareMenu";
import { siteConfig } from "@/lib/site";

export function WishCard({ text }: { text: string }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4 shadow-sm">
      <p className="text-[15px] leading-relaxed">{text}</p>
      <div className="flex items-center gap-2 border-t border-border pt-3">
        <CopyButton text={text} successMessage="✓ Wish copied!" />
        <ShareMenu title={`${siteConfig.name} Wish`} text={text} url={siteConfig.url} showWhatsapp />
      </div>
    </div>
  );
}
