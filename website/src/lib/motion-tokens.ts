/**
 * Centralized motion tokens — the single source of truth for every
 * animation duration and easing curve on the site. Components must
 * import from here rather than hard-coding durations/easings inline.
 *
 * Philosophy: motion should explain something real about the product
 * (a lead being answered, a step completing) — never decorate for its
 * own sake. See /brand/motion/signature-motion-spec.md.
 */

export const easing = {
  /** Standard entrance easing — confident, settled arrival */
  out: [0.16, 1, 0.3, 1] as const,
  /** Ambient / looping motion */
  inOut: [0.45, 0, 0.55, 1] as const,
};

export const duration = {
  /** Micro-interactions: hovers, presses, toggles */
  fast: 0.15,
  /** Standard UI transitions */
  base: 0.3,
  /** Section reveals, larger compositional moves */
  slow: 0.6,
  /** Narrative / scroll-driven sequences */
  narrative: 1.0,
};

export const stagger = {
  tight: 0.06,
  base: 0.08,
  loose: 0.12,
};

/** Standard fade-up reveal used for section headers, cards, and lists */
export const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.slow, ease: easing.out },
  },
};

/** Simple opacity fade — for ambient backgrounds, overlays */
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: duration.slow, ease: easing.out },
  },
};

/** Container variant for staggered children reveals */
export function staggerContainer(staggerAmount: number = stagger.base) {
  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerAmount,
      },
    },
  };
}
