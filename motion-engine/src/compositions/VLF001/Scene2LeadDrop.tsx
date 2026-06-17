import type { FC } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Caption } from "../../components/Caption";
import { GradientBackground } from "../../components/GradientBackground";
import { colors } from "../../config/colors";
import { sansFont } from "../../config/fonts";

const STAGES = ["New lead", "Contacted", "Booked"];

/**
 * Scene 2 — Lead pipeline drop (0:05–0:09)
 * "It wasn't your work." A lead card slides toward "Contacted" but
 * stalls and is marked missed before it gets there.
 */
export const Scene2LeadDrop: FC = () => {
  const frame = useCurrentFrame();

  // Card slides from stage 0 toward stage 1, then stalls.
  const slideProgress = interpolate(frame, [10, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cardX = interpolate(slideProgress, [0, 1], [0, 200]);

  // Card fades and tilts once it stalls.
  const missedProgress = interpolate(frame, [55, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const cardOpacity = interpolate(missedProgress, [0, 1], [1, 0.35]);
  const cardRotate = interpolate(missedProgress, [0, 1], [0, -6]);

  const stampOpacity = interpolate(frame, [60, 75], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const stampScale = interpolate(frame, [60, 75], [0.7, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <GradientBackground />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 64, alignItems: "center" }}>
          {/* Pipeline stage labels */}
          <div style={{ display: "flex", gap: 56 }}>
            {STAGES.map((stage, i) => (
              <div
                key={stage}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 12,
                  width: 180,
                }}
              >
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: i === 0 ? colors.ink400 : colors.ink700,
                  }}
                />
                <div
                  style={{
                    fontFamily: sansFont,
                    fontSize: 28,
                    fontWeight: 600,
                    color: colors.ink400,
                    textAlign: "center",
                  }}
                >
                  {stage}
                </div>
              </div>
            ))}
          </div>

          {/* Lead card */}
          <div
            style={{
              position: "relative",
              transform: `translateX(${cardX - 200}px) rotate(${cardRotate}deg)`,
              opacity: cardOpacity,
              background: colors.ink800,
              border: `1px solid ${colors.ink700}`,
              borderRadius: 20,
              padding: "28px 36px",
              minWidth: 320,
            }}
          >
            <div
              style={{
                fontFamily: sansFont,
                fontSize: 32,
                fontWeight: 700,
                color: colors.ink50,
              }}
            >
              New customer inquiry
            </div>
            <div
              style={{
                fontFamily: sansFont,
                fontSize: 26,
                color: colors.ink200,
                marginTop: 6,
              }}
            >
              Inbound call · 6:42 PM
            </div>

            {/* Missed stamp */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: `translate(-50%, -50%) rotate(-8deg) scale(${stampScale})`,
                opacity: stampOpacity,
                border: `3px solid ${colors.error}`,
                color: colors.error,
                fontFamily: sansFont,
                fontWeight: 800,
                fontSize: 34,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                padding: "8px 24px",
                borderRadius: 12,
                whiteSpace: "nowrap",
              }}
            >
              Missed
            </div>
          </div>
        </div>
      </AbsoluteFill>
      <Caption text="It wasn't your work." delay={20} />
    </AbsoluteFill>
  );
};
