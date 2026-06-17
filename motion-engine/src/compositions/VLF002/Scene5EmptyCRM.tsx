import type { FC } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Caption } from "../../components/Caption";
import { GradientBackground } from "../../components/GradientBackground";
import { colors } from "../../config/colors";
import { headingFont, sansFont } from "../../config/fonts";

/**
 * Scene 5 — Empty CRM (0:20–0:26)
 * "You'll never see that lead in any report." A dashboard card showing
 * "0" new leads this week, with empty placeholder rows fading in below it.
 */
export const Scene5EmptyCRM: FC = () => {
  const frame = useCurrentFrame();

  const cardOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const rowOpacity = (i: number) =>
    interpolate(frame, [25 + i * 12, 40 + i * 12], [0, 0.5], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
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
            minWidth: 560,
            display: "flex",
            flexDirection: "column",
            gap: 28,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <div style={{ fontFamily: sansFont, fontSize: 28, fontWeight: 700, color: colors.ink50 }}>
              New leads this week
            </div>
            <div style={{ fontFamily: headingFont, fontSize: 64, fontWeight: 800, color: colors.ink400 }}>
              0
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                style={{ height: 56, borderRadius: 12, border: `1px dashed ${colors.ink600}`, opacity: rowOpacity(i) }}
              />
            ))}
          </div>
        </div>
      </AbsoluteFill>
      <Caption text="You'll never see that lead in any report." delay={28} />
    </AbsoluteFill>
  );
};
