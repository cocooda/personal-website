"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { PreviewFrame } from "@/components/project/PreviewFrame";
import { LiquidDMark } from "@/components/visual/LiquidDMark";
import { profile } from "@/content/profile";
import { featuredProjects } from "@/lib/content/projects";
import type { ProjectContent } from "@/lib/content/schemas";
import { cn } from "@/lib/utils/cn";

const PROJECT_RAIL_GAP = "80px";
const PROJECT_ORBIT_RADIUS_X = 300;
const PROJECT_ORBIT_RADIUS_Y = 300;
const PROJECT_FOCAL_ANGLE = Math.PI * 0.72;

type HomeStagePhase = "identity" | "portal" | "navigation" | "exit" | "released";
type OrbitalMode = "planet" | "morphing" | "node";

type StageRatios = {
  identityRatio: number;
  portalRatio: number;
  navigationRatio: number;
  navigationStart: number;
  navigationEnd: number;
};

type ProjectNode = {
  slug: string;
  homepageIndex: number;
  label: string;
  previewAsset: string;
  status: string;
  baseAngle: number;
  radiusX: number;
  radiusY: number;
  orbitSpeed: number;
  bubbleSize: number;
};

const ORBIT_COORDINATES = [
  { baseAngle: -2.52, radiusX: 192, radiusY: 132, orbitSpeed: 0.82, bubbleSize: 42 },
  { baseAngle: -0.46, radiusX: 184, radiusY: 142, orbitSpeed: 1.06, bubbleSize: 30 },
  { baseAngle: 1.94, radiusX: 178, radiusY: 154, orbitSpeed: 1.18, bubbleSize: 20 },
] as const;

const AMBIENT_FUTURE_BUBBLES = [
  { x: 18, y: 22, size: 14, opacity: 0.22, drift: 5, duration: 18, delay: 0.2 },
  { x: 72, y: 17, size: 9, opacity: 0.18, drift: -4, duration: 22, delay: 2.1 },
  { x: 86, y: 48, size: 16, opacity: 0.14, drift: 3, duration: 24, delay: 4.4 },
  { x: 24, y: 74, size: 10, opacity: 0.17, drift: -3, duration: 20, delay: 1.2 },
  { x: 62, y: 82, size: 7, opacity: 0.16, drift: 4, duration: 26, delay: 5.6 },
  { x: 42, y: 10, size: 11, opacity: 0.12, drift: -5, duration: 28, delay: 3.3 },
] as const;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function clampIndex(index: number, maxIndex: number) {
  return clamp(index, 0, maxIndex);
}

function mix(from: number, to: number, progress: number) {
  return from + (to - from) * progress;
}

function getInactiveDistanceState(distance: number) {
  if (distance <= 0.5) {
    const progress = distance / 0.5;
    return {
      activeEdgeOpacity: mix(0.54, 0.24, progress),
      mediaOpacity: mix(0.92, 0.74, progress),
      scale: mix(0.985, 0.96, progress),
      scrimOpacity: mix(0.14, 0.34, progress),
    };
  }

  const progress = (distance - 0.5) / 0.5;
  return {
    activeEdgeOpacity: mix(0.24, 0.12, progress),
    mediaOpacity: mix(0.74, 0.46, progress),
    scale: mix(0.96, 0.92, progress),
    scrimOpacity: mix(0.34, 0.58, progress),
  };
}

function getStagePhase(progress: number, ratios: StageRatios): HomeStagePhase {
  if (progress >= 0.995) return "released";
  if (progress < ratios.identityRatio) return "identity";
  if (progress < ratios.navigationStart) return "portal";
  if (progress <= ratios.navigationEnd) return "navigation";
  return "exit";
}

function getOrbitalMode(phase: HomeStagePhase): OrbitalMode {
  if (phase === "identity") return "planet";
  if (phase === "portal") return "morphing";
  return "node";
}

function getProjectNodes(projects: ProjectContent[]): ProjectNode[] {
  return projects.map((project, index) => {
    const orbit = ORBIT_COORDINATES[index] ?? ORBIT_COORDINATES[ORBIT_COORDINATES.length - 1];

    return {
      slug: project.slug,
      homepageIndex: index + 1,
      label: project.title,
      previewAsset: project.visual.src,
      status: project.statusLabel,
      baseAngle: orbit.baseAngle,
      radiusX: orbit.radiusX,
      radiusY: orbit.radiusY,
      orbitSpeed: orbit.orbitSpeed,
      bubbleSize: orbit.bubbleSize,
    };
  });
}

export function HeroWorkStage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isNearViewport, setIsNearViewport] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<HomeStagePhase>("identity");
  const [debugEnabled, setDebugEnabled] = useState(false);
  const [debugSnapshot, setDebugSnapshot] = useState({
    rawProgress: 0,
    projectProgress: 0,
    railY: 0,
  });
  const [geometry, setGeometry] = useState({
    previewHeight: 0,
    gap: 0,
    viewportHeight: 800,
    isMeasured: false,
  });

  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(0);
  const phaseRef = useRef<HomeStagePhase>("identity");
  const orbitPausedRef = useRef(false);
  const idleOrbitOffset = useMotionValue(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: "500px" },
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    const updateGeometry = () => {
      const previewElement = previewRef.current;
      const portalElement = portalRef.current;
      const railElement = railRef.current;
      const portalHeight = portalElement?.getBoundingClientRect().height ?? 0;
      const viewportHeight = portalHeight > 0 ? portalHeight : window.innerHeight;

      if (!previewElement || !railElement) {
        setGeometry((previous) => ({
          ...previous,
          viewportHeight,
          isMeasured: false,
        }));
        return;
      }

      // Transform-based emphasis deliberately changes the visual bounds. The
      // rail geometry must instead keep using the untransformed layout height.
      const previewHeight = previewElement.offsetHeight;
      const railStyles = window.getComputedStyle(railElement);
      const rawGap = railStyles.rowGap === "normal" ? railStyles.gap : railStyles.rowGap;
      const parsedGap = Number.parseFloat(rawGap);
      const gap = Number.isFinite(parsedGap) ? parsedGap : 0;
      const isMeasured = previewHeight > 0 && viewportHeight > 0;

      setGeometry((previous) => {
        const unchanged =
          Math.abs(previous.previewHeight - previewHeight) < 0.5 &&
          Math.abs(previous.gap - gap) < 0.5 &&
          Math.abs(previous.viewportHeight - viewportHeight) < 0.5 &&
          previous.isMeasured === isMeasured;

        if (unchanged) return previous;

        return {
          previewHeight,
          gap,
          viewportHeight,
          isMeasured,
        };
      });
    };

    const resizeObserver = new ResizeObserver(updateGeometry);
    const observedElements = [previewRef.current, portalRef.current, railRef.current].filter(
      (element): element is HTMLDivElement => element !== null,
    );
    observedElements.forEach((element) => resizeObserver.observe(element));

    const animationFrame = window.requestAnimationFrame(() => {
      setDebugEnabled(new URLSearchParams(window.location.search).get("debugExplorer") === "1");
      updateGeometry();
    });

    return () => {
      observer.disconnect();
      resizeObserver.disconnect();
      window.cancelAnimationFrame(animationFrame);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: stageRef,
    offset: ["start start", "end end"],
  });

  const projectCount = featuredProjects.length;
  const projectNodes = getProjectNodes(featuredProjects);
  const { previewHeight, gap, viewportHeight, isMeasured } = geometry;
  const previewStep = isMeasured ? previewHeight + gap : 0;

  const identityDistance = viewportHeight * 0.72;
  const portalDistance = viewportHeight * 0.46;
  const perProjectScrollDistance = Math.min(Math.max(viewportHeight * 0.8, 500), 1000);
  const railScrollDistance = Math.max(projectCount - 1, 0) * perProjectScrollDistance;
  const exitDistance = viewportHeight * 0.48;
  const scrollableDistance = identityDistance + portalDistance + railScrollDistance + exitDistance;
  const stageHeight = viewportHeight + scrollableDistance;

  const identityRatio = identityDistance / scrollableDistance;
  const portalRatio = portalDistance / scrollableDistance;
  const navigationRatio = railScrollDistance / scrollableDistance;
  const navigationStart = identityRatio + portalRatio;
  const navigationEnd = navigationStart + navigationRatio;
  const ratios = { identityRatio, portalRatio, navigationRatio, navigationStart, navigationEnd };
  const previewRevealStart = identityRatio + portalRatio * 0.55;
  const previewRevealEnd = navigationStart;

  const railTravel = isMeasured ? Math.max(projectCount - 1, 0) * previewStep : 0;

  const projectProgress = useTransform(
    scrollYProgress,
    [0, navigationStart, navigationEnd, 1],
    [0, 0, 1, 1],
  );

  const railY = useTransform(projectProgress, [0, 1], [0, -railTravel]);

  const identityOpacity = useTransform(
    scrollYProgress,
    [0, identityRatio * 0.55, identityRatio + portalRatio * 0.45],
    [1, 0.72, 0],
  );
  const projectLayerOpacity = useTransform(
    scrollYProgress,
    [0, previewRevealStart, previewRevealEnd, 1],
    [0, 0, 1, 1],
  );
  const workContextOpacity = useTransform(
    scrollYProgress,
    [0, previewRevealStart, previewRevealEnd, 1],
    [0, 0, 1, 1],
  );
  const explorerExitOpacity = useTransform(
    scrollYProgress,
    [navigationEnd, 0.995],
    [1, 0.72],
  );
  const dScale = useTransform(
    scrollYProgress,
    [0, identityRatio, navigationStart, navigationEnd, 1],
    [1, 0.88, 1.08, 1.02, 0.86],
  );
  const dOpacity = useTransform(
    scrollYProgress,
    [0, identityRatio, navigationStart, navigationEnd, 0.98, 1],
    [0.96, 0.84, 0.54, 0.46, 0.24, 0.08],
  );
  const scrollCueOpacity = useTransform(
    scrollYProgress,
    [0, identityRatio * 0.45, identityRatio * 0.82, identityRatio],
    [0.72, 0.72, 0.2, 0],
  );

  const syncCurrentPhase = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const stageTop = stage.getBoundingClientRect().top + window.scrollY;
    const scrollableDistance = Math.max(stage.offsetHeight - window.innerHeight, 1);
    const progress = clamp((window.scrollY - stageTop) / scrollableDistance, 0, 1);
    const nextPhase = getStagePhase(progress, {
      identityRatio,
      portalRatio,
      navigationRatio,
      navigationStart,
      navigationEnd,
    });

    if (nextPhase !== phaseRef.current) {
      phaseRef.current = nextPhase;
      setCurrentPhase(nextPhase);
    }
  }, [identityRatio, navigationEnd, navigationRatio, navigationStart, portalRatio]);

  useLayoutEffect(() => {
    syncCurrentPhase();
    window.addEventListener("pageshow", syncCurrentPhase);

    return () => window.removeEventListener("pageshow", syncCurrentPhase);
  }, [syncCurrentPhase]);

  useAnimationFrame((time) => {
    if (prefersReducedMotion || phaseRef.current !== "identity" || orbitPausedRef.current) {
      if (idleOrbitOffset.get() !== 0) idleOrbitOffset.set(0);
      return;
    }

    const identityInfluence = 1 - clamp(scrollYProgress.get() / Math.max(identityRatio * 0.72, 0.001), 0, 1);
    idleOrbitOffset.set(Math.sin(time * 0.00045) * 0.045 * identityInfluence);
  });

  useMotionValueEvent(railY, "change", (latestY) => {
    if (debugEnabled) {
      setDebugSnapshot((previous) => ({ ...previous, railY: latestY }));
    }

    if (!isMeasured || previewStep <= 0) return;

    const rawIndex = Math.round(Math.abs(latestY) / previewStep);
    const clampedIndex = clampIndex(rawIndex, projectCount - 1);
    if (clampedIndex !== activeIndexRef.current) {
      activeIndexRef.current = clampedIndex;
      setActiveIndex(clampedIndex);
    }
  });

  useMotionValueEvent(scrollYProgress, "change", (latestProgress) => {
    const nextPhase = getStagePhase(latestProgress, ratios);

    if (nextPhase !== phaseRef.current) {
      phaseRef.current = nextPhase;
      setCurrentPhase(nextPhase);
    }

    if (debugEnabled) {
      setDebugSnapshot((previous) => ({ ...previous, rawProgress: latestProgress }));
    }
  });

  useMotionValueEvent(projectProgress, "change", (latestProgress) => {
    if (debugEnabled) {
      setDebugSnapshot((previous) => ({ ...previous, projectProgress: latestProgress }));
    }
  });

  useEffect(() => {
    if (!isMeasured || previewStep <= 0) return;

    const rawIndex = Math.round(Math.abs(railY.get()) / previewStep);
    const clampedIndex = clampIndex(rawIndex, projectCount - 1);

    if (clampedIndex !== activeIndexRef.current) {
      activeIndexRef.current = clampedIndex;
      setActiveIndex(clampedIndex);
    }
  }, [isMeasured, previewStep, projectCount, railY]);

  const selectProject = useCallback(
    (index: number) => {
      const stage = stageRef.current;
      if (!stage) return;

      const stageTop = stage.getBoundingClientRect().top + window.scrollY;
      const target =
        stageTop + identityDistance + portalDistance + clampIndex(index, projectCount - 1) * perProjectScrollDistance;

      window.scrollTo({
        top: Math.max(0, target),
        behavior: prefersReducedMotion ? "auto" : "smooth",
      });
    },
    [identityDistance, perProjectScrollDistance, portalDistance, prefersReducedMotion, projectCount],
  );
  const setOrbitPaused = useCallback((paused: boolean) => {
    orbitPausedRef.current = paused;
  }, []);
  const activeProject = featuredProjects[activeIndex] ?? featuredProjects[0];
  if (!activeProject) return null;

  const activeSlug = activeProject.slug;
  const previewIsInteractive = currentPhase === "navigation" || currentPhase === "exit";
  const orbitalMode = getOrbitalMode(currentPhase);

  return (
    <section
      id="work"
      ref={sectionRef}
      data-active-slug={activeSlug}
      data-home-stage-phase={currentPhase}
      className="relative scroll-mt-0 bg-bg-work text-text-work"
    >
      <StaticProjectFlow projects={featuredProjects} projectNodes={projectNodes} />

      <div
        ref={stageRef}
        id="project-explorer-stage"
        data-active-slug={activeSlug}
        data-home-stage-phase={currentPhase}
        data-explorer-phase={currentPhase}
        data-identity-ratio={identityRatio.toFixed(6)}
        data-portal-ratio={portalRatio.toFixed(6)}
        data-navigation-ratio={navigationRatio.toFixed(6)}
        data-navigation-start={navigationStart.toFixed(6)}
        data-navigation-end={navigationEnd.toFixed(6)}
        data-preview-reveal-start={previewRevealStart.toFixed(6)}
        data-preview-reveal-end={previewRevealEnd.toFixed(6)}
        className="relative hidden w-full lg:block motion-reduce:hidden lg:motion-reduce:hidden"
        style={{ height: `${stageHeight}px` }}
      >
        <div
          ref={portalRef}
          className="sticky top-0 h-screen w-full overflow-hidden bg-bg-work text-text-work"
          data-active-slug={activeSlug}
          data-home-stage-phase={currentPhase}
          data-explorer-phase={currentPhase}
        >
          <div className="absolute inset-0 pointer-events-none opacity-60 spatial-grid" aria-hidden="true" />
          <motion.div
            className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-bg-work to-transparent pointer-events-none"
            style={{ opacity: explorerExitOpacity }}
            aria-hidden="true"
          />

          <div className="container-shell relative z-10 grid h-full max-w-[1600px] grid-cols-12 items-center gap-10">
            <div className="relative col-span-3 h-[360px]">
              <motion.div
                className={cn(
                  "absolute inset-0 flex flex-col justify-center",
                  currentPhase !== "identity" && "pointer-events-none",
                  currentPhase !== "identity" && currentPhase !== "portal" && "invisible",
                )}
                aria-hidden={currentPhase !== "identity"}
                style={{ opacity: identityOpacity }}
              >
                <p className="font-mono text-xs text-text-kicker" style={{ color: "var(--color-text-kicker)", opacity: 1 }}>01 / IDENTITY</p>
                <div className="mt-4 h-px w-32 bg-white/10" />
                <p className="mt-4 max-w-[220px] font-mono text-xs uppercase leading-relaxed tracking-wider text-text-muted" style={{ color: "var(--color-text-muted)", opacity: 1 }}>
                  AI product engineer building from workflow evidence to measurable systems.
                </p>
              </motion.div>

              <ProjectTitleLayer
                activeIndex={activeIndex}
                activeProject={activeProject}
                opacity={projectLayerOpacity}
                contextOpacity={workContextOpacity}
                phase={currentPhase}
              />
            </div>

            <div className="relative col-span-6 flex h-full items-center justify-center">
              <AmbientFutureBubbles
                prefersReducedMotion={Boolean(prefersReducedMotion)}
                ratios={ratios}
                scrollYProgress={scrollYProgress}
              />

              <PersistentDPortal
                scale={dScale}
                opacity={dOpacity}
              />

              <IdentityScrollCue
                opacity={scrollCueOpacity}
                phase={currentPhase}
                prefersReducedMotion={Boolean(prefersReducedMotion)}
              />

              <OrbitalProjectNodes
                activeIndex={activeIndex}
                activeSlug={activeSlug}
                mode={orbitalMode}
                nodes={projectNodes}
                onOrbitInteraction={setOrbitPaused}
                onSelectProject={selectProject}
                idleOrbitOffset={idleOrbitOffset}
                projectProgress={projectProgress}
                scrollYProgress={scrollYProgress}
                ratios={ratios}
              />

              <ProjectExplorerLayer
                activeIndex={activeIndex}
                activeSlug={activeSlug}
                isNearViewport={isNearViewport}
                opacity={projectLayerOpacity}
                phase={currentPhase}
                previewIsInteractive={previewIsInteractive}
                previewRef={previewRef}
                railRef={railRef}
                railY={railY}
                previewStep={previewStep}
              />
            </div>

            <div className="relative col-span-3 h-[420px]">
              <HeroIdentityContent
                opacity={identityOpacity}
                phase={currentPhase}
                onExploreSelectedWork={() => selectProject(0)}
              />
              <ProjectMetadataLayer
                activeProject={activeProject}
                activeSlug={activeSlug}
                opacity={projectLayerOpacity}
                phase={currentPhase}
              />
            </div>
          </div>

          {debugEnabled && (
            <div
              className="fixed bottom-4 left-4 z-[100] pointer-events-none border border-white/10 bg-[#080D10]/90 px-4 py-3 font-mono text-[11px] leading-relaxed text-primary shadow-2xl"
              data-explorer-debug
            >
              <div>Raw scroll progress: {debugSnapshot.rawProgress.toFixed(4)}</div>
              <div>Project progress: {debugSnapshot.projectProgress.toFixed(4)}</div>
              <div>Rail Y: {debugSnapshot.railY.toFixed(2)}</div>
              <div>Preview height: {previewHeight.toFixed(2)}</div>
              <div>Gap: {gap.toFixed(2)}</div>
              <div>Preview step: {previewStep.toFixed(2)}</div>
              <div>Rail travel: {railTravel.toFixed(2)}</div>
              <div>Active index: {activeIndex}</div>
              <div>Active slug: {activeSlug}</div>
              <div>Current phase: {currentPhase}</div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function HeroIdentityContent({
  opacity,
  phase,
  onExploreSelectedWork,
}: {
  opacity: MotionValue<number>;
  phase: HomeStagePhase;
  onExploreSelectedWork: () => void;
}) {
  const isIdentityPhase = phase === "identity";

  return (
    <motion.div
      className={cn(
        "absolute inset-0 flex flex-col justify-center pt-14 xl:-ml-16 xl:pt-20",
        !isIdentityPhase && "pointer-events-none",
        phase !== "identity" && phase !== "portal" && "invisible",
      )}
      aria-hidden={!isIdentityPhase}
      style={{ opacity }}
    >
      <span className="mb-4 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-accent">
        <span className="size-1.5 rounded-full bg-accent" />
        {profile.role.split(" / ")[0]}
      </span>
      <h1
        className="w-[390px] max-w-none text-balance text-[38px] font-extrabold leading-[1.01] tracking-[-0.035em] text-primary xl:text-[44px]"
        data-hero-identity-headline
      >
        From ambiguous workflows to measurable AI systems.
      </h1>
      <p className="mt-5 w-[370px] max-w-none text-[15px] leading-relaxed text-text-muted xl:text-base" style={{ color: "var(--color-text-muted)", opacity: 1 }}>
        {profile.bio}
      </p>
      <div className="mt-7 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={onExploreSelectedWork}
          className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-[#0A0D10] shadow-md transition-all duration-300 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-accent active:scale-95"
          tabIndex={isIdentityPhase ? 0 : -1}
        >
          Explore Selected Work
        </button>
        <Link
          href={profile.resume.pageHref}
          className="inline-flex items-center justify-center rounded-full border border-white/10 px-6 py-3 text-sm font-semibold text-primary transition-all duration-200 hover:border-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          tabIndex={isIdentityPhase ? 0 : -1}
        >
          View Resume
        </Link>
      </div>
    </motion.div>
  );
}

function AmbientFutureBubbles({
  prefersReducedMotion,
  ratios,
  scrollYProgress,
}: {
  prefersReducedMotion: boolean;
  ratios: StageRatios;
  scrollYProgress: MotionValue<number>;
}) {
  const opacity = useTransform(
    scrollYProgress,
    [0, ratios.identityRatio, ratios.navigationStart, ratios.navigationEnd, 1],
    [0.58, 0.48, 0.22, 0.08, 0],
  );
  const y = useTransform(scrollYProgress, [0, ratios.navigationEnd, 1], [0, -8, -16]);

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[5]"
      data-ambient-future-bubbles
      style={{ opacity, y }}
    >
      {AMBIENT_FUTURE_BUBBLES.map((bubble, index) => (
        <motion.span
          key={`ambient-future-${index}`}
          aria-hidden="true"
          className="pointer-events-none absolute rounded-full border border-accent/22 bg-[radial-gradient(circle_at_32%_24%,rgba(255,255,255,0.78),rgba(221, 241, 255,0.24)_34%,rgba(9,16,20,0.22)_100%)] shadow-[0_0_18px_rgba(169, 214, 255,0.08),inset_0_1px_2px_rgba(255,255,255,0.38)]"
          data-ambient-future-bubble
          style={{
            height: bubble.size,
            left: `${bubble.x}%`,
            opacity: bubble.opacity,
            top: `${bubble.y}%`,
            width: bubble.size,
          }}
          animate={
            prefersReducedMotion
              ? undefined
              : {
                  x: [0, bubble.drift, 0],
                  y: [0, -7, 0],
                }
          }
          transition={{
            delay: bubble.delay,
            duration: bubble.duration,
            ease: "easeInOut",
            repeat: prefersReducedMotion ? 0 : Infinity,
          }}
        />
      ))}
    </motion.div>
  );
}

function PersistentDPortal({
  opacity,
  scale,
}: {
  opacity: MotionValue<number>;
  scale: MotionValue<number>;
}) {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
      aria-hidden="true"
      data-persistent-d
    >
      <motion.div
        className="absolute size-[500px] rounded-full bg-accent/10 blur-3xl"
        style={{ opacity }}
      />
      <motion.div
        className="relative select-none"
        style={{
          opacity,
          scale,
        }}
      >
        <LiquidDMark className="w-[390px] xl:w-[458px]" variant="portal" />
      </motion.div>
    </div>
  );
}

function IdentityScrollCue({
  opacity,
  phase,
  prefersReducedMotion,
}: {
  opacity: MotionValue<number>;
  phase: HomeStagePhase;
  prefersReducedMotion: boolean;
}) {
  return (
    <motion.div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute bottom-[clamp(2.5rem,5vh,4.25rem)] z-20 flex flex-col items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-accent/80",
        phase !== "identity" && "invisible",
      )}
      data-scroll-cue
      style={{ opacity }}
    >
      <span>SCROLL TO EXPLORE</span>
      <motion.span
        aria-hidden="true"
        className="size-1 rounded-full bg-accent shadow-[0_0_8px_rgba(169, 214, 255,0.5)]"
        animate={prefersReducedMotion ? undefined : { y: [0, 6, 0] }}
        transition={{ duration: 1.6, ease: "easeInOut", repeat: prefersReducedMotion ? 0 : Infinity }}
        data-scroll-cue-indicator
      />
    </motion.div>
  );
}

function OrbitalProjectNodes({
  activeIndex,
  activeSlug,
  mode,
  nodes,
  onOrbitInteraction,
  onSelectProject,
  idleOrbitOffset,
  projectProgress,
  ratios,
  scrollYProgress,
}: {
  activeIndex: number;
  activeSlug: string;
  mode: OrbitalMode;
  nodes: ProjectNode[];
  onOrbitInteraction: (paused: boolean) => void;
  onSelectProject: (index: number) => void;
  idleOrbitOffset: MotionValue<number>;
  projectProgress: MotionValue<number>;
  ratios: StageRatios;
  scrollYProgress: MotionValue<number>;
}) {
  const showActiveProjectState = mode === "morphing" || mode === "node";
  const orbitOpacity = useTransform(
    scrollYProgress,
    [0, ratios.identityRatio, ratios.navigationStart, ratios.navigationEnd, 1],
    [0.38, 0.34, 0.28, 0.22, 0.04],
  );

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[80] flex items-center justify-center"
      data-orbital-project-nodes
      data-desktop-orbital-project-nodes
      data-active-slug={showActiveProjectState ? activeSlug : undefined}
      data-orbital-mode={mode}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <motion.svg
          viewBox="0 0 640 640"
          className="absolute left-1/2 top-1/2 size-[610px] -translate-x-1/2 -translate-y-1/2 overflow-visible"
          data-orbit-paths
          style={{ opacity: orbitOpacity }}
        >
          <ellipse
            cx="320"
            cy="320"
            rx="300"
            ry="292"
            fill="none"
            stroke="rgba(217, 221, 224, 0.34)"
            strokeWidth="1"
          />
          <ellipse
            cx="320"
            cy="320"
            rx="218"
            ry="286"
            fill="none"
            stroke="rgba(169, 214, 255, 0.2)"
            strokeDasharray="4 12"
            strokeWidth="1"
          />
        </motion.svg>
      </div>

      <div className="pointer-events-none absolute inset-0">
        {nodes.map((node, index) => (
          <OrbitalProjectNode
            key={node.slug}
            active={showActiveProjectState && index === activeIndex}
            activeIndex={activeIndex}
            index={index}
            mode={mode}
            node={node}
            onOrbitInteraction={onOrbitInteraction}
            onSelectProject={onSelectProject}
            idleOrbitOffset={idleOrbitOffset}
            projectCount={nodes.length}
            projectProgress={projectProgress}
            ratios={ratios}
            scrollYProgress={scrollYProgress}
          />
        ))}
      </div>
    </div>
  );
}

function OrbitalProjectNode({
  active,
  activeIndex,
  index,
  mode,
  node,
  onOrbitInteraction,
  onSelectProject,
  idleOrbitOffset,
  projectCount,
  projectProgress,
  ratios,
  scrollYProgress,
}: {
  active: boolean;
  activeIndex: number;
  index: number;
  mode: OrbitalMode;
  node: ProjectNode;
  onOrbitInteraction: (paused: boolean) => void;
  onSelectProject: (index: number) => void;
  idleOrbitOffset: MotionValue<number>;
  projectCount: number;
  projectProgress: MotionValue<number>;
  ratios: StageRatios;
  scrollYProgress: MotionValue<number>;
}) {
  const isPlanet = mode === "planet";
  const isPast = index < activeIndex;
  const surface = isPlanet
    ? [
        "radial-gradient(circle at 29% 22%, rgba(255,255,255,0.95), rgba(217,221,224,0.52) 18%, rgba(92,137,139,0.46) 52%, rgba(8,13,16,0.6) 100%)",
        "radial-gradient(circle at 31% 23%, rgba(255,255,255,0.88), rgba(193,239,230,0.48) 21%, rgba(86,125,134,0.5) 54%, rgba(8,13,16,0.62) 100%)",
        "radial-gradient(circle at 28% 24%, rgba(255,255,255,0.9), rgba(180,229,227,0.45) 23%, rgba(75,111,124,0.5) 57%, rgba(8,13,16,0.64) 100%)",
      ][index] ?? "rgba(21,25,30,0.88)"
    : active
      ? "linear-gradient(135deg, rgba(169, 214, 255,0.18), rgba(21,25,30,0.9))"
      : "linear-gradient(135deg, rgba(217,221,224,0.11), rgba(21,25,30,0.82))";

  const portalT = useTransform(() =>
    clamp(
      (scrollYProgress.get() - ratios.identityRatio) / Math.max(ratios.portalRatio, 0.001),
      0,
      1,
    ),
  );

  const getFocusDistance = () => Math.abs(index - projectProgress.get() * Math.max(projectCount - 1, 0));
  const getFocusProximity = () => 1 - clamp(getFocusDistance(), 0, 1);
  const getScrollLinkedAngle = () => {
    const angleStep = (Math.PI * 2) / Math.max(projectCount, 1);
    const progressIndex = projectProgress.get() * Math.max(projectCount - 1, 0);
    const canonicalAngle = PROJECT_FOCAL_ANGLE + (index - progressIndex) * angleStep;
    const idleOffset = mode === "planet" ? idleOrbitOffset.get() * (1 + index * 0.04) : 0;

    return canonicalAngle + idleOffset;
  };

  const x = useTransform(() => Math.cos(getScrollLinkedAngle()) * PROJECT_ORBIT_RADIUS_X);
  const y = useTransform(() => Math.sin(getScrollLinkedAngle()) * PROJECT_ORBIT_RADIUS_Y);

  const width = useTransform(() => {
    if (mode === "planet") return node.bubbleSize;

    const transition = portalT.get();
    const proximity = getFocusProximity();
    const morph = clamp((proximity - 0.18) / 0.82, 0, 1) * transition;
    const capsule = clamp((proximity - 0.72) / 0.28, 0, 1) * transition;
    const circularSize = mix(node.bubbleSize * 0.78, node.bubbleSize * 1.08, morph);

    return mix(node.bubbleSize, mix(circularSize, 196, capsule), transition);
  });
  const height = useTransform(() => {
    if (mode === "planet") return node.bubbleSize;

    const transition = portalT.get();
    const proximity = getFocusProximity();
    const morph = clamp((proximity - 0.18) / 0.82, 0, 1) * transition;
    const capsule = clamp((proximity - 0.72) / 0.28, 0, 1) * transition;
    const circularSize = mix(node.bubbleSize * 0.78, node.bubbleSize * 1.08, morph);

    return mix(node.bubbleSize, mix(circularSize, 38, capsule), transition);
  });
  const nodeOpacity = useTransform(() => {
    if (mode === "planet") return 0.94;
    const transition = portalT.get();
    const navigationOpacity =
      active && getFocusDistance() < 0.56
        ? mix(0.62, 1, getFocusProximity())
        : isPast
          ? mix(0.08, 0.18, getFocusProximity())
          : mix(0.22, 0.34, getFocusProximity());

    return mix(0.94, navigationOpacity, transition);
  });
  const numberOpacity = useTransform(() => {
    if (mode === "planet") return 0;
    const reveal = clamp((getFocusProximity() - 0.28) / 0.46, 0, 1);
    return (active ? reveal : reveal * 0.7) * portalT.get();
  });
  const fullLabelOpacity = useTransform(() => {
    if (!active || mode === "planet") return 0;
    const portalReveal = clamp((portalT.get() - 0.45) / 0.35, 0, 1);
    const focalReveal = clamp((getFocusProximity() - 0.78) / 0.22, 0, 1);
    return portalReveal * focalReveal;
  });
  const highlightOpacity = useTransform(() => {
    if (mode === "planet") return 0.94;
    return mix(0.94, mix(0.12, active ? 0.38 : 0.2, getFocusProximity()), portalT.get());
  });

  return (
    <motion.button
      type="button"
      className={cn(
        "pointer-events-auto group absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-visible rounded-full border px-2 font-mono text-[10px] font-bold uppercase tracking-wider backdrop-blur-md transition-[border-color,box-shadow] duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent",
        isPlanet
          ? "border-white/40 text-primary shadow-[0_0_24px_rgba(169, 214, 255,0.18),inset_0_1px_1px_rgba(255,255,255,0.62)]"
          : active
            ? "border-accent/75 text-primary shadow-[0_0_28px_rgba(169, 214, 255,0.22)]"
            : "border-white/16 text-secondary",
      )}
      aria-current={active ? "true" : undefined}
      aria-label={`Select ${node.label}`}
      data-project-node
      data-project-slug={node.slug}
      data-active-slug={active ? node.slug : undefined}
      data-orbital-mode={mode}
      data-project-node-state={isPlanet ? "planet" : active ? "active-node" : isPast ? "past-node" : "future-node"}
      onBlur={() => {
        onOrbitInteraction(false);
      }}
      onClick={() => onSelectProject(index)}
      onFocus={() => {
        onOrbitInteraction(true);
      }}
      onMouseEnter={() => {
        onOrbitInteraction(true);
      }}
      onMouseLeave={() => {
        onOrbitInteraction(false);
      }}
      style={{
        background: surface,
        height,
        width,
        x,
        y,
        opacity: nodeOpacity,
      }}
    >
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute left-[20%] top-[15%] size-[22%] rounded-full bg-white blur-[1px]"
        style={{ opacity: highlightOpacity }}
      />
      <motion.span aria-hidden="true" className="relative whitespace-nowrap" style={{ opacity: numberOpacity }}>
        {String(node.homepageIndex).padStart(2, "0")}
      </motion.span>
      <motion.span
        aria-hidden="true"
        className="relative whitespace-nowrap text-primary"
        data-project-node-label
        style={{ opacity: fullLabelOpacity }}
      >
        {node.label}
      </motion.span>
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute left-1/2 top-[calc(100%+12px)] -translate-x-1/2 whitespace-nowrap rounded-full border border-white/12 bg-[#10171B]/92 px-2.5 py-1 text-[9px] font-mono font-semibold uppercase tracking-wider text-primary shadow-lg backdrop-blur-md opacity-0 transition-opacity duration-150",
        )}
      >
        {node.label}
      </span>
    </motion.button>
  );
}

function ProjectExplorerLayer({
  activeIndex,
  activeSlug,
  isNearViewport,
  opacity,
  phase,
  previewIsInteractive,
  previewRef,
  railRef,
  railY,
  previewStep,
}: {
  activeIndex: number;
  activeSlug: string;
  isNearViewport: boolean;
  opacity: MotionValue<number>;
  phase: HomeStagePhase;
  previewIsInteractive: boolean;
  previewRef: React.RefObject<HTMLDivElement | null>;
  railRef: React.RefObject<HTMLDivElement | null>;
  railY: MotionValue<number>;
  previewStep: number;
}) {
  const isIdentity = phase === "identity";
  const isFullyVisible = phase === "navigation" || phase === "exit";
  const layerOpacity = isIdentity ? 0 : isFullyVisible ? 1 : opacity;

  return (
    <motion.div
      className={cn(
        "relative z-[70] flex aspect-[16/10] w-full max-w-[620px] items-center justify-center",
        isIdentity && "invisible pointer-events-none",
      )}
      aria-hidden={isIdentity}
      style={{ opacity: layerOpacity }}
      data-explorer-layer
      data-active-slug={activeSlug}
      data-explorer-phase={phase}
    >
      <div className="absolute inset-0 overflow-visible">
        <motion.div
          id="project-rail-track"
          ref={railRef}
          className="flex w-full flex-col items-center"
          data-active-slug={activeSlug}
          data-explorer-phase={phase}
          style={{ y: railY, gap: PROJECT_RAIL_GAP }}
        >
          {featuredProjects.map((project, index) => (
            <ProjectRailItem
              key={`rail-${project.slug}`}
              activeIndex={activeIndex}
              activeSlug={activeSlug}
              eager={isNearViewport && Math.abs(index - activeIndex) <= 1}
              index={index}
              phase={phase}
              previewIsInteractive={previewIsInteractive}
              previewRef={index === 0 ? previewRef : null}
              previewStep={previewStep}
              project={project}
              railY={railY}
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}

function ProjectRailItem({
  activeIndex,
  activeSlug,
  eager,
  index,
  phase,
  previewIsInteractive,
  previewRef,
  previewStep,
  project,
  railY,
}: {
  activeIndex: number;
  activeSlug: string;
  eager: boolean;
  index: number;
  phase: HomeStagePhase;
  previewIsInteractive: boolean;
  previewRef: React.RefObject<HTMLDivElement | null> | null;
  previewStep: number;
  project: ProjectContent;
  railY: MotionValue<number>;
}) {
  const isActive = index === activeIndex;
  const visualState = useTransform(() => {
    if (isActive) {
      return {
        activeEdgeOpacity: 1,
        mediaOpacity: 1,
        scale: 1,
        scrimOpacity: 0,
      };
    }

    const distance = previewStep > 0 ? Math.min(Math.abs(railY.get() + index * previewStep) / previewStep, 1) : 1;

    return getInactiveDistanceState(distance);
  });
  const mediaOpacity = useTransform(visualState, (value) => value.mediaOpacity);
  const previewScale = useTransform(visualState, (value) => value.scale);
  const scrimOpacity = useTransform(visualState, (value) => value.scrimOpacity);
  const activeEdgeOpacity = useTransform(visualState, (value) => value.activeEdgeOpacity);
  const activeBrightness = project.homepageVisualAdjustment?.brightness ?? 1.08;
  const activeContrast = project.homepageVisualAdjustment?.contrast ?? 1.04;
  const mediaFilter = isActive
    ? `brightness(${activeBrightness}) contrast(${activeContrast})`
    : "brightness(0.98) contrast(1.02)";

  return (
    <motion.div
      ref={previewRef}
      className="relative aspect-[16/10] w-full origin-center"
      data-active-slug={isActive ? activeSlug : undefined}
      data-project-slug={project.slug}
      data-explorer-phase={phase}
      data-preview-distance-index={index}
      data-preview-state={isActive ? "active" : "inactive"}
      data-media-opacity={isActive ? "1" : "distance"}
      data-scrim-state={isActive ? "clear" : "distance"}
      data-active-edge-opacity={isActive ? "1" : "distance"}
      style={{ scale: previewScale }}
    >
      <Link
        href={`/work/${project.slug}`}
        scroll={false}
        id={`project-trigger-${project.slug}`}
        className={cn(
          "relative block h-full w-full overflow-hidden rounded-2xl focus:outline-none focus-visible:ring-4 focus-visible:ring-accent",
          !previewIsInteractive || !isActive ? "pointer-events-none" : "pointer-events-auto",
        )}
        tabIndex={previewIsInteractive && isActive ? 0 : -1}
        aria-hidden={!previewIsInteractive || !isActive}
        data-active-slug={isActive ? activeSlug : undefined}
        data-project-slug={project.slug}
        data-explorer-phase={phase}
      >
        <motion.div
          className="h-full w-full bg-[#071014]"
          data-preview-media
          style={{ filter: mediaFilter, opacity: mediaOpacity }}
        >
          <PreviewFrame
            src={project.visual.src}
            alt={project.visual.alt}
            slug={project.slug}
            kind={project.visual.kind}
            eager={eager}
          />
        </motion.div>
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-2xl bg-[#071014]"
          data-preview-scrim
          style={{ opacity: scrimOpacity }}
        />
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-2xl border border-accent/70 shadow-[0_0_24px_rgba(169, 214, 255,0.16),inset_0_0_18px_rgba(255,255,255,0.05)]"
          data-preview-active-edge
          style={{ opacity: activeEdgeOpacity }}
        />
      </Link>
    </motion.div>
  );
}

function ProjectTitleLayer({
  activeIndex,
  activeProject,
  contextOpacity,
  opacity,
  phase,
}: {
  activeIndex: number;
  activeProject: ProjectContent;
  contextOpacity: MotionValue<number>;
  opacity: MotionValue<number>;
  phase: HomeStagePhase;
}) {
  const isIdentity = phase === "identity";
  const isFullyVisible = phase === "navigation" || phase === "exit";

  return (
    <motion.div
      className={cn(
        "absolute inset-0 flex flex-col justify-center select-none",
        isIdentity && "invisible pointer-events-none",
      )}
      aria-hidden={isIdentity}
      data-active-slug={activeProject.slug}
      data-project-slug={activeProject.slug}
      data-explorer-phase={phase}
      data-explorer-slot="left-title"
      style={{ opacity: isIdentity ? 0 : isFullyVisible ? 1 : opacity }}
    >
      <motion.span
        className="mb-4 block font-mono text-xs uppercase tracking-wider text-accent"
        style={{ opacity: contextOpacity }}
      >
        02 / SELECTED WORK
      </motion.span>
      <span className="mb-3 font-mono text-xs text-secondary">
        0{activeIndex + 1}
      </span>
      <h2 className="break-words text-4xl font-black tracking-tight text-primary xl:text-5xl">
        {activeProject.title}
      </h2>
      <div
        className="relative my-4 h-px max-w-[220px] bg-white/10"
        data-active-slug={activeProject.slug}
        data-project-slug={activeProject.slug}
        data-explorer-phase={phase}
        data-explorer-slot="connector"
      >
        <div className="absolute right-0 top-1/2 size-2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_8px_#A9D6FF]" />
      </div>
      <p className="font-mono text-xs uppercase leading-relaxed tracking-wider text-secondary">
        {activeProject.role}
      </p>
    </motion.div>
  );
}

function ProjectMetadataLayer({
  activeProject,
  activeSlug,
  opacity,
  phase,
}: {
  activeProject: ProjectContent;
  activeSlug: string;
  opacity: MotionValue<number>;
  phase: HomeStagePhase;
}) {
  const isIdentity = phase === "identity";
  const isFullyVisible = phase === "navigation" || phase === "exit";

  return (
    <motion.div
      className={cn(
        "absolute inset-0 flex flex-col justify-center py-4",
        isIdentity && "invisible pointer-events-none",
      )}
      aria-hidden={isIdentity}
      data-active-slug={activeSlug}
      data-project-slug={activeSlug}
      data-explorer-phase={phase}
      data-explorer-slot="right-metadata"
      style={{ opacity: isIdentity ? 0 : isFullyVisible ? 1 : opacity }}
    >
      <div>
        <span className="mb-3 block font-mono text-[10px] uppercase tracking-widest text-accent">
          {activeProject.statusLabel}
        </span>
        <p className="mb-6 text-sm leading-relaxed text-secondary">
          {activeProject.oneLineSummary}
        </p>

        {activeProject.metrics.length > 0 ? (
          <div className="mb-4 grid grid-cols-2 gap-4">
            {activeProject.metrics
              .filter((metric) => metric.featured)
              .map((point) => (
                <div key={point.label} className="flex flex-col">
                  <span className="text-2xl font-black text-accent drop-shadow-[0_0_10px_rgba(169, 214, 255,0.15)]">
                    {point.value}
                  </span>
                  <span className="mt-1 text-[10px] font-semibold uppercase text-secondary">
                    {point.label}
                  </span>
                </div>
              ))}
          </div>
        ) : null}
      </div>

      <div className="mt-6">
        <Link
          href={`/work/${activeSlug}`}
          scroll={false}
          className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-primary hover:text-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          data-active-slug={activeSlug}
          data-project-slug={activeSlug}
          data-explorer-phase={phase}
          data-explorer-slot="cta"
        >
          Explore project
          <ArrowUpRight size={14} />
        </Link>
      </div>
    </motion.div>
  );
}

function StaticProjectFlow({
  projects,
  projectNodes,
}: {
  projects: ProjectContent[];
  projectNodes: ProjectNode[];
}) {
  return (
    <div className="container-shell block py-28 lg:hidden motion-reduce:block lg:motion-reduce:block">
      <div className="grid gap-10 md:grid-cols-[0.82fr_1.18fr] md:items-center">
        <div className="relative mx-auto flex min-h-[260px] w-full max-w-[360px] items-center justify-center">
          <div className="pointer-events-none absolute inset-0 rounded-full border border-white/12" aria-hidden="true" />
          <div className="pointer-events-none absolute size-[210px] rounded-full border border-dashed border-accent/20" aria-hidden="true" />
          <LiquidDMark className="pointer-events-none w-[218px]" variant="compact" />
          <div
            className="pointer-events-none absolute inset-0"
            aria-hidden="true"
            data-orbital-project-nodes
            data-orbital-mode="planet"
          >
            {projectNodes.map((node, index) => (
              <div
                key={node.slug}
                className={cn(
                  "absolute rounded-full border border-white/40 shadow-[0_0_18px_rgba(169, 214, 255,0.16),inset_0_1px_1px_rgba(255,255,255,0.65)]",
                  index === 0 ? "left-3 top-10 size-[42px]" : index === 1 ? "right-2 top-28 size-[30px]" : "bottom-8 left-16 size-[20px]",
                )}
                data-project-node
                data-project-slug={node.slug}
                data-project-node-state="planet"
                style={{
                  background:
                    index === 0
                      ? "radial-gradient(circle at 29% 22%, rgba(255,255,255,0.95), rgba(217,221,224,0.52) 18%, rgba(92,137,139,0.46) 52%, rgba(8,13,16,0.6) 100%)"
                      : index === 1
                        ? "radial-gradient(circle at 31% 23%, rgba(255,255,255,0.88), rgba(193,239,230,0.48) 21%, rgba(86,125,134,0.5) 54%, rgba(8,13,16,0.62) 100%)"
                        : "radial-gradient(circle at 28% 24%, rgba(255,255,255,0.9), rgba(180,229,227,0.45) 23%, rgba(75,111,124,0.5) 57%, rgba(8,13,16,0.64) 100%)",
                }}
              >
                <span className="absolute left-[22%] top-[16%] size-[24%] rounded-full bg-white/90 blur-[1px]" />
              </div>
            ))}
          </div>
        </div>

        <div>
          <span className="mb-4 flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-accent">
            <span className="size-1.5 rounded-full bg-accent" />
            {profile.role.split(" / ")[0]}
          </span>
          <h1 className="max-w-[390px] text-balance text-[32px] font-extrabold leading-[1.03] tracking-[-0.03em] text-primary md:text-[40px]">
            From ambiguous workflows to measurable AI systems.
          </h1>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-text-muted md:text-base" style={{ color: "var(--color-text-muted)", opacity: 1 }}>
            {profile.bio}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href={profile.resume.pageHref}
              className="inline-flex items-center justify-center rounded-full border border-white/10 px-6 py-3 text-sm font-semibold text-primary transition-all duration-200 hover:border-white/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              View Resume
            </Link>
            <a
              href="#project-list"
              className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-[#0A0D10] transition-all duration-200 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              Explore Work
            </a>
          </div>
        </div>
      </div>

      <div id="project-list" className="mt-16">
        <span className="mb-6 block font-mono text-xs uppercase tracking-wider text-accent">
          02 / SELECTED WORK
        </span>
        <div className="space-y-10">
          {projects.map((project, index) => (
            <article
              key={project.slug}
              className="rounded-2xl border border-white/8 bg-[#15191E]/35 p-5 md:p-6"
              data-project-slug={project.slug}
            >
              <div className="mb-5">
                <div className="mb-2 flex items-center gap-2">
                  <span className="font-mono text-xs text-secondary">0{index + 1}</span>
                  <span className="h-px w-7 bg-accent/50" />
                  <span className="font-mono text-[10px] uppercase tracking-wider text-accent">
                    {project.statusLabel}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-primary">{project.title}</h2>
                <p className="mt-1 text-xs uppercase tracking-wider text-secondary">{project.role}</p>
              </div>

              <Link
                href={`/work/${project.slug}`}
                scroll={false}
                id={`project-trigger-fallback-${project.slug}`}
                className="block overflow-hidden rounded-xl focus:outline-none focus-visible:ring-4 focus-visible:ring-accent"
              >
                <div className="aspect-[16/10] w-full">
                  <PreviewFrame
                    src={project.visual.src}
                    alt={project.visual.alt}
                    slug={project.slug}
                    kind={project.visual.kind}
                    eager={index === 0}
                  />
                </div>
              </Link>

              <div className="mt-5">
                <p className="text-sm leading-relaxed text-secondary">{project.oneLineSummary}</p>

                {project.metrics.length > 0 ? (
                  <div className="mt-5 grid grid-cols-2 gap-4">
                    {project.metrics
                      .filter((metric) => metric.featured)
                      .map((point) => (
                        <div key={point.label} className="flex flex-col">
                          <span className="text-xl font-bold text-accent">{point.value}</span>
                          <span className="text-[9px] font-semibold uppercase text-secondary">
                            {point.label}
                          </span>
                        </div>
                      ))}
                  </div>
                ) : null}

                <Link
                  href={`/work/${project.slug}`}
                  scroll={false}
                  className="mt-5 inline-flex items-center gap-1 text-xs font-mono font-bold uppercase tracking-wider text-accent hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  Read case study <ArrowUpRight size={12} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
