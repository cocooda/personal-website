# Motion Storyboard

Motion should support comprehension. It must never block navigation, hide core content, or create scroll-jacking.

## Global Motion Rules

- Reduced motion support is mandatory.
- Mobile uses simplified fades/transforms.
- No constant floating animation across the whole page.
- No animation delay before content is readable.
- No horizontal drag-only navigation.
- Prefer CSS transforms, Intersection Observer, and lightweight React client components.

## Scene 1: Hero Zoom-Out

Reference: PAM-style scroll transition.

Initial state:
- Hero fills most of viewport.
- Background evidence field has subtle grain and layered panels.
- Headline appears immediately.

Scroll behavior:
- Hero visual layer scales from 1.04 to 0.94 as user scrolls.
- Text moves slightly upward.
- Proof strip fades into prominence below.

Reduced motion:
- Static hero.
- Proof strip visible without transition.

Acceptance:
- User can click nav/CTA immediately.
- Next section is hinted at in first viewport.
- No scroll lock.

## Scene 2: Selected Work Evidence Cards

Reference: OBYS-style feature storytelling without hiding content.

Desktop:
- Legolas preview spans wider columns.
- Visual area is sticky inside the section only after all project titles are visible.
- As the user scrolls through project evidence, the visual swaps between:
  1. Workflow map.
  2. Retrieval architecture.
  3. Evaluation snapshot.
  4. Deployment topology.

Mobile:
- All visuals appear inline.
- No sticky swap.

Quick detail motion:
- Height/opacity transition under the project preview.
- Focus moves to the expanded region heading.
- Collapse returns focus to triggering button.

Acceptance:
- Every project title and summary is visible before interaction.
- Expansion works by keyboard and tap.
- Layout does not jump unpredictably.

## Scene 3: How I Build Process

Desktop:
- Sticky left rail with process verbs.
- Right side scrolls through evidence-backed examples.
- Active step changes by Intersection Observer.

Steps:
1. Discover.
2. Define.
3. Prototype.
4. Build.
5. Evaluate.
6. Deploy.
7. Observe.
8. Iterate.

Motion:
- Active step gets subtle highlight and line extension.
- Evidence panel fades in 12 to 20 px upward.

Reduced motion:
- All steps are static and readable.

## Scene 4: Legolas Case Study

Desktop:
- Article scrolls normally.
- Sticky evidence rail shows current artifact type:
  - User workflow.
  - Retrieval.
  - Benchmark.
  - Deployment.
  - Observability.

Motion:
- Visuals crossfade.
- Diagram lines draw in once, then remain static.
- Metrics count-up is optional and should be disabled in reduced motion.

Mobile:
- Evidence rail becomes inline blocks.

## Scene 5: Tactile Interactions

Buttons:
- 1 to 2 px translateY on hover.
- Subtle shadow increase.
- Clear focus ring.

Project previews:
- Slight scale to 1.01 on hover/focus-within.
- Border highlight changes to accent.steel.
- No tilt effects.

Material bubbles:
- Only as small accent surfaces around evidence snippets.
- Static or one-time entry transition.

## Scene 6: Challenge Log

Day entries:
- New entries use simple reveal animation.
- Status tag changes are instant and accessible.

Day 0:
- "Personal portfolio."
- "Build -> deploy -> submit workflow."
- Status: planned / in progress until implementation.
- Live URL placeholder lives in content data.

## QA Checklist

- `prefers-reduced-motion` disables scroll-linked transforms.
- Keyboard users can reach every interactive element.
- Focus is visible on dark backgrounds.
- Project quick detail uses `aria-expanded`.
- No content appears only after animation completion.
- No horizontal overflow at 320 px width.
- No console animation errors.

