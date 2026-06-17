import type { FC } from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Caption } from "../../components/Caption";
import { GradientBackground } from "../../components/GradientBackground";
import { PhoneIcon } from "../../components/carousel/icons";
import { colors } from "../../config/colors";
import { sansFont } from "../../config/fonts";

/**
 * Scene 3 — Voicemail (0:10–0:15)
 * "It went to voicemail. They didn't leave one." A "Missed call · No
 * voicemail" notification card springs in — the quiet, unresolved beat.
 */
export const Scene3Voicemail: FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardProgress = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 260, mass: 0.5 },
  });
  const cardScale = interpolate(cardProgress, [0, 1], [0.88, 1]);
  const cardOpacity = interpolate(cardProgress, [0, 1], [0, 1]);

  return (
    <AbsoluteFill>
      <GradientBackground />
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
              background: colors.error,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <PhoneIcon size={28} color={colors.ink950} />
          </div>
          <div>
            <div style={{ fontFamily: sansFont, fontSize: 32, fontWeight: 700, color: colors.ink50 }}>
              Missed call
            </div>
            <div style={{ fontFamily: sansFont, fontSize: 26, color: colors.ink400, marginTop: 6 }}>
              No voicemail · 7:42 PM
            </div>
          </div>
        </div>
      </AbsoluteFill>
      <Caption text="It went to voicemail. They didn't leave one." delay={18} />
    </AbsoluteFill>
  );
};
