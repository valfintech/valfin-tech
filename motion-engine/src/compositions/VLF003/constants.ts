/**
 * Scene durations in frames at 30fps. Total = 690 frames = 23s — tightened
 * from the original 36s cut per Revision Round 1 (faster pacing, earlier
 * pattern interrupts, 20-30s target).
 */
export const SCENE_DURATIONS = {
  hook: 115, // 0:00–0:03.8 — visual pattern interrupt: incoming-inquiry card + "next 30 seconds" line
  caught: 115, // 0:03.8–0:07.6 — Step 1: Caught
  replied: 105, // 0:07.6–0:11.1 — Step 2: Replied
  followUp: 115, // 0:11.1–0:14.9 — Step 3: Followed up (Day 1 / 3 / 7)
  booked: 120, // 0:14.9–0:18.9 — Step 4: Booked
  endCard: 120, // 0:18.9–0:23 — CTA
} as const;

export const TOTAL_DURATION = Object.values(SCENE_DURATIONS).reduce(
  (sum, d) => sum + d,
  0,
);
