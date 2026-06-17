import type { FC } from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { AmbientVideoBackdrop } from "../../components/AmbientVideoBackdrop";
import { colors } from "../../config/colors";
import { headingFont, sansFont } from "../../config/fonts";

export const TOTAL_DURATION = 300; // 10s @ 30fps

const START_BALANCE = 48_200;
const LOW_BALANCE = 11_400;
const RECOVERED_BALANCE = 52_400;

// Phase boundaries (frames)
const DRAIN_START = 12;
const DRAIN_END = 138;
const FLASH_AT = 150;
const RECOVER_START = 168;
const RECOVER_END = 286;

const fmt = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;

const crossfade = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

/**
 * HOOK-01 — "The Draining Balance Timer" (revised execution)
 *
 * All business-critical information (the balance figure, the deltas, the
 * status label) is rendered as a deterministic Remotion overlay so it is
 * always clean, correct, and readable. The Higgsfield clip is reduced to a
 * heavily blurred ambient backdrop — cinematic movement and lighting only,
 * never a carrier of numbers or text.
 *
 * Beat structure: a clearly draining balance (red, falling fast) hits a
 * low point, a sharp "impact" flash marks the turning point, then the
 * balance climbs back past its starting value into a confident green
 * "recovered" state.
 */
export const HOOK01: FC = () => {
  const frame = useCurrentFrame();

  const drainProgress = interpolate(frame, [DRAIN_START, DRAIN_END], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });
  const recoverProgress = interpolate(
    frame,
    [RECOVER_START, RECOVER_END],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    },
  );

  const balance =
    frame < RECOVER_START
      ? interpolate(drainProgress, [0, 1], [START_BALANCE, LOW_BALANCE])
      : interpolate(recoverProgress, [0, 1], [LOW_BALANCE, RECOVERED_BALANCE]);

  const isRecoveryPhase = frame >= RECOVER_START;
  const numberColor = isRecoveryPhase ? colors.success : colors.error;

  // Tint wash over the ambient backdrop: red while draining, green while recovering.
  const tintOpacity = interpolate(
    frame,
    [0, 25, DRAIN_END, FLASH_AT, RECOVER_START, RECOVER_END],
    [0, 0.22, 0.22, 0.05, 0.18, 0.18],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // White "impact" flash punctuating the turning point.
  const flashOpacity = interpolate(
    frame,
    [FLASH_AT - 6, FLASH_AT, FLASH_AT + 14],
    [0, 0.55, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Small shake on the impact beat.
  const shakeT = frame - FLASH_AT;
  const shake =
    shakeT >= 0 && shakeT < 12
      ? Math.sin(shakeT * 2.4) * (1 - shakeT / 12) * 6
      : 0;

  // Status label crossfades: DRAINING -> RECOVERING -> RECOVERED
  const labelDrainOpacity = 1 - crossfade(frame, DRAIN_END - 10, FLASH_AT);
  const labelRecoveringOpacity =
    crossfade(frame, FLASH_AT, FLASH_AT + 8) *
    (1 - crossfade(frame, RECOVER_END - 16, RECOVER_END));
  const labelRecoveredOpacity = crossfade(frame, RECOVER_END - 16, RECOVER_END);

  // Delta tags
  const drainDeltaOpacity = crossfade(frame, 55, 75) * (1 - crossfade(frame, DRAIN_END - 8, FLASH_AT));
  const recoverDeltaOpacity = crossfade(frame, RECOVER_START + 45, RECOVER_START + 65);

  // Entrance
  const introOpacity = crossfade(frame, 0, 14);

  return (
    <AbsoluteFill style={{ backgroundColor: colors.ink950 }}>
      <Audio src={staticFile("audio/hooks/hook01-music.m4a")} volume={0.85} />
      <Audio src={staticFile("audio/hooks/hook01-sfx.mp3")} volume={1} />

      <AmbientVideoBackdrop src="higgsfield/hook01-bg.mp4" />

      {/* Phase tint wash */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 35%, ${numberColor} 0%, transparent 60%)`,
          opacity: tintOpacity,
        }}
      />

      {/* Impact flash */}
      <AbsoluteFill style={{ background: colors.ink50, opacity: flashOpacity }} />

      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          opacity: introOpacity,
          transform: `translate(${shake}px, 0px)`,
        }}
      >
        <div style={{ textAlign: "center" }}>
          {/* Label */}
          <div
            style={{
              fontFamily: sansFont,
              fontSize: 30,
              fontWeight: 700,
              letterSpacing: 6,
              color: colors.ink200,
              textTransform: "uppercase",
              marginBottom: 28,
            }}
          >
            Account Balance
          </div>

          {/* The number — the single source of truth, never AI-generated */}
          <div
            style={{
              fontFamily: headingFont,
              fontWeight: 800,
              fontSize: 148,
              lineHeight: 1,
              color: numberColor,
              letterSpacing: -2,
            }}
          >
            {fmt(balance)}
          </div>

          {/* Delta tags */}
          <div style={{ height: 64, marginTop: 32, position: "relative" }}>
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 14,
                opacity: drainDeltaOpacity,
                fontFamily: headingFont,
                fontWeight: 700,
                fontSize: 44,
                color: colors.error,
              }}
            >
              <span>&#9660;</span>
              <span>-$36,800 this month</span>
            </div>
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 14,
                opacity: recoverDeltaOpacity,
                fontFamily: headingFont,
                fontWeight: 700,
                fontSize: 44,
                color: colors.success,
              }}
            >
              <span>&#9650;</span>
              <span>+$41,000 recovered</span>
            </div>
          </div>

          {/* Status label */}
          <div style={{ height: 50, marginTop: 36, position: "relative" }}>
            <StatusLabel text="BALANCE DRAINING" color={colors.error} opacity={labelDrainOpacity} />
            <StatusLabel text="RECOVERY IN PROGRESS" color={colors.accent400} opacity={labelRecoveringOpacity} />
            <StatusLabel text="FULLY RECOVERED" color={colors.success} opacity={labelRecoveredOpacity} />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const StatusLabel: FC<{ text: string; color: string; opacity: number }> = ({
  text,
  color,
  opacity,
}) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      opacity,
      fontFamily: sansFont,
      fontSize: 32,
      fontWeight: 700,
      letterSpacing: 4,
      textTransform: "uppercase",
      color,
    }}
  >
    {text}
  </div>
);
