"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type NavItem = {
  label: string;
  href: string;
};

export function MobileNav({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex size-11 items-center justify-center rounded-md border border-strong bg-elevated text-primary"
      >
        {open ? <X aria-hidden="true" size={19} /> : <Menu aria-hidden="true" size={19} />}
      </button>
      <div
        id="mobile-navigation"
        hidden={!open}
        className="absolute inset-x-4 top-[calc(var(--header-height)-4px)] rounded-md border border-strong bg-base/96 p-3 shadow-2xl backdrop-blur-xl"
      >
        <nav aria-label="Mobile navigation" className="grid gap-1">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="min-h-11 rounded-md px-3 py-2 text-sm font-semibold text-secondary hover:bg-panel hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
