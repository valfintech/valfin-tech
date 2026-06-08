"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion, animate } from "framer-motion";

type AnimatedCounterProps = {
  /** Final numeric value to count up to */
  value: number;
  /** Optional prefix, e.g. "$" */
  prefix?: string;
  /** Optional suffix, e.g. "%" or "x" */
  suffix?: string;
  /** Number of decimal places to display */
  decimals?: number;
  className?: string;
  /** Duration of the count-up animation, in seconds */
  durationSeconds?: number;
};

function format(n: number, decimals: number, prefix: string, suffix: string) {
  return `${prefix}${n.toFixed(decimals)}${suffix}`;
}

/**
 * Counts up from 0 to `value` once, when scrolled into view. Triggers a
 * single time (intersection observer with "once" behavior) — never
 * re-fires on repeat scroll passes, per the motion spec. Renders the
 * final value immediately (no animation) when the user prefers reduced
 * motion — without ever calling setState synchronously inside an effect.
 */
export function AnimatedCounter({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  className,
  durationSeconds = 1.2,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const shouldReduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView || shouldReduceMotion) return;

    const controls = animate(0, value, {
      duration: durationSeconds,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplay(latest),
    });

    return () => controls.stop();
  }, [isInView, value, shouldReduceMotion, durationSeconds]);

  // Reduced motion: render the final value directly — no animation, no
  // intermediate state. Otherwise: start at 0 and count up on scroll-in.
  const resolved = shouldReduceMotion ? value : display;

  return (
    <span ref={ref} className={className} aria-label={format(value, decimals, prefix, suffix)}>
      {format(resolved, decimals, prefix, suffix)}
    </span>
  );
}
