/**
 * Scene durations in frames at 30fps. Total = 640 frames = ~21.3s.
 * Tightened for Revision Round 1 — eliminate dead space, earlier payoff.
 */
export const SCENE_DURATIONS = {
  hook: 105, // 0:00–0:03.5 — cycling guess counter glitches to "?", then headline
  calculator: 85, // 0:03.5–0:06.3 — Revenue Recovery Calculator card
  inputs: 150, // 0:06.3–0:11.3 — Leads/month + average job value
  result: 150, // 0:11.3–0:16.3 — Result: what slow follow-up costs
  endCard: 150, // 0:16.3–0:21.3 — CTA
} as const;

export const TOTAL_DURATION = Object.values(SCENE_DURATIONS).reduce(
  (sum, d) => sum + d,
  0,
);
