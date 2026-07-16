# Content Update Guide

This guide describes the intended post-implementation content workflow. Routine updates should not require editing React components.

## Normal Workflow

1. Edit one content file.
2. Add or replace media assets if needed.
3. Run validation and preview.
4. Commit and push.
5. Let Vercel create a preview deployment.

Recommended commands:

```bash
npm run validate:content
npm run check
npm run dev
```

## 1. Update Headline And Biography

Edit:

```text
content/profile.ts
```

Example fields:

```ts
headline: "Building AI products from ambiguous workflows to measurable production systems.",
bio: "I work across product discovery, backend systems, retrieval pipelines, evaluation, deployment, and iteration.",
```

Then run:

```bash
npm run validate:content
```

## 2. Add Or Edit Experience

Edit:

```text
content/experience.ts
```

Example:

```ts
{
  company: "VinUni",
  role: "AI Engineering Trainee",
  start: "2026-05",
  end: "2026-08",
  summary: "Worked on applied AI engineering, RAG applications, cloud deployment, and ML infrastructure.",
  highlights: [
    "Co-developed legal AI workflows for Q&A, drafting, and document review.",
  ],
}
```

Rules:
- Keep highlights concise.
- Do not copy the CV verbatim.
- Avoid unsupported metrics.

## 3. Replace The Resume PDF

Replace:

```text
public/resume/nguyen-duy-duc-resume.pdf
```

If the filename changes, update the one resume config field in:

```text
content/profile.ts
```

Example:

```ts
resume: {
  href: "/resume/nguyen-duy-duc-resume.pdf",
}
```

Run:

```bash
npm run check
```

## 4. Add A New Project

Create:

```text
content/projects/new-project-slug.ts
```

Add assets under:

```text
public/projects/new-project-slug/
```

Example:

```ts
export default {
  slug: "new-project-slug",
  title: "New Project",
  shortTitle: "New Project",
  status: "staging",
  featured: false,
  visibility: "public",
  priority: 40,
  oneLineSummary: "A concise evidence-backed summary.",
  problem: "The user or business problem.",
  role: "Your specific role.",
  teamContext: "Solo project or team context.",
  contributions: ["Specific contribution."],
  outcomes: ["Specific outcome."],
  metrics: [],
  technologies: ["Next.js", "FastAPI"],
  gallery: [],
  lastUpdated: "2026-07-16",
  sections: [
    {
      id: "overview",
      title: "Overview",
      body: "Short case-study body.",
    },
  ],
} satisfies ProjectContent;
```

Run:

```bash
npm run validate:content
```

## 5. Feature Or Unfeature A Project

Edit the project file:

```ts
featured: true
```

Only featured and public projects appear in the selected work section.

Run:

```bash
npm run validate:content
```

## 6. Reorder Projects

Edit:

```ts
priority: 10
```

Lower numbers appear earlier.

Suggested:
- Legolas AI: `10`
- HanoiWorld: `20`
- Powfolio: `30`

## 7. Hide A Project Without Deleting It

Edit:

```ts
visibility: "hidden"
```

Use:
- `public` for visible.
- `hidden` for retained but not routed/listed.
- `draft` for incomplete content.

Run:

```bash
npm run validate:content
```

## 8. Add Screenshots

Add files under:

```text
public/projects/<project-slug>/
```

Reference them in the project file:

```ts
gallery: [
  {
    src: "/projects/legolas-ai/workflow.png",
    alt: "Legolas AI workflow showing Q&A, drafting, and review.",
    caption: "Sanitized workflow overview.",
  },
]
```

Rules:
- Use meaningful alt text.
- Do not expose private data.
- Do not use Langfuse demo screenshots as real Legolas evidence.

## 9. Update Project Metrics

Edit the project file:

```ts
metrics: [
  {
    label: "Citation hit rate",
    value: "46.67% to 80.00%",
    source: "Formal CV dated 2026-07-12.",
    caveat: "30-case multi-source benchmark against the overlap baseline.",
  },
]
```

Rules:
- Every metric needs a source.
- If metrics conflict, resolve before publishing.
- Use "Top 2 product at the program's final Demo Day" only with the restrained program-context wording.

## 10. Add A Challenge-Day Entry

Create:

```text
content/challenge/day-01.ts
```

Example:

```ts
export default {
  day: 1,
  date: "2026-07-17",
  title: "Portfolio content model",
  status: "planned",
  summary: "Set up typed content modules for profile, projects, and challenge entries.",
  shipped: [],
  links: [],
} satisfies ChallengeEntry;
```

Run:

```bash
npm run validate:content
```

## 11. Validation And Preview Commands

Use:

```bash
npm run validate:content
npm run typecheck
npm run lint
npm run build
npm run dev
```

Or all core checks:

```bash
npm run check
```

## 12. Verify Locally Before Pushing

1. Run:

```bash
npm run check
```

2. Start preview:

```bash
npm run dev
```

3. Open:

```text
http://localhost:3000
```

4. Check:
- Homepage.
- Project quick views.
- Project routes.
- Challenge page.
- Resume link.
- Mobile viewport.
- Console errors.

5. Commit and push.

Vercel should then create a preview deployment automatically.
