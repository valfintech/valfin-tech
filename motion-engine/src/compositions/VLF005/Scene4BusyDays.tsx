import type { FC } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Caption } from "../../components/Caption";
import { GradientBackground } from "../../components/GradientBackground";
import { colors } from "../../config/colors";
import { headingFont, sansFont } from "../../config/fonts";

/**
 * Scene 4 — Busy days too (0:18–0:23.5)
 * "And here's the thing — that's happening on your busy days too. You just
 * can't see it when you're heads-down on a job." A dashboard card with a
 * missed-calls counter ticking up alongside small notification rows.
 */
export const Scene4BusyDays: FC = () => {
  const frame = useCurrentFrame();

  const cardOpacity = interpolate(frame, [0, 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const count = Math.round(
    interpolate(frame, [16, 70], [0, 7], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );

  const rows = [0, 1, 2].map((i) => {
    const start = 30 + i * 14;
    return interpolate(frame, [start, start + 12], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  });

  return (
    <AbsoluteFill>
      <GradientBackground />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            opacity: cardOpacity,
            background: colors.ink800,
            border: `1px solid ${colors.ink700}`,
            borderRadius: 24,
            padding: "40px 48px",
            display: "flex",
            flexDirection: "column",
            gap: 24,
            minWidth: 420,
          }}
        >
          <div style={{ fontFamily: sansFont, fontSize: 26, fontWeight: 600, color: colors.ink200, textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Missed while you were on the job
          </div>
          <div style={{ fontFamily: headingFont, fontWeight: 800, fontSize: 110, color: colors.error, lineHeight: 1 }}>
            {count}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
            {rows.map((opacity, i) => (
              <div
                key={i}
                style={{
                  opacity,
                  height: 18,
                  borderRadius: 9,
                  background: colors.ink700,
                  width: `${85 - i * 12}%`,
                }}
              />
            ))}
          </div>
        </div>
      </AbsoluteFill>
      <Caption
        text="And here's the thing: that's happening on your busy days too. You just can't see it."
        delay={75}
      />
    </AbsoluteFill>
  );
};
