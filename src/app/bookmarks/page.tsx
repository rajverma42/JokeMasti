import type { Metadata } from "next";
import { BookmarksClient } from "@/components/BookmarksClient";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "My Bookmarks",
  description: "Aapke saved jokes aur memes — locally stored on this device, no login required.",
  path: "/bookmarks",
  noIndex: true,
});

export default function BookmarksPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <Breadcrumbs items={[{ name: "Bookmarks", path: "/bookmarks" }]} />
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">🔖 My Bookmarks</h1>
      <p className="mt-2 max-w-2xl text-foreground-muted">
        Ye saved jokes aur memes sirf is browser mein store hote hain — koi account zaroori nahi.
      </p>
      <div className="mt-8">
        <BookmarksClient />
      </div>
    </div>
  );
}
