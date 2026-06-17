import type { FC } from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Caption } from "../../components/Caption";
import { GradientBackground } from "../../components/GradientBackground";
import { Eyebrow, NumberBadge, Timeline } from "../../components/carousel/visuals";
import { colors } from "../../config/colors";

/**
 * Scene 4 — Step 3: Followed up (0:11.1–0:14.9)
 * "If they don't book right away, it follows up — day one, three, seven."
 */
export const Scene4FollowUp: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const badgeProgress = spring({ frame, fps, config: { damping: 10, stiffness: 220, mass: 0.5 } });
  const badgeScale = interpolate(badgeProgress, [0, 1], [0.4, 1]);
  const badgeOpacity = interpolate(frame, [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const timelineProgress = spring({ frame: frame - 6, fps, config: { damping: 14, stiffness: 200, mass: 0.5 } });
  const timelineOpacity = interpolate(timelineProgress, [0, 1], [0, 1]);
  const timelineY = interpolate(timelineProgress, [0, 1], [22, 0]);

  return (
    <AbsoluteFill>
      <GradientBackground />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 56 }}>
        <div
          style={{
            opacity: badgeOpacity,
            transform: `scale(${badgeScale})`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 24,
          }}
        >
          <NumberBadge n={3} />
          <Eyebrow text="Followed up" color={colors.accent400} />
        </div>
        <div style={{ opacity: timelineOpacity, transform: `translateY(${timelineY}px)` }}>
          <Timeline
            steps={[
              { label: "Day 1", active: true },
              { label: "Day 3", active: true },
              { label: "Day 7", active: true },
            ]}
          />
        </div>
      </AbsoluteFill>
      <Caption text="If they don't book right away, it follows up: day one, three, seven." delay={18} />
    </AbsoluteFill>
  );
};
