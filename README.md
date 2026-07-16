# Nguyen Duy Duc Portfolio

Static-first personal portfolio for Nguyen Duy Duc, positioned as an AI Product Engineer / Applied AI Engineer.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- React Server Components by default
- Static typed content modules
- No database, authentication, CMS, runtime secrets, or backend service

## Routes

- `/` - homepage with hero, proof strip, selected work, process, experience, challenge teaser, and contact
- `/work/legolas-ai` - flagship Legolas AI case study
- `/work/hanoiworld` - secondary technical/research case study
- `/work/powfolio` - currently-building product experiment
- `/challenge` - 30-Day Challenge build log
- `/resume/nguyen-duy-duc-resume.pdf` - stable resume path

## Content Architecture

Routine content changes should happen in `content/`, not React layout components.

- `content/profile.ts` - profile, canonical site URL, education, contact, resume path
- `content/experience.ts` - experience timeline
- `content/capabilities.ts` - capability groups
- `content/process.ts` - build process steps
- `content/projects/*.ts` - one canonical source for project preview, quick view, and case-study route
- `content/challenge/*.ts` - independent challenge entries
- `public/projects/<slug>/` - public-safe diagrams and media
- `public/resume/nguyen-duy-duc-resume.pdf` - formal downloadable resume

The project homepage preview, quick-view expansion, and `/work/<slug>` route all read from the same project object.

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Verification

```bash
npm run validate:content
npm run typecheck
npm run lint
npm run test
npm run build
npm run check
```

`npm run check` runs content validation, TypeScript, ESLint, smoke tests, and the production build.

## Vercel Import Settings

- Framework preset: `Next.js`
- Install command: `npm install`
- Build command: `npm run build`
- Output directory: Vercel default for Next.js
- Environment variables: none required
- Suggested project name: `duc-nguyen-portfolio`
- Suggested production URL slug: `duc-nguyen-ai`

Do not add environment variables for Day 0. The contact action uses `mailto:`.

## Post-Deploy Smoke Test

After Vercel deploys:

1. Open the production URL.
2. Check the homepage hero and proof strip.
3. Expand at least one project quick view with keyboard and pointer.
4. Open `/work/legolas-ai`, `/work/hanoiworld`, and `/work/powfolio`.
5. Open `/challenge`.
6. Open `/resume/nguyen-duy-duc-resume.pdf`.
7. Check the mobile navigation.
8. Confirm no console or hydration errors.
9. Confirm the social preview uses the portfolio title and description.

## Known Content Limitations

- LinkedIn and personal GitHub profile URLs are omitted until verified.
- HanoiWorld has no public numeric performance claims.
- Powfolio is presented as a currently-building product experiment, not a validated flagship product.
