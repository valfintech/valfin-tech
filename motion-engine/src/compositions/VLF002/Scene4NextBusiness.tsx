import type { FC } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Caption } from "../../components/Caption";
import { GradientBackground } from "../../components/GradientBackground";
import { ArrowRightIcon, CheckIcon, XIcon } from "../../components/carousel/icons";
import { colors } from "../../config/colors";
import { sansFont } from "../../config/fonts";

/**
 * Scene 4 — Next business (0:15–0:20)
 * "So they called the next business. That one picked up." Two cards —
 * "You" (missed) and "Next business" (connected) — the object-based,
 * no-people version of the original "competitor answers" beat.
 */
export const Scene4NextBusiness: FC = () => {
  const frame = useCurrentFrame();

  const leftOpacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const arrowOpacity = interpolate(frame, [25, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rightOpacity = interpolate(frame, [40, 58], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const rightScale = interpolate(frame, [40, 58], [0.9, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <GradientBackground />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 40 }}>
          <div
            style={{
              opacity: leftOpacity,
              background: colors.ink800,
              border: `1px solid ${colors.ink700}`,
              borderRadius: 20,
              padding: "28px 32px",
              minWidth: 220,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: colors.ink700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <XIcon size={28} color={colors.ink400} />
            </div>
            <div style={{ fontFamily: sansFont, fontSize: 28, fontWeight: 700, color: colors.ink400 }}>You</div>
          </div>
          <div style={{ opacity: arrowOpacity }}>
            <ArrowRightIcon size={40} color={colors.ink400} />
          </div>
          <div
            style={{
              opacity: rightOpacity,
              transform: `scale(${rightScale})`,
              background: colors.ink800,
              border: `1px solid ${colors.ink700}`,
              borderRadius: 20,
              padding: "28px 32px",
              minWidth: 220,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: colors.success,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CheckIcon size={28} color={colors.ink950} strokeWidth={3} />
            </div>
            <div style={{ fontFamily: sansFont, fontSize: 28, fontWeight: 700, color: colors.ink50 }}>
              Next business
            </div>
          </div>
        </div>
      </AbsoluteFill>
      <Caption text="So they called the next business. That one picked up." delay={45} />
    </AbsoluteFill>
  );
};
