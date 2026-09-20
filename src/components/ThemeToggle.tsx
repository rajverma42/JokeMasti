"use client";

import { useState } from "react";
import { setStoredTheme, type Theme } from "@/lib/storage";
import { useStoredTheme } from "@/lib/hooks";

const OPTIONS: { value: Theme; label: string; icon: string }[] = [
  { value: "light", label: "Light Mode", icon: "☀️" },
  { value: "dark", label: "Dark Mode", icon: "🌙" },
  { value: "system", label: "System Mode", icon: "⚙️" },
];

function applyTheme(theme: Theme) {
  const resolved =
    theme === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : theme;
  document.documentElement.setAttribute("data-theme", resolved);
}

export function ThemeToggle() {
  const theme = useStoredTheme();
  const [open, setOpen] = useState(false);

  function handleSelect(next: Theme) {
    setStoredTheme(next);
    applyTheme(next);
    setOpen(false);
  }

  const current = OPTIONS.find((o) => o.value === theme) ?? OPTIONS[2];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Toggle color theme"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-lg transition-colors hover:bg-surface-muted"
      >
        <span aria-hidden="true">{current.icon}</span>
      </button>
      {open && (
        <>
          <button
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            className="fixed inset-0 z-40 cursor-default"
            onClick={() => setOpen(false)}
          />
          <div
            role="menu"
            className="absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-xl border border-border bg-surface py-1 shadow-lg"
          >
            {OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                role="menuitem"
                onClick={() => handleSelect(opt.value)}
                className={`flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors hover:bg-surface-muted ${
                  theme === opt.value ? "font-semibold text-brand-600" : "text-foreground"
                }`}
              >
                <span aria-hidden="true">{opt.icon}</span>
                {opt.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
