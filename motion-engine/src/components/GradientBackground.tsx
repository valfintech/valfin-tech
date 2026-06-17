import type { FC } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { colors } from "../config/colors";

/**
 * Shared full-frame backdrop: ink gradient + a slow-pulsing accent glow +
 * a faint grid, used across every scene for a consistent premium look.
 */
export const GradientBackground: FC = () => {
  const frame = useCurrentFrame();

  // Slow breathing glow — subtle, never distracting.
  const glowOpacity = interpolate(
    Math.sin(frame / 45),
    [-1, 1],
    [0.12, 0.28],
  );

  // Slow layered drift for a sense of 3D depth: the grid (far plane) creeps
  // slightly slower than the glow (near plane), like a subtle parallax dolly.
  const gridScale = interpolate(frame, [0, 240], [1, 1.025], {
    extrapolateRight: "clamp",
  });
  const glowScale = interpolate(frame, [0, 240], [1, 1.08], {
    extrapolateRight: "clamp",
  });
  const glowDrift = interpolate(frame, [0, 240], [0, -16], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${colors.ink900} 0%, ${colors.ink950} 60%)`,
      }}
    >
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${colors.ink700} 1px, transparent 1px), linear-gradient(90deg, ${colors.ink700} 1px, transparent 1px)`,
          backgroundSize: "72px 72px",
          opacity: 0.18,
          transform: `scale(${gridScale})`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 28%, ${colors.accent500} 0%, transparent 55%)`,
          opacity: glowOpacity,
          transform: `scale(${glowScale}) translateY(${glowDrift}px)`,
        }}
      />
    </AbsoluteFill>
  );
};
