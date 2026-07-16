import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { challengeEntries } from "@/lib/content/challenge";
import { SectionHeading } from "@/components/sections/SectionHeading";

export function ChallengeTeaser() {
  const [latest] = challengeEntries;

  return (
    <section className="border-t border-subtle bg-elevated/36 py-20 md:py-28">
      <div className="container-shell grid gap-8 lg:grid-cols-[0.9fr_1fr] lg:items-end">
        <SectionHeading
          eyebrow="Currently building"
          title="30-Day Challenge build log."
          body="The log starts at Day 0 with this portfolio build and continues as a public record of shipping, deploying, and tightening proof."
        />
        <article className="surface rounded-lg p-5">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-md border border-steel/40 bg-steel/10 px-3 py-1 font-mono text-xs font-bold uppercase text-steel">
              Day {latest.day}
            </span>
            <span className="rounded-md border border-subtle px-3 py-1 font-mono text-xs uppercase text-muted">
              {latest.status}
            </span>
          </div>
          <h3 className="mt-5 text-2xl font-bold text-primary">{latest.title}</h3>
          <p className="mt-3 text-sm leading-7 text-secondary">{latest.summary}</p>
          <Link
            href="/challenge"
            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-md border border-strong bg-elevated px-4 py-2 text-sm font-semibold text-primary transition hover:-translate-y-0.5 hover:border-steel"
          >
            Open build log
            <ArrowUpRight aria-hidden="true" size={16} />
          </Link>
        </article>
      </div>
    </section>
  );
}
