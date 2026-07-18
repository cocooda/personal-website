"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils/cn";

type NavItem = {
  label: string;
  href: string;
};

export function MobileNav({ items, isScrolled }: { items: NavItem[]; isScrolled: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "inline-flex size-12 items-center justify-center rounded-full border transition-all duration-300",
          isScrolled 
            ? "bg-elevated/80 border-white/10 shadow-lg text-accent backdrop-blur-md" 
            : "bg-elevated border-white/5 text-primary"
        )}
      >
        {open ? <X aria-hidden="true" size={19} /> : <Menu aria-hidden="true" size={19} />}
      </button>
      {open && (
        <div
          id="mobile-navigation"
          className="absolute inset-x-6 top-[88px] rounded-2xl border border-white/10 bg-elevated/95 p-4 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-200"
        >
          <nav aria-label="Mobile navigation" className="grid gap-1">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center min-h-12 rounded-xl px-4 text-base font-semibold text-secondary transition-all hover:bg-panel hover:text-primary active:bg-panel/50"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}

