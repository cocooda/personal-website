"use client";

import { useId } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils/cn";

type LiquidDMarkProps = {
  className?: string;
  variant?: "hero" | "portal" | "compact";
};

const D_MARK_PATH =
  "M54 49C77 52 103 55 132 55H239C335 55 393 137 393 264C393 392 334 475 238 475H54V438C75 436 91 432 101 424V100C91 91 75 87 54 86V49ZM167 113V417H226C282 417 321 360 321 264C321 167 282 113 226 113H167Z";

const D_COUNTER_PATH =
  "M167 113V417H226C282 417 321 360 321 264C321 167 282 113 226 113H167Z";

const D_BASE_BUBBLES = [
  { x: 132, y: 465, size: 4.2, opacity: 0.38, drift: -4, lift: 42, duration: 8.8, delay: 0.1 },
  { x: 151, y: 480, size: 2.7, opacity: 0.32, drift: 3, lift: 34, duration: 7.6, delay: 1.4 },
  { x: 173, y: 458, size: 5.4, opacity: 0.34, drift: -2, lift: 52, duration: 10.4, delay: 2.2 },
  { x: 196, y: 474, size: 3.4, opacity: 0.28, drift: 5, lift: 38, duration: 9.4, delay: 3.1 },
  { x: 218, y: 462, size: 4.8, opacity: 0.3, drift: 2, lift: 48, duration: 11.2, delay: 4.3 },
  { x: 119, y: 486, size: 2.4, opacity: 0.25, drift: -3, lift: 30, duration: 8.2, delay: 5.0 },
  { x: 184, y: 490, size: 2.9, opacity: 0.22, drift: 4, lift: 36, duration: 9.8, delay: 6.4 },
] as const;

/**
 * A small, self-contained brand mark for the identity and explorer states.
 *
 * The path deliberately has a display-serif silhouette instead of relying on
 * the installed font stack, so the mark keeps its character wherever it is
 * rendered. Its material is layered in SVG rather than being a flat glyph.
 */
export function LiquidDMark({ className, variant = "hero" }: LiquidDMarkProps) {
  const prefersReducedMotion = useReducedMotion();
  const isPortal = variant === "portal";
  const isCompact = variant === "compact";
  const instanceId = useId().replace(/:/g, "");
  const pearlId = `${instanceId}-pearl`;
  const extrusionId = `${instanceId}-extrusion`;
  const bevelId = `${instanceId}-bevel`;
  const highlightId = `${instanceId}-highlight`;
  const counterId = `${instanceId}-counter`;
  const causticId = `${instanceId}-caustic`;
  const baseGlowId = `${instanceId}-base-glow`;
  const baseCoreId = `${instanceId}-base-core`;
  const lowerSpillId = `${instanceId}-lower-spill`;
  const glowId = `${instanceId}-glow`;
  const softShadowId = `${instanceId}-soft-shadow`;
  const softenId = `${instanceId}-soften`;
  const baseOpacity = isPortal ? 0.48 : isCompact ? 0.52 : 0.74;
  const bubbleSet = prefersReducedMotion ? D_BASE_BUBBLES.slice(0, 3) : D_BASE_BUBBLES;

  return (
    <svg
      aria-hidden="true"
      className={cn("pointer-events-none block overflow-visible", className)}
      data-liquid-d
      data-liquid-d-variant={variant}
      fill="none"
      viewBox="0 0 440 530"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={extrusionId} x1="126" x2="383" y1="122" y2="467" gradientUnits="userSpaceOnUse">
          <stop stopColor="#172A38" stopOpacity="0.95" />
          <stop offset="0.48" stopColor="#325F78" stopOpacity="0.72" />
          <stop offset="1" stopColor="#74C5E5" stopOpacity="0.42" />
        </linearGradient>
        <linearGradient id={pearlId} x1="112" x2="330" y1="50" y2="466" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" />
          <stop offset="0.22" stopColor="#F7FAFC" />
          <stop offset="0.58" stopColor="#DCEFF5" />
          <stop offset="1" stopColor="#9FD3E3" />
        </linearGradient>
        <linearGradient id={bevelId} x1="79" x2="378" y1="70" y2="438" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" stopOpacity="0.96" />
          <stop offset="0.28" stopColor="#F0FAFD" stopOpacity="0.4" />
          <stop offset="0.62" stopColor="#315F73" stopOpacity="0.24" />
          <stop offset="1" stopColor="#081521" stopOpacity="0.68" />
        </linearGradient>
        <radialGradient id={highlightId} cx="0" cy="0" r="1" gradientTransform="translate(129 104) rotate(43) scale(172 126)" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" stopOpacity="0.88" />
          <stop offset="0.44" stopColor="#EFFBFF" stopOpacity="0.28" />
          <stop offset="1" stopColor="#EFFBFF" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={counterId} x1="168" x2="326" y1="120" y2="411" gradientUnits="userSpaceOnUse">
          <stop stopColor="#09131A" stopOpacity="0.56" />
          <stop offset="0.28" stopColor="#234554" stopOpacity="0.3" />
          <stop offset="0.72" stopColor="#E2F4F8" stopOpacity="0.2" />
          <stop offset="1" stopColor="#071019" stopOpacity="0.68" />
        </linearGradient>
        <linearGradient id={causticId} x1="94" x2="353" y1="308" y2="278" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="0.34" stopColor="#FFFFFF" stopOpacity="0.18" />
          <stop offset="0.54" stopColor="#B8EAF7" stopOpacity="0.38" />
          <stop offset="0.78" stopColor="#FFFFFF" stopOpacity="0.1" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={baseGlowId} cx="0" cy="0" r="1" gradientTransform="translate(220 474) rotate(90) scale(48 218)" gradientUnits="userSpaceOnUse">
          <stop stopColor="#EAFBFF" stopOpacity="0.74" />
          <stop offset="0.32" stopColor="#91DDF3" stopOpacity="0.44" />
          <stop offset="1" stopColor="#65CBEE" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={baseCoreId} cx="0" cy="0" r="1" gradientTransform="translate(220 474) rotate(90) scale(14 118)" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFFFF" stopOpacity="0.82" />
          <stop offset="0.42" stopColor="#C4EEF8" stopOpacity="0.5" />
          <stop offset="1" stopColor="#65CBEE" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={lowerSpillId} x1="220" x2="220" y1="334" y2="476" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6ACBEB" stopOpacity="0" />
          <stop offset="0.76" stopColor="#6ACBEB" stopOpacity="0.18" />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0.28" />
        </linearGradient>
        <filter id={glowId} x="-38%" y="-22%" width="176%" height="154%" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation="12" />
        </filter>
        <filter id={softShadowId} x="-14%" y="-10%" width="128%" height="128%" colorInterpolationFilters="sRGB">
          <feDropShadow dx="9" dy="12" stdDeviation="7" floodColor="#071014" floodOpacity="0.38" />
        </filter>
        <filter id={softenId} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation="1.1" />
        </filter>
      </defs>

      <g data-d-base-illumination opacity={baseOpacity}>
        <ellipse cx="220" cy="477" fill={`url(#${baseGlowId})`} filter={`url(#${glowId})`} rx="205" ry="36" />
        <ellipse cx="220" cy="474" fill={`url(#${baseCoreId})`} filter={`url(#${softenId})`} rx="125" ry="8" />
        <path
          d="M127 464C169 458 268 458 312 464"
          opacity="0.42"
          stroke="#ECFBFF"
          strokeLinecap="round"
          strokeWidth="2"
        />
        <path
          d="M116 471C166 477 275 477 326 471"
          opacity="0.26"
          stroke="#87D8EF"
          strokeLinecap="round"
          strokeWidth="1.2"
        />
      </g>

      <g data-d-base-bubble-plume>
        {bubbleSet.map((bubble, index) => (
          <motion.circle
            key={`d-base-bubble-${index}`}
            className="pointer-events-none"
            cx={bubble.x}
            cy={bubble.y}
            data-d-base-bubble
            fill="rgba(255,255,255,0.06)"
            r={bubble.size}
            stroke="rgba(221,245,251,0.72)"
            strokeWidth="0.8"
            initial={false}
            animate={
              prefersReducedMotion
                ? { opacity: bubble.opacity * 0.72 }
                : {
                  opacity: [0, bubble.opacity, 0],
                  x: [0, bubble.drift, bubble.drift * 1.4],
                  y: [0, -bubble.lift * 0.44, -bubble.lift],
                }
            }
            transition={{
              delay: bubble.delay,
              duration: bubble.duration,
              ease: "easeOut",
              repeat: prefersReducedMotion ? 0 : Infinity,
            }}
          />
        ))}
      </g>

      <path
        d={D_MARK_PATH}
        fill={`url(#${extrusionId})`}
        fillRule="evenodd"
        filter={`url(#${softShadowId})`}
        opacity={isPortal ? "0.46" : "0.82"}
        transform="translate(11 13)"
      />
      <path
        d={D_MARK_PATH}
        fill={`url(#${pearlId})`}
        fillRule="evenodd"
        opacity={isPortal ? "0.86" : "1"}
      />
      <path
        d={D_MARK_PATH}
        fill={`url(#${highlightId})`}
        fillRule="evenodd"
        opacity={isPortal ? "0.3" : "0.58"}
      />
      <path
        d={D_MARK_PATH}
        fill={`url(#${lowerSpillId})`}
        fillRule="evenodd"
        opacity={isPortal ? "0.24" : "0.42"}
      />
      <path
        d="M70 60C93 64 115 67 139 67H238C323 67 376 141 376 264C376 387 323 462 238 462H73M166 112H226C283 112 323 168 323 264C323 360 283 418 226 418H166"
        opacity={isPortal ? "0.42" : "0.72"}
        stroke={`url(#${bevelId})`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
      />
      <path
        d={D_COUNTER_PATH}
        opacity={isPortal ? "0.36" : "0.58"}
        stroke={`url(#${counterId})`}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="6"
      />
      <motion.path
        aria-hidden="true"
        d="M100 311C155 287 229 283 315 303"
        data-d-surface-caustic
        filter={`url(#${softenId})`}
        opacity={isPortal ? "0.16" : "0.32"}
        stroke={`url(#${causticId})`}
        strokeLinecap="round"
        strokeWidth="5"
        initial={false}
        animate={prefersReducedMotion ? undefined : { x: [0, 5, 0], opacity: [0.18, 0.32, 0.18] }}
        transition={{ duration: 14, ease: "easeInOut", repeat: prefersReducedMotion ? 0 : Infinity }}
      />
    </svg>
  );
}