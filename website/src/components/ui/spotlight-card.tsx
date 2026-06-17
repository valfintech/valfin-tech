"use client";

import { useRef, useCallback } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

type SpotlightCardProps = {
  children: React.ReactNode;
  className?: string;
};

/**
 * Wraps any card with a cursor-reactive radial spotlight.
 * The glow tracks the mouse position within the card via CSS custom
 * properties — no React re-renders on mousemove, zero performance cost.
 * Falls back to a static card when prefers-reduced-motion is set.
 */
export function SpotlightCard({ children, className }: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current || prefersReduced) return;
      const rect = ref.current.getBoundingClientRect();
      ref.current.style.setProperty("--sx", `${e.clientX - rect.left}px`);
      ref.current.style.setProperty("--sy", `${e.clientY - rect.top}px`);
    },
    [prefersReduced],
  );

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      className={cn("spotlight-card", className)}
    >
      {children}
    </div>
  );
}
