import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd, type BreadcrumbItem } from "@/lib/seo";

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const full: BreadcrumbItem[] = [{ name: "Home", path: "/" }, ...items];

  return (
    <nav aria-label="Breadcrumb" className="mb-4 overflow-x-auto no-scrollbar">
      <JsonLd data={breadcrumbJsonLd(full)} />
      <ol className="flex items-center gap-1.5 whitespace-nowrap text-sm text-foreground-muted">
        {full.map((item, i) => {
          const isLast = i === full.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-1.5">
              {i > 0 && <span aria-hidden="true">/</span>}
              {isLast ? (
                <span aria-current="page" className="font-medium text-foreground">
                  {item.name}
                </span>
              ) : (
                <Link href={item.path} className="hover:text-brand-600">
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
