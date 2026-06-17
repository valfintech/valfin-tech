import type { FC } from "react";
import {
  AbsoluteFill,
  Video,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Caption } from "../../components/Caption";
import { colors } from "../../config/colors";
import { sansFont } from "../../config/fonts";

/**
 * Scene — Turning point (0:17–0:19)
 * The emotional beat, rebuilt as a UI-driven motion graphic: a calm desk/
 * calendar object shot (Higgsfield) under a "Appointment booked" notification
 * card — the success mirror of Scene 2's "Missed" stamp. Reuses the
 * comparison scene's caption, "They booked the guy who answered."
 */
export const SceneTurningPoint: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardProgress = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 260, mass: 0.5 },
  });
  const cardScale = interpolate(cardProgress, [0, 1], [0.88, 1]);
  const cardOpacity = interpolate(cardProgress, [0, 1], [0, 1]);

  const badgeProgress = spring({
    frame: frame - 8,
    fps,
    config: { damping: 11, stiffness: 280, mass: 0.4 },
  });
  const badgeScale = interpolate(badgeProgress, [0, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill>
      <Video
        src={staticFile("higgsfield/vlf001-turning-point-desk.mp4")}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
        muted
      />
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, ${colors.ink950}99 0%, ${colors.ink950}f2 100%)`,
        }}
      />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            transform: `scale(${cardScale})`,
            opacity: cardOpacity,
            background: colors.ink800,
            border: `1px solid ${colors.ink700}`,
            borderRadius: 20,
            padding: "28px 36px",
            minWidth: 380,
            display: "flex",
            alignItems: "center",
            gap: 20,
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
              flexShrink: 0,
              transform: `scale(${badgeScale})`,
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 13l4 4L19 7"
                stroke={colors.ink950}
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div>
            <div
              style={{
                fontFamily: sansFont,
                fontSize: 32,
                fontWeight: 700,
                color: colors.ink50,
              }}
            >
              Appointment booked
            </div>
            <div
              style={{
                fontFamily: sansFont,
                fontSize: 26,
                color: colors.ink200,
                marginTop: 6,
              }}
            >
              Today · 2:14 PM
            </div>
          </div>
        </div>
      </AbsoluteFill>
      <Caption text="They booked the guy who answered." delay={14} />
    </AbsoluteFill>
  );
};
