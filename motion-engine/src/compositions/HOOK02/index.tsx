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
import { GradientBackground } from "../../components/GradientBackground";
import { KineticText } from "../../components/KineticText";
import { colors } from "../../config/colors";
import { headingFont, sansFont } from "../../config/fonts";

export const TOTAL_DURATION = 240; // 8s @ 30fps

const TARGET_COUNT = 47;
const SPIN_END = 50;
const IMPACT_AT = 52;
const END_CARD_START = 110;

const crossfade = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

/**
 * HOOK-02 — "Missed Call Counter Spiral" (revised execution)
 *
 * The counter value and every word of the closing message are rendered as
 * deterministic Remotion overlays — Higgsfield only supplies a heavily
 * blurred ambient backdrop (pulsing light / motion), never the number or
 * the text. The counter spins up and lands hard on a single, unambiguous
 * number, then the scene resolves into a clean, fully readable end card.
 */
export const HOOK02: FC = () => {
  const frame = useCurrentFrame();

  // Deterministic "spin": accelerates up and lands exactly on TARGET_COUNT.
  const rawCount = interpolate(frame, [0, SPIN_END], [0, TARGET_COUNT], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const count = Math.min(TARGET_COUNT, Math.round(rawCount));

  // Impact shake when the counter lands.
  const shakeT = frame - IMPACT_AT;
  const shake =
    shakeT >= 0 && shakeT < 10
      ? Math.sin(shakeT * 2.6) * (1 - shakeT / 10) * 8
      : 0;
  const flashOpacity = interpolate(
    frame,
    [IMPACT_AT - 2, IMPACT_AT, IMPACT_AT + 12],
    [0, 0.5, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Red pulse tint while the counter spins/lands, fading out before the end card.
  const tintOpacity = interpolate(
    frame,
    [0, 20, IMPACT_AT + 20, END_CARD_START],
    [0.1, 0.26, 0.2, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Crossfade from the ambient video backdrop to the calm gradient for the end card.
  const videoOpacity = 1 - crossfade(frame, END_CARD_START - 10, END_CARD_START + 20);

  // Counter block fades out as the end card resolves.
  const counterOpacity = 1 - crossfade(frame, END_CARD_START - 15, END_CARD_START + 10);

  // Subtext under the counter.
  const subtextOpacity = crossfade(frame, IMPACT_AT + 18, IMPACT_AT + 34) * (1 - crossfade(frame, END_CARD_START - 15, END_CARD_START + 10));

  // End-card message.
  const messageOpacity = crossfade(frame, END_CARD_START + 15, END_CARD_START + 35);

  const introOpacity = crossfade(frame, 0, 8);

  return (
    <AbsoluteFill style={{ backgroundColor: colors.ink950 }}>
      <Audio src={staticFile("audio/hooks/hook02-music.m4a")} volume={0.85} />
      <Audio src={staticFile("audio/hooks/hook02-sfx.mp3")} volume={1} />

      <AbsoluteFill style={{ opacity: videoOpacity }}>
        <AmbientVideoBackdrop src="higgsfield/hook02-bg.mp4" scale={1.25} />
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: 1 - videoOpacity }}>
        <GradientBackground />
      </AbsoluteFill>

      {/* Red pulse tint */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 35%, ${colors.error} 0%, transparent 60%)`,
          opacity: tintOpacity,
        }}
      />

      {/* Impact flash */}
      <AbsoluteFill style={{ background: colors.ink50, opacity: flashOpacity }} />

      {/* Counter block */}
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          opacity: introOpacity * counterOpacity,
          transform: `translate(${shake}px, 0px)`,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontFamily: sansFont,
              fontSize: 30,
              fontWeight: 700,
              letterSpacing: 6,
              color: colors.ink200,
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            Missed Calls This Week
          </div>
          <div
            style={{
              fontFamily: headingFont,
              fontWeight: 800,
              fontSize: 320,
              lineHeight: 1,
              color: colors.error,
            }}
          >
            {count}
          </div>
          <div
            style={{
              marginTop: 28,
              fontFamily: headingFont,
              fontWeight: 700,
              fontSize: 40,
              color: colors.ink50,
              opacity: subtextOpacity,
            }}
          >
            47 calls. 47 chances to book a job.
          </div>
        </div>
      </AbsoluteFill>

      {/* End card message */}
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          padding: "0 90px",
          opacity: messageOpacity,
        }}
      >
        <KineticText
          text="Every missed call is a missed job."
          highlight={["missed", "job"]}
          fontSize={78}
          delay={0}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
