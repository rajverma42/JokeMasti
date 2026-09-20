"use client";

import { useEffect, useState } from "react";

interface ToastEntry {
  id: number;
  message: string;
}

let counter = 0;

export function ToastHost() {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);

  useEffect(() => {
    function handler(e: Event) {
      const message = (e as CustomEvent<string>).detail;
      const id = ++counter;
      setToasts((prev) => [...prev, { id, message }]);
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 2200);
    }
    window.addEventListener("jm:toast", handler);
    return () => window.removeEventListener("jm:toast", handler);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-20 z-[100] flex flex-col items-center gap-2 px-4 sm:bottom-6"
      aria-live="polite"
      role="status"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className="animate-toast-in pointer-events-auto rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background shadow-lg"
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
