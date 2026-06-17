import type { FC } from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { colors } from "../config/colors";
import { headingFont, sansFont } from "../config/fonts";

type Props = {
  title: string;
  /** Seconds the response-time counter animates up to. */
  toSeconds: number;
  /** Frame (relative to the scene) the counter starts. */
  startFrame?: number;
  durationInFrames?: number;
  badgeText: string;
  badgeColor: string;
  accentColor: string;
};

const formatTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

/**
 * One column of the "you vs. them" response-time comparison: a counting
 * clock plus a badge that appears once the counter finishes.
 */
export const ComparisonColumn: FC<Props> = ({
  title,
  toSeconds,
  startFrame = 0,
  durationInFrames = 60,
  badgeText,
  badgeColor,
  accentColor,
}) => {
  const frame = useCurrentFrame();

  const seconds = interpolate(
    frame,
    [startFrame, startFrame + durationInFrames],
    [0, toSeconds],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    },
  );

  const badgeProgress = interpolate(
    frame,
    [startFrame + durationInFrames, startFrame + durationInFrames + 12],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
        flex: 1,
      }}
    >
      <div
        style={{
          fontFamily: sansFont,
          fontSize: 32,
          fontWeight: 600,
          color: colors.ink200,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontFamily: headingFont,
          fontWeight: 800,
          fontSize: 88,
          color: accentColor,
        }}
      >
        {formatTime(seconds)}
      </div>
      <div
        style={{
          fontFamily: sansFont,
          fontSize: 28,
          fontWeight: 700,
          color: badgeColor,
          padding: "10px 28px",
          borderRadius: 999,
          border: `2px solid ${badgeColor}`,
          opacity: badgeProgress,
          transform: `scale(${0.85 + badgeProgress * 0.15})`,
        }}
      >
        {badgeText}
      </div>
    </div>
  );
};
