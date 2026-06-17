import type { FC } from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Caption } from "../../components/Caption";
import { GradientBackground } from "../../components/GradientBackground";
import { Eyebrow, IconRow, NumberBadge } from "../../components/carousel/visuals";
import { FormIcon, MessageIcon, PhoneIcon } from "../../components/carousel/icons";
import { colors } from "../../config/colors";

/**
 * Scene 2 — Step 1: Caught (0:03.8–0:07.6)
 * "It gets caught. Call, text, or form — nothing slips through."
 */
export const Scene2Caught: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const badgeProgress = spring({ frame, fps, config: { damping: 10, stiffness: 220, mass: 0.5 } });
  const badgeScale = interpolate(badgeProgress, [0, 1], [0.4, 1]);
  const badgeOpacity = interpolate(frame, [0, 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const rowProgress = spring({ frame: frame - 6, fps, config: { damping: 14, stiffness: 200, mass: 0.5 } });
  const rowOpacity = interpolate(rowProgress, [0, 1], [0, 1]);
  const rowY = interpolate(rowProgress, [0, 1], [22, 0]);

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
          <NumberBadge n={1} />
          <Eyebrow text="Caught" color={colors.accent400} />
        </div>
        <div style={{ opacity: rowOpacity, transform: `translateY(${rowY}px)` }}>
          <IconRow
            items={[
              { icon: <PhoneIcon size={40} />, label: "Call" },
              { icon: <MessageIcon size={40} />, label: "Text" },
              { icon: <FormIcon size={40} />, label: "Form" },
            ]}
            toInbox
          />
        </div>
      </AbsoluteFill>
      <Caption text="It gets caught. Call, text, or form. Nothing slips through." delay={18} />
    </AbsoluteFill>
  );
};
