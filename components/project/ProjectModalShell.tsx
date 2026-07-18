"use client";

import { useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { motion } from "motion/react";

interface ProjectModalShellProps {
  slug: string;
  title: string;
  children: React.ReactNode;
}

export function ProjectModalShell({ slug, title, children }: ProjectModalShellProps) {
  const router = useRouter();
  const modalRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleClose = useCallback(() => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/#work");
    }
  }, [router]);

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleClose]);

  // Inert background & Scroll Locking & Scrollbar Shift Prevention
  useEffect(() => {
    const mainEl = document.getElementById("main");
    const headerEl = document.querySelector("header");
    const footerEl = document.querySelector("footer");

    mainEl?.setAttribute("inert", "true");
    headerEl?.setAttribute("inert", "true");
    footerEl?.setAttribute("inert", "true");

    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      const fixedHeaderFooter = document.querySelectorAll("header, footer");
      fixedHeaderFooter.forEach((el) => {
        (el as HTMLElement).style.paddingRight = `${scrollbarWidth}px`;
      });
    }

    // iOS Safari scroll locking
    const preventDefault = (e: TouchEvent) => {
      if (scrollContainerRef.current && !scrollContainerRef.current.contains(e.target as Node)) {
        e.preventDefault();
      }
    };
    document.addEventListener("touchmove", preventDefault, { passive: false });

    return () => {
      mainEl?.removeAttribute("inert");
      headerEl?.removeAttribute("inert");
      footerEl?.removeAttribute("inert");

      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;

      const fixedHeaderFooter = document.querySelectorAll("header, footer");
      fixedHeaderFooter.forEach((el) => {
        (el as HTMLElement).style.paddingRight = "";
      });

      document.removeEventListener("touchmove", preventDefault);
    };
  }, []);

  // Focus trap & Initial Focus
  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    const focusableElements = modal.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex="0"]'
    );
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    window.addEventListener("keydown", handleTabKey);
    firstElement.focus();

    return () => window.removeEventListener("keydown", handleTabKey);
  }, []);

  // Focus Restoration
  useEffect(() => {
    const triggerId = `project-trigger-${slug}`;
    return () => {
      const triggerElement = document.getElementById(triggerId);
      if (triggerElement) {
        triggerElement.focus({ preventScroll: true });
      } else {
        document.getElementById("work")?.focus({ preventScroll: true });
      }
    };
  }, [slug]);

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      ref={modalRef}
    >
      {/* Backdrop Click */}
      <div className="absolute inset-0 cursor-pointer" onClick={handleClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative w-full max-w-5xl h-[90vh] mx-4 bg-[#0B1116] border border-white/10 rounded-2xl overflow-hidden flex flex-col shadow-2xl z-10"
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#0B1116] shrink-0">
          <h2 id="modal-title" className="text-lg font-bold text-primary font-mono uppercase tracking-wider">
            {title} — Case Study
          </h2>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-full border border-white/10 bg-white/5 text-secondary hover:text-primary hover:border-white/20 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-0 cursor-pointer"
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable content */}
        <div 
          ref={scrollContainerRef}
          className="flex-grow overflow-y-auto p-6 md:p-10 select-text scrollbar-thin"
        >
          {children}
        </div>
      </motion.div>
    </div>
  );
}
