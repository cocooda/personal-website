const proofItems = [
  {
    label: "Legal AI workflows",
    evidence: "Q&A, drafting, and document review in one MVP.",
  },
  {
    label: "Evaluation discipline",
    evidence: "30-case multi-source benchmark against overlap baseline.",
  },
  {
    label: "Grounded retrieval",
    evidence: "Dense search, BM25, RRF, citation grounding.",
  },
  {
    label: "Deployment fit",
    evidence: "Vercel, Render, Supabase/PostgreSQL, Hugging Face Spaces.",
  },
];

export function ProofStrip() {
  return (
    <section aria-label="Proof points" className="border-y border-subtle bg-base/42 py-6">
      <div className="container-shell grid gap-3 md:grid-cols-4">
        {proofItems.map((item) => (
          <div key={item.label} className="border-l border-strong pl-4">
            <p className="font-mono text-xs font-bold uppercase text-steel">{item.label}</p>
            <p className="mt-2 text-sm leading-6 text-secondary">{item.evidence}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
