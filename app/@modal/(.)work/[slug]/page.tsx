import { getProjectBySlug } from "@/lib/content/projects";
import { notFound } from "next/navigation";
import { ProjectModalShell } from "@/components/project/ProjectModalShell";
import { CaseStudy } from "@/components/project/CaseStudy";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function ProjectModalPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <ProjectModalShell slug={project.slug} title={project.title}>
      <CaseStudy project={project} />
    </ProjectModalShell>
  );
}
