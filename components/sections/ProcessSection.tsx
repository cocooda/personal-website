"use client";

import { useState, type CSSProperties } from "react";
import {
  Activity,
  Code,
  Gauge,
  ListChecks,
  PenTool,
  RefreshCcw,
  Rocket,
  Search,
  type LucideIcon,
} from "lucide-react";
import { processSteps } from "@/content/process";
import { cn } from "@/lib/utils/cn";

const PROCESS_NODE_ICONS: LucideIcon[] = [
  Search,
  ListChecks,
  PenTool,
  Code,
  Gauge,
  Rocket,
  Activity,
  RefreshCcw,
];

// One horizon composition drives the planet, connector, nodes, light link, and detail.
const PROCESS_RIM_Y = "clamp(350px, 50svh, 500px)";
const PROCESS_NODE_TRACK_OFFSET = -84;
const PROCESS_DETAIL_OFFSET = 96;
const PROCESS_NODE_OFFSETS = [10, 6, 2, 0, 0, 2, 6, 10] as const;

type ProcessStep = (typeof processSteps)[number];

function PlanetaryHorizon() {
  // The reference uses a true sphere, not a wide ellipse. Most of the circle
  // sits below the stage so only its illuminated horizon remains visible.
  const planetDiameter = "clamp(1120px, 80vw, 1540px)";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0"
      data-process-planet
    >
      <div
        className="absolute left-1/2 hidden h-56 -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(85,200,255,0.3),rgba(85,200,255,0.11)_38%,transparent_72%)] blur-2xl lg:block"
        data-process-planet-atmosphere
        style={{
          top: "calc(var(--process-rim-y) - 118px)",
          width: "min(86vw, 1480px)",
        }}
      />
      <div
        className="absolute left-1/2 hidden -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(122,220,255,0.26),transparent_68%)] blur-xl lg:block"
        data-process-rim-atmosphere
        style={{
          top: "calc(var(--process-rim-y) - 30px)",
          width: "min(82vw, 1420px)",
          height: "92px",
        }}
      />
      <div
        className="absolute left-1/2 hidden -translate-x-1/2 bg-[radial-gradient(ellipse_at_50%_0%,rgba(115,215,255,0.22),rgba(27,47,61,0.92)_12%,rgba(8,15,21,0.99)_34%,#0b1218_62%,#13191e_100%)] shadow-[inset_0_36px_110px_rgba(85,200,255,0.07)] lg:block"
        data-process-planet-body
        style={{
          top: "var(--process-rim-y)",
          width: planetDiameter,
          height: planetDiameter,
          borderRadius: "50%",
        }}
      />
      <div
        className="absolute left-1/2 hidden -translate-x-1/2 border border-[#F2FCFF]/75 shadow-[0_-1px_4px_rgba(242,252,255,0.58),0_-10px_30px_rgba(85,200,255,0.38),0_-24px_70px_rgba(85,200,255,0.16)] lg:block"
        data-process-rim-highlight
        style={{
          top: "var(--process-rim-y)",
          width: planetDiameter,
          height: planetDiameter,
          borderRadius: "50%",
          clipPath: "inset(0 0 70% 0)",
          maskImage: "linear-gradient(to right, transparent 14%, black 32%, black 68%, transparent 86%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 14%, black 32%, black 68%, transparent 86%)",
        }}
      />
      <div
        className="absolute left-1/2 h-32 w-[min(130vw,520px)] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,rgba(85,200,255,0.2),transparent_70%)] blur-2xl lg:hidden"
        data-process-mobile-planet-glow
        style={{ top: "390px" }}
      />
    </div>
  );
}

function ActiveProcessDetail({ activeIndex }: { activeIndex: number }) {
  const activeStep = processSteps[activeIndex];

  return (
    <div
      id="active-process-detail"
      aria-live="polite"
      className="relative z-20 mt-8 h-[246px] w-full lg:absolute lg:inset-x-0 lg:top-[var(--process-detail-top)] lg:mt-0 lg:h-[220px]"
      data-process-active-detail
      data-process-detail-verb={activeStep.verb}
      data-process-rim-offset={PROCESS_DETAIL_OFFSET}
      style={{
        "--process-detail-top": `calc(var(--process-rim-y) + ${PROCESS_DETAIL_OFFSET}px)`,
      } as CSSProperties}
    >
      <div className="relative mx-auto h-full max-w-[660px] px-6 text-left md:px-8">
        {processSteps.map((step, index) => {
          const isActive = index === activeIndex;

          return (
            <div
              key={step.verb}
              aria-hidden={!isActive}
              className={cn(
                "absolute inset-0 flex flex-col items-start transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none",
                isActive ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0",
              )}
              data-process-detail-content
              data-process-detail-state={isActive ? "active" : "inactive"}
              data-process-detail-step={step.verb}
            >
              <div className="flex items-center gap-3 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-accent md:text-[11px]">
                <span>{String(index + 1).padStart(2, "0")} / PROCESS</span>
                <span className="text-primary/90">{step.verb}</span>
              </div>
              <h4 className="mt-4 max-w-[600px] text-2xl font-semibold leading-tight tracking-[-0.03em] text-primary lg:text-[2rem]">
                {step.action}
              </h4>
              <p className="mt-4 max-w-[560px] text-sm leading-6 text-[#b3c0c8] lg:text-[15px]">
                {step.evidence}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProcessNodeTrack({
  activeIndex,
  onSelectStep,
}: {
  activeIndex: number;
  onSelectStep: (index: number) => void;
}) {
  return (
    <div
      className="absolute left-1/2 z-10 hidden h-[92px] w-[min(92vw,1680px)] -translate-x-1/2 lg:block"
      data-process-desktop
      data-process-node-track
      data-process-rim-offset={PROCESS_NODE_TRACK_OFFSET}
      style={{ top: `calc(var(--process-rim-y) + ${PROCESS_NODE_TRACK_OFFSET}px)` }}
    >
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-2 h-12 w-full overflow-visible"
        fill="none"
        viewBox="0 0 1000 48"
        preserveAspectRatio="none"
      >
        <path
          d="M28 30C282 22 718 22 972 30"
          stroke="rgba(180, 198, 205, 0.32)"
          strokeWidth="1"
          data-process-connector-line
        />
        <path
          d="M28 30C282 22 718 22 972 30"
          data-process-active-connector
          pathLength="100"
          stroke="rgba(122,220,255,0.92)"
          strokeDasharray={`${((activeIndex + 1) / processSteps.length) * 100} 100`}
          strokeLinecap="round"
          strokeWidth="1.35"
        />
      </svg>

      <ol className="relative grid grid-cols-8 gap-1" aria-label="Process steps">
        {processSteps.map((step, index) => {
          const isActive = index === activeIndex;
          const Icon = PROCESS_NODE_ICONS[index] ?? Search;
          const nodeOffset = PROCESS_NODE_OFFSETS[index] + (isActive ? -4 : 0);

          return (
            <li
              key={step.verb}
              className="relative min-w-0"
              data-process-node-offset={PROCESS_NODE_OFFSETS[index]}
              style={{ top: `${nodeOffset}px` }}
            >
              <button
                aria-controls="active-process-detail"
                aria-current={isActive ? "step" : undefined}
                aria-label={`${step.verb}${isActive ? ", current process step" : ", select process step"}`}
                aria-pressed={isActive}
                className="group relative z-20 flex min-h-[76px] w-full min-w-0 flex-col items-center text-center outline-none focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-bg-process"
                data-process-node-state={isActive ? "active" : "inactive"}
                data-process-step={step.verb}
                onClick={() => onSelectStep(index)}
                type="button"
              >
                <span
                  className={cn(
                    "relative flex size-11 shrink-0 items-center justify-center rounded-full border transition duration-200",
                    isActive
                      ? "scale-110 border-[#F2FCFF] bg-[#DDF5FF] text-[#071014] shadow-[0_0_0_5px_rgba(85,200,255,0.14),0_0_28px_rgba(85,200,255,0.48),0_0_56px_rgba(85,200,255,0.16)]"
                      : "border-[#72818a]/65 bg-[#10171c] text-[#c1ccd1] shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)] group-hover:border-[#b4c6cc] group-hover:text-primary",
                  )}
                >
                  <Icon className="relative" size={16} strokeWidth={isActive ? 2.2 : 1.8} />
                  {isActive ? (
                    <span
                      aria-hidden="true"
                      className="absolute left-1/2 top-full h-5 w-px -translate-x-1/2 bg-gradient-to-b from-accent/75 to-transparent"
                      data-process-active-indicator
                    />
                  ) : null}
                </span>
                <span
                  className={cn(
                    "mt-2 block max-w-full text-[10px] font-mono font-semibold uppercase leading-4 tracking-[0.06em] transition-colors lg:text-[11px]",
                    isActive ? "font-bold text-[#F2FCFF]" : "text-[#aebbc2] group-hover:text-primary",
                  )}
                >
                  {step.verb}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function MobileProcessNodeList({
  activeIndex,
  onSelectStep,
}: {
  activeIndex: number;
  onSelectStep: (index: number) => void;
}) {
  return (
    <div className="relative lg:hidden" data-process-mobile>
      <div className="absolute bottom-[18px] left-[15px] top-[17px] w-px bg-[#63717a]/45" aria-hidden="true" />
      <ol className="relative flex flex-col gap-3 pl-9" aria-label="Process steps">
        {processSteps.map((step, index) => {
          const isActive = index === activeIndex;
          const Icon = PROCESS_NODE_ICONS[index] ?? Search;

          return (
            <li key={step.verb} className="relative">
              <button
                aria-controls="active-process-detail"
                aria-current={isActive ? "step" : undefined}
                aria-label={`${step.verb}${isActive ? ", current process step" : ", select process step"}`}
                aria-pressed={isActive}
                className="group relative z-20 flex min-h-10 w-full items-center gap-4 rounded-sm text-left outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-bg-process"
                data-process-node-state={isActive ? "active" : "inactive"}
                data-process-step={step.verb}
                onClick={() => onSelectStep(index)}
                type="button"
              >
                <span
                  className={cn(
                    "relative -ml-9 flex size-8 shrink-0 items-center justify-center rounded-full border transition duration-200",
                    isActive
                      ? "scale-110 border-[#F2FCFF] bg-[#DDF5FF] text-[#071014] shadow-[0_0_0_4px_rgba(85,200,255,0.14),0_0_22px_rgba(85,200,255,0.44)]"
                      : "border-[#72818a]/65 bg-[#10171c] text-[#c1ccd1]",
                  )}
                >
                  <Icon size={14} strokeWidth={isActive ? 2.2 : 1.8} />
                </span>
                <span
                  className={cn(
                    "text-sm font-mono font-semibold uppercase tracking-[0.08em] transition-colors",
                    isActive ? "font-bold text-[#F2FCFF]" : "text-[#aebbc2]",
                  )}
                >
                  {step.verb}
                </span>
                {isActive ? <span className="sr-only">Current process step</span> : null}
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function ProcessVisualStage({
  activeIndex,
  onSelectStep,
}: {
  activeIndex: number;
  onSelectStep: (index: number) => void;
}) {
  return (
    <div
      className="relative min-w-0 px-6 pb-16 pt-16 lg:min-h-[clamp(720px,100svh,960px)] lg:px-0 lg:py-0"
      data-process-stage
      data-process-visual-stage
      data-process-rim-y={PROCESS_RIM_Y}
      style={{
        "--process-rim-y": PROCESS_RIM_Y,
      } as CSSProperties}
    >
      <PlanetaryHorizon />

      <header className="relative z-20 max-w-[320px] lg:absolute lg:left-[10%] lg:top-[clamp(72px,10svh,110px)]">
        <span className="block font-mono text-xs font-semibold uppercase tracking-[0.16em] text-accent">
          03 / PROCESS
        </span>
        <h3 className="mt-4 text-4xl font-black leading-[0.96] tracking-[-0.045em] text-primary md:text-5xl">
          How I Build
        </h3>
        <p
          className="mt-5 max-w-[18rem] text-sm leading-6 text-[#b3c0c8] md:text-[15px]"
          data-process-supporting-copy
        >
          Product, engineering, evaluation, and iteration stay connected in an end-to-end cycle.
        </p>
      </header>

      <ProcessNodeTrack activeIndex={activeIndex} onSelectStep={onSelectStep} />
      <MobileProcessNodeList activeIndex={activeIndex} onSelectStep={onSelectStep} />
      <ActiveProcessDetail activeIndex={activeIndex} />
    </div>
  );
}

export function ProcessSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeStep: ProcessStep = processSteps[activeIndex];

  return (
    <section
      id="process"
      className="relative scroll-mt-20 overflow-hidden border-t border-white/5 bg-bg-process text-text-process"
    >
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true" data-process-section-atmosphere>
        <div className="absolute -inset-x-1/4 top-0 h-[68%] bg-[radial-gradient(ellipse_at_70%_42%,rgba(85,200,255,0.13),transparent_66%)] blur-3xl" />
        <div className="absolute inset-x-0 top-[24%] h-[42%] bg-[radial-gradient(ellipse_at_58%_50%,rgba(126,169,196,0.065),transparent_70%)]" />
      </div>
      <div className="pointer-events-none absolute inset-0 opacity-[0.13] spatial-grid" aria-hidden="true" />

      <ProcessVisualStage activeIndex={activeIndex} onSelectStep={setActiveIndex} />

      <span className="sr-only" data-process-active-step={activeStep.verb}>
        Active process step: {activeStep.verb}
      </span>
    </section>
  );
}