/**
 * Scene durations in frames at 30fps. Total = 1020 frames = 34s,
 * matching the ~30-40s Reel target.
 */
export const SCENE_DURATIONS = {
  hook: 150, // 0:00–0:05 — "They just call back faster."
  leadDrop: 120, // 0:05–0:09 — "It wasn't your work."
  phoneUI: 240, // 0:09–0:17 — "You meant to call back."
  turningPoint: 60, // 0:17–0:19 — "They booked the guy who answered." (Higgsfield insert)
  comparison: 150, // 0:19–0:24 — "They booked the guy who answered."
  recovery: 180, // 0:24–0:30 — "Speed is fixable."
  endCard: 120, // 0:30–0:34 — CTA
} as const;

export const TOTAL_DURATION = Object.values(SCENE_DURATIONS).reduce(
  (sum, d) => sum + d,
  0,
);
