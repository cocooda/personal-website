"use client";

import { useState } from "react";
import { OpeningLoader } from "@/components/ui/OpeningLoader";
import { ContactSection } from "@/components/sections/ContactSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { HeroWorkStage } from "@/components/sections/HeroWorkStage";
import { ProcessSection } from "@/components/sections/ProcessSection";

export default function HomePage() {
  const [loaderComplete, setLoaderComplete] = useState(false);

  return (
    <>
      <OpeningLoader onComplete={() => setLoaderComplete(true)} />
      <div 
        className={
          loaderComplete 
            ? "opacity-100 transition-opacity duration-700 ease-out" 
            : "opacity-0 h-screen overflow-hidden"
        }
      >
        <HeroWorkStage />
        <ProcessSection />
        <ExperienceSection />
        <ContactSection />
      </div>
    </>
  );
}
