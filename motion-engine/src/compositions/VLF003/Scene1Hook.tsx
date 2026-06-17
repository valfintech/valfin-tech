import type { FC } from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { GradientBackground } from "../../components/GradientBackground";
import { KineticText } from "../../components/KineticText";
import { IconCard } from "../../components/carousel/visuals";
import { PhoneIcon } from "../../components/carousel/icons";
import { colors } from "../../config/colors";
import { headingFont } from "../../config/fonts";

/**
 * Scene 1 — Hook (0:00–0:03.8)
 * Visual pattern interrupt first: a phone notification card pops in and
 * pulses like a ringing call from frame 0, with a "new inquiry" badge —
 * then the line "The next 30 seconds decide if you get the job" lands
 * underneath. No text-only opening.
 */
export const Scene1Hook: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardProgress = spring({
    frame,
    fps,
    config: { damping: 11, stiffness: 180, mass: 0.6 },
  });
  const cardScale = interpolate(cardProgress, [0, 1], [0.55, 1]);
  const cardOpacity = interpolate(frame, [0, 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pulseScale = 1 + Math.sin(frame / 5) * 0.06;

  const badgeProgress = spring({
    frame: frame - 6,
    fps,
    config: { damping: 10, stiffness: 220, mass: 0.5 },
  });
  const badgeScale = interpolate(badgeProgress, [0, 1], [0, 1]);

  return (
    <AbsoluteFill>
      <GradientBackground />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 56, padding: "0 76px" }}>
        <div style={{ position: "relative", opacity: cardOpacity, transform: `scale(${cardScale})` }}>
          <div
            style={{
              position: "absolute",
              inset: -22,
              borderRadius: "50%",
              border: `2px solid ${colors.accent400}`,
              opacity: 0.35,
              transform: `scale(${pulseScale})`,
            }}
          />
          <IconCard icon={<PhoneIcon size={88} color={colors.accent400} />} size={180} />
          <div
            style={{
              position: "absolute",
              top: -16,
              right: -16,
              width: 52,
              height: 52,
              borderRadius: "50%",
              background: colors.error,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: headingFont,
              fontWeight: 800,
              fontSize: 26,
              color: colors.ink50,
              transform: `scale(${badgeScale})`,
            }}
          >
            1
          </div>
        </div>
        <KineticText
          text="The next 30 seconds decide if you get the job."
          highlight={["30", "seconds"]}
          fontSize={60}
          delay={18}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
