import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { challengeEntries } from "@/lib/content/challenge";

export const metadata: Metadata = {
  title: "30-Day Challenge",
  description:
    "Public build log for Nguyen Duy Duc's 30-day portfolio and product shipping challenge.",
  alternates: {
    canonical: "/challenge",
  },
};

export default function ChallengePage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container-shell">
        <SectionHeading
          eyebrow="Build log"
          title="30-Day Challenge"
          body="A maintainable public log for shipping the portfolio, deploying it, and continuing the product-building cadence after Day 0."
        />
        <div className="mt-10 grid gap-5">
          {challengeEntries.map((entry) => (
            <article key={entry.day} className="surface rounded-lg p-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-md border border-steel/40 bg-steel/10 px-3 py-1 font-mono text-xs font-bold uppercase text-steel">
                  Day {entry.day}
                </span>
                <time className="font-mono text-xs text-muted" dateTime={entry.date}>
                  {entry.date}
                </time>
                <span className="rounded-md border border-subtle px-3 py-1 font-mono text-xs uppercase text-muted">
                  {entry.status}
                </span>
              </div>
              <h2 className="mt-5 text-2xl font-bold text-primary">{entry.title}</h2>
              <p className="mt-3 text-sm leading-7 text-secondary">{entry.summary}</p>
              <div className="mt-5 grid gap-2">
                {entry.shipped.map((item) => (
                  <p key={item} className="text-sm text-secondary">
                    {item}
                  </p>
                ))}
              </div>
              <p className="mt-5 rounded-md border border-subtle bg-base/50 p-4 text-sm leading-7 text-secondary">
                Next: {entry.nextStep}
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                {entry.links.map((link) =>
                  link.kind === "internal" ? (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="inline-flex min-h-11 items-center gap-2 rounded-md border border-strong bg-elevated px-4 py-2 text-sm font-semibold text-primary transition hover:border-steel"
                    >
                      {link.label}
                      <ArrowUpRight aria-hidden="true" size={16} />
                    </Link>
                  ) : (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex min-h-11 items-center gap-2 rounded-md border border-strong bg-elevated px-4 py-2 text-sm font-semibold text-primary transition hover:border-steel"
                    >
                      {link.label}
                      <ArrowUpRight aria-hidden="true" size={16} />
                    </a>
                  ),
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
