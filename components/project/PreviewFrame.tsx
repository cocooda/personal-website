import Image from "next/image";
import { cn } from "@/lib/utils/cn";

interface PreviewFrameProps {
  src: string;
  alt: string;
  slug: string;
  kind: string;
  eager?: boolean;
}

export function PreviewFrame({ src, alt, slug, kind, eager = false }: PreviewFrameProps) {
  const isDiagram = kind === "diagram";
  const isEvidence = kind === "evidence";
  const isSimulation = kind === "simulation";
  const isProductUI = kind === "product-ui";

  return (
    <div
      className="w-full h-full relative flex flex-col justify-stretch"
      data-preview-kind={kind}
      data-project-slug={slug}
    >
      {/* Frame Wrapper */}
      <div 
        className={cn(
          "w-full h-full flex flex-col rounded-xl overflow-hidden border select-none transition-all duration-300",
          isDiagram || isEvidence
            ? "border-white/10 bg-bg-experience/40 shadow-[0_12px_40px_rgba(0,0,0,0.3)]" 
            : isSimulation 
              ? "border-accent/20 bg-base/80 shadow-[0_12px_40px_rgba(169, 214, 255,0.03)]"
              : "border-white/5 bg-[#15191E]/40 shadow-[0_24px_80px_rgba(0,0,0,0.4)]"
        )}
      >
        {/* Header bar based on kind */}
        {isDiagram && (
          <div className="flex items-center px-4 py-2 bg-white/5 border-b border-white/5 text-[10px] font-mono text-secondary/80 select-none">
            <span className="text-accent font-bold mr-2">[SYSTEM_DIAGRAM]</span>
            <span className="truncate">{slug}://flow-map</span>
          </div>
        )}

        {isEvidence && (
          <div className="flex items-center px-4 py-2 bg-white/5 border-b border-white/5 text-[10px] font-mono text-secondary/80 select-none">
            <span className="text-accent font-bold mr-2">[EVIDENCE_VIEW]</span>
            <span className="truncate">{slug}://proof-map</span>
          </div>
        )}

        {isSimulation && (
          <div className="flex items-center justify-between px-4 py-2 bg-accent/5 border-b border-accent/10 text-[10px] font-mono text-accent select-none">
            <span>[SIMULATION]</span>
            <span>PUBLIC ENVIRONMENT FIGURE</span>
          </div>
        )}

        {isProductUI && (
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/5 text-xs font-mono text-secondary/60">
            {/* Traffic light dots */}
            <div className="flex gap-1.5 mr-2">
              <span className="size-2 rounded-full bg-red-500/60" />
              <span className="size-2 rounded-full bg-yellow-500/60" />
              <span className="size-2 rounded-full bg-green-500/60" />
            </div>
            <span className="truncate">{slug}://product-ui</span>
          </div>
        )}

        {/* Fallback header for other/unknown kinds */}
        {!isDiagram && !isEvidence && !isSimulation && !isProductUI && (
          <div className="flex items-center px-4 py-2 bg-white/5 border-b border-white/5 text-[10px] font-mono text-secondary/80 select-none">
            <span className="text-accent font-bold mr-2">[EVIDENCE]</span>
            <span className="truncate">{slug}://details</span>
          </div>
        )}

        {/* Content Image Area */}
        <div className="relative flex-grow flex items-center justify-center p-6 bg-base/20">
          <div className="relative w-full h-full overflow-hidden rounded-lg">
            <Image
              src={src}
              alt={alt}
              fill
              sizes="(max-w-768px) 100vw, 480px"
              className="object-contain"
              loading={eager ? "eager" : "lazy"}
              unoptimized
            />
          </div>
        </div>
      </div>
    </div>
  );
}
