import Link from "next/link";
import { Logo } from "@/components/Logo";
import { siteConfig } from "@/lib/site";

const columns = [
  {
    title: "Explore",
    links: [
      { href: "/jokes", label: "Jokes" },
      { href: "/memes", label: "Memes" },
      { href: "/trending", label: "Trending" },
      { href: "/festival", label: "Festivals" },
      { href: "/funny-images", label: "Funny Images" },
      { href: "/whatsapp", label: "WhatsApp Status" },
      { href: "/bookmarks", label: "My Bookmarks" },
    ],
  },
  {
    title: "Categories",
    links: [
      { href: "/jokes/hindi", label: "Hindi Jokes" },
      { href: "/memes/desi", label: "Desi Memes" },
      { href: "/jokes/friendship", label: "Friendship" },
      { href: "/jokes/love", label: "Love" },
      { href: "/jokes/school", label: "School" },
      { href: "/jokes/office", label: "Office" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/contact", label: "Contact Us" },
      { href: "/privacy-policy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms & Conditions" },
      { href: "/disclaimer", label: "Disclaimer" },
      { href: "/copyright-policy", label: "Copyright Policy" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="col-span-2 flex flex-col gap-3 md:col-span-1">
            <Logo />
            <p className="text-sm text-foreground-muted">
              {siteConfig.description}
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground-muted">
                {col.title}
              </h3>
              <ul className="flex flex-col gap-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-foreground-muted hover:text-brand-600">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center gap-2 border-t border-border pt-6 text-center text-xs text-foreground-muted sm:flex-row sm:justify-between sm:text-left">
          <p>© {new Date().getFullYear()} {siteConfig.name}. All Rights Reserved.</p>
          <p>Made with 😂 for India</p>
        </div>
      </div>
    </footer>
  );
}
