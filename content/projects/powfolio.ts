import type { ProjectContent } from "@/lib/content/schemas";

const powfolio = {
  slug: "powfolio",
  title: "Powfolio",
  shortTitle: "Powfolio",
  hierarchy: "experiment",
  status: "current",
  statusLabel: "Currently building / product experiment",
  featured: true,
  visibility: "public",
  priority: 30,
  oneLineSummary:
    "A local-first project showcase compiler for turning private work into public-safe proof.",
  productDescription:
    "Powfolio scans local project evidence, builds an evidence map, flags redaction risks, and exports project showcase artifacts without requiring a SaaS backend.",
  problem:
    "Many useful projects sit in private repos or messy local workspaces. Builders still need a way to prove what they built without exposing source code, secrets, or user data.",
  role:
    "Product experiment owner",
  teamContext:
    "Currently building as a local-first CLI product experiment.",
  contributionBoundary:
    "Powfolio is presented as an MVP product experiment with passing local tests, not as a validated flagship product.",
  proofPoint:
    "MVP local pipeline with deterministic collectors, evidence map, redaction-first review, and 26 passing tests in the audited run.",
  visual: {
    src: "/projects/powfolio/pipeline.svg",
    alt: "Powfolio pipeline diagram showing local repo collection, evidence map, redaction review, and static exports.",
    caption: "Generated pipeline diagram from verified README and audit evidence.",
    kind: "diagram",
  },
  contributions: [
    "Designed a local-first project evidence pipeline with deterministic collectors.",
    "Made the evidence map the source of truth for generated briefs and showcase exports.",
    "Built redaction-first review surfaces for secrets, private URLs, and sensitive project details.",
    "Implemented static Markdown and HTML outputs for recruiter-readable project proof.",
  ],
  outcomes: [
    "Audited test run passed with 26 tests.",
    "No public adoption claim is made.",
    "The project stays in the Currently Building narrative instead of competing with Legolas AI.",
  ],
  metrics: [
    {
      label: "Audited tests",
      value: "26 passing",
      context: "Local audit of the Powfolio MVP pipeline.",
      source: "Portfolio audit, 2026-07-16.",
      featured: false,
    },
  ],
  technologies: [
    "TypeScript",
    "Node.js",
    "CLI",
    "Static HTML",
    "Markdown",
    "Evidence Mapping",
    "Redaction Review",
  ],
  gallery: [
    {
      src: "/projects/powfolio/pipeline.svg",
      alt: "Powfolio local-first evidence and export pipeline.",
      caption: "Public-safe product workflow diagram.",
      kind: "diagram",
    },
  ],
  caseStudyUrl: "/work/powfolio",
  lastUpdated: "2026-07-16",
  confidentialityNote:
    "The public story describes the product pipeline, not private repositories or generated private evidence.",
  sections: [
    {
      id: "overview",
      title: "Overview",
      eyebrow: "Currently building",
      body: [
        "Powfolio is a local-first project showcase compiler. It is meant for developers who have real work in private repos, NDA-adjacent projects, or local experiments but need public-safe proof for a CV or portfolio.",
        "It is deliberately not presented as a validated flagship product. The site treats it as a product experiment with clear validation boundaries.",
      ],
      bullets: [
        "Local-first CLI product experiment.",
        "Evidence map as source of truth.",
        "Static Markdown and HTML outputs.",
      ],
    },
    {
      id: "pipeline",
      title: "Pipeline",
      eyebrow: "Redaction first",
      body: [
        "The MVP pipeline collects deterministic signals, normalizes them into an evidence map, flags sensitivity risks, proposes evidence-backed claims, and exports public-safe narrative artifacts.",
        "The product constraint is that an LLM should not need to read an entire repository by default, and public claims should tie back to explicit evidence IDs.",
      ],
      bullets: [
        "Collect: git, docs, tests, deploy metadata, screenshots, and manual notes.",
        "Review: redaction risks and evidence quality.",
        "Export: case study, showcase brief, CV bullets, interview notes, and static HTML.",
      ],
    },
    {
      id: "status",
      title: "Status",
      eyebrow: "Validation boundary",
      body: [
        "The audited local pipeline had 26 passing tests, which supports the implementation story. It does not prove market adoption, so the public copy avoids user or revenue claims.",
      ],
      bullets: [
        "MVP pipeline exists and is tested locally.",
        "No adoption or public demo claim is made.",
        "Next validation step is shipping a public-safe workflow from the local MVP.",
      ],
    },
  ],
} satisfies ProjectContent;

export default powfolio;
