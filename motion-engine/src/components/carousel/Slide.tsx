import type { FC, ReactNode } from "react";
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from "remotion";
import { colors } from "../../config/colors";
import { headingFont, sansFont } from "../../config/fonts";
import { GradientBackground } from "../GradientBackground";

/** Static (non-animated) headline for carousel stills — word-highlight support. */
export const Headline: FC<{
  text: string;
  highlight?: string[];
  size?: number;
  color?: string;
}> = ({ text, highlight = [], size = 64, color = colors.ink50 }) => (
  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: "0 0.28em",
      fontFamily: headingFont,
      fontWeight: 700,
      fontSize: size,
      lineHeight: 1.25,
      textAlign: "center",
    }}
  >
    {text.split(" ").map((word, i) => (
      <span
        key={`${word}-${i}`}
        style={{ color: highlight.includes(word.replace(/[.,"]/g, "")) ? colors.accent400 : color }}
      >
        {word}
      </span>
    ))}
  </div>
);

/** Body/sub text under a headline. */
export const SubText: FC<{ text: string; color?: string; size?: number }> = ({
  text,
  color = colors.ink200,
  size = 32,
}) => (
  <div
    style={{
      fontFamily: sansFont,
      fontSize: size,
      fontWeight: 500,
      color,
      textAlign: "center",
      lineHeight: 1.4,
      maxWidth: 760,
    }}
  >
    {text}
  </div>
);

/** Bottom slide-index dots + optional note (e.g. "swipe →" on slide 1). */
const SlideFooter: FC<{ index: number; total: number; note?: string }> = ({ index, total, note }) => (
  <AbsoluteFill style={{ justifyContent: "flex-end", alignItems: "center", paddingBottom: 56 }}>
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
      {note && (
        <div
          style={{
            fontFamily: sansFont,
            fontSize: 26,
            fontWeight: 600,
            color: colors.ink400,
            textTransform: "uppercase",
            letterSpacing: "0.18em",
          }}
        >
          {note}
        </div>
      )}
      <div style={{ display: "flex", gap: 10 }}>
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            style={{
              width: i === index - 1 ? 28 : 10,
              height: 10,
              borderRadius: 5,
              background: i === index - 1 ? colors.accent400 : colors.ink700,
              transition: "none",
            }}
          />
        ))}
      </div>
    </div>
  </AbsoluteFill>
);

export type SlideProps = {
  index: number;
  total?: number;
  background?: "gradient" | "photo" | "solid";
  photoSrc?: string;
  scrim?: "light" | "heavy";
  eyebrow?: ReactNode;
  headline: string;
  highlight?: string[];
  headlineSize?: number;
  headlineColor?: string;
  sub?: string;
  align?: "center" | "bottom";
  visual?: ReactNode;
  visualPosition?: "above" | "below";
  footerNote?: string;
  cta?: ReactNode;
};

/**
 * Generic 1080x1350 (4:5) carousel slide: gradient/photo/solid background,
 * optional eyebrow pill, headline, optional visual element, optional CTA,
 * and a slide-index footer. Shared across all PKG carousel compositions.
 */
export const Slide: FC<SlideProps> = ({
  index,
  total = 8,
  background = "gradient",
  photoSrc,
  scrim = "heavy",
  eyebrow,
  headline,
  highlight,
  headlineSize = 64,
  headlineColor,
  sub,
  align = "center",
  visual,
  visualPosition = "below",
  footerNote,
  cta,
}) => {
  return (
    <AbsoluteFill style={{ backgroundColor: colors.ink950 }}>
      {background === "gradient" && <GradientBackground />}
      {background === "photo" && photoSrc && (
        <>
          <AbsoluteFill>
            <Img src={staticFile(photoSrc)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </AbsoluteFill>
          <AbsoluteFill
            style={{
              background:
                scrim === "heavy"
                  ? `linear-gradient(180deg, ${colors.ink950}55 0%, ${colors.ink950}f5 75%)`
                  : `linear-gradient(180deg, ${colors.ink950}22 0%, ${colors.ink950}cc 100%)`,
            }}
          />
        </>
      )}
      <AbsoluteFill
        style={{
          padding: "100px 76px 180px",
          display: "flex",
          flexDirection: "column",
          justifyContent: align === "bottom" ? "flex-end" : "center",
          alignItems: "center",
          gap: 40,
        }}
      >
        {eyebrow}
        {visual && visualPosition === "above" && visual}
        <Headline text={headline} highlight={highlight} size={headlineSize} color={headlineColor} />
        {sub && <SubText text={sub} />}
        {visual && visualPosition === "below" && visual}
        {cta}
      </AbsoluteFill>
      <SlideFooter index={index} total={total} note={footerNote} />
    </AbsoluteFill>
  );
};

/**
 * Renders one carousel composition's worth of slides — one slide per frame.
 * Used to export each slide as a still via `npx remotion still <CompID> --frame=N`.
 */
export const Carousel: FC<{ slides: SlideProps[] }> = ({ slides }) => {
  const frame = useCurrentFrame();
  return <Slide {...slides[Math.min(frame, slides.length - 1)]} />;
};
