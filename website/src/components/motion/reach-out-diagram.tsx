"use client";

import { motion, useReducedMotion } from "framer-motion";

type ReachOutDiagramProps = {
  className?: string;
  /** Smaller variant used inline (e.g. in How It Works) vs. the hero */
  size?: "hero" | "inline";
};

/**
 * The signature motion moment of the brand: a small pulse — "a customer
 * reaching out" — travels across, and is met instantly by a response
 * that lights up and returns. This single loop visualizes Valfin's
 * entire thesis: something reaches out, something answers.
 *
 * Quiet, slow-looping, low-opacity ambient glow — never aggressive.
 * Fully static (final "answered" state) under prefers-reduced-motion.
 */
export function ReachOutDiagram({ className, size = "hero" }: ReachOutDiagramProps) {
  const shouldReduceMotion = useReducedMotion();
  const dimension = size === "hero" ? 420 : 240;

  return (
    <div
      className={className}
      role="img"
      aria-label="Animation showing a customer inquiry being answered instantly by Valfin"
    >
      <svg
        viewBox="0 0 420 240"
        width={dimension}
        height={dimension * (240 / 420)}
        className="w-full max-w-md"
        aria-hidden="true"
      >
        {/* Connecting line / "channel" */}
        <line
          x1="60"
          y1="120"
          x2="360"
          y2="120"
          stroke="var(--ink-700)"
          strokeWidth="1.5"
          strokeDasharray="4 6"
        />

        {/* Origin node — "someone reaches out" */}
        <circle cx="60" cy="120" r="8" fill="var(--ink-600)" />
        <circle cx="60" cy="120" r="3" fill="var(--ink-200)" />

        {/* Destination node — "Valfin answers" */}
        <circle cx="360" cy="120" r="20" fill="var(--ink-800)" stroke="var(--accent-500)" strokeWidth="1.5" />
        <circle cx="360" cy="120" r="6" fill="var(--accent-500)" />

        {!shouldReduceMotion ? (
          <>
            {/* Outbound pulse traveling from origin to destination */}
            <motion.circle
              r="5"
              fill="var(--ink-50)"
              initial={{ cx: 60, opacity: 0 }}
              animate={{
                cx: [60, 360],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 2.6,
                ease: [0.45, 0, 0.55, 1],
                repeat: Infinity,
                repeatDelay: 1.4,
                times: [0, 0.08, 0.75, 1],
              }}
              cy={120}
            />

            {/* Response glow — lights up the moment the pulse arrives */}
            <motion.circle
              cx="360"
              cy="120"
              r="20"
              fill="transparent"
              stroke="var(--accent-400)"
              strokeWidth="2"
              initial={{ opacity: 0, scale: 1 }}
              animate={{
                opacity: [0, 0, 0.9, 0],
                scale: [1, 1, 1.9, 2.4],
              }}
              transition={{
                duration: 2.6,
                ease: "easeOut",
                repeat: Infinity,
                repeatDelay: 1.4,
                times: [0, 0.72, 0.8, 1],
              }}
              style={{ transformOrigin: "360px 120px" }}
            />

            {/* Ambient slow drift glow behind the answer node */}
            <motion.circle
              cx="360"
              cy="120"
              r="34"
              fill="var(--accent-500)"
              initial={{ opacity: 0.05 }}
              animate={{ opacity: [0.05, 0.12, 0.05] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              style={{ filter: "blur(18px)" }}
            />
          </>
        ) : (
          // Static "answered" end-state for reduced motion
          <circle cx="360" cy="120" r="30" fill="var(--accent-500)" opacity="0.12" />
        )}

        {/* Labels */}
        <text x="60" y="160" textAnchor="middle" fill="var(--ink-400)" fontSize="12" fontFamily="var(--font-sans)">
          Someone reaches out
        </text>
        <text x="360" y="160" textAnchor="middle" fill="var(--ink-200)" fontSize="12" fontFamily="var(--font-sans)">
          Valfin answers — instantly
        </text>
      </svg>
    </div>
  );
}
