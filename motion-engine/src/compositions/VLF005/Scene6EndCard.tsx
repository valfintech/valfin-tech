import type { FC } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { colors } from "../../config/colors";
import { headingFont, sansFont } from "../../config/fonts";

/**
 * Scene 6 — CTA end card (0:29–0:35)
 * Solid dark background, centered two-line CTA — "There's a better way to
 * run it." + "Link in bio."
 */
export const Scene6EndCard: FC = () => {
  const frame = useCurrentFrame();

  const titleOpacity = interpolate(frame, [0, 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const titleY = interpolate(frame, [0, 16], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const linkOpacity = interpolate(frame, [16, 32], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const lineWidth = interpolate(frame, [32, 50], [0, 100], {
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
        There's a better way to run it.
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
