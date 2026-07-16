import { ArrowDown, Mail } from "lucide-react";
import { HeroEvidenceField } from "@/components/motion/HeroEvidenceField";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { profile } from "@/content/profile";

export function HeroSection() {
  return (
    <section className="relative min-h-[calc(88vh-var(--header-height))] overflow-hidden pb-14 pt-20 md:pb-16 md:pt-28">
      <HeroEvidenceField />
      <div className="container-shell">
        <div className="max-w-5xl">
          <p className="mb-5 font-mono text-xs font-bold uppercase text-steel">{profile.role}</p>
          <h1 className="text-balance text-[40px] font-bold leading-[1.02] text-primary md:text-[72px] lg:text-[86px]">
            {profile.headline}
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-secondary md:text-xl">{profile.bio}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href="#work" variant="primary">
              Explore selected work
              <ArrowDown aria-hidden="true" size={16} />
            </ButtonLink>
            <ButtonLink href={profile.resume.href}>View resume</ButtonLink>
            <ButtonLink href={`mailto:${profile.email}`} variant="ghost">
              <Mail aria-hidden="true" size={16} />
              Contact
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
