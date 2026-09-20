"use client";

import { useEffect, useRef, useState } from "react";
import {
  buildFacebookShareUrl,
  buildTelegramShareUrl,
  buildTwitterShareUrl,
  buildWhatsappShareUrl,
  copyText,
  nativeShare,
  supportsNativeShare,
} from "@/lib/share";
import { showToast } from "@/lib/toast";
import { cn } from "@/lib/utils";

interface ShareMenuProps {
  title: string;
  text?: string;
  url: string;
  /** Show a dedicated, always-visible WhatsApp button (recommended per spec). */
  showWhatsapp?: boolean;
  size?: "sm" | "md";
}

export function ShareMenu({ title, text, url, showWhatsapp = true, size = "sm" }: ShareMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const target = { title, text, url };

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  async function handleShareClick() {
    if (supportsNativeShare()) {
      const ok = await nativeShare(target);
      if (ok) return;
    }
    setOpen((v) => !v);
  }

  async function handleCopyLink() {
    const ok = await copyText(url);
    showToast(ok ? "✓ Link copied!" : "Couldn't copy link");
    setOpen(false);
  }

  const btnBase = cn(
    "inline-flex items-center justify-center rounded-full border border-border bg-surface transition-colors",
    size === "sm" ? "h-9 w-9 text-base" : "h-11 w-11 text-lg"
  );

  return (
    <div className="relative flex items-center gap-2" ref={rootRef}>
      {showWhatsapp && (
        <a
          href={buildWhatsappShareUrl(target)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on WhatsApp"
          title="Share on WhatsApp"
          className={cn(btnBase, "border-transparent bg-[#25D366] text-white hover:brightness-105")}
        >
          <span aria-hidden="true">📱</span>
        </a>
      )}
      <button
        type="button"
        onClick={handleShareClick}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Share"
        title="Share"
        className={cn(btnBase, "hover:text-brand-500")}
      >
        <span aria-hidden="true">🔗</span>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute top-full left-0 z-30 mt-2 w-48 overflow-hidden rounded-xl border border-border bg-surface py-1 shadow-lg"
        >
          <a
            role="menuitem"
            href={buildFacebookShareUrl(target)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-surface-muted"
          >
            <span aria-hidden="true">📘</span> Facebook
          </a>
          <a
            role="menuitem"
            href={buildTwitterShareUrl(target)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-surface-muted"
          >
            <span aria-hidden="true">✖️</span> X (Twitter)
          </a>
          <a
            role="menuitem"
            href={buildTelegramShareUrl(target)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-surface-muted"
          >
            <span aria-hidden="true">✈️</span> Telegram
          </a>
          <button
            role="menuitem"
            type="button"
            onClick={handleCopyLink}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-surface-muted"
          >
            <span aria-hidden="true">🔗</span> Copy Link
          </button>
        </div>
      )}
    </div>
  );
}
