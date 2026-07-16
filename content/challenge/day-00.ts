import type { ChallengeEntry } from "@/lib/content/schemas";

const day00 = {
  day: 0,
  date: "2026-07-16",
  title: "Personal portfolio production build",
  status: "in-progress",
  summary:
    "Initialize the portfolio, implement the data-driven content model, build the Evidence Field design, verify locally, then prepare the Vercel handoff.",
  shipped: [
    "Approved implementation source of truth.",
    "Project hierarchy and public claim boundaries.",
    "Day 0 build -> deploy -> submit workflow.",
  ],
  nextStep:
    "Deploy the verified portfolio through Vercel import and submit the production URL.",
  links: [
    {
      label: "Portfolio route",
      href: "/",
      kind: "internal",
      verified: true,
    },
  ],
} satisfies ChallengeEntry;

export default day00;
