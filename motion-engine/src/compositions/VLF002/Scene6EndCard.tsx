import type { FC } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { colors } from "../../config/colors";
import { headingFont, sansFont } from "../../config/fonts";

/**
 * Scene 6 — CTA end card (0:26–0:30)
 * Solid dark background, centered follow CTA + handle. Holds for the
 * back half of the scene per the production package.
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
        Follow for more on the leaks you can&apos;t see.
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
      <div style={{ fontFamily: sansFont, fontWeight: 600, fontSize: 36, color: colors.accent400, opacity: linkOpacity }}>
        @valfintech
      </div>
    </AbsoluteFill>
  );
};
