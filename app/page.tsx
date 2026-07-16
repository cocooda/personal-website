import { ChallengeTeaser } from "@/components/sections/ChallengeTeaser";
import { ContactSection } from "@/components/sections/ContactSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { HeroSection } from "@/components/sections/HeroSection";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { ProofStrip } from "@/components/sections/ProofStrip";
import { SelectedWork } from "@/components/sections/SelectedWork";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ProofStrip />
      <SelectedWork />
      <ProcessSection />
      <ExperienceSection />
      <ChallengeTeaser />
      <ContactSection />
    </>
  );
}
