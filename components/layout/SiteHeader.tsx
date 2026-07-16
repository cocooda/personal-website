import Link from "next/link";
import { profile } from "@/content/profile";
import { MobileNav } from "@/components/layout/MobileNav";

const navItems = [
  { label: "Work", href: "/#work" },
  { label: "Process", href: "/#process" },
  { label: "Challenge", href: "/challenge" },
  { label: "About", href: "/#about" },
  { label: "Resume", href: profile.resume.pageHref },
  { label: "Contact", href: profile.contact.pageHref },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 h-[var(--header-height)] border-b border-subtle/80 bg-base/82 backdrop-blur-xl">
      <div className="container-shell flex h-full items-center justify-between gap-4">
        <Link href="/" className="group flex items-center gap-3" aria-label="Go to homepage">
          <span className="grid size-9 place-items-center rounded-md border border-strong bg-elevated font-mono text-sm font-bold text-primary transition group-hover:border-steel">
            {profile.initials}
          </span>
          <span className="hidden text-sm font-semibold text-primary sm:inline">{profile.shortName}</span>
        </Link>
        <nav aria-label="Primary navigation" className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-semibold text-secondary transition hover:bg-panel hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <MobileNav items={navItems} />
      </div>
    </header>
  );
}
