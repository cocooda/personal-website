import { z } from "zod";

export const LinkSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
  kind: z.enum(["email", "resume", "external", "internal"]).default("external"),
  verified: z.boolean().default(true),
});

export type SiteLink = z.infer<typeof LinkSchema>;

export const MetricSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
  context: z.string().min(1),
  source: z.string().min(1),
  caveat: z.string().optional(),
  featured: z.boolean().default(false),
});

export const GalleryItemSchema = z.object({
  src: z.string().startsWith("/"),
  alt: z.string().min(10),
  caption: z.string().optional(),
  kind: z.enum(["diagram", "benchmark", "workflow", "placeholder", "screenshot"]),
});

export const CaseStudySectionSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  eyebrow: z.string().optional(),
  body: z.array(z.string().min(1)).min(1),
  bullets: z.array(z.string().min(1)).default([]),
});

export const ProjectSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  shortTitle: z.string().min(1),
  hierarchy: z.enum(["flagship", "secondary", "experiment"]),
  status: z.enum(["shipped", "staging", "current", "archived"]),
  statusLabel: z.string().min(1),
  featured: z.boolean(),
  visibility: z.enum(["public", "hidden", "draft"]),
  priority: z.number().int(),
  oneLineSummary: z.string().min(1),
  productDescription: z.string().min(1),
  problem: z.string().min(1),
  role: z.string().min(1),
  teamContext: z.string().min(1),
  contributionBoundary: z.string().min(1),
  proofPoint: z.string().min(1),
  visual: GalleryItemSchema,
  contributions: z.array(z.string().min(1)).min(1),
  outcomes: z.array(z.string().min(1)).default([]),
  metrics: z.array(MetricSchema).default([]),
  technologies: z.array(z.string().min(1)).min(1),
  gallery: z.array(GalleryItemSchema).default([]),
  liveUrl: z.string().url().optional(),
  repositoryUrl: z.string().url().optional(),
  caseStudyUrl: z.string().startsWith("/").optional(),
  startedAt: z.string().optional(),
  completedAt: z.string().optional(),
  lastUpdated: z.string(),
  confidentialityNote: z.string().optional(),
  sections: z.array(CaseStudySectionSchema).min(1),
});

export type ProjectContent = z.infer<typeof ProjectSchema>;

export const ExperienceSchema = z.object({
  company: z.string().min(1),
  role: z.string().min(1),
  location: z.string().min(1),
  start: z.string().min(4),
  end: z.string().min(4),
  summary: z.string().min(1),
  highlights: z.array(z.string().min(1)).min(1),
  evidence: z.string().min(1),
});

export type ExperienceItem = z.infer<typeof ExperienceSchema>;

export const CapabilitySchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  examples: z.array(z.string().min(1)).min(1),
});

export type Capability = z.infer<typeof CapabilitySchema>;

export const ChallengeEntrySchema = z.object({
  day: z.number().int().min(0),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  title: z.string().min(1),
  status: z.enum(["planned", "in-progress", "shipped"]),
  summary: z.string().min(1),
  shipped: z.array(z.string().min(1)).default([]),
  nextStep: z.string().min(1),
  links: z.array(LinkSchema).default([]),
});

export type ChallengeEntry = z.infer<typeof ChallengeEntrySchema>;
