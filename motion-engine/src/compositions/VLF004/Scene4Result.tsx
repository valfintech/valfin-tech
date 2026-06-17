import type { FC } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Caption } from "../../components/Caption";
import { GradientBackground } from "../../components/GradientBackground";
import { colors } from "../../config/colors";
import { headingFont, sansFont } from "../../config/fonts";

/**
 * Scene 4 — The result (0:18–0:24)
 * "It shows you, plainly, what slow follow-up is probably costing you
 * every month." The result counts up, clearly labeled as an example.
 */
export const Scene4Result: FC = () => {
  const frame = useCurrentFrame();

  const labelOpacity = interpolate(frame, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const valueOpacity = interpolate(frame, [8, 22], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const exampleOpacity = interpolate(frame, [46, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const value = Math.round(
    interpolate(frame, [8, 42], [0, 8400], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );
  const formatted = value.toLocaleString("en-US");

  return (
    <AbsoluteFill>
      <GradientBackground />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 16 }}>
        <div
          style={{
            opacity: labelOpacity,
            fontFamily: sansFont,
            fontSize: 28,
            fontWeight: 600,
            color: colors.ink200,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            textAlign: "center",
            maxWidth: 600,
          }}
        >
          Slow follow-up could be costing you
        </div>
        <div
          style={{
            opacity: valueOpacity,
            fontFamily: headingFont,
            fontWeight: 800,
            fontSize: 130,
            color: colors.accent400,
            lineHeight: 1,
          }}
        >
          ${formatted}/mo
        </div>
        <div style={{ opacity: exampleOpacity, fontFamily: sansFont, fontSize: 28, color: colors.ink400 }}>
          (example, based on your inputs)
        </div>
      </AbsoluteFill>
      <Caption text="It shows you, plainly, what slow follow-up is probably costing you every month." delay={65} />
    </AbsoluteFill>
  );
};
