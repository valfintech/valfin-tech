import type { FC } from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Caption } from "../../components/Caption";
import { GradientBackground } from "../../components/GradientBackground";
import { CalendarIcon } from "../../components/carousel/icons";
import { Checklist, Eyebrow, IconCard, NumberBadge } from "../../components/carousel/visuals";
import { colors } from "../../config/colors";

/**
 * Scene 5 — Step 4: Booked (0:14.9–0:18.9)
 * "It stops the moment they book. The ready ones land on your calendar."
 */
export const Scene5Booked: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const badgeProgress = spring({ frame, fps, config: { damping: 10, stiffness: 220, mass: 0.5 } });
  const badgeScale = interpolate(badgeProgress, [0, 1], [0.4, 1]);
  const badgeOpacity = interpolate(frame, [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const calendarProgress = spring({ frame: frame - 6, fps, config: { damping: 12, stiffness: 240, mass: 0.5 } });
  const calendarOpacity = interpolate(calendarProgress, [0, 1], [0, 1]);
  const calendarScale = interpolate(calendarProgress, [0, 1], [0.78, 1]);

  const checklistOpacity = interpolate(frame, [30, 46], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <GradientBackground />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 48 }}>
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
          <NumberBadge n={4} />
          <Eyebrow text="Booked" color={colors.accent400} />
        </div>
        <div style={{ opacity: calendarOpacity, transform: `scale(${calendarScale})` }}>
          <IconCard icon={<CalendarIcon size={88} color={colors.success} />} size={200} />
        </div>
        <div style={{ opacity: checklistOpacity }}>
          <Checklist items={["Caught", "Replied", "Followed up"]} />
        </div>
      </AbsoluteFill>
      <Caption text="It stops the moment they book. The ready ones land on your calendar." delay={50} />
    </AbsoluteFill>
  );
};
