import { existsSync } from "node:fs";
import { getProjectBySlug, getProjectSlugs, publicProjects } from "@/lib/content/projects";
import { profile } from "@/content/profile";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

const expectedRoutes = ["/", profile.resume.pageHref, ...getProjectSlugs().map((slug) => `/work/${slug}`)];

assert(profile.contact.pageHref === "/#contact", "Contact navigation target changed");
assert(profile.resume.pageHref === "/resume", "Resume page route changed");
assert(profile.resume.pdfHref.endsWith(profile.resume.fileName), "Resume PDF filename mismatch");
assert(expectedRoutes.includes("/work/legolas-ai"), "Legolas route missing");
assert(expectedRoutes.includes("/work/hanoiworld"), "HanoiWorld route missing");
assert(expectedRoutes.includes("/work/powfolio"), "Powfolio route missing");
assert(existsSync(`public${profile.resume.pdfHref}`), "Resume PDF missing");

for (const project of publicProjects) {
  assert(getProjectBySlug(project.slug)?.title === project.title, `${project.slug} lookup failed`);
  assert(project.visual.alt.length >= 10, `${project.slug} visual alt text too short`);
  assert(project.contributions.length > 0, `${project.slug} contributions missing`);
}

console.log(`Smoke-tested routes: ${expectedRoutes.join(", ")}`);
