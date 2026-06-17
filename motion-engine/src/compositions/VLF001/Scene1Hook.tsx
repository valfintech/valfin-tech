import type { FC } from "react";
import { AbsoluteFill, Video, interpolate, staticFile, useCurrentFrame } from "remotion";
import { GradientBackground } from "../../components/GradientBackground";
import { KineticText } from "../../components/KineticText";
import { colors } from "../../config/colors";

// Frames the Higgsfield object clip holds at full opacity before dissolving
// into the gradient background — pulled forward so the pattern-interrupt
// (cinematic object shot -> kinetic type) lands inside the first 2 seconds.
const VIDEO_HOLD = 35;
const CROSSFADE = 25;

/**
 * Scene 1 — Hook (0:00–0:05)
 * "They just call back faster." — opens on a premium object-based Higgsfield
 * clip (a smartphone lighting up with a notification), with a fast push-in,
 * dissolving early into the brand gradient as the kinetic-typography line
 * reveals — a motion-design-first cold open with no AI-generated people.
 */
export const Scene1Hook: FC = () => {
  const frame = useCurrentFrame();

  const lineWidth = interpolate(frame, [50, 75], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const videoOpacity = interpolate(
    frame,
    [VIDEO_HOLD, VIDEO_HOLD + CROSSFADE],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Fast push-in on the object shot for extra energy in the opening beat.
  const videoScale = interpolate(frame, [0, VIDEO_HOLD + CROSSFADE], [1, 1.12], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: videoOpacity }}>
        <Video
          src={staticFile("higgsfield/vlf001-hook-phone.mp4")}
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
            background: `linear-gradient(180deg, ${colors.ink950}66 0%, ${colors.ink950}cc 100%)`,
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
          text="They just call back faster."
          highlight={["faster"]}
          fontSize={88}
          delay={15}
        />
        <div
          style={{
            width: `${lineWidth}%`,
            maxWidth: 420,
            height: 4,
            marginTop: 28,
            background: colors.accent400,
            borderRadius: 2,
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
