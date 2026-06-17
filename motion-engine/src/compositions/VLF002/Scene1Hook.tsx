import type { FC } from "react";
import { AbsoluteFill, Video, interpolate, staticFile, useCurrentFrame } from "remotion";
import { GradientBackground } from "../../components/GradientBackground";
import { KineticText } from "../../components/KineticText";
import { colors } from "../../config/colors";

// Frames the Higgsfield object clip holds at full opacity before dissolving
// into the gradient background — a quiet phone-at-night cold open with no
// AI-generated people, per the VLF-001 benchmark pattern.
const VIDEO_HOLD = 60;
const CROSSFADE = 25;

/**
 * Scene 1 — Hook (0:00–0:05)
 * "Your best lead this week called at 7:42 PM. Nobody answered." — opens on
 * a premium object-based Higgsfield clip (a phone glowing with an incoming
 * call on a dark counter at night), slow push-in, dissolving into the brand
 * gradient as the kinetic-typography line reveals.
 */
export const Scene1Hook: FC = () => {
  const frame = useCurrentFrame();

  const videoOpacity = interpolate(
    frame,
    [VIDEO_HOLD, VIDEO_HOLD + CROSSFADE],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Slow push-in to match the calm, quiet-story tone of this piece.
  const videoScale = interpolate(frame, [0, VIDEO_HOLD + CROSSFADE], [1, 1.08], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: videoOpacity }}>
        <Video
          src={staticFile("higgsfield/vlf002-hook.mp4")}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${videoScale})`,
          }}
          muted
        />
        <AbsoluteFill
          style={{
            background: `linear-gradient(180deg, ${colors.ink950}55 0%, ${colors.ink950}e6 100%)`,
          }}
        />
      </AbsoluteFill>
      <AbsoluteFill style={{ opacity: 1 - videoOpacity }}>
        <GradientBackground />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          padding: "0 80px",
        }}
      >
        <KineticText
          text="Your best lead this week called at 7:42 PM. Nobody answered."
          highlight={["7:42", "PM"]}
          fontSize={72}
          delay={20}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
