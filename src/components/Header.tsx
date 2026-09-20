import Link from "next/link";
import { Logo } from "@/components/Logo";
import { SearchBar } from "@/components/SearchBar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { MobileMenu } from "@/components/MobileMenu";
import { NAV_LINKS } from "@/components/navLinks";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/90 backdrop-blur supports-backdrop-blur:bg-surface/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <Logo />

        <nav aria-label="Primary navigation" className="hidden flex-1 items-center gap-1 md:flex">
          {NAV_LINKS.slice(0, 6).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-2 text-sm font-medium text-foreground-muted transition-colors hover:bg-surface-muted hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto hidden w-64 lg:block xl:w-80">
          <SearchBar variant="header" />
        </div>

        <Link
          href="/search"
          aria-label="Search"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-lg lg:hidden"
        >
          <span aria-hidden="true">🔍</span>
        </Link>

        <ThemeToggle />
        <MobileMenu />
      </div>
    </header>
  );
}
