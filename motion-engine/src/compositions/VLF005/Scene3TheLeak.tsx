import type { FC, ReactNode } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Caption } from "../../components/Caption";
import { GradientBackground } from "../../components/GradientBackground";
import { CheckIcon, PhoneIcon, XIcon } from "../../components/carousel/icons";
import { colors } from "../../config/colors";
import { sansFont } from "../../config/fonts";

const ROWS: { icon: ReactNode; label: string; color: string }[] = [
  { icon: <PhoneIcon size={36} color={colors.error} />, label: "Missed call → Voicemail", color: colors.error },
  { icon: <XIcon size={36} color={colors.ink400} />, label: "No reply → Gave up", color: colors.ink400 },
  { icon: <CheckIcon size={36} color={colors.warning} />, label: "Booked with someone else", color: colors.warning },
];

/**
 * Scene 3 — The leak (0:11.5–0:18)
 * "A few go to voicemail. A few try once and give up. A few book your
 * competitor before you're even back." Three notification rows stack in,
 * one per beat.
 */
export const Scene3TheLeak: FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill>
      <GradientBackground />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {ROWS.map((row, i) => {
            const start = 10 + i * 45;
            const opacity = interpolate(frame, [start, start + 16], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const translateX = interpolate(frame, [start, start + 16], [-24, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });

            return (
              <div
                key={i}
                style={{
                  opacity,
                  transform: `translateX(${translateX}px)`,
                  display: "flex",
                  alignItems: "center",
                  gap: 24,
                  background: colors.ink800,
                  border: `1px solid ${colors.ink700}`,
                  borderRadius: 18,
                  padding: "22px 36px",
                  minWidth: 480,
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    background: colors.ink900,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {row.icon}
                </div>
                <div style={{ fontFamily: sansFont, fontSize: 32, fontWeight: 600, color: colors.ink50 }}>
                  {row.label}
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
      <Caption
        text="A few go to voicemail. A few try once and give up. A few book your competitor before you're even back."
        delay={110}
      />
    </AbsoluteFill>
  );
};
