"use client";

import { ChevronDown } from "lucide-react";
import { useId, useRef, useState } from "react";
import type { ProjectContent } from "@/lib/content/schemas";
import { cn } from "@/lib/utils/cn";

export function ProjectQuickView({ project, isLight = false }: { project: ProjectContent; isLight?: boolean }) {
  const [open, setOpen] = useState(false);
  const regionId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const regionRef = useRef<HTMLDivElement>(null);

  function toggle() {
    setOpen((current) => {
      const next = !current;
      window.requestAnimationFrame(() => {
        if (next) {
          regionRef.current?.focus();
        } else {
          buttonRef.current?.focus();
        }
      });
      return next;
    });
  }

  return (
    <div className={cn("mt-6 pt-6 border-t", isLight ? "border-black/5" : "border-white/5")}>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={regionId}
        onClick={toggle}
        className={cn(
          "flex min-h-12 w-full items-center justify-between gap-4 rounded-full border px-6 py-3 text-left text-sm font-semibold transition-all duration-300",
          isLight
            ? "border-black/10 bg-black/5 text-ink hover:border-black/25 hover:bg-black/10"
            : "border-white/5 bg-elevated/40 text-primary hover:border-white/20 hover:bg-panel/60"
        )}
      >
        <span>See evidence quick view</span>
        <ChevronDown
          aria-hidden="true"
          size={18}
          className={cn("shrink-0 transition-transform duration-300", open && "rotate-180")}
        />
      </button>
      {open && (
        <div
          id={regionId}
          ref={regionRef}
          tabIndex={-1}
          className={cn(
            "mt-4 rounded-2xl border p-6 animate-in fade-in slide-in-from-top-2 duration-200 focus:outline-none",
            isLight
              ? "border-black/5 bg-white/40 text-ink"
              : "border-white/5 bg-elevated/20 text-primary"
          )}
        >
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <h5 className="text-lg font-bold">{project.shortTitle} evidence</h5>
              <p className={cn("mt-2 text-xs leading-relaxed", isLight ? "text-ink/80" : "text-secondary")}>
                {project.contributionBoundary}
              </p>
              <ul className="mt-4 flex flex-col gap-2.5 text-xs">
                {project.contributions.slice(0, 4).map((item) => (
                  <li key={item} className="flex gap-2.5 items-start">
                    <span 
                      aria-hidden="true" 
                      className={cn("size-1.5 rounded-full mt-1.5 shrink-0", isLight ? "bg-black/30" : "bg-accent")} 
                    />
                    <span className={isLight ? "text-ink/90" : "text-secondary"}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="border-t lg:border-t-0 lg:border-l pt-6 lg:pt-0 lg:pl-6 border-white/5">
              <span className={cn("font-mono text-[10px] tracking-wider block mb-2", isLight ? "text-ink/50" : "text-secondary/50")}>
                PROOF_TRACK
              </span>
              <p className={cn("text-xs leading-relaxed mb-4", isLight ? "text-ink/80" : "text-secondary")}>
                {project.proofPoint}
              </p>
              {project.metrics.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {project.metrics.slice(0, 2).map((metric) => (
                    <div 
                      key={metric.label} 
                      className={cn(
                        "rounded-xl border p-3",
                        isLight ? "border-black/5 bg-black/5" : "border-white/5 bg-elevated/40"
                      )}
                    >
                      <span className={cn("font-mono text-[9px] uppercase block", isLight ? "text-ink/50" : "text-secondary/60")}>
                        {metric.label}
                      </span>
                      <span className="text-base font-black text-accent drop-shadow-[0_0_6px_rgba(169, 214, 255,0.15)] block mt-0.5">
                        {metric.value}
                      </span>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

