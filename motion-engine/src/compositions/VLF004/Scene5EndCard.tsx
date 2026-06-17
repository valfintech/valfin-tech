import type { FC } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { colors } from "../../config/colors";
import { headingFont, sansFont } from "../../config/fonts";

/**
 * Scene 5 — CTA end card (0:24–0:30)
 * Solid dark background, centered two-line CTA — "No pitch. No demo trap.
 * Just your number." + "Link in bio."
 */
export const Scene5EndCard: FC = () => {
  const frame = useCurrentFrame();

  const titleOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleY = interpolate(frame, [0, 12], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const linkOpacity = interpolate(frame, [12, 26], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const lineWidth = interpolate(frame, [26, 42], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.ink950,
        alignItems: "center",
        justifyContent: "center",
        padding: "0 80px",
      }}
    >
      <div
        style={{
          fontFamily: headingFont,
          fontWeight: 700,
          fontSize: 64,
          color: colors.ink50,
          textAlign: "center",
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
        }}
      >
        No pitch. No demo trap. Just your number.
      </div>
      <div
        style={{
          width: `${lineWidth}%`,
          maxWidth: 200,
          height: 3,
          background: colors.accent400,
          borderRadius: 2,
          margin: "32px 0",
        }}
      />
      <div style={{ fontFamily: sansFont, fontWeight: 600, fontSize: 40, color: colors.accent400, opacity: linkOpacity }}>
        Link in bio
      </div>
    </AbsoluteFill>
  );
};
