import type { MetadataRoute } from "next";
import { profile } from "@/content/profile";
import { publicProjects } from "@/lib/content/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/challenge",
    ...publicProjects.map((project) => `/work/${project.slug}`),
  ];

  return routes.map((route) => ({
    url: `${profile.siteUrl}${route}`,
    lastModified: profile.lastUpdated,
    changeFrequency: route === "" ? "monthly" : "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}
