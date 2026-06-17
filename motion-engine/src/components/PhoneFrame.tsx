import type { CSSProperties, FC, ReactNode } from "react";
import { colors } from "../config/colors";

type Props = {
  children: ReactNode;
  width?: number;
  height?: number;
};

/**
 * Minimal premium phone-UI mockup: rounded frame, notch, and a content
 * area for scene-specific UI (notifications, call screens, etc.).
 */
export const PhoneFrame: FC<Props> = ({ children, width = 520, height = 920 }) => {
  const frameStyle: CSSProperties = {
    width,
    height,
    borderRadius: 56,
    border: `2px solid ${colors.ink600}`,
    background: colors.ink900,
    position: "relative",
    overflow: "hidden",
    boxShadow: "0 40px 100px rgba(0,0,0,0.55)",
  };

  return (
    <div style={frameStyle}>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: 160,
          height: 32,
          background: colors.ink950,
          borderRadius: "0 0 20px 20px",
          zIndex: 2,
        }}
      />
      <div style={{ position: "absolute", inset: 0, padding: "64px 28px 28px" }}>
        {children}
      </div>
    </div>
  );
};
