import { ProjectPreview } from "@/components/project/ProjectPreview";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { featuredProjects } from "@/lib/content/projects";

export function SelectedWork() {
  return (
    <section id="work" className="scroll-mt-24 py-20 md:py-28">
      <div className="container-shell">
        <SectionHeading
          eyebrow="Selected work"
          title="Core projects are visible first, then expandable."
          body="Each preview stays on the page, quick details are keyboard and touch accessible, and the full case-study route derives from the same structured project content."
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {featuredProjects.map((project) => (
            <ProjectPreview key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
