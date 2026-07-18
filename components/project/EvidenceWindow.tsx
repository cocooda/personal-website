"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils/cn";

interface EvidenceWindowProps {
  src: string;
  alt: string;
  title: string;
  slug: string;
  isLightBg?: boolean;
}

export function EvidenceWindow({ src, alt, title, slug, isLightBg = false }: EvidenceWindowProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={`/work/${slug}`}
      className="group block relative w-full pointer-events-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={`View case study for ${title}`}
    >
      {/* Outer shadow and glow container */}
      <div 
        className={cn(
          "relative rounded-xl overflow-hidden border transition-all duration-500 ease-out select-none",
          isLightBg 
            ? "border-black/10 bg-white/60 shadow-[0_20px_50px_rgba(0,0,0,0.06)] group-hover:shadow-[0_30px_60px_rgba(0,0,0,0.12)] group-hover:border-black/20"
            : "border-white/5 bg-elevated/40 shadow-[0_24px_80px_rgba(0,0,0,0.4)] group-hover:shadow-[0_32px_90px_rgba(0,0,0,0.6)] group-hover:border-accent/20"
        )}
        style={{
          transform: isHovered ? "scale(1.02) translateY(-4px)" : "scale(1) translateY(0)",
        }}
      >
        {/* Mock Browser Header */}
        <div 
          className={cn(
            "flex items-center gap-2 px-4 py-3 border-b text-xs font-mono",
            isLightBg 
              ? "border-black/5 bg-black/5 text-ink/50" 
              : "border-white/5 bg-white/5 text-secondary/60"
          )}
        >
          {/* Traffic light dots */}
          <div className="flex gap-1.5 mr-2">
            <span className="size-2 rounded-full bg-red-500/60" />
            <span className="size-2 rounded-full bg-yellow-500/60" />
            <span className="size-2 rounded-full bg-green-500/60" />
          </div>
          {/* Mock URL / Title */}
          <span className="truncate max-w-[200px] md:max-w-xs">{slug}://evidence</span>

          {/* Hover highlight line */}
          {!isLightBg && (
            <div 
              className={cn(
                "absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent transition-opacity duration-300",
                isHovered ? "opacity-100" : "opacity-0"
              )}
            />
          )}
        </div>

        {/* Content Image Area */}
        <div 
          className={cn(
            "relative p-8 flex items-center justify-center min-h-[220px] md:min-h-[300px]",
            isLightBg ? "bg-white/40" : "bg-base/20"
          )}
        >
          <div className="relative w-full aspect-[16/10] overflow-hidden rounded-lg">
            <Image
              src={src}
              alt={alt}
              fill
              sizes="(max-w-768px) 100vw, 50vw"
              className="object-contain transition-transform duration-700 ease-out group-hover:scale-105"
              priority={slug === "legolas-ai"}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
