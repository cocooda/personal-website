import { existsSync } from "node:fs";
import path from "node:path";
import { challengeEntries } from "@/lib/content/challenge";
import { projects, publicProjects } from "@/lib/content/projects";
import { profile } from "@/content/profile";

const bannedPatterns = [
  { pattern: /\+84/i, reason: "phone number country code" },
  { pattern: /983\s*980\s*279/i, reason: "phone number" },
  { pattern: /C:\\Users\\/i, reason: "local Windows path" },
  { pattern: /\blorem\b/i, reason: "placeholder copy" },
  { pattern: /\bcutting-edge\b/i, reason: "overstated generic copy" },
  { pattern: /\brevolution/i, reason: "overstated generic copy" },
  { pattern: /\bmastered\b/i, reason: "overstated seniority" },
  { pattern: /\bsenior engineer\b/i, reason: "unsupported seniority" },
];

function collectStrings(value: unknown, output: string[] = []): string[] {
  if (typeof value === "string") {
    output.push(value);
    return output;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => collectStrings(item, output));
    return output;
  }

  if (value && typeof value === "object") {
    Object.values(value).forEach((item) => collectStrings(item, output));
  }

  return output;
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function validateAsset(src: string) {
  const filePath = path.join(process.cwd(), "public", src.replace(/^\//, ""));
  assert(existsSync(filePath), `Missing public asset: ${src}`);
}

for (const project of projects) {
  const strings = collectStrings(project);
  for (const text of strings) {
    for (const banned of bannedPatterns) {
      assert(!banned.pattern.test(text), `${project.slug}: ${banned.reason}`);
    }
  }

  assert(project.caseStudyUrl === `/work/${project.slug}`, `${project.slug}: caseStudyUrl must match slug`);
  assert(project.visual.src.startsWith(`/projects/${project.slug}/`), `${project.slug}: visual must live under project asset folder`);
  validateAsset(project.visual.src);
  project.gallery.forEach((item) => validateAsset(item.src));

  if (project.visibility === "public") {
    assert(project.sections.length > 0, `${project.slug}: public project needs sections`);
    assert(project.proofPoint.length > 20, `${project.slug}: proof point is too thin`);
  }

  for (const metric of project.metrics) {
    assert(metric.source.length > 0, `${project.slug}: metric source required`);
    assert(metric.context.length > 0, `${project.slug}: metric context required`);
  }
}

assert(publicProjects.length >= 3, "Expected at least three public projects");
assert(challengeEntries.length >= 1, "Expected at least one challenge entry");
assert(profile.resume.href === "/resume/nguyen-duy-duc-resume.pdf", "Resume path must stay canonical");
validateAsset(profile.resume.href);

const publicStrings = [
  ...collectStrings(profile),
  ...projects.flatMap((project) => collectStrings(project)),
  ...challengeEntries.flatMap((entry) => collectStrings(entry)),
];

for (const text of publicStrings) {
  for (const banned of bannedPatterns) {
    assert(!banned.pattern.test(text), `Public content contains ${banned.reason}`);
  }
}

console.log(`Validated ${projects.length} projects and ${challengeEntries.length} challenge entries.`);
