import type { FC } from "react";
import { AbsoluteFill, Video, interpolate, staticFile, useCurrentFrame } from "remotion";
import { GradientBackground } from "../../components/GradientBackground";
import { KineticText } from "../../components/KineticText";
import { colors } from "../../config/colors";

// Frames the Higgsfield object clip holds at full opacity before dissolving
// into the gradient background — a sunny, object-based vacation cold open
// with no AI-generated people, per the VLF-001/VLF-002 benchmark pattern.
const VIDEO_HOLD = 60;
const CROSSFADE = 25;

/**
 * Scene 1 — Hook (0:00–0:06)
 * "You want to know if your business is actually leaking money? Take a
 * week off and watch what happens." Opens on a phone lighting up with
 * missed calls on a sunny beach towel, dissolving into the brand gradient
 * as the kinetic-typography line reveals.
 */
export const Scene1Hook: FC = () => {
  const frame = useCurrentFrame();

  const videoOpacity = interpolate(
    frame,
    [VIDEO_HOLD, VIDEO_HOLD + CROSSFADE],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const videoScale = interpolate(frame, [0, VIDEO_HOLD + CROSSFADE], [1, 1.08], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ opacity: videoOpacity }}>
        <Video
          src={staticFile("higgsfield/vlf005-hook.mp4")}
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
          text="You want to know if your business is actually leaking money? Take a week off and watch what happens."
          highlight={["leaking", "money"]}
          fontSize={62}
          delay={20}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
