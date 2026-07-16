# Design Specification

Figma status: connected account is view-only. A Figma file was not created. This local design specification is the handoff source for implementation.

## Design Goal

Create a personal portfolio that feels:
- Minimalist.
- Mysterious.
- High-tech.
- Editorial.
- Precise.
- Tactile.
- Active.
- Premium but restrained.

It must not feel:
- Cartoonish.
- Gaming-oriented.
- Cyberpunk.
- Neon sci-fi.
- Generic dark SaaS.
- Template marketplace.
- A collection of identical rounded cards.

## Visual Concept

Working concept:

> Evidence Field

The site should feel like a quiet technical dossier: dark spatial surfaces, precise typography, large evidence visuals, fine dividers, and subtle material depth. The visual language should suggest systems, retrieval, traces, and product workflows without using generic AI imagery.

## Palette

Use an obsidian/graphite base with warm readable text and a restrained mineral accent.

Suggested tokens:

```text
bg.base        #08090B
bg.elevated    #101216
bg.panel       #15181D
bg.fog         #E7E2D8
text.primary   #F2EFE7
text.secondary #B7B1A7
text.muted     #7C818A
line.subtle    #2A2E35
line.strong    #3A414B
accent.steel   #8EA4B8
accent.teal    #6D9F9B
accent.violet  #948AA8
danger.muted   #B67979
success.muted  #7A9B83
```

Rules:
- Do not rely on bright cyan, neon green, or dominant purple gradients.
- Avoid one-hue monochrome. Use neutral base plus steel/teal/violet-gray accents.
- Text contrast must pass WCAG AA.

## Typography

Recommended:
- Sans: Geist or Inter.
- Optional mono: Geist Mono or IBM Plex Mono for metadata and evidence labels.

Hierarchy:
- Hero H1: 64 to 88 px desktop, 40 to 48 px mobile.
- Section heading: 36 to 48 px desktop, 28 to 34 px mobile.
- Card heading: 20 to 28 px.
- Body: 16 to 18 px.
- Metadata: 12 to 14 px mono/sans.

Rules:
- Letter spacing should be 0.
- Do not scale font size with viewport width.
- Keep headings compact inside tool surfaces and previews.

## Layout

Desktop:
- Max content width: 1180 to 1280 px.
- Use editorial grids: 12 columns or asymmetric 5/7 split.
- Large visuals should occupy real space, not small thumbnails.
- Avoid cards inside cards.

Mobile:
- Single vertical sequence.
- Project previews remain immediately visible.
- No nested scroll containers.
- Simplify sticky/pinned effects.

## Components

### Navigation
- Fixed or sticky top with subtle translucent material.
- Name/monogram left.
- Links center/right.
- Resume/contact as text links or compact buttons.
- Visible focus rings.

### Hero
- Full first viewport but reveal hint of next section.
- No split hero card.
- Text should sit directly on layered background.
- Include compact proof indicators below CTAs.

### Proof Strip
- 3 or 4 signals.
- Fine borders, not pill overload.
- Each proof point should have label + compact evidence line.

### Project Preview
Always visible:
- Title.
- One-line problem.
- Role.
- Status.
- Visual.
- 1 to 2 proof points.
- CTA to case study.
- Button for quick detail.

Quick detail:
- Expand/collapse region below preview.
- Keyboard accessible.
- Stable layout.
- `aria-expanded` and focus management.
- No hover-only behavior.

### Case Study
- Editorial article structure.
- Sticky evidence rail on desktop.
- Large architecture diagram.
- Metrics table where evidence supports it.
- Trade-off sections should be visually distinct but not decorative.

### Process Section
Use a sequence:

```text
Discover -> Define -> Prototype -> Build -> Evaluate -> Deploy -> Observe -> Iterate
```

Each step gets:
- Verb.
- One short action line.
- Evidence example from projects.

### Challenge Log
- Chronological entries.
- Each entry has day, title, status, shipped artifact, next step.
- Day 0 entry exists from launch.

## Material Detail

Interactive blocks:
- Fine border.
- Soft shadow.
- Slight elevation on hover/focus.
- Subtle edge highlight.
- 6 to 8 px radius, unless a component is intentionally sharp.

Bubble/liquid details:
- Use sparingly as accent material.
- Controlled translucency.
- Inner highlight and soft shadow.
- No giant blobs.
- No unreadable glass buttons.
- No continuous morphing.

## Imagery

Use evidence visuals:
- Product screenshots.
- Architecture diagrams.
- Benchmark snippets.
- Trace diagrams.
- CLI output screenshots.

Do not use:
- Generic stock people.
- Abstract AI heads.
- Neon network graphics.
- Dark unreadable screenshots.

## Accessibility

Required:
- Semantic landmarks.
- Correct heading hierarchy.
- Keyboard navigation.
- Visible focus states.
- Reduced motion.
- Alt text for meaningful visuals.
- No horizontal overflow.
- Sufficient contrast.
- No hover-only content.

## Page-Specific Design

### Homepage Desktop

1. Hero evidence field.
2. Proof strip.
3. Selected Work grid with Legolas large and HanoiWorld/Powfolio secondary.
4. Sticky "How I Build" process.
5. Experience timeline.
6. Challenge teaser.
7. Contact closing.

### Homepage Mobile

1. Hero.
2. Proof strip as stacked compact rows.
3. Projects in vertical order.
4. Quick detail accordion.
5. Process as vertical steps.
6. Experience timeline.
7. Challenge/contact.

### Legolas Case Study

1. Hero: product problem + status + links.
2. Workflow visual: Q&A, draft, review.
3. Architecture diagram.
4. Evidence section: retrieval, benchmark, deployment, observability.
5. Trade-offs and lessons.

## Implementation Notes

Use CSS/Tailwind for most effects. Use Motion for React only where it materially improves scroll-linked or disclosure behavior. Avoid GSAP/Lenis unless CSS and Intersection Observer cannot meet the target.

