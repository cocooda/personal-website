import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudy } from "@/components/project/CaseStudy";
import { profile } from "@/content/profile";
import { getProjectBySlug, getProjectSlugs } from "@/lib/content/projects";
import { projectJsonLd } from "@/lib/seo/jsonLd";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {};
  }

  return {
    title: project.title,
    description: project.productDescription,
    alternates: {
      canonical: `/work/${project.slug}`,
    },
    openGraph: {
      title: `${project.title} - ${profile.name}`,
      description: project.productDescription,
      url: `/work/${project.slug}`,
      images: [
        {
          url: project.visual.src,
          width: 1280,
          height: 760,
          alt: project.visual.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} - ${profile.name}`,
      description: project.productDescription,
      images: [project.visual.src],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <div id="top">
      <CaseStudy project={project} />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd(project)) }}
      />
    </div>
  );
}
