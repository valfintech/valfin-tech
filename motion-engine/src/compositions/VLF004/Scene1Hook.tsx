import type { FC } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { GradientBackground } from "../../components/GradientBackground";
import { KineticText } from "../../components/KineticText";
import { colors } from "../../config/colors";
import { headingFont, sansFont } from "../../config/fonts";

// A rapid-fire cycle of plausible "guess" numbers — the visual metaphor for
// not knowing your real number. Cycles fast, then glitches to "?" before
// the real headline lands.
const GUESS_VALUES = [1240, 6800, 3150, 9400, 2070, 5500, 7300, 4100, 8600, 1900];

/**
 * Scene 1 — Hook (0:00–0:05)
 * Visual pattern interrupt first: a big number rapidly cycles through
 * random-looking guesses (like an odometer spinning), then glitches to "?" —
 * then "Stop guessing. Get the real number." lands underneath. No
 * text-only opening.
 */
export const Scene1Hook: FC = () => {
  const frame = useCurrentFrame();

  const settleFrame = 26;
  const isSettled = frame >= settleFrame;
  const cycleIndex = Math.floor(frame / 2) % GUESS_VALUES.length;
  const displayValue = isSettled ? "?" : `$${GUESS_VALUES[cycleIndex].toLocaleString("en-US")}`;

  const counterOpacity = interpolate(frame, [0, 6], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const glitchShift = isSettled ? Math.sin(frame * 3) * (frame < settleFrame + 6 ? 6 : 0) : 0;
  const counterColor = isSettled ? colors.error : colors.ink400;

  return (
    <AbsoluteFill>
      <GradientBackground />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", gap: 28, padding: "0 76px" }}>
        <div style={{ opacity: counterOpacity, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <div
            style={{
              fontFamily: sansFont,
              fontWeight: 700,
              fontSize: 28,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: colors.ink400,
            }}
          >
            Your guess
          </div>
          <div
            style={{
              fontFamily: headingFont,
              fontWeight: 800,
              fontSize: 110,
              color: counterColor,
              lineHeight: 1,
              transform: `translateX(${glitchShift}px)`,
            }}
          >
            {displayValue}
            <span style={{ fontSize: 48 }}>/mo</span>
          </div>
        </div>
        <KineticText
          text="Stop guessing. Get the real number."
          highlight={["real", "number"]}
          fontSize={60}
          delay={34}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
