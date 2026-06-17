import type { FC } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Caption } from "../../components/Caption";
import { GradientBackground } from "../../components/GradientBackground";
import { ClockIcon } from "../../components/carousel/icons";
import { IconCard } from "../../components/carousel/visuals";
import { colors } from "../../config/colors";
import { sansFont } from "../../config/fonts";

/**
 * Scene 2 — Quiet (0:05–0:10)
 * "You were at dinner. Or driving. Or just done for the day." A calm,
 * Remotion-only beat — a clock icon with a slow breathing pulse, the
 * "after hours" moment when the call comes in.
 */
export const Scene2Quiet: FC = () => {
  const frame = useCurrentFrame();

  const fadeIn = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pulse = interpolate(Math.sin(frame / 30), [-1, 1], [0.94, 1]);

  return (
    <AbsoluteFill>
      <GradientBackground />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 36 }}>
        <div style={{ opacity: fadeIn, transform: `scale(${pulse})` }}>
          <IconCard icon={<ClockIcon size={88} color={colors.ink400} />} size={200} />
        </div>
        <div
          style={{
            fontFamily: sansFont,
            fontSize: 30,
            fontWeight: 600,
            color: colors.ink400,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            opacity: fadeIn,
          }}
        >
          After hours
        </div>
      </AbsoluteFill>
      <Caption text="You were at dinner. Or driving. Or just done for the day." delay={20} />
    </AbsoluteFill>
  );
};
