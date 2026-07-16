"use client";

import { useEffect, useRef, useState } from "react";
import { processSteps } from "@/content/process";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { cn } from "@/lib/utils/cn";

export function ProcessSection() {
  const [active, setActive] = useState<(typeof processSteps)[number]["verb"]>(processSteps[0].verb);
  const refs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target instanceof HTMLElement) {
          const nextStep = visible.target.dataset.step as (typeof processSteps)[number]["verb"] | undefined;
          setActive(nextStep ?? processSteps[0].verb);
        }
      },
      { rootMargin: "-30% 0px -45% 0px", threshold: [0.2, 0.5, 0.8] },
    );

    refs.current.forEach((node) => {
      if (node) {
        observer.observe(node);
      }
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section id="process" className="scroll-mt-24 border-y border-subtle bg-elevated/36 py-20 md:py-28">
      <div className="container-shell">
        <SectionHeading
          eyebrow="How I build"
          title="Product, engineering, evaluation, and iteration stay connected."
          body="The process is deliberately end to end: define the product problem, build the system, measure it, deploy it, observe it, and tighten the next pass."
        />
        <div className="mt-12 grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="lg:sticky lg:top-28 lg:self-start" aria-label="Process steps">
            <ol className="grid gap-2">
              {processSteps.map((step) => (
                <li key={step.verb}>
                  <button
                    type="button"
                    onClick={() => {
                      setActive(step.verb);
                      refs.current[processSteps.indexOf(step)]?.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      });
                    }}
                    className={cn(
                      "flex min-h-11 w-full items-center justify-between rounded-md border px-3 py-2 text-left text-sm font-semibold transition",
                      active === step.verb
                        ? "border-steel bg-panel text-primary"
                        : "border-subtle bg-base/40 text-muted hover:border-strong hover:text-secondary",
                    )}
                  >
                    {step.verb}
                    <span
                      aria-hidden="true"
                      className={cn("h-px w-8 bg-subtle transition", active === step.verb && "w-14 bg-steel")}
                    />
                  </button>
                </li>
              ))}
            </ol>
          </aside>
          <div className="grid gap-4">
            {processSteps.map((step, index) => (
              <div
                key={step.verb}
                ref={(node) => {
                  refs.current[index] = node;
                }}
                data-step={step.verb}
                className="rounded-lg border border-subtle bg-base/52 p-5"
              >
                <p className="font-mono text-xs font-bold uppercase text-steel">
                  {String(index + 1).padStart(2, "0")} / {step.verb}
                </p>
                <h3 className="mt-3 text-2xl font-bold text-primary">{step.action}</h3>
                <p className="mt-4 text-sm leading-7 text-secondary">{step.evidence}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
