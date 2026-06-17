import type { CSSProperties, FC } from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { colors } from "../config/colors";
import { headingFont } from "../config/fonts";

type Props = {
  text: string;
  /** Words (matched without trailing punctuation) rendered in the accent color. */
  highlight?: string[];
  fontSize?: number;
  /** Frames to wait before the first word starts animating in. */
  delay?: number;
  color?: string;
};

const STAGGER = 3;

/**
 * Word-by-word kinetic typography reveal: each word springs up and fades in,
 * staggered left-to-right. Used as the primary on-screen caption for every
 * scene.
 */
export const KineticText: FC<Props> = ({
  text,
  highlight = [],
  fontSize = 64,
  delay = 0,
  color = colors.ink50,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(" ");

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "0 0.32em",
        fontFamily: headingFont,
        fontWeight: 700,
        fontSize,
        lineHeight: 1.25,
        textAlign: "center",
      }}
    >
      {words.map((word, i) => {
        const progress = spring({
          frame: frame - delay - i * STAGGER,
          fps,
          config: { damping: 200, stiffness: 260, mass: 0.5 },
        });
        const opacity = interpolate(progress, [0, 1], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const translateY = interpolate(progress, [0, 1], [28, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const isHighlight = highlight.includes(word.replace(/[.,]/g, ""));

        const style: CSSProperties = {
          display: "inline-block",
          opacity,
          transform: `translateY(${translateY}px)`,
          color: isHighlight ? colors.accent400 : color,
        };

        return (
          <span key={`${word}-${i}`} style={style}>
            {word}
          </span>
        );
      })}
    </div>
  );
};
