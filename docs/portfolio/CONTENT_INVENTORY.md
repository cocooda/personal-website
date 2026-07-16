# Content Inventory

## Canonical Source Plan

The production site should keep content in these canonical modules:

```text
content/profile.ts
content/experience.ts
content/capabilities.ts
content/projects/legolas-ai.ts
content/projects/hanoiworld.ts
content/projects/powfolio.ts
content/challenge/day-00.ts
public/projects/<project-slug>/
public/resume/nguyen-duy-duc-resume.pdf
```

Routine updates must not require editing React components.

## Profile Content

| Field | Proposed value | Source | Status |
|---|---|---|---|
| Name | Nguyen Duy Duc | CV | Supported |
| Role | AI Product Engineer / Applied AI Engineer | User brief + CV | Supported |
| Location | Hanoi, Vietnam | CV | Supported |
| Email | `ddnguyen4779@gmail.com` | CV | Supported |
| Phone | Do not publish | CV contains it | Excluded |
| GitHub | Verified public project links only | CV/project evidence | Supported |
| LinkedIn | Do not display until URL is verified | Not extracted | Omitted for Day 0 |
| Resume path | `/resume/nguyen-duy-duc-resume.pdf` | User requirement | Required |
| Education | Computer Science, 2021-2026 | CV | Supported, institution needs verification |

## Experience Inventory

| Experience | Public treatment | Evidence | Notes |
|---|---|---|---|
| VinUni AI Engineering Trainee | Primary timeline item | CV + Legolas repo/worklog | Use May 2026 to expected Aug 2026 if still accurate. |
| Sapo Fullstack Developer Intern | Concise backend/full-stack item | CV | Include REST APIs, Spring Boot, JWT, React integration. |
| Shoop City QA Tester Intern | Concise QA/testing item | CV | Include functional/regression testing and Jira. |

## Capabilities Inventory

Recommended capability groups:

1. Product and delivery
   - Discovery.
   - Problem framing.
   - Workflow design.
   - Scope control.
   - Demo/deployment readiness.

2. AI systems
   - RAG.
   - LangGraph.
   - Hybrid retrieval.
   - Evaluation.
   - Citation grounding.
   - Guardrails.

3. Backend and data
   - FastAPI.
   - Spring Boot.
   - REST APIs.
   - JWT/Auth/RBAC.
   - SQLAlchemy.
   - PostgreSQL/MySQL.

4. Deployment and observability
   - Vercel.
   - Render.
   - Supabase.
   - Hugging Face Spaces.
   - Docker.
   - Langfuse.

5. Frontend implementation
   - React.
   - Vite/Next.js.
   - Tailwind CSS.
   - Product UI integration.

## Project Inventory

### Legolas AI

Treatment: Flagship case study.

Supported content:
- Legal assistant MVP for university/legal operations.
- 2-person team.
- Three AI workflows: citation-grounded Q&A, drafting, document review.
- Hybrid retrieval: dense Chroma, BM25, RRF.
- Legal-aware ingestion/chunking and citation grounding.
- Evaluation artifacts under `eval/results/`.
- Deployment topology: Vercel, Render, PostgreSQL/Supabase, Hugging Face Space.
- Observability docs covering Langfuse trace shapes and privacy rules.
- Live staging URL returned `200 OK`.

Claims to use carefully:
- Citation hit rate and improvements must be reconciled between CV and eval report.
- "Top 2 product at the program's final Demo Day" is user-confirmed and may be used with restrained wording.
- Langfuse screenshots under `docs/media/langfuse-demo` are not real Legolas evidence.

Potential proof points:
- "Three production-oriented legal AI workflows."
- "30-case multi-source benchmark."
- "Hybrid retrieval evaluation and citation grounding."
- "Split cloud architecture for frontend, backend, database/storage, and retrieval."

### HanoiWorld

Treatment: Secondary case study, lean until more evidence is inspected.

Supported content from CV:
- JEPA-based world model for autonomous driving.
- Group project.
- Implemented JEPA-style observation encoding modules.
- Contributed to architecture planning, preprocessing, training pipeline setup, model training logic, experiments.
- Evaluated behavior using collision rate, episode reward, and scenario-level planning metrics.
- Public GitHub link resolves.

Avoid:
- Numeric performance claims.
- "Owned the world model" unless repo evidence supports it.
- Full research case study depth before inspecting source/report.

### Powfolio

Treatment: Currently Building / Product Experiment.

Supported content:
- Local-first npm/npx project showcase compiler.
- Evidence map as source of truth.
- Deterministic collectors.
- Redaction-first pipeline.
- Static Markdown/HTML output.
- Agent-assisted Codex workflow.
- `npm test` passed: 26 tests.

Avoid:
- Featured flagship treatment.
- User/adoption claims.
- Calling it a complete portfolio CMS.
- Letting it make the personal site feel like a generic portfolio-builder showcase.

## Asset Inventory

| Asset | Use | Status |
|---|---|---|
| `AI Engineer CV.pdf` | Copy to stable resume path | Required |
| Legolas architecture PNG/HTML | Case study visual | Keep after sanitization |
| Legolas pitch deck media | Potential visual source | Inspect/extract only sanitized images |
| Legolas icon | Not used | Avoid brand ambiguity |
| Langfuse demo screenshots | Do not use as real evidence | Remove from public proof |
| HanoiWorld screenshots | Not used | Use generated system diagram |
| Powfolio CLI screenshots | Not found | Can generate after approval if needed |

## Content Risks

1. Education inconsistency from PDF extraction.
   - Action: ask user or inspect latest resume source before publishing institution details.

2. Legolas metrics inconsistency.
   - Action: choose exact source per metric and record source in project data.

3. Top 2 Demo Day claim.
   - Action: use only the user-confirmed restrained wording: "Top 2 product at the program's final Demo Day."

4. LinkedIn profile missing.
   - Action: leave field empty until a verified URL is supplied.

5. Public screenshots may expose demo accounts or legal document data.
   - Action: sanitize screenshots or use purpose-built diagrams.
