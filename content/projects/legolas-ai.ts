import type { ProjectContent } from "@/lib/content/schemas";

const legolasAi = {
  slug: "legolas-ai",
  title: "Legolas AI",
  shortTitle: "Legolas",
  hierarchy: "flagship",
  status: "staging",
  statusLabel: "Flagship project / staging MVP",
  featured: true,
  visibility: "public",
  priority: 10,
  oneLineSummary:
    "A citation-grounded legal AI assistant for Q&A, drafting, and document review workflows.",
  productDescription:
    "Legolas AI helps legal and university operations teams work across scattered legal sources with grounded answers, draft generation, and review findings.",
  problem:
    "Legal teams need answers and drafts that cite the right source material, but relevant law, internal documents, and review context are fragmented across files and services.",
  role:
    "AI Product Engineer / co-developer in a 2-person team",
  teamContext:
    "2-person VinUni AI Engineer Training Program project.",
  contributionBoundary:
    "Public copy uses co-developed for shared team outcomes and names personal work only where supported by the CV and project evidence.",
  proofPoint:
    "Citation hit rate improved from 46.67% to 80.00% on a 30-case multi-source benchmark against the overlap baseline.",
  visual: {
    src: "/projects/legolas-ai/evidence-map.svg",
    alt: "Diagram of Legolas AI workflows, retrieval, evaluation, deployment, and observability evidence.",
    caption: "Generated evidence map from verified project architecture and benchmark context.",
    kind: "diagram",
  },
  contributions: [
    "Co-developed three end-to-end workflows: citation-grounded Q&A, template-based drafting, and document review.",
    "Co-designed legal-aware hybrid ingestion and retrieval with dense search, BM25, and reciprocal rank fusion.",
    "Built and ran the 30-case multi-source benchmark against the overlap baseline.",
    "Helped deploy the split cloud staging architecture across frontend, backend, database/storage, and retrieval service surfaces.",
    "Used trace evidence to investigate latency, provider fallback, and citation failure behavior.",
  ],
  outcomes: [
    "Top 2 product at the program's final Demo Day.",
    "Public staging demo and public team repository are available for inspection.",
    "Benchmark context is explicit and separated from older unrelated experiment runs.",
  ],
  metrics: [
    {
      label: "Citation hit rate",
      value: "46.67% to 80.00%",
      context: "30-case multi-source benchmark against the overlap baseline.",
      source: "Formal CV dated 2026-07-12.",
      featured: true,
    },
    {
      label: "Legal-number recall",
      value: "61.67% to 90.00%",
      context: "30-case multi-source benchmark against the overlap baseline.",
      source: "Formal CV dated 2026-07-12.",
      featured: true,
    },
    {
      label: "Multi-source fact score",
      value: "60.00% to 90.00%",
      context: "30-case multi-source benchmark against the overlap baseline.",
      source: "Formal CV dated 2026-07-12.",
      featured: false,
    },
  ],
  technologies: [
    "FastAPI",
    "React",
    "Vite",
    "LangGraph",
    "Chroma",
    "BM25",
    "RRF",
    "PostgreSQL",
    "Supabase",
    "Vercel",
    "Render",
    "Hugging Face Spaces",
    "Langfuse",
  ],
  gallery: [
    {
      src: "/projects/legolas-ai/workflow.svg",
      alt: "Legolas AI workflow diagram showing Q&A, drafting, and document review.",
      caption: "Product workflow diagram generated from verified project features.",
      kind: "workflow",
    },
    {
      src: "/projects/legolas-ai/architecture.svg",
      alt: "Legolas AI architecture diagram with frontend, backend, database, retrieval, and observability surfaces.",
      caption: "Public-safe architecture diagram, not a raw internal screenshot.",
      kind: "diagram",
    },
    {
      src: "/projects/legolas-ai/benchmark.svg",
      alt: "Benchmark visualization for citation hit rate, legal-number recall, and multi-source fact score.",
      caption: "Benchmark values from the formal CV, shown with the 30-case context.",
      kind: "benchmark",
    },
  ],
  liveUrl: "https://legolas-ai-staging.vercel.app",
  repositoryUrl: "https://github.com/AI20K-Build-Cohort-2/C2-App-108",
  caseStudyUrl: "/work/legolas-ai",
  startedAt: "2026-05",
  completedAt: "2026-08",
  lastUpdated: "2026-07-16",
  confidentialityNote:
    "The portfolio uses diagrams and benchmark summaries instead of private data, unsanitized screenshots, uploaded legal documents, or internal environment details.",
  sections: [
    {
      id: "overview",
      title: "Overview",
      eyebrow: "Product problem",
      body: [
        "Legolas AI was built for legal and administrative workflows where a free-form answer is not enough. Users need to know which source supports an answer, whether a draft is grounded, and where review risks come from.",
        "The MVP centers on three workflows: citation-grounded Q&A, template-based drafting, and document review with risk findings and source traceability.",
      ],
      bullets: [
        "Target workflow: legal lookup, drafting, and review.",
        "Project context: 2-person VinUni AI Engineer Training Program team.",
        "Public status: staging MVP with a public repository and live staging URL.",
      ],
    },
    {
      id: "architecture",
      title: "Architecture",
      eyebrow: "System design",
      body: [
        "The system used a React/Vite frontend, FastAPI backend, PostgreSQL/Supabase persistence, Chroma retrieval, BM25 lexical retrieval, reciprocal rank fusion, and a Hugging Face retrieval service. Frontend, backend, database/storage, and retrieval ran as separate cloud surfaces.",
        "This split architecture made deployment more realistic for a training-program MVP while exposing practical constraints around latency, memory, provider fallback, and tracing.",
      ],
      bullets: [
        "Dense retrieval plus BM25 and RRF for public legal corpus retrieval.",
        "FastAPI API surface for auth, chat, document review, drafting, feedback, and support endpoints.",
        "Vercel, Render, Supabase/PostgreSQL, and Hugging Face Spaces deployment surfaces.",
      ],
    },
    {
      id: "evaluation",
      title: "Evaluation",
      eyebrow: "Measured quality",
      body: [
        "The public metrics on this site use the CV as the current source of truth. They refer to a verified 30-case multi-source benchmark against the overlap baseline, not older experimental runs from unrelated benchmark contexts.",
        "The case study reports all three supported metrics with their benchmark context so the claims are inspectable without overstating general production performance.",
      ],
      bullets: [
        "Citation hit rate: 46.67% to 80.00%.",
        "Legal-number recall: 61.67% to 90.00%.",
        "Multi-source fact score: 60.00% to 90.00%.",
      ],
    },
    {
      id: "trade-offs",
      title: "Trade-offs",
      eyebrow: "Production-oriented choices",
      body: [
        "The main product tension was balancing grounded legal answers with demo stability. The system needed to provide useful answers while warning when evidence was insufficient, and it needed cloud deployment paths that fit student-program constraints.",
        "The observability work focused on traces that help inspect latency, model/provider fallback, and citation failures without exposing private document content.",
      ],
      bullets: [
        "Legal grounding was prioritized over free-form answer fluency.",
        "Private and uploaded documents were kept out of public portfolio evidence.",
        "Staging/demo production language is used instead of claiming broad production adoption.",
      ],
    },
    {
      id: "result",
      title: "Result",
      eyebrow: "Outcome",
      body: [
        "Legolas AI became the flagship portfolio project because it connects product discovery, backend systems, applied AI, evaluation, deployment, and observability in one coherent product surface.",
        "The project was a Top 2 product at the program's final Demo Day. This is intentionally phrased as a program Demo Day outcome, not as an industry award.",
      ],
      bullets: [
        "Top 2 product at the program's final Demo Day.",
        "Three production-oriented legal AI workflows.",
        "Traceable benchmark and deployment evidence.",
      ],
    },
  ],
} satisfies ProjectContent;

export default legolasAi;
