import type { FC } from "react";
import { AbsoluteFill, Video, staticFile } from "remotion";
import { colors } from "../config/colors";

type Props = {
  src: string;
  scale?: number;
};

/**
 * Heavily blurred/dimmed Higgsfield footage used purely as ambient
 * lighting and motion texture. Never carries readable text or numbers —
 * all business-critical information is rendered as separate deterministic
 * Remotion overlays on top of this layer.
 */
export const AmbientVideoBackdrop: FC<Props> = ({ src, scale = 1.15 }) => (
  <AbsoluteFill>
    <Video
      src={staticFile(src)}
      muted
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        transform: `scale(${scale})`,
        filter: "blur(24px) brightness(0.3) saturate(0.6)",
      }}
    />
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, ${colors.ink950}b3 0%, ${colors.ink950}f7 100%)`,
      }}
    />
  </AbsoluteFill>
);
