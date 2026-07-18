"use client";

import { capabilities } from "@/content/capabilities";
import { experience } from "@/content/experience";
import { profile } from "@/content/profile";

export function ExperienceSection() {
  return (
    <section 
      id="about" 
      className="scroll-mt-20 py-24 md:py-32 bg-bg-experience text-text-experience border-t border-white/5"
    >
      <div className="container-shell grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        
        {/* LEFT COLUMN: Experience Timeline */}
        <div className="lg:col-span-7 flex flex-col">
          <span className="font-mono text-xs text-secondary uppercase tracking-wider block mb-3">
            04 / EXPERIENCE
          </span>
          <h3 className="text-4xl md:text-5xl font-black tracking-tight leading-none text-primary mb-12">
            Applied Practice
          </h3>

          <div className="flex flex-col gap-10">
            {experience.map((item) => (
              <div 
                key={`${item.company}-${item.role}`} 
                className="grid grid-cols-1 md:grid-cols-12 gap-4 pb-10 border-b border-white/5 last:border-0 last:pb-0"
              >
                {/* Period */}
                <div className="md:col-span-4 flex flex-col">
                  <span className="font-mono text-xs text-secondary/70 font-semibold uppercase">
                    {item.start}
                  </span>
                  <span className="font-mono text-xs text-secondary/50 uppercase mt-0.5">
                    to {item.end.replace("Expected: ", "")}
                  </span>
                  <span className="text-[10px] font-mono text-secondary/40 mt-1 uppercase">
                    {item.location}
                  </span>
                </div>

                {/* Content */}
                <div className="md:col-span-8">
                  <h4 className="text-lg font-bold text-primary leading-snug">
                    {item.role}
                  </h4>
                  <p className="text-sm font-semibold text-accent-dim text-accent/80 bg-base/90 inline-block px-2.5 py-0.5 rounded-full mt-1.5 font-mono select-none">
                    {item.company}
                  </p>
                  
                  <p className="mt-3.5 text-sm leading-relaxed text-secondary">
                    {item.summary}
                  </p>

                  <ul className="mt-4 flex flex-col gap-2">
                    {item.highlights.slice(0, 2).map((highlight, hIdx) => (
                      <li key={hIdx} className="flex gap-2.5 items-start text-xs text-secondary leading-relaxed">
                        <span className="size-1 rounded-full bg-accent mt-1.5 shrink-0" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Education & Capabilities */}
        <div className="lg:col-span-5 flex flex-col gap-12">
          {/* Education */}
          <div>
            <span className="font-mono text-xs text-secondary uppercase tracking-wider block mb-6 border-b border-white/5 pb-2">
              EDUCATION
            </span>
            <div className="flex flex-col gap-6">
              {profile.education.map((edu) => (
                <div key={edu.institution} className="flex flex-col">
                  <h4 className="text-sm font-bold text-primary leading-snug">
                    {edu.institution}
                  </h4>
                  <span className="text-xs text-secondary mt-1">
                    {edu.degree}
                  </span>
                  <span className="font-mono text-[10px] text-secondary mt-1">
                    {edu.period} {"detail" in edu && edu.detail ? ` / ${edu.detail}` : ""}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Capabilities */}
          <div>
            <span className="font-mono text-xs text-secondary uppercase tracking-wider block mb-6 border-b border-white/5 pb-2">
              CAPABILITIES
            </span>
            <div className="flex flex-col gap-6">
              {capabilities.slice(0, 3).map((cap) => (
                <div key={cap.title} className="flex flex-col">
                  <h4 className="text-sm font-bold text-primary leading-snug">
                    {cap.title}
                  </h4>
                  <p className="text-xs leading-relaxed text-secondary mt-1.5">
                    {cap.summary}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
