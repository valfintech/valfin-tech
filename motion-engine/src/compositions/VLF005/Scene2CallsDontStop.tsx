import type { FC } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Caption } from "../../components/Caption";
import { GradientBackground } from "../../components/GradientBackground";
import { PhoneIcon } from "../../components/carousel/icons";
import { IconCard } from "../../components/carousel/visuals";
import { colors } from "../../config/colors";
import { headingFont, sansFont } from "../../config/fonts";

/**
 * Scene 2 — The calls don't stop (0:06–0:11.5)
 * "Be honest. When you go away, the calls don't stop. They just go
 * unanswered." A pulsing phone icon with a missed-call counter ticking up.
 */
export const Scene2CallsDontStop: FC = () => {
  const frame = useCurrentFrame();

  const fadeIn = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pulse = interpolate(Math.sin(frame / 22), [-1, 1], [0.95, 1.04]);

  const missedCalls = Math.min(3, Math.floor(interpolate(frame, [25, 100], [0, 3.99], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  })));

  return (
    <AbsoluteFill>
      <GradientBackground />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 36 }}>
        <div style={{ opacity: fadeIn, transform: `scale(${pulse})`, position: "relative" }}>
          <IconCard icon={<PhoneIcon size={88} color={colors.error} />} size={200} />
          {missedCalls > 0 && (
            <div
              style={{
                position: "absolute",
                top: -16,
                right: -16,
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: colors.error,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: headingFont,
                fontWeight: 800,
                fontSize: 28,
                color: colors.ink50,
              }}
            >
              {missedCalls}
            </div>
          )}
        </div>
        <div
          style={{
            opacity: fadeIn,
            fontFamily: sansFont,
            fontSize: 30,
            fontWeight: 600,
            color: colors.ink400,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          Missed calls
        </div>
      </AbsoluteFill>
      <Caption text="Be honest. When you go away, the calls don't stop. They just go unanswered." delay={20} />
    </AbsoluteFill>
  );
};
