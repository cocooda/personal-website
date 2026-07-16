import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/ButtonLink";
import type { ProjectContent } from "@/lib/content/schemas";

export function CaseStudy({ project }: { project: ProjectContent }) {
  return (
    <article className="pb-20">
      <header className="border-b border-subtle bg-elevated/30 py-16 md:py-24">
        <div className="container-shell">
          <p className="font-mono text-xs font-bold uppercase text-steel">{project.statusLabel}</p>
          <h1 className="mt-5 max-w-5xl text-balance text-4xl font-bold text-primary md:text-7xl">
            {project.title}
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-secondary">{project.productDescription}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {project.liveUrl ? (
              <ButtonLink href={project.liveUrl} external variant="primary">
                Live demo
              </ButtonLink>
            ) : null}
            {project.repositoryUrl ? (
              <ButtonLink href={project.repositoryUrl} external>
                Public repository
              </ButtonLink>
            ) : null}
          </div>
        </div>
      </header>
      <div className="container-shell grid gap-10 py-12 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0">
          <figure className="overflow-hidden rounded-lg border border-subtle bg-base/60">
            <Image
              src={project.visual.src}
              alt={project.visual.alt}
              width={1280}
              height={760}
              unoptimized
              preload
              loading="eager"
              className="aspect-[16/9] w-full object-cover"
            />
            <figcaption className="border-t border-subtle px-4 py-3 text-xs leading-5 text-muted">
              {project.visual.caption}
            </figcaption>
          </figure>
          <section className="mt-10 grid gap-5 md:grid-cols-3">
            {project.metrics.map((metric) => (
              <div key={metric.label} className="rounded-lg border border-subtle bg-elevated/48 p-5">
                <p className="font-mono text-xs uppercase text-muted">{metric.label}</p>
                <p className="mt-3 text-2xl font-bold text-primary">{metric.value}</p>
                <p className="mt-3 text-xs leading-5 text-secondary">{metric.context}</p>
              </div>
            ))}
          </section>
          <div className="mt-12 grid gap-12">
            {project.sections.map((section) => (
              <section key={section.id} id={section.id} className="scroll-mt-24">
                {section.eyebrow ? (
                  <p className="font-mono text-xs font-bold uppercase text-steel">{section.eyebrow}</p>
                ) : null}
                <h2 className="mt-3 text-3xl font-bold text-primary md:text-4xl">{section.title}</h2>
                <div className="mt-5 grid gap-4 text-base leading-8 text-secondary">
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                {section.bullets.length > 0 ? (
                  <ul className="mt-5 grid gap-2 text-sm leading-7 text-secondary">
                    {section.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-3">
                        <span aria-hidden="true" className="mt-3 size-1.5 rounded-full bg-steel" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>
          <section className="mt-14 grid gap-5 md:grid-cols-2">
            {project.gallery.map((item) => (
              <figure key={item.src} className="overflow-hidden rounded-lg border border-subtle bg-base/60">
                <Image
                  src={item.src}
                  alt={item.alt}
                  width={1280}
                  height={760}
                  unoptimized
                  className="aspect-[16/9] w-full object-cover"
                />
                <figcaption className="border-t border-subtle px-4 py-3 text-xs leading-5 text-muted">
                  {item.caption}
                </figcaption>
              </figure>
            ))}
          </section>
        </div>
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="surface rounded-lg p-5">
            <p className="font-mono text-xs font-bold uppercase text-steel">Evidence rail</p>
            <dl className="mt-5 grid gap-4 text-sm">
              <div>
                <dt className="text-muted">Role</dt>
                <dd className="mt-1 font-semibold text-primary">{project.role}</dd>
              </div>
              <div>
                <dt className="text-muted">Team context</dt>
                <dd className="mt-1 text-secondary">{project.teamContext}</dd>
              </div>
              <div>
                <dt className="text-muted">Proof point</dt>
                <dd className="mt-1 text-secondary">{project.proofPoint}</dd>
              </div>
            </dl>
            <div className="mt-5 flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span key={tech} className="rounded-md border border-subtle px-2.5 py-1 font-mono text-xs text-muted">
                  {tech}
                </span>
              ))}
            </div>
            {project.confidentialityNote ? (
              <p className="mt-5 rounded-md border border-subtle bg-base/50 p-3 text-xs leading-6 text-muted">
                {project.confidentialityNote}
              </p>
            ) : null}
          </div>
          <a
            href="#top"
            className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-strong bg-elevated px-4 py-2 text-sm font-semibold text-primary transition hover:border-steel"
          >
            Back to top
            <ArrowUpRight aria-hidden="true" size={15} />
          </a>
        </aside>
      </div>
    </article>
  );
}
