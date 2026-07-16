# Implementation Task System

This file is implementation-ready but execution has not started. Do not begin production code until the user approves.

## Dependency Graph

```text
P0 -> P1
P1 -> P2
P1 -> P3
P2 + P3 -> P4
P3 -> P5
P4 + P5 -> P6
P4 + P5 -> P7
P5 -> P8
P3 -> P9
P6 + P7 + P8 + P9 -> P10
P6 + P7 + P8 + P9 -> P11
P10 + P11 -> P12
P12 -> P13
```

Parallel opportunities:
- P2 and P3 can run in parallel after P1.
- P7, P8, and P9 can run partly in parallel after P4/P5.
- P10 and P11 can run in parallel once core pages exist.

## P0 - Repository And Content Audit

Objective:
- Convert this planning audit into implementation inputs.

Rationale:
- The current workspace is empty and evidence lives in adjacent materials.

Files likely to change:
- `README.md`
- `docs/portfolio/*`
- no production app files unless execution is approved.

Dependencies:
- None.

Implementation steps:
1. Confirm source materials and copied resume path.
2. Confirm Git status and repository initialization strategy.
3. Confirm which public links are allowed.
4. Reconcile Legolas metrics.
5. Confirm education/LinkedIn details.

Acceptance criteria:
- `docs/portfolio/AUDIT.md` exists.
- No phone number appears in website content.
- Unsupported claims are marked as needs verification.
- Powfolio treatment is recorded as "Currently Building / Product Experiment."

Verification commands:
- `rg -n "Top 2|phone|\\+84|passionate|cutting-edge|revolution" docs/portfolio`
- `Get-ChildItem docs/portfolio`

Risks:
- Missing latest CV source.
- Ambiguous education fields.

Rollback:
- Revert docs only.

Estimated complexity: S

Can run in parallel: No

Definition of done:
- Planning audit is accepted as source of truth for implementation.

## P1 - Product Positioning And Information Architecture

Objective:
- Lock the portfolio narrative and route structure.

Rationale:
- The site should sell product/AI engineering capability, not generic frontend skills.

Files likely to change:
- `content/profile.ts`
- `content/capabilities.ts`
- `app/page.tsx`
- `app/work/[slug]/page.tsx`

Dependencies:
- P0.

Implementation steps:
1. Create profile and site config.
2. Encode homepage section order.
3. Define project ranking and visibility rules.
4. Confirm route list.
5. Draft concise public copy from evidence.

Acceptance criteria:
- Homepage can answer the five visitor questions in first two sections.
- IA includes `/`, `/work/legolas-ai`, `/work/hanoiworld`, `/challenge`, and resume path.
- No unnecessary pages are created.
- No unsupported metrics are displayed.

Verification commands:
- `npm run validate:content`
- Manual copy review against `CONTENT_INVENTORY.md`

Risks:
- Overloading homepage with case-study detail.

Rollback:
- Revert content modules and route config.

Estimated complexity: M

Can run in parallel: No

Definition of done:
- Product copy and route structure are ready for design/build.

## P2 - Design System And Interaction Prototype

Objective:
- Build design tokens, layout primitives, and motion prototypes.

Rationale:
- The desired direction requires restraint and consistency before page assembly.

Files likely to change:
- `app/globals.css`
- `tailwind.config.*`
- `components/ui/*`
- `components/motion/*`
- `components/layout/*`

Dependencies:
- P1.

Implementation steps:
1. Create color, spacing, radius, shadow, and typography tokens.
2. Add base layout primitives.
3. Prototype hero zoom-out with reduced-motion fallback.
4. Prototype project quick-detail disclosure.
5. Validate contrast and focus states.

Acceptance criteria:
- Tokens match `DESIGN_SPEC.md`.
- Reduced motion disables scroll-linked transforms.
- Focus states are visible on all dark surfaces.
- No component uses unreadable glass backgrounds.

Verification commands:
- `npm run dev`
- Browser keyboard pass
- `npm run lint`

Risks:
- Overbuilding motion before content.

Rollback:
- Revert design tokens and motion components.

Estimated complexity: M

Can run in parallel: Yes, after P1.

Definition of done:
- Reusable design primitives exist and are accessible.

## P3 - Static Content Architecture, Schemas, And Maintenance Workflow

Objective:
- Separate content from presentation with validation.

Rationale:
- Future CV, project, metric, link, screenshot, and challenge updates must not require React edits.

Files likely to change:
- `content/profile.ts`
- `content/experience.ts`
- `content/capabilities.ts`
- `content/projects/*.ts`
- `content/challenge/*.ts`
- `lib/content/*`
- `scripts/validate-content.ts`
- `docs/portfolio/CONTENT_UPDATE_GUIDE.md`

Dependencies:
- P1.

Implementation steps:
1. Define typed schemas.
2. Create canonical profile, experience, capabilities, project, and challenge data.
3. Add validation script.
4. Add asset path conventions.
5. Add content update workflow docs.

Acceptance criteria:
- Malformed project data fails validation.
- Project listing and detail routes read from the same source.
- Challenge entries are independent files.
- Resume path is configured once.

Verification commands:
- `npm run validate:content`
- `npm run typecheck`

Risks:
- Content schema too rigid for future case studies.

Rollback:
- Revert schema and content modules.

Estimated complexity: M

Can run in parallel: Yes, after P1.

Definition of done:
- Content can be edited without touching layout components.

## P4 - Reusable Project Preview, Expansion, And Case-Study System

Objective:
- Build project components generated from canonical project data.

Rationale:
- Discoverability and progressive disclosure are core requirements.

Files likely to change:
- `components/project/ProjectPreview.tsx`
- `components/project/ProjectQuickView.tsx`
- `components/project/ProjectEvidence.tsx`
- `app/work/[slug]/page.tsx`
- `lib/content/projects.ts`

Dependencies:
- P2 and P3.

Implementation steps:
1. Build always-visible project preview.
2. Build accessible quick detail disclosure.
3. Build case-study renderer.
4. Add static params for visible projects.
5. Add hidden/draft behavior.

Acceptance criteria:
- Every selected project preview shows title, visual, summary, role, status, evidence, and CTA.
- Quick detail works by keyboard and tap.
- `aria-expanded` is correct.
- Full case study and quick detail use the same data source.

Verification commands:
- `npm run check`
- Keyboard navigation test
- Mobile viewport test

Risks:
- Overly generic renderer weakens editorial quality.

Rollback:
- Revert project components and route.

Estimated complexity: L

Can run in parallel: No

Definition of done:
- Project previews and project routes are data-driven and accessible.

## P5 - Static Content And Project Data Model

Objective:
- Author initial production content.

Rationale:
- Strong implementation depends on accurate, evidence-backed content.

Files likely to change:
- `content/projects/legolas-ai.ts`
- `content/projects/hanoiworld.ts`
- `content/projects/powfolio.ts`
- `content/experience.ts`
- `content/capabilities.ts`
- `public/projects/*`
- `public/resume/*`

Dependencies:
- P3.

Implementation steps:
1. Copy resume PDF to stable path.
2. Create Legolas data and case-study sections.
3. Create HanoiWorld data with caveats.
4. Create Powfolio current-building data.
5. Add initial assets or placeholders that are not lorem ipsum.
6. Mark unverified data hidden or caveated.

Acceptance criteria:
- No lorem ipsum.
- No phone number.
- Legolas is featured and highest priority.
- Powfolio is not labeled as validated flagship.
- Top 2 claim uses only restrained user-confirmed wording.

Verification commands:
- `npm run validate:content`
- `rg -n "lorem|Top 2|\\+84|passionate|expert|mastered" content public docs`

Risks:
- Screenshots may expose private data.

Rollback:
- Remove/swap content modules and assets.

Estimated complexity: M

Can run in parallel: Yes, after P3.

Definition of done:
- Initial content is publishable and evidence-aware.

## P6 - Homepage Implementation

Objective:
- Implement the main portfolio page.

Rationale:
- Homepage must answer the visitor's primary questions quickly.

Files likely to change:
- `app/page.tsx`
- `components/sections/*`
- `components/layout/*`
- `components/project/*`

Dependencies:
- P4 and P5.

Implementation steps:
1. Build hero.
2. Build proof strip.
3. Build selected work section.
4. Build process section.
5. Build experience timeline.
6. Build challenge teaser.
7. Build contact close.

Acceptance criteria:
- First viewport communicates role and problem class.
- Selected projects are visible without hover/carousel.
- CTAs work.
- Mobile layout is vertical and readable.

Verification commands:
- `npm run check`
- Manual desktop/mobile review

Risks:
- Page becomes too dense.

Rollback:
- Revert homepage section components.

Estimated complexity: L

Can run in parallel: No

Definition of done:
- Homepage is responsive, accessible, and content-complete.

## P7 - Legolas AI Case-Study Implementation

Objective:
- Build the flagship case-study page.

Rationale:
- Legolas is the strongest evidence of applied AI product engineering.

Files likely to change:
- `content/projects/legolas-ai.ts`
- `app/work/[slug]/page.tsx`
- `components/project/*`
- `public/projects/legolas-ai/*`

Dependencies:
- P4 and P5.

Implementation steps:
1. Author case-study sections.
2. Add architecture visual.
3. Add workflow visual.
4. Add metrics with source/caveat.
5. Add deployment/observability trade-offs.
6. Add links and confidentiality note.

Acceptance criteria:
- Page clearly distinguishes personal contribution and team output.
- No Langfuse demo screenshots are used as real evidence.
- Metrics have source labels.
- Case study includes problem, role, architecture, evaluation, deployment, trade-offs, lessons.

Verification commands:
- `npm run validate:content`
- Manual evidence review
- Link check

Risks:
- Overclaiming production status or personal ownership.

Rollback:
- Hide route by setting project visibility to draft.

Estimated complexity: L

Can run in parallel: Partly with P8/P9 after P4/P5.

Definition of done:
- Legolas route is the strongest project proof on the site.

## P8 - Additional Work And Experience Sections

Objective:
- Implement HanoiWorld, Powfolio treatment, experience, and capabilities.

Rationale:
- These add breadth without distracting from Legolas.

Files likely to change:
- `content/projects/hanoiworld.ts`
- `content/projects/powfolio.ts`
- `content/experience.ts`
- `content/capabilities.ts`
- `components/sections/Experience.tsx`
- `components/sections/Capabilities.tsx`

Dependencies:
- P5.

Implementation steps:
1. Build experience timeline.
2. Build capability/process section.
3. Add HanoiWorld preview/route if evidence is sufficient.
4. Add Powfolio current-building card.
5. Keep secondary work concise.

Acceptance criteria:
- HanoiWorld does not show unsupported metrics.
- Powfolio appears as current experiment.
- Experience bullets are concise and not CV copy-paste.
- Capabilities are workflow-oriented, not a raw framework list.

Verification commands:
- `npm run check`
- Manual content review

Risks:
- Secondary projects dilute flagship narrative.

Rollback:
- Hide project via `visibility: "hidden"`.

Estimated complexity: M

Can run in parallel: Yes, after P5.

Definition of done:
- Breadth is represented without weakening positioning.

## P9 - 30-Day Challenge Build Log

Objective:
- Add a maintainable challenge route and Day 0 entry.

Rationale:
- The challenge should support future daily entries without rebuilding the layout.

Files likely to change:
- `content/challenge/day-00.ts`
- `app/challenge/page.tsx`
- `components/sections/ChallengeLog.tsx`

Dependencies:
- P3.

Implementation steps:
1. Define challenge entry schema.
2. Add Day 0 entry.
3. Build challenge listing.
4. Add status/live URL placeholder fields.
5. Link from homepage.

Acceptance criteria:
- New challenge entry can be added by creating one content file.
- Day 0 includes portfolio build -> deploy -> submit workflow.
- Live URL placeholder is data-driven.

Verification commands:
- `npm run validate:content`
- `npm run check`

Risks:
- Challenge route feels empty on Day 0.

Rollback:
- Keep challenge teaser only and hide route until entries grow.

Estimated complexity: S

Can run in parallel: Yes, after P3.

Definition of done:
- Challenge route is ready for Day 1 to Day 30 entries.

## P10 - Responsive Behavior And Accessibility

Objective:
- Make the site robust across desktop, tablet, mobile, keyboard, and reduced motion.

Rationale:
- Motion and dense visuals can easily damage usability.

Files likely to change:
- CSS and component files across app.
- Playwright or verification scripts if added.

Dependencies:
- P6 through P9.

Implementation steps:
1. Test at 320, 390, 768, 1024, 1440 px.
2. Verify keyboard order.
3. Verify focus states.
4. Verify reduced motion.
5. Check alt text.
6. Remove horizontal overflow.

Acceptance criteria:
- No horizontal overflow.
- All interactive elements are keyboard reachable.
- Quick view disclosure works on touch.
- Reduced motion disables scroll transforms.
- Text does not overlap or clip.

Verification commands:
- `npm run check`
- Browser devtools responsive pass
- Optional Playwright smoke test

Risks:
- Sticky/pinned sections break on mobile.

Rollback:
- Disable advanced motion behind media queries.

Estimated complexity: M

Can run in parallel: Yes, with P11.

Definition of done:
- Site is accessible and responsive enough for deployment.

## P11 - SEO, Metadata, Analytics Readiness, And Social Preview

Objective:
- Add metadata, sitemap, robots, JSON-LD, and share surfaces.

Rationale:
- Recruiters and hiring teams should receive correct previews and indexable content.

Files likely to change:
- `app/layout.tsx`
- `app/sitemap.ts`
- `app/robots.ts`
- `lib/seo/*`
- `public/favicon.*`
- `public/og/*`

Dependencies:
- P6 through P9.

Implementation steps:
1. Add site metadata.
2. Add per-project metadata.
3. Add canonical URL config.
4. Add JSON-LD Person schema.
5. Add CreativeWork/SoftwareApplication schema where useful.
6. Add favicon and OG image strategy.

Acceptance criteria:
- Every public route has title and description.
- Sitemap includes visible routes only.
- Robots is present.
- Canonical URL comes from one config field.
- No analytics script is added unless approved.

Verification commands:
- `npm run build`
- Inspect generated route metadata

Risks:
- Canonical placeholder accidentally ships as final domain.

Rollback:
- Use neutral site URL placeholder and document update.

Estimated complexity: M

Can run in parallel: Yes, with P10.

Definition of done:
- The site is shareable and search-ready.

## P12 - Testing, Performance, And Visual QA

Objective:
- Verify build quality before handoff.

Rationale:
- The final user action should be Vercel import/deploy, not debugging.

Files likely to change:
- Test scripts.
- Minor bugfixes.
- README verification section.

Dependencies:
- P10 and P11.

Implementation steps:
1. Run content validation.
2. Run typecheck/lint/build.
3. Run local dev server.
4. Browser smoke test key routes.
5. Check console errors.
6. Check broken links.
7. Check image loading and alt text.

Acceptance criteria:
- `npm run check` passes.
- No hydration warnings.
- No console errors on main routes.
- No broken internal links.
- Lighthouse/Core Web Vitals issues are addressed where practical.

Verification commands:
- `npm run check`
- `npm run dev`
- Browser route smoke test

Risks:
- External links or staging URLs fail intermittently.

Rollback:
- Mark unstable links as disabled or "available on request."

Estimated complexity: M

Can run in parallel: No

Definition of done:
- Build is ready for Vercel import.

## P13 - Vercel Deployment Handoff

Objective:
- Prepare final deploy instructions requiring no manual engineering from user.

Rationale:
- User should only connect GitHub to Vercel, confirm settings, optionally add domain, and deploy.

Files likely to change:
- `README.md`
- `docs/portfolio/VERCEL_HANDOFF.md`
- `package.json`
- Next config if needed.

Dependencies:
- P12.

Implementation steps:
1. Add README deployment section.
2. Confirm package scripts.
3. Confirm no env vars required.
4. Add post-deploy smoke checklist.
5. Provide suggested Vercel project name and production slug.

Acceptance criteria:
- `npm run build` passes locally.
- Vercel settings are documented.
- No source edits are required before deploy.
- `.env.example` exists only if genuinely needed.
- Handoff checklist is complete.

Verification commands:
- `npm run check`
- `git status --short`

Risks:
- Workspace still not linked to GitHub.

Rollback:
- Keep deployment docs without creating Vercel config.

Estimated complexity: S

Can run in parallel: No

Definition of done:
- User can import repo into Vercel and click Deploy.
