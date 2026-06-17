import type { FC, ReactNode } from "react";
import { useCurrentFrame } from "remotion";
import { colors } from "../../config/colors";
import { headingFont, sansFont } from "../../config/fonts";

export type ChaosItem = {
  icon: ReactNode;
  title: string;
  subtitle: string;
  color: string;
  top: number;
  left: number;
  width: number;
  rotate: number;
  jitterSeed: number;
};

/**
 * A single cluttered notification card. Subtle continuous jitter (rotation
 * + vertical drift) sells "unmanaged" without ever becoming illegible —
 * all text is plain, static, deterministic typography.
 */
export const ChaosCard: FC<{ item: ChaosItem }> = ({ item }) => {
  const frame = useCurrentFrame();
  const jitterRotate = Math.sin(frame / 22 + item.jitterSeed) * 1.4;
  const jitterY = Math.sin(frame / 17 + item.jitterSeed * 1.7) * 4;

  return (
    <div
      style={{
        position: "absolute",
        top: item.top + jitterY,
        left: item.left,
        width: item.width,
        transform: `rotate(${item.rotate + jitterRotate}deg)`,
        background: colors.ink800,
        border: `1px solid ${colors.ink700}`,
        borderRadius: 18,
        padding: "20px 26px",
        display: "flex",
        alignItems: "center",
        gap: 18,
        boxShadow: "0 18px 40px rgba(0,0,0,0.45)",
      }}
    >
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: "50%",
          background: colors.ink900,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {item.icon}
      </div>
      <div>
        <div style={{ fontFamily: sansFont, fontWeight: 700, fontSize: 26, color: colors.ink50 }}>
          {item.title}
        </div>
        <div style={{ fontFamily: headingFont, fontWeight: 600, fontSize: 20, color: item.color, marginTop: 2 }}>
          {item.subtitle}
        </div>
      </div>
    </div>
  );
};
