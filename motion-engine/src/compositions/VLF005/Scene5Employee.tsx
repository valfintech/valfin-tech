import type { FC } from "react";
import { AbsoluteFill } from "remotion";
import { KineticText } from "../../components/KineticText";
import { colors } from "../../config/colors";

/**
 * Scene 5 — The quiet truth (0:23.5–0:29)
 * "A business that only works when you're standing next to it isn't really
 * yours. You're its employee." A deliberately sparse, near-black beat —
 * no gradient glow, no grid — so the music and motion both go quiet here.
 */
export const Scene5Employee: FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: colors.ink950 }}>
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", padding: "0 88px" }}>
        <KineticText
          text="A business that only works when you're standing next to it isn't really yours. You're its employee."
          highlight={["employee"]}
          fontSize={56}
          delay={14}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
