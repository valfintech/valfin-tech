"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";
import { fadeUp, staggerContainer, stagger } from "@/lib/motion-tokens";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  /** Delay before the reveal starts, in seconds */
  delay?: number;
  /** Override the default fade-up variants */
  variants?: Variants;
  as?: "div" | "section" | "header" | "li" | "span";
};

/**
 * Standard scroll-triggered reveal wrapper. Fades content up into place
 * as it enters the viewport, once. Respects prefers-reduced-motion by
 * rendering content statically (no animation, no layout shift).
 */
export function ScrollReveal({
  children,
  className,
  delay = 0,
  variants,
  as = "div",
}: ScrollRevealProps) {
  const shouldReduceMotion = useReducedMotion();
  const MotionTag = motion[as];

  if (shouldReduceMotion) {
    const StaticTag = as;
    return <StaticTag className={className}>{children}</StaticTag>;
  }

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={variants ?? fadeUp}
      transition={{ delay }}
    >
      {children}
    </MotionTag>
  );
}

type ScrollRevealGroupProps = {
  children: ReactNode;
  className?: string;
  staggerAmount?: number;
  as?: "div" | "ul" | "ol";
};

/**
 * Wraps a group of ScrollRevealItem children and staggers their entrance.
 * Use for card grids, step lists, FAQ items, etc.
 */
export function ScrollRevealGroup({
  children,
  className,
  staggerAmount = stagger.base,
  as = "div",
}: ScrollRevealGroupProps) {
  const shouldReduceMotion = useReducedMotion();
  const MotionTag = motion[as];

  if (shouldReduceMotion) {
    const StaticTag = as;
    return <StaticTag className={className}>{children}</StaticTag>;
  }

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={staggerContainer(staggerAmount)}
    >
      {children}
    </MotionTag>
  );
}

export function ScrollRevealItem({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li";
}) {
  const shouldReduceMotion = useReducedMotion();
  const MotionTag = motion[as];

  if (shouldReduceMotion) {
    const StaticTag = as;
    return <StaticTag className={className}>{children}</StaticTag>;
  }

  return (
    <MotionTag className={className} variants={fadeUp}>
      {children}
    </MotionTag>
  );
}
