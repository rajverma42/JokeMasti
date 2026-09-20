import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export function LegalLayout({
  title,
  path,
  updated,
  children,
}: {
  title: string;
  path: string;
  updated?: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Breadcrumbs items={[{ name: title, path }]} />
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{title}</h1>
      {updated && <p className="mt-2 text-sm text-foreground-muted">Last updated: {updated}</p>}
      <div className="mt-6 flex flex-col gap-4 text-[15px] leading-relaxed text-foreground [&_h2]:mt-6 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-foreground [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-1.5 [&_a]:text-brand-600 [&_a]:underline">
        {children}
      </div>
    </div>
  );
}
