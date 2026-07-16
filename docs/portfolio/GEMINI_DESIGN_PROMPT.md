# Gemini Design Generation Prompt

Use this prompt only if a visual design-generation pass is needed. It should produce production-oriented page designs, not a mood board.

```text
Design a production-ready personal portfolio website for Nguyen Duy Duc, positioned as an AI Product Engineer / Applied AI Engineer.

Primary audience:
- AI engineering recruiters
- Backend engineering recruiters
- Applied AI teams
- AI product teams
- Startup founders
- Forward-deployed engineering teams
- Technical hiring managers

Core positioning:
"Building AI products from ambiguous workflows to measurable production systems."

Supporting narrative:
Duc works across product discovery, system design, backend engineering, retrieval and model pipelines, evaluation, deployment, observability, and iteration.

Visual direction:
- Minimalist
- Mysterious
- High-tech
- Editorial
- Precise
- Tactile
- Active
- Premium but restrained

Do not make it:
- Cartoonish
- Gaming-oriented
- Cyberpunk
- Neon sci-fi
- Generic dark SaaS
- Template marketplace portfolio
- A collection of identical rounded cards

Palette:
- Obsidian / graphite base
- Carbon gray surfaces
- Warm off-white text
- Fog gray secondary text
- Muted steel
- Mineral teal or violet-gray accent
- No bright cyan or neon green
- No dominant purple gradient

Typography:
- Strong editorial hierarchy
- Sans-serif similar to Geist or Inter
- Optional mono for evidence labels
- No negative letter spacing
- No viewport-width font scaling

Pages / frames to design:
1. Desktop homepage, 1440 px wide
2. Mobile homepage, 390 px wide
3. Desktop Legolas AI case-study page, 1440 px wide
4. Mobile Legolas AI case-study page, 390 px wide

Homepage section order:
1. Navigation
   - Name or compact monogram
   - Work
   - Process
   - Challenge
   - About
   - Resume
   - Contact

2. Hero
   - H1: "Building AI products from ambiguous workflows to measurable production systems."
   - Supporting copy about applied AI, product thinking, backend/systems, evaluation, and deployment.
   - CTAs: Explore selected work, View resume, GitHub/contact secondary.
   - Hero should be full first viewport but hint at next section.
   - Do not put hero text in a card.

3. Proof strip
   - Use supported signals only:
     - Three legal AI workflows
     - 30-case multi-source benchmark
     - Hybrid retrieval and citation grounding
     - Split cloud deployment
   - If used, phrase the claim only as "Top 2 product at the program's final Demo Day."

4. Selected Work
   - Legolas AI as flagship
   - HanoiWorld as secondary ML/research project
   - Powfolio as currently building/product experiment
   - Every project preview must show:
     - Title
     - One-line problem
     - My role
     - Status
     - Strong visual
     - One or two proof points
     - CTA to inspect further
   - No carousel
   - No hover-only interaction

5. How I Build
   - Process: Discover -> Define -> Prototype -> Build -> Evaluate -> Deploy -> Observe -> Iterate
   - Show product management, engineering, forward deployment, and research as one workflow.

6. Experience
   - VinUni AI Engineering Trainee
   - Sapo Fullstack Developer Intern
   - Shoop City QA Tester Intern
   - Concise editorial timeline.

7. Currently Building / 30-Day Challenge
   - Day 0: Personal portfolio, build -> deploy -> submit workflow, live URL placeholder.

8. Contact / closing
   - Email, verified public project links, LinkedIn only if verified, resume.
   - Do not show phone number.

Legolas AI case-study content:
- Product problem: legal/admin teams need cited answers, drafting, and review across scattered legal sources.
- Role: 2-person team; clearly distinguish co-developed vs personal contribution.
- Workflows: citation-grounded Q&A, drafting, document review.
- Architecture: React/Vite frontend, FastAPI backend, PostgreSQL/Supabase, Chroma/BM25 retrieval, Hugging Face retrieval service, Vercel/Render deployment.
- Evidence: legal-aware ingestion, hybrid retrieval, 30-case benchmark, citation grounding, Langfuse tracing.
- Trade-offs: citation reliability, latency, cloud memory limits, staging/demo stability, private document safety.

Interaction annotations to include:
- Hero scroll zoom-out: subtle scale down, no scroll-jacking.
- Selected work sticky visual swap on desktop only.
- Project quick detail expandable region with aria-expanded behavior.
- Reduced-motion fallback.
- Mobile simplification: vertical project sequence, no sticky swap, no nested scroll.

Component states:
- Default, hover, focus, active, expanded, disabled where applicable.
- Buttons, project preview, quick detail accordion, process step, metric/proof item, timeline entry.

Accessibility:
- High contrast
- Visible focus
- Semantic heading order
- No hover-only content
- Tap targets at least 44 px on mobile
- No horizontal overflow

Output:
Create polished, implementation-ready page designs with exact section order, responsive layout rules, typography scale, color tokens, component states, and motion annotations. Avoid conceptual mood-board output.
```
