import Link from "next/link";
import { ContactActions } from "@/components/contact/ContactActions";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { profile } from "@/content/profile";

export function ContactSection() {
  return (
    <section id="contact" className="scroll-mt-24 py-20 md:py-28">
      <div className="container-shell">
        <div className="surface rounded-lg p-6 md:p-10">
          <p className="font-mono text-xs font-bold uppercase text-steel">Contact</p>
          <h2 className="mt-4 max-w-3xl text-3xl font-bold text-primary md:text-5xl">
            Need someone who can connect product ambiguity to measurable AI systems?
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-secondary">
            Public project links and the formal resume are available for inspection.
          </p>
          <div className="mt-6">
            <p className="font-mono text-xs font-bold uppercase text-muted">Email</p>
            <p className="mt-2 select-text break-all font-mono text-lg font-semibold text-primary">{profile.email}</p>
          </div>
          <ContactActions email={profile.email} mailtoHref={profile.contact.mailtoHref} />
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={profile.resume.pageHref}>View resume</ButtonLink>
            <Link
              href="/work/legolas-ai"
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-strong bg-elevated px-4 py-2 text-sm font-semibold text-primary transition hover:-translate-y-0.5 hover:border-steel"
            >
              Inspect flagship case study
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
