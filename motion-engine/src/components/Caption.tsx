import type { FC } from "react";
import { KineticText } from "./KineticText";

type Props = {
  text: string;
  highlight?: string[];
  delay?: number;
};

/**
 * Burned-in caption: the primary message for a scene, anchored to the
 * lower third so it never collides with the visual above it.
 */
export const Caption: FC<Props> = ({ text, highlight, delay = 0 }) => {
  return (
    <div
      style={{
        position: "absolute",
        bottom: 170,
        left: 0,
        right: 0,
        padding: "0 72px",
      }}
    >
      <KineticText text={text} highlight={highlight} delay={delay} fontSize={58} />
    </div>
  );
};
