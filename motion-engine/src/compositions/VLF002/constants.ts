/**
 * Scene durations in frames at 30fps. Total = 900 frames = 30s,
 * matching the ~30s Reel target from LAUNCH-02.
 */
export const SCENE_DURATIONS = {
  hook: 150, // 0:00–0:05 — "Your best lead this week called at 7:42 PM. Nobody answered."
  quiet: 150, // 0:05–0:10 — "You were at dinner. Or driving. Or just done for the day."
  voicemail: 150, // 0:10–0:15 — "It went to voicemail. They didn't leave one."
  nextBusiness: 150, // 0:15–0:20 — "So they called the next business. That one picked up."
  emptyCRM: 180, // 0:20–0:26 — "You'll never see that lead in any report."
  endCard: 120, // 0:26–0:30 — CTA / follow
} as const;

export const TOTAL_DURATION = Object.values(SCENE_DURATIONS).reduce(
  (sum, d) => sum + d,
  0,
);
