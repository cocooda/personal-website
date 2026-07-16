export const processSteps = [
  {
    verb: "Discover",
    action: "Map the user workflow, constraints, and proof required before building.",
    evidence: "Legolas legal workflows and Powfolio evidence-map framing.",
  },
  {
    verb: "Define",
    action: "Turn ambiguous scope into a product slice with measurable success criteria.",
    evidence: "30-case benchmark context and Day 0 launch constraints.",
  },
  {
    verb: "Prototype",
    action: "Build enough of the workflow to test product behavior early.",
    evidence: "Cited Q&A, draft generation, and review surfaces.",
  },
  {
    verb: "Build",
    action: "Implement the backend, retrieval, frontend, and integration layers.",
    evidence: "FastAPI, React, LangGraph, Chroma, BM25, and cloud surfaces.",
  },
  {
    verb: "Evaluate",
    action: "Measure answer quality and retrieval behavior against explicit baselines.",
    evidence: "Citation hit rate, legal-number recall, and multi-source fact score.",
  },
  {
    verb: "Deploy",
    action: "Ship a staging surface with real cloud boundaries and runbook thinking.",
    evidence: "Vercel, Render, Supabase/PostgreSQL, and Hugging Face Spaces.",
  },
  {
    verb: "Observe",
    action: "Use traces and user feedback to find latency, fallback, and grounding issues.",
    evidence: "Langfuse trace investigation for core AI workflows.",
  },
  {
    verb: "Iterate",
    action: "Tighten scope, quality, privacy, and public proof after each pass.",
    evidence: "Powfolio redaction-first pipeline and portfolio content validation.",
  },
] as const;
