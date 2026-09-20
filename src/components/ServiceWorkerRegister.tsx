"use client";

import { useEffect } from "react";
import { withBasePath } from "@/lib/site";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) return;
    if (process.env.NODE_ENV !== "production") return;

    window.addEventListener("load", () => {
      // withBasePath so this resolves correctly when hosted under a repo
      // subpath (e.g. GitHub Pages) — the SW's scope defaults to its own
      // directory, so registering "/<basePath>/sw.js" scopes it to the
      // whole site, same as registering "/sw.js" at the domain root.
      navigator.serviceWorker.register(withBasePath("/sw.js")).catch(() => {
        // Non-critical: site works fully without the service worker.
      });
    });
  }, []);

  return null;
}
