import type { FC } from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Caption } from "../../components/Caption";
import { GradientBackground } from "../../components/GradientBackground";
import { ChatBubbleIcon } from "../../components/carousel/icons";
import { Eyebrow, IconCard, NumberBadge } from "../../components/carousel/visuals";
import { colors } from "../../config/colors";

/**
 * Scene 3 — Step 2: Replied (0:07.6–0:11.1)
 * "An automatic reply goes out fast — in your words."
 */
export const Scene3Replied: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const badgeProgress = spring({ frame, fps, config: { damping: 10, stiffness: 220, mass: 0.5 } });
  const badgeScale = interpolate(badgeProgress, [0, 1], [0.4, 1]);
  const badgeOpacity = interpolate(frame, [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const cardProgress = spring({
    frame: frame - 6,
    fps,
    config: { damping: 12, stiffness: 240, mass: 0.5 },
  });
  const cardScale = interpolate(cardProgress, [0, 1], [0.78, 1]);
  const cardOpacity = interpolate(cardProgress, [0, 1], [0, 1]);

  return (
    <AbsoluteFill>
      <GradientBackground />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 44 }}>
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
          <NumberBadge n={2} />
          <Eyebrow text="Replied" color={colors.accent400} />
        </div>
        <div style={{ opacity: cardOpacity, transform: `scale(${cardScale})` }}>
          <IconCard icon={<ChatBubbleIcon size={88} color={colors.success} />} size={200} />
        </div>
      </AbsoluteFill>
      <Caption text="An automatic reply goes out fast, in your words." delay={16} />
    </AbsoluteFill>
  );
};
