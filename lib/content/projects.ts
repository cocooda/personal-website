import hanoiWorld from "@/content/projects/hanoiworld";
import legolasAi from "@/content/projects/legolas-ai";
import powfolio from "@/content/projects/powfolio";
import { ProjectSchema, type ProjectContent } from "@/lib/content/schemas";

const rawProjects = [legolasAi, hanoiWorld, powfolio] satisfies ProjectContent[];

export const projects = rawProjects
  .map((project) => ProjectSchema.parse(project))
  .sort((a, b) => a.priority - b.priority);

export const publicProjects = projects.filter(
  (project) => project.visibility === "public",
);

export const featuredProjects = publicProjects.filter((project) => project.featured);

export function getProjectBySlug(slug: string) {
  return publicProjects.find((project) => project.slug === slug);
}

export function getProjectSlugs() {
  return publicProjects.map((project) => project.slug);
}
