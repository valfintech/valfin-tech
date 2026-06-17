/**
 * Scene durations in frames at 30fps. Total = 1050 frames = 35s,
 * matching the LAUNCH-05 "Vacation Test" script (~35s).
 */
export const SCENE_DURATIONS = {
  hook: 180, // 0:00–0:06 — "Take a week off and watch what happens."
  callsDontStop: 165, // 0:06–0:11.5 — "The calls don't stop. They just go unanswered."
  theLeak: 195, // 0:11.5–0:18 — Voicemail / gave up / booked elsewhere
  busyDays: 165, // 0:18–0:23.5 — "It happens on your busy days too."
  employee: 165, // 0:23.5–0:29 — Quiet beat: "You're its employee."
  endCard: 180, // 0:29–0:35 — CTA
} as const;

export const TOTAL_DURATION = Object.values(SCENE_DURATIONS).reduce(
  (sum, d) => sum + d,
  0,
);
