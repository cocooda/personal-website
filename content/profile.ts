import type { SiteLink } from "@/lib/content/schemas";

export const profile = {
  name: "Nguyen Duy Duc",
  shortName: "Duc Nguyen",
  initials: "DD",
  role: "AI Product Engineer / Applied AI Engineer",
  location: "Hanoi, Vietnam",
  email: "ddnguyen4779@gmail.com",
  siteUrl: "https://duc-nguyen-ai.vercel.app",
  headline: "Building AI products from ambiguous workflows to measurable production systems.",
  bio: "I work across product discovery, backend systems, retrieval and model pipelines, evaluation, deployment, observability, and iteration to turn AI concepts into usable workflows.",
  positioning:
    "Production-oriented applied AI builder across product discovery, engineering, evaluation, deployment, observability, and iteration.",
  resume: {
    label: "Resume",
    href: "/resume/nguyen-duy-duc-resume.pdf",
    fileName: "nguyen-duy-duc-resume.pdf",
  },
  links: [
    {
      label: "Email",
      href: "mailto:ddnguyen4779@gmail.com",
      kind: "email",
      verified: true,
    },
    {
      label: "Resume",
      href: "/resume/nguyen-duy-duc-resume.pdf",
      kind: "resume",
      verified: true,
    },
    {
      label: "Legolas AI GitHub",
      href: "https://github.com/AI20K-Build-Cohort-2/C2-App-108",
      kind: "external",
      verified: true,
    },
    {
      label: "HanoiWorld GitHub",
      href: "https://github.com/CS-3331-Fundamental-of-AI/WorldModel-Self-Driving-Car",
      kind: "external",
      verified: true,
    },
  ] satisfies SiteLink[],
  social: {
    githubProfile: null as string | null,
    linkedin: null as string | null,
  },
  education: [
    {
      institution: "Hanoi University of Science and Technology",
      degree: "Bachelor of Computer Science",
      period: "2021-2026",
    },
    {
      institution: "Troy University",
      degree: "B.S. Computer Science",
      period: "2021-2026",
      detail: "GPA: 3.1/4.0",
    },
  ],
  lastUpdated: "2026-07-16",
} as const;
