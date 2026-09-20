"use client";

import { useState } from "react";
import { copyText } from "@/lib/share";
import { showToast } from "@/lib/toast";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  text: string;
  label?: string;
  successMessage?: string;
  variant?: "default" | "inverted";
}

export function CopyButton({
  text,
  label = "Copy",
  successMessage = "✓ Joke copied!",
  variant = "default",
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleClick() {
    const ok = await copyText(text);
    if (ok) {
      setCopied(true);
      showToast(successMessage);
      window.setTimeout(() => setCopied(false), 1800);
    } else {
      showToast("Couldn't copy — try again");
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
        variant === "inverted"
          ? "border border-white/30 bg-white/10 text-white hover:bg-white/20"
          : "border border-border bg-surface text-foreground-muted hover:border-brand-500/40 hover:text-brand-600"
      )}
    >
      <span aria-hidden="true">{copied ? "✅" : "📋"}</span>
      {copied ? "Copied!" : label}
    </button>
  );
}
