import type { FC } from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { colors } from "../config/colors";
import { headingFont, sansFont } from "../config/fonts";

type Props = {
  from: number;
  to: number;
  /** Frame (relative to the scene) the count-up starts. */
  startFrame?: number;
  durationInFrames?: number;
  label?: string;
  fontSize?: number;
};

/**
 * Animated currency counter, e.g. for the "speed is fixable" recovery
 * scene. Counts up on an ease-out curve.
 */
export const RevenueCounter: FC<Props> = ({
  from,
  to,
  startFrame = 0,
  durationInFrames = 60,
  label,
  fontSize = 104,
}) => {
  const frame = useCurrentFrame();

  const value = interpolate(
    frame,
    [startFrame, startFrame + durationInFrames],
    [from, to],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    },
  );

  const formatted = Math.round(value).toLocaleString("en-US");

  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          fontFamily: headingFont,
          fontWeight: 800,
          fontSize,
          color: colors.accent400,
        }}
      >
        ${formatted}
      </div>
      {label && (
        <div
          style={{
            fontFamily: sansFont,
            fontSize: 28,
            color: colors.ink400,
            marginTop: 12,
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
};
