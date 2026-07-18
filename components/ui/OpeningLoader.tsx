"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LiquidDMark } from "@/components/visual/LiquidDMark";

interface OpeningLoaderProps {
  onComplete: () => void;
}

export function OpeningLoader({ onComplete }: OpeningLoaderProps) {
  const [shouldPlay, setShouldPlay] = useState<boolean | null>(null);
  const [step, setStep] = useState<"initial" | "active" | "exit">("initial");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hasLoaded = sessionStorage.getItem("portfolio-loaded");
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (hasLoaded || prefersReducedMotion) {
      onComplete();
      const t = setTimeout(() => {
        setShouldPlay(false);
      }, 0);
      return () => clearTimeout(t);
    } else {
      const t1 = setTimeout(() => {
        setShouldPlay(true);
      }, 0);
      
      const activeTimer = setTimeout(() => {
        setStep("active");
      }, 800);

      const exitTimer = setTimeout(() => {
        setStep("exit");
      }, 2000);

      const completeTimer = setTimeout(() => {
        sessionStorage.setItem("portfolio-loaded", "true");
        onComplete();
      }, 2600);

      return () => {
        clearTimeout(t1);
        clearTimeout(activeTimer);
        clearTimeout(exitTimer);
        clearTimeout(completeTimer);
      };
    }
  }, [onComplete]);

  if (shouldPlay === false) return null;

  return (
    <AnimatePresence>
      {step !== "exit" && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#080D10] text-[#F4F3EE]"
        >
          {/* Spatial visual background grid */}
          <div className="absolute inset-0 pointer-events-none opacity-40 spatial-grid" />

          <div className="relative flex flex-col items-center justify-center">
            {/* Fine orbital ring or signal movement around D */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: step === "active" ? 1.05 : 1, 
                opacity: step === "active" ? 0.35 : 0.15 
              }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="absolute size-[280px] rounded-full border border-accent/40"
            />
            
            {/* Spinning orbital dot */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
              className="absolute size-[280px] rounded-full"
            >
              <div className="absolute top-0 left-1/2 size-2 -translate-x-1/2 rounded-full bg-accent droplet-glow" />
            </motion.div>

            {/* Reuse the identity mark so the opening never falls back to a plain glyph. */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0.2 }}
              animate={{ 
                scale: step === "active" ? 1.1 : 1, 
                opacity: 1,
              }}
              transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
              className="select-none"
            >
              <LiquidDMark className="w-[220px]" variant="hero" />
            </motion.div>

            {/* Subtle progress signal */}
            <div className="absolute -bottom-8 flex gap-1 h-0.5 w-16 bg-white/10 overflow-hidden rounded-full">
              <motion.div 
                initial={{ left: "-100%" }}
                animate={{ left: "100%" }}
                transition={{ duration: 2.2, ease: "easeInOut" }}
                className="relative h-full w-1/2 bg-accent rounded-full"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
