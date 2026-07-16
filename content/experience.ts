import type { ExperienceItem } from "@/lib/content/schemas";

export const experience = [
  {
    company: "VinUni",
    role: "AI Engineering Trainee",
    location: "Hanoi",
    start: "May 2026",
    end: "Expected: August 2026",
    summary:
      "Applied AI engineering training focused on RAG applications, cloud deployment, and ML infrastructure.",
    highlights: [
      "Co-developed Legolas AI, a legal assistant MVP with Q&A, drafting, and document review workflows.",
      "Built and ran the verified 30-case multi-source benchmark used in the public case study.",
      "Deployed a split cloud staging architecture and used traces to investigate latency, fallback, and citation failures.",
    ],
    evidence: "Formal CV dated 2026-07-12 and Legolas AI project materials.",
  },
  {
    company: "Sapo",
    role: "Fullstack Developer Intern",
    location: "Hanoi",
    start: "February 2026",
    end: "May 2026",
    summary:
      "Built RESTful product, category, and warehouse API work with Spring Boot and React integration.",
    highlights: [
      "Implemented API features with JWT authentication, validation, pagination, and transaction handling.",
      "Integrated React flows with backend APIs using fetch/axios, React Router, and Redux Toolkit Query.",
      "Practiced production-oriented foundations including SQL optimization and web security basics.",
    ],
    evidence: "Formal CV dated 2026-07-12.",
  },
  {
    company: "Shoop City",
    role: "QA Tester Intern",
    location: "Remote - France",
    start: "June 2024",
    end: "August 2024",
    summary:
      "Executed functional and regression test cases and collaborated with developers to verify fixes.",
    highlights: [
      "Documented defects in Jira and supported release quality through regression coverage.",
    ],
    evidence: "Formal CV dated 2026-07-12.",
  },
] satisfies ExperienceItem[];
