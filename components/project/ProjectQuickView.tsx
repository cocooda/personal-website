"use client";

import { ChevronDown } from "lucide-react";
import { useId, useRef, useState } from "react";
import type { ProjectContent } from "@/lib/content/schemas";
import { cn } from "@/lib/utils/cn";

export function ProjectQuickView({ project }: { project: ProjectContent }) {
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
    <div className="mt-5 border-t border-subtle pt-5">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={regionId}
        onClick={toggle}
        className="flex min-h-11 w-full items-center justify-between gap-4 rounded-md border border-strong bg-elevated/70 px-4 py-3 text-left text-sm font-semibold text-primary transition hover:border-steel hover:bg-panel"
      >
        <span>See evidence quick view</span>
        <ChevronDown
          aria-hidden="true"
          size={18}
          className={cn("shrink-0 transition-transform", open && "rotate-180")}
        />
      </button>
      <div
        id={regionId}
        ref={regionRef}
        tabIndex={-1}
        hidden={!open}
        className="mt-4 rounded-md border border-subtle bg-base/52 p-5"
      >
        <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <h3 className="text-xl font-bold text-primary">{project.shortTitle} evidence</h3>
            <p className="mt-3 text-sm leading-7 text-secondary">{project.contributionBoundary}</p>
            <ul className="mt-4 grid gap-2 text-sm leading-6 text-secondary">
              {project.contributions.slice(0, 4).map((item) => (
                <li key={item} className="flex gap-3">
                  <span aria-hidden="true" className="mt-2 size-1.5 rounded-full bg-steel" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-mono text-xs font-bold uppercase text-steel">Proof</p>
            <p className="mt-3 text-sm leading-7 text-secondary">{project.proofPoint}</p>
            {project.metrics.length > 0 ? (
              <div className="mt-4 grid gap-3">
                {project.metrics.slice(0, 2).map((metric) => (
                  <div key={metric.label} className="rounded-md border border-subtle bg-elevated/52 p-3">
                    <p className="font-mono text-xs uppercase text-muted">{metric.label}</p>
                    <p className="mt-1 text-lg font-bold text-primary">{metric.value}</p>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
