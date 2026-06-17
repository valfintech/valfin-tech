import type { FC } from "react";
import { AbsoluteFill } from "remotion";
import { Caption } from "../../components/Caption";
import { ComparisonColumn } from "../../components/ComparisonColumn";
import { GradientBackground } from "../../components/GradientBackground";
import { colors } from "../../config/colors";
import { sansFont } from "../../config/fonts";

/**
 * Scene 4 — Comparison (0:17–0:22)
 * "They booked the guy who answered." Two response-time clocks race —
 * one finishes in seconds and books, the other keeps climbing.
 */
export const Scene4Comparison: FC = () => {
  return (
    <AbsoluteFill>
      <GradientBackground />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            fontFamily: sansFont,
            fontSize: 30,
            fontWeight: 600,
            color: colors.ink200,
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            marginBottom: 64,
          }}
        >
          Response time
        </div>
        <div style={{ display: "flex", width: "100%", padding: "0 64px", gap: 32 }}>
          <ComparisonColumn
            title="You"
            toSeconds={347}
            startFrame={10}
            durationInFrames={90}
            badgeText="Lost"
            badgeColor={colors.error}
            accentColor={colors.ink200}
          />
          <ComparisonColumn
            title="Them"
            toSeconds={42}
            startFrame={10}
            durationInFrames={36}
            badgeText="Booked"
            badgeColor={colors.success}
            accentColor={colors.accent400}
          />
        </div>
      </AbsoluteFill>
      <Caption text="They booked the guy who answered." delay={20} />
    </AbsoluteFill>
  );
};
