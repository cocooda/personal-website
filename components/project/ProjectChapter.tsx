"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { EvidenceWindow } from "@/components/project/EvidenceWindow";
import { ProjectQuickView } from "@/components/project/ProjectQuickView";
import type { ProjectContent } from "@/lib/content/schemas";
import { cn } from "@/lib/utils/cn";

export type ProjectChapterProps = {
  project: ProjectContent;
  num: string;
  isLight?: boolean;
  className?: string;
};

export function ProjectChapter({ project, num, isLight = false, className }: ProjectChapterProps) {
  // Extract custom proof points to align with reference.png details
  const getProofPoints = (slug: string) => {
    if (slug === "legolas-ai") {
      return [
        { value: "80%", label: "Citation hit rate" },
        { value: "90%", label: "Legal-number recall" }
      ];
    }
    if (slug === "hanoiworld") {
      return [
        { value: "3", label: "Scenarios" },
        { value: "Simulation", label: "Highway, merge, roundabout" }
      ];
    }
    if (slug === "powfolio") {
      return [
        { value: "26", label: "Tests passed" },
        { value: "MVP", label: "In progress" }
      ];
    }
    return [];
  };

  const getSubLabel = (slug: string) => {
    if (slug === "legolas-ai") return "FLAGSHIP PROJECT";
    if (slug === "hanoiworld") return "RESEARCH PROJECT";
    if (slug === "powfolio") return "CURRENTLY BUILDING";
    return project.hierarchy.toUpperCase() + " PROJECT";
  };

  const proofPoints = getProofPoints(project.slug);
  const subLabel = getSubLabel(project.slug);

  return (
    <div 
      className={cn(
        "w-full py-24 md:py-32 relative transition-colors duration-500",
        isLight 
          ? "bg-fog text-ink" 
          : "bg-base text-primary",
        className
      )}
    >
      <div className="container-shell grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* LEFT COLUMN: Number, Name, Role & Connector */}
        <div className="col-span-12 lg:col-span-3 flex flex-col justify-between h-full min-h-[140px] z-10">
          <div>
            <span className={cn(
              "font-mono text-xs mb-4 block",
              isLight ? "text-ink/60" : "text-secondary"
            )}>
              {num}
            </span>
            <div className="flex items-center justify-between w-full group/title">
              <Link 
                href={`/work/${project.slug}`} 
                className="text-4xl md:text-5xl font-black tracking-tight hover:text-accent transition-colors duration-200"
              >
                {project.title}
              </Link>
              {/* Thin precise floating connector line */}
              <div className={cn(
                "hidden lg:block h-[1px] flex-grow ml-6 relative transition-colors duration-300",
                isLight ? "bg-black/10" : "bg-white/10"
              )}>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 size-2 rounded-full bg-accent shadow-[0_0_8px_#A9D6FF]" />
              </div>
            </div>
            <p className={cn(
              "mt-3 text-sm font-semibold",
              isLight ? "text-ink/70" : "text-secondary"
            )}>
              {project.role}
            </p>
          </div>
        </div>

        {/* CENTER COLUMN: Clickable Image Preview */}
        <div className="col-span-12 lg:col-span-6 flex justify-center items-center z-10">
          <EvidenceWindow 
            src={project.visual.src} 
            alt={project.visual.alt} 
            title={project.title} 
            slug={project.slug} 
            isLightBg={isLight}
          />
        </div>

        {/* RIGHT COLUMN: Metadata & Proof Points */}
        <div className="col-span-12 lg:col-span-3 flex flex-col justify-between h-full min-h-[240px] z-10">
          <div>
            <span className={cn(
              "font-mono text-[10px] tracking-widest block mb-2",
              isLight ? "text-ink/50" : "text-secondary"
            )}>
              {subLabel}
            </span>
            <h4 className="text-lg md:text-xl font-bold tracking-tight mb-2">
              {project.title === "Legolas AI" ? "Legal AI Assistant" : project.title === "HanoiWorld" ? "World Model for AD" : "Evidence → Portfolio"}
            </h4>
            <p className={cn(
              "text-sm leading-relaxed mb-6",
              isLight ? "text-ink/80" : "text-secondary"
            )}>
              {project.oneLineSummary}
            </p>

            {/* Proof values */}
            {proofPoints.length > 0 && (
              <div className="grid grid-cols-2 gap-4 mb-6">
                {proofPoints.map((point, index) => (
                  <div key={index} className="flex flex-col">
                    <span className="text-2xl md:text-3xl font-black font-sans text-accent drop-shadow-[0_0_10px_rgba(169, 214, 255,0.15)]">
                      {point.value}
                    </span>
                    <span className={cn(
                      "text-[10px] font-semibold font-sans tracking-wide uppercase mt-1",
                      isLight ? "text-ink/60" : "text-secondary"
                    )}>
                      {point.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <Link 
              href={`/work/${project.slug}`} 
              className={cn(
                "inline-flex items-center gap-1.5 text-xs font-mono font-bold tracking-wider uppercase group/link",
                isLight ? "text-ink hover:text-ink/70" : "text-primary hover:text-accent"
              )}
            >
              Explore project 
              <ArrowUpRight size={14} className="transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
            </Link>
          </div>
        </div>

        {/* Full-width Collapsible Evidence Quick View */}
        <div className="col-span-12 z-20">
          <ProjectQuickView project={project} isLight={isLight} />
        </div>

      </div>
    </div>
  );
}
