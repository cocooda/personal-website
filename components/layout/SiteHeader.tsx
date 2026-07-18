"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { profile } from "@/content/profile";
import { MobileNav } from "@/components/layout/MobileNav";
import { cn } from "@/lib/utils/cn";

const navItems = [
  { label: "Work", href: "/#work", id: "work" },
  { label: "Process", href: "/#process", id: "process" },
  { label: "About", href: "/#about", id: "about" },
  { label: "Contact", href: profile.contact.pageHref, id: "contact" },
  { label: "Resume", href: profile.resume.pageHref, id: "resume" },
];

export function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  const updateActiveSection = useCallback(() => {
    const sections = ["work", "process", "about", "contact"];
    let currentSection = "";
    const activationLine = window.scrollY + window.innerHeight * 0.4;

    for (const id of sections) {
      const el = document.getElementById(id);
      if (el) {
        const rect = el.getBoundingClientRect();
        const top = rect.top + window.scrollY;
        const bottom = top + rect.height;

        if (activationLine >= top && activationLine < bottom) {
          currentSection = id;
          break;
        }
      }
    }

    // Fallback for contact when scrolled to the absolute bottom
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
      document.getElementById("contact")
    ) {
      currentSection = "contact";
    }

    setActiveSection(currentSection);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      updateActiveSection();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // Initial check
    handleScroll();

    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (["work", "process", "about", "contact"].includes(hash)) {
        setActiveSection(hash);
      }
    };
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, [updateActiveSection]);

  return (
    <header className="fixed top-6 inset-x-0 z-50 pointer-events-none transition-all duration-300">
      <div className="container-shell flex justify-between items-center">
        {/* Monogram / Logo - Floating Container */}
        <Link 
          href="/" 
          className={cn(
            "pointer-events-auto flex items-center justify-center font-sans font-black text-xl size-12 rounded-full border transition-all duration-300",
            isScrolled 
              ? "bg-elevated/80 border-white/10 shadow-lg text-accent backdrop-blur-md" 
              : "bg-transparent border-transparent text-primary"
          )}
          aria-label="Go to homepage"
        >
          D
        </Link>

        {/* Floating Capsule Nav */}
        <nav 
          aria-label="Primary navigation" 
          className={cn(
            "pointer-events-auto hidden md:flex items-center gap-1 px-2 py-1.5 rounded-full border transition-all duration-300",
            isScrolled 
              ? "bg-elevated/70 border-white/5 shadow-xl backdrop-blur-md px-4" 
              : "bg-transparent border-transparent"
          )}
        >
          {navItems.map((item) => {
            const isActive = activeSection === item.id && item.id !== "resume";
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  if (item.id !== "resume") setActiveSection(item.id);
                }}
                aria-current={isActive ? "location" : undefined}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 hover:text-primary",
                  isActive ? "text-primary" : "text-secondary",
                  item.id === "resume" && "opacity-80 hover:opacity-100" // subtle utility treatment
                )}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 size-1 rounded-full bg-accent shadow-[0_0_8px_var(--color-accent)]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Mobile Navigation Trigger inside Floating container */}
        <div className="pointer-events-auto md:hidden">
          <MobileNav items={navItems} isScrolled={isScrolled} />
        </div>
      </div>
    </header>
  );
}
