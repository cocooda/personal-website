# Portfolio Audit

Date: 2026-07-16

## Executive Finding

The personal website repository was initialized from an empty workspace into a static-first Next.js portfolio. The implementation source of truth is now the approved portfolio planning set plus the user's final content decisions from 2026-07-16.

The strongest public evidence source is Legolas AI, supported by the formal CV, public staging URL, public team repository, architecture/evaluation/deployment materials, and the user's confirmed Demo Day outcome. HanoiWorld is supported by the formal CV and a public GitHub repository. Powfolio is real local product work with a tested MVP pipeline, but it is presented only as a currently-building product experiment.

## Repository State

| Item | Status | Decision |
|---|---|---|
| Git repository | Initialized on `main` | Keep local commits and push when a remote is available. |
| Production app | Implemented | Next.js App Router, TypeScript, Tailwind CSS, static-first content. |
| Content architecture | Implemented | Canonical typed modules under `content/`. |
| Resume artifact | Implemented | Stable public path: `/resume/nguyen-duy-duc-resume.pdf`. |
| Project assets | Implemented | Public-safe generated diagrams, not raw private screenshots. |
| Deployment config | Implemented | Vercel-compatible with no environment variables. |

## Public Content Decisions

| Area | Final decision |
|---|---|
| Positioning | AI Product Engineer / Applied AI Engineer. |
| Narrative | Builds measurable, traceable, production-oriented AI products across discovery, engineering, evaluation, deployment, observability, and iteration. |
| Seniority | Do not present as senior. |
| Phone | Excluded from website content. |
| LinkedIn | Not displayed because no verified URL was available in the inspected public evidence. |
| GitHub | Public project repositories are linked where verified. |
| Education | List the two CV-supported institutions separately without inferring a relationship. |

## Education Source Of Truth

List exactly:

| Institution | Degree | Period | Detail |
|---|---|---|---|
| Hanoi University of Science and Technology | Bachelor of Computer Science | 2021-2026 | None |
| Troy University | B.S. Computer Science | 2021-2026 | GPA: 3.1/4.0 |

Do not label this as a dual degree, exchange, transfer, or joint program unless explicitly documented later.

## Project Hierarchy

| Project | Public treatment |
|---|---|
| Legolas AI | Flagship case study. |
| HanoiWorld | Secondary technical/research case study. |
| Powfolio | Currently Building / Product Experiment. |
| 30-Day Challenge | Evolving public build log. |

## Legolas AI Claim Safety

Allowed public claims:
- Legal assistant MVP for university/legal operations.
- 2-person team.
- Three AI workflows: citation-grounded Q&A, drafting, document review.
- Hybrid retrieval with dense search, BM25, and reciprocal rank fusion.
- Legal-aware chunking/ingestion and citation grounding.
- Split staging deployment across frontend, backend, database/storage, and retrieval service surfaces.
- Trace-based debugging for latency, provider fallback, and citation failures.
- Top 2 product at the program's final Demo Day.

Metrics source of truth:

| Metric | Value | Context |
|---|---|---|
| Citation hit rate | 46.67% to 80.00% | 30-case multi-source benchmark against overlap baseline. |
| Legal-number recall | 61.67% to 90.00% | 30-case multi-source benchmark against overlap baseline. |
| Multi-source fact score | 60.00% to 90.00% | 30-case multi-source benchmark against overlap baseline. |

Do not mix these values with older unrelated benchmark runs.

## Privacy And Public Safety

Do not publish:
- Phone number.
- API keys, tokens, environment variables, or internal service URLs.
- Uploaded legal documents, organization data, user data, or teammate-private details.
- Raw private screenshots or unsanitized debugging traces.
- Bundled git internals, dependency folders, or raw private evidence exports.

Implementation uses generated architecture, benchmark, workflow, and pipeline diagrams instead of raw screenshots.

## Remaining Content Limitations

- LinkedIn and personal GitHub profile URLs are omitted until verified.
- HanoiWorld has no public numeric performance claims.
- Powfolio has no public adoption or user validation claim.
- Resume PDF is copied as the formal downloadable artifact; website copy remains a separate structured presentation layer.
