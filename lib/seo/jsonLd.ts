import { profile } from "@/content/profile";
import type { ProjectContent } from "@/lib/content/schemas";

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.role,
    email: profile.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: profile.location,
    },
    url: profile.siteUrl,
    sameAs: profile.links
      .filter((link) => link.kind === "external")
      .map((link) => link.href),
  };
}

export function projectJsonLd(project: ProjectContent) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: project.title,
    applicationCategory: "DeveloperApplication",
    description: project.productDescription,
    url: `${profile.siteUrl}/work/${project.slug}`,
    author: {
      "@type": "Person",
      name: profile.name,
    },
    codeRepository: project.repositoryUrl,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
}
