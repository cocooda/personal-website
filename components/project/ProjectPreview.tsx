import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { ProjectQuickView } from "@/components/project/ProjectQuickView";
import type { ProjectContent } from "@/lib/content/schemas";
import { cn } from "@/lib/utils/cn";

export function ProjectPreview({ project }: { project: ProjectContent }) {
  const featured = project.hierarchy === "flagship";

  return (
    <article
      className={cn(
        "surface group rounded-lg p-4 transition duration-200 hover:-translate-y-1 hover:border-steel md:p-5",
        featured && "lg:col-span-2",
      )}
    >
      <div className={cn("grid gap-6", featured && "lg:grid-cols-[1fr_1.12fr]")}>
        <div className="flex min-w-0 flex-col justify-between">
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="rounded-md border border-strong bg-base/60 px-2.5 py-1 font-mono text-xs uppercase text-steel">
                {project.statusLabel}
              </span>
              <span className="rounded-md border border-subtle px-2.5 py-1 font-mono text-xs uppercase text-muted">
                {project.role}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-primary md:text-3xl">{project.title}</h3>
            <p className="mt-3 text-base leading-7 text-secondary">{project.productDescription}</p>
            <p className="mt-5 border-l border-steel pl-4 text-sm leading-6 text-secondary">
              {project.proofPoint}
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/work/${project.slug}`}
              className="inline-flex min-h-11 items-center gap-2 rounded-md border border-fog bg-fog px-4 py-2 text-sm font-semibold cta-ink transition hover:-translate-y-0.5"
            >
              Read case study
              <ArrowUpRight aria-hidden="true" size={16} />
            </Link>
            {project.liveUrl ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center gap-2 rounded-md border border-strong bg-elevated px-4 py-2 text-sm font-semibold text-primary transition hover:-translate-y-0.5 hover:border-steel"
              >
                Live demo
                <ExternalLink aria-hidden="true" size={15} />
              </a>
            ) : null}
          </div>
        </div>
        <figure className="overflow-hidden rounded-md border border-subtle bg-base/60">
          <Image
            src={project.visual.src}
            alt={project.visual.alt}
            width={1280}
            height={760}
            unoptimized
            className="aspect-[16/9] h-full w-full object-cover transition duration-300 group-hover:scale-[1.01]"
          />
          <figcaption className="border-t border-subtle px-4 py-3 text-xs leading-5 text-muted">
            {project.visual.caption}
          </figcaption>
        </figure>
      </div>
      <ProjectQuickView project={project} />
    </article>
  );
}
