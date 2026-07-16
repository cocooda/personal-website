# Information Architecture

## Route Map

Required routes for Day 0:

| Route | Purpose | Status |
|---|---|---|
| `/` | Main portfolio narrative and selected work | Required |
| `/work/legolas-ai` | Flagship case study | Required |
| `/work/hanoiworld` | Secondary ML/research project | Required if enough source detail is available |
| `/challenge` | 30-Day Challenge / Currently Building log | Required |
| `/resume/nguyen-duy-duc-resume.pdf` | Stable downloadable resume | Required |

Optional route:

| Route | Decision |
|---|---|
| `/about` | Defer unless homepage becomes too dense. A compact About section on `/` is enough for Day 0. |
| `/work/powfolio` | Implemented as a concise product-experiment case study. It must not compete with Legolas AI as the flagship. |

## Navigation

Desktop:
- Duc Nguyen or compact monogram.
- Work.
- Process.
- Challenge.
- About.
- Resume.
- Contact.

Mobile:
- Visible name/monogram and menu button.
- Menu links must be normal tap targets.
- Resume/contact remain visible in menu without hover dependencies.

## Homepage Structure

1. Hero
   - Positioning headline.
   - Short supporting copy.
   - CTAs: Explore selected work, View resume, GitHub/contact secondary.
   - Visual: abstract evidence surface or product-system composition, not generic AI art.

2. Proof strip
   - 3 to 4 supported signals.
   - Use the user-confirmed Top 2 Demo Day claim only with restrained program-context wording.

3. Selected Work
   - Immediately visible previews for Legolas AI, HanoiWorld, Powfolio/current experiment.
   - No carousel.
   - No hover-only disclosure.
   - Each preview shows title, one-line problem, role, status, visual, proof points, and action.

4. How I Build
   - Discover -> Define -> Prototype -> Build -> Evaluate -> Deploy -> Observe -> Iterate.
   - Show product, engineering, forward deployment, and research as one workflow.

5. Experience
   - Editorial timeline, concise.
   - VinUni AI Engineering Trainee.
   - Sapo Fullstack Developer Intern.
   - Shoop City QA Tester Intern.

6. Currently Building
   - 30-Day Challenge.
   - Initial Day 0 entry: personal portfolio build/deploy/submit workflow and live URL placeholder.
   - Powfolio can appear here as a product experiment if useful.

7. About / Contact
   - Short bio.
   - Email, GitHub, LinkedIn if verified, resume.
   - No phone number by default.

## Project Progressive Disclosure

Level 1: Always visible preview
- Title.
- Visual.
- Short description.
- Role.
- Key evidence.
- Status.
- CTA.

Level 2: Expandable quick detail
- Accessible button: "Quick view" or "See evidence."
- `aria-expanded` and focus management.
- Shows contribution, architecture, outcomes, and links.
- Works by click/tap/keyboard.
- Does not depend on hover.
- Does not resize unpredictably.

Level 3: Full case study
- Route: `/work/<slug>`.
- Product context.
- Decisions and trade-offs.
- Architecture.
- Research/evaluation.
- Outcomes.
- Lessons.
- Gallery/walkthrough.

## Case Study Structure

For Legolas AI:
1. Overview: what problem, who it served, current status.
2. Product workflows: Q&A, drafting, review.
3. My role and team context.
4. Architecture: frontend, FastAPI, database/storage, retrieval service, providers.
5. Legal-aware ingestion and retrieval.
6. Evaluation: 30-case benchmark and public retrieval benchmark where appropriate.
7. Deployment and observability.
8. Trade-offs: legal grounding, latency, cloud constraints, private data, demo stability.
9. Lessons and next steps.

For HanoiWorld:
1. Overview: autonomous driving world model.
2. My contribution: JEPA-style observation encoding, preprocessing, training pipeline, experiments.
3. Architecture: representation encoder, RSSM latent dynamics, actor-critic control.
4. Evaluation dimensions: collision rate, episode reward, scenario-level planning metrics.
5. Limitations: group project, no local evidence inspected yet, no public performance numbers unless verified.

For Powfolio:
1. Keep as current experiment, not flagship.
2. Explain problem: private/local evidence is hard to turn into public proof.
3. Show MVP pipeline and passing tests.
4. Mark validation/adoption as open.

## Footer

Footer should include:
- Name.
- Email.
- GitHub.
- LinkedIn if verified.
- Resume.
- Last updated from content config.

Do not include:
- Phone number.
- Private repository names beyond public links.
- Internal service URLs.
