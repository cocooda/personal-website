import type { Capability } from "@/lib/content/schemas";

export const capabilities = [
  {
    title: "Product discovery to scoped workflow",
    summary:
      "Translate ambiguous operational pain into user flows, success criteria, and buildable product slices.",
    examples: [
      "Legal assistant workflows for cited Q&A, drafting, and document review.",
      "Public build-log framing for a 30-day portfolio launch cycle.",
    ],
  },
  {
    title: "Grounded AI systems",
    summary:
      "Design retrieval, citation, and evaluation loops around measurable answer quality rather than demo-only behavior.",
    examples: [
      "Hybrid retrieval with dense search, BM25, and reciprocal rank fusion.",
      "30-case multi-source benchmark against an overlap baseline.",
    ],
  },
  {
    title: "Backend and data foundations",
    summary:
      "Build APIs, auth boundaries, persistence, and integration surfaces that support real product workflows.",
    examples: [
      "FastAPI, SQLAlchemy, PostgreSQL/Supabase, JWT, and REST API work.",
      "Spring Boot API and React integration experience from internship work.",
    ],
  },
  {
    title: "Deployment and observability",
    summary:
      "Prepare systems for staging, demo stability, cloud constraints, and trace-based debugging.",
    examples: [
      "Vercel, Render, Supabase/PostgreSQL, Hugging Face Spaces, and Docker.",
      "Langfuse traces used to inspect latency, fallback, and citation failures.",
    ],
  },
] satisfies Capability[];
