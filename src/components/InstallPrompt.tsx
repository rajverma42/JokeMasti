"use client";

import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISSED_KEY = "jm:install-dismissed";

export function InstallPrompt() {
  const [deferredEvent, setDeferredEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handler(e: Event) {
      e.preventDefault();
      try {
        if (localStorage.getItem(DISMISSED_KEY)) return;
      } catch {
        // ignore storage errors, still allow prompt
      }
      setDeferredEvent(e as BeforeInstallPromptEvent);
      setVisible(true);
    }
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (!visible || !deferredEvent) return null;

  async function handleInstall() {
    if (!deferredEvent) return;
    await deferredEvent.prompt();
    setVisible(false);
  }

  function handleDismiss() {
    try {
      localStorage.setItem(DISMISSED_KEY, "1");
    } catch {
      // ignore
    }
    setVisible(false);
  }

  return (
    <div className="fixed inset-x-4 bottom-4 z-[90] mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-border bg-surface p-4 shadow-xl sm:inset-x-auto sm:right-6">
      <span aria-hidden="true" className="text-2xl">📲</span>
      <div className="flex-1 text-sm">
        <p className="font-semibold">Install JokeMasti</p>
        <p className="text-foreground-muted">Jokes aur memes ab ek tap mein, offline bhi!</p>
      </div>
      <button
        type="button"
        onClick={handleInstall}
        className="rounded-full bg-brand-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-brand-600"
      >
        Install
      </button>
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Dismiss install prompt"
        className="text-foreground-muted hover:text-foreground"
      >
        ✕
      </button>
    </div>
  );
}
