# Technical Architecture

## Stack Decision

Recommended Day 0 stack:

- Next.js App Router.
- TypeScript.
- Tailwind CSS.
- React Server Components by default.
- Client components only for navigation disclosure, project quick views, and scroll/motion effects.
- Static-first content.
- No database.
- No authentication.
- No external CMS.
- No paid runtime dependency.
- No required runtime secrets.

As of the audit date, Next.js docs and npm report latest stable Next.js as `16.2.10`. Implementation should use `next@latest`, `react@latest`, and `react-dom@latest` at execution time, avoiding canary releases unless explicitly approved.

References checked:
- https://nextjs.org/docs/app
- https://www.npmjs.com/package/next

## Proposed File Structure

```text
app/
  layout.tsx
  page.tsx
  not-found.tsx
  sitemap.ts
  robots.ts
  work/
    [slug]/
      page.tsx
  challenge/
    page.tsx
components/
  layout/
  sections/
  project/
  motion/
  ui/
content/
  profile.ts
  experience.ts
  capabilities.ts
  projects/
    legolas-ai.ts
    hanoiworld.ts
    powfolio.ts
  challenge/
    day-00.ts
lib/
  content/
    schemas.ts
    projects.ts
    challenge.ts
    validation.ts
  seo/
  utils/
public/
  projects/
    legolas-ai/
    hanoiworld/
    powfolio/
  resume/
    nguyen-duy-duc-resume.pdf
docs/
  portfolio/
```

## Content Model

Use typed TypeScript content modules for Day 0. This keeps content:
- Version-controlled.
- Type-safe.
- Easy to edit.
- Vercel-compatible.
- Free from CMS dependencies.
- Independent from React layout components.

Schema fields:

```ts
type ProjectContent = {
  slug: string;
  title: string;
  shortTitle: string;
  status: "shipped" | "staging" | "current" | "archived";
  featured: boolean;
  visibility: "public" | "hidden" | "draft";
  priority: number;
  oneLineSummary: string;
  problem: string;
  role: string;
  teamContext: string;
  contributions: string[];
  outcomes: string[];
  metrics: Array<{
    label: string;
    value: string;
    source: string;
    caveat?: string;
  }>;
  technologies: string[];
  thumbnail?: string;
  previewMedia?: string;
  gallery: Array<{
    src: string;
    alt: string;
    caption?: string;
  }>;
  liveUrl?: string;
  repositoryUrl?: string;
  caseStudyUrl?: string;
  startedAt?: string;
  completedAt?: string;
  lastUpdated: string;
  confidentialityNote?: string;
  challengeDays?: number[];
  sections: Array<{
    id: string;
    title: string;
    body: string;
  }>;
};
```

Use `satisfies ProjectContent` and an explicit validation script. Add Zod only if it materially improves error clarity. If Zod is added, keep it as a normal dependency and use it at build/dev validation time.

## Data Flow

```text
content/projects/*.ts
  -> lib/content/projects.ts
  -> homepage selected work
  -> project quick view
  -> /work/[slug] static params
  -> project metadata / JSON-LD
```

The homepage preview, quick detail, and case-study page must all read from the same project object.

## Rendering Strategy

- Static generation for all routes.
- `generateStaticParams` for project pages.
- `generateMetadata` per project from content data.
- No route handlers unless a real Day 0 requirement appears.
- `mailto:` for contact.

## SEO

Required:
- Site metadata.
- Project metadata.
- Open Graph and Twitter/X cards.
- Canonical URL config in `content/profile.ts`.
- Sitemap.
- Robots.
- JSON-LD Person schema.
- CreativeWork/SoftwareApplication schema where useful.
- Favicon.
- Custom 404 page.

Canonical URL:
- Store as a single config field, for example `profile.siteUrl`.
- Use placeholder value in content until production URL is known.
- Do not require manual source edits before deployment; make it a clearly documented content config value.

## Resume Handling

Stable public path:

```text
/resume/nguyen-duy-duc-resume.pdf
```

Content config:

```ts
resume: {
  label: "Resume",
  href: "/resume/nguyen-duy-duc-resume.pdf",
  fileName: "nguyen-duy-duc-resume.pdf",
}
```

The site must not parse PDF content at runtime. Structured content is the portfolio source; PDF is the formal downloadable artifact.

## Motion Implementation

Preferred order:
1. CSS transitions/transforms.
2. Intersection Observer.
3. Motion for React only for project disclosure or scroll-linked transforms that are hard to express cleanly.

Avoid:
- GSAP unless truly necessary.
- Lenis unless native scroll remains accessible.
- Any animation that controls discoverability.

## Quality Gates

Scripts to plan:

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "typecheck": "tsc --noEmit",
  "validate:content": "tsx scripts/validate-content.ts",
  "check": "npm run validate:content && npm run typecheck && npm run lint && npm run build"
}
```

If the selected Next.js version no longer supports `next lint`, use ESLint CLI directly.

## Deployment Fit

The project should deploy to Vercel with:
- No environment variables required.
- Standard Next.js framework detection.
- Build command: `npm run build`.
- Output: Vercel-managed Next.js output.
- No database.
- No server dependency.
- No manual source edits by user before deploy.

