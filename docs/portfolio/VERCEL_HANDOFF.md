# Vercel Handoff Plan

This is the deployment handoff plan. Deployment has not started.

## Desired Final User Actions

After implementation, the user should only need to:

1. Push or confirm the repository is on GitHub.
2. Import the repository into Vercel.
3. Confirm framework detection.
4. Set the production branch.
5. Optionally add a custom domain.
6. Click Deploy.

No manual source edits should be required.

## Suggested Vercel Settings

Project name:

```text
duc-nguyen-portfolio
```

Suggested production URL slug:

```text
duc-nguyen-ai
```

Framework preset:

```text
Next.js
```

Build command:

```text
npm run build
```

Install command:

```text
npm install
```

Output directory:

```text
Vercel default for Next.js
```

Environment variables:

```text
None required for Day 0
```

## Required Package Scripts

Implementation should provide:

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

If the selected Next.js version no longer supports `next lint`, replace `lint` with the supported ESLint command and keep `npm run check` valid.

## Canonical URL Handling

Store canonical URL in one content/config field:

```ts
siteUrl: "https://duc-nguyen-ai.vercel.app"
```

Before a custom domain exists, use the intended Vercel URL placeholder in content config. This should be documented but should not require source edits from the user during Vercel import.

## Resume Path

The downloadable resume should be served at:

```text
/resume/nguyen-duy-duc-resume.pdf
```

Replacing the resume should require changing one file and, only if renamed, one config field.

## Pre-Handoff Verification

Codex should run before handoff:

```bash
npm run check
```

Manual smoke checks:
- `/`
- `/work/legolas-ai`
- `/work/hanoiworld` if visible
- `/challenge`
- `/resume/nguyen-duy-duc-resume.pdf`
- 404 route

Browser checks:
- No console errors.
- No hydration warnings.
- No broken internal links.
- No horizontal overflow at mobile widths.
- Resume opens.
- Contact links work.

## Vercel Import Checklist

In Vercel:
1. Click Add New Project.
2. Import GitHub repository.
3. Confirm framework preset is Next.js.
4. Confirm build command is `npm run build`.
5. Confirm no environment variables are required.
6. Select production branch, usually `main`.
7. Click Deploy.

Optional:
- Add custom domain.
- Update `siteUrl` content config in a later content update if the domain differs from the placeholder.

## Post-Deploy Smoke Test

After deploy:
- Open the production URL.
- Check homepage hero and selected work.
- Open Legolas case study.
- Open resume.
- Check email, public project, resume, and any verified social links.
- Check mobile layout using browser devtools.
- Share URL preview in a chat app or social debugger if desired.

## README Deployment Section

Implementation should add a README section with:
- Local setup.
- Validation commands.
- Vercel deployment checklist.
- Content update guide link.
- No required secrets.

## Current Blockers

None for Day 0 Vercel import.

Known content limitations:
- LinkedIn and personal GitHub profile URLs are omitted until verified.
- The canonical URL is the suggested Vercel slug and can be updated later in `content/profile.ts` if the deployed domain differs.
