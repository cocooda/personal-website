"use client";

import { useEffect, useRef, useState } from "react";

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function HeroEvidenceField() {
  const frame = useRef<number | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) {
      return;
    }

    const update = () => {
      frame.current = null;
      setProgress(clamp(window.scrollY / 520, 0, 1));
    };

    const onScroll = () => {
      if (frame.current === null) {
        frame.current = window.requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame.current !== null) {
        window.cancelAnimationFrame(frame.current);
      }
    };
  }, []);

  const scale = 1.04 - progress * 0.1;
  const y = -progress * 18;
  const opacity = 0.92 - progress * 0.12;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[86vh] min-h-[660px] overflow-hidden"
    >
      <div
        data-motion-field="hero-evidence"
        className="absolute left-1/2 top-20 h-[560px] w-[min(1100px,92vw)] -translate-x-1/2 rounded-[18px] border border-strong bg-elevated/60 shadow-[0_50px_140px_rgba(0,0,0,0.42)] transition-transform duration-150 fine-grid"
        style={{ transform: `translateX(-50%) translateY(${y}px) scale(${scale})`, opacity }}
      >
        <div className="absolute inset-8 rounded-xl border border-subtle bg-base/34" />
        <div className="absolute left-[8%] top-[18%] h-24 w-72 rounded-md border border-steel/30 bg-panel/72 shadow-2xl" />
        <div className="absolute right-[8%] top-[28%] h-40 w-80 rounded-md border border-teal/30 bg-panel/70 shadow-2xl" />
        <div className="absolute bottom-[18%] left-[20%] h-36 w-[42%] rounded-md border border-violet/30 bg-panel/64 shadow-2xl" />
        <div className="absolute left-[16%] top-[44%] h-2 w-[68%] rounded-full bg-gradient-to-r from-steel/0 via-steel/60 to-teal/0" />
        <div className="absolute right-[17%] top-[22%] size-20 rounded-full border border-teal/40 bg-teal/10 shadow-[inset_0_1px_22px_rgba(231,226,216,0.08),0_18px_80px_rgba(109,159,155,0.16)]" />
        <div className="absolute bottom-[23%] left-[12%] size-14 rounded-full border border-steel/40 bg-steel/10 shadow-[inset_0_1px_16px_rgba(231,226,216,0.08),0_14px_50px_rgba(142,164,184,0.12)]" />
      </div>
    </div>
  );
}
