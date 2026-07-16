import { capabilities } from "@/content/capabilities";
import { experience } from "@/content/experience";
import { profile } from "@/content/profile";
import { SectionHeading } from "@/components/sections/SectionHeading";

export function ExperienceSection() {
  return (
    <section id="about" className="scroll-mt-24 py-20 md:py-28">
      <div className="container-shell grid gap-12 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <SectionHeading
            eyebrow="Experience"
            title="Concise evidence, not a copied CV."
            body="The timeline keeps the work readable while the resume remains the formal artifact."
          />
          <div className="mt-10 grid gap-5">
            {experience.map((item) => (
              <article key={`${item.company}-${item.role}`} className="border-l border-strong pl-5">
                <p className="font-mono text-xs uppercase text-muted">
                  {item.start} - {item.end} / {item.location}
                </p>
                <h3 className="mt-2 text-xl font-bold text-primary">{item.role}</h3>
                <p className="mt-1 text-sm font-semibold text-steel">{item.company}</p>
                <p className="mt-3 text-sm leading-7 text-secondary">{item.summary}</p>
                <ul className="mt-3 grid gap-2 text-sm leading-6 text-secondary">
                  {item.highlights.map((highlight) => (
                    <li key={highlight} className="flex gap-3">
                      <span aria-hidden="true" className="mt-2 size-1.5 rounded-full bg-teal" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
        <div className="grid gap-5">
          <div className="surface rounded-lg p-5">
            <p className="font-mono text-xs font-bold uppercase text-steel">Education</p>
            <div className="mt-5 grid gap-4">
              {profile.education.map((education) => (
                <div key={education.institution} className="rounded-md border border-subtle bg-base/44 p-4">
                  <h3 className="font-bold text-primary">{education.institution}</h3>
                  <p className="mt-2 text-sm text-secondary">{education.degree}</p>
                  <p className="mt-1 font-mono text-xs text-muted">
                    {education.period}
                    {"detail" in education && education.detail ? ` / ${education.detail}` : ""}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="surface rounded-lg p-5">
            <p className="font-mono text-xs font-bold uppercase text-steel">Capabilities</p>
            <div className="mt-5 grid gap-4">
              {capabilities.map((capability) => (
                <div key={capability.title} className="rounded-md border border-subtle bg-base/44 p-4">
                  <h3 className="font-bold text-primary">{capability.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-secondary">{capability.summary}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
