import type { FC } from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Caption } from "../../components/Caption";
import { GradientBackground } from "../../components/GradientBackground";
import { colors } from "../../config/colors";
import { sansFont } from "../../config/fonts";
import { CalculatorCard, CardHeader } from "./components";

/**
 * Scene 2 — The calculator (0:06–0:11)
 * "There's a calculator that does it with your numbers, not made-up ones."
 */
export const Scene2Calculator: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardScale = spring({ frame, fps, config: { damping: 200, stiffness: 220, mass: 0.6 } });
  const cardOpacity = interpolate(cardScale, [0, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const subtitleOpacity = interpolate(frame, [14, 28], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <GradientBackground />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ opacity: cardOpacity, transform: `scale(${interpolate(cardScale, [0, 1], [0.9, 1])})` }}>
          <CalculatorCard>
            <CardHeader title="Revenue Recovery Calculator" />
            <div style={{ opacity: subtitleOpacity, fontFamily: sansFont, fontSize: 28, color: colors.ink200 }}>
              Your numbers. Not made-up ones.
            </div>
          </CalculatorCard>
        </div>
      </AbsoluteFill>
      <Caption text="There's a calculator that does it with your numbers, not made-up ones." delay={30} />
    </AbsoluteFill>
  );
};
