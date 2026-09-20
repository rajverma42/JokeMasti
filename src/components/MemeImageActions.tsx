"use client";

import { copyImageToClipboard, downloadImage, supportsClipboardImage } from "@/lib/share";
import { showToast } from "@/lib/toast";
import { buildMemeFilename, cn } from "@/lib/utils";

interface MemeImageActionsProps {
  image: string;
  category: string;
  id: string;
  size?: "sm" | "md";
}

export function MemeImageActions({ image, category, id, size = "sm" }: MemeImageActionsProps) {
  const filename = buildMemeFilename(category, id);

  function handleDownload() {
    downloadImage(image, filename);
    showToast("✓ Meme downloading...");
  }

  async function handleCopyImage() {
    if (!supportsClipboardImage()) {
      handleDownload();
      showToast("Copy not supported here — downloaded instead");
      return;
    }
    const ok = await copyImageToClipboard(image);
    if (ok) {
      showToast("✓ Image copied!");
    } else {
      handleDownload();
      showToast("Copy failed — downloaded instead");
    }
  }

  const btnClass = cn(
    "inline-flex items-center justify-center rounded-full border border-border bg-surface transition-colors hover:text-brand-500",
    size === "sm" ? "h-9 w-9 text-base" : "h-11 w-11 text-lg"
  );

  return (
    <div className="flex items-center gap-2">
      <button type="button" onClick={handleCopyImage} aria-label="Copy image" title="Copy image" className={btnClass}>
        <span aria-hidden="true">🖼️</span>
      </button>
      <button type="button" onClick={handleDownload} aria-label="Download image" title="Download image" className={btnClass}>
        <span aria-hidden="true">⬇️</span>
      </button>
    </div>
  );
}
