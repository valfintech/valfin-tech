import type { FC, ReactNode } from "react";
import { colors } from "../../config/colors";
import { headingFont, sansFont } from "../../config/fonts";

/** Rounded UI card — the recurring "Revenue Recovery Calculator" surface. */
export const CalculatorCard: FC<{ children: ReactNode; width?: number }> = ({ children, width = 760 }) => (
  <div
    style={{
      width,
      background: colors.ink800,
      border: `1px solid ${colors.ink700}`,
      borderRadius: 28,
      padding: "44px 48px",
      display: "flex",
      flexDirection: "column",
      gap: 28,
    }}
  >
    {children}
  </div>
);

/** Card title row — small accent dot + label, mimicking a real app header. */
export const CardHeader: FC<{ title: string }> = ({ title }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
    <div style={{ width: 14, height: 14, borderRadius: "50%", background: colors.accent400 }} />
    <div style={{ fontFamily: headingFont, fontWeight: 700, fontSize: 36, color: colors.ink50 }}>{title}</div>
  </div>
);

/** Single labeled input row with a value on the right, like a real form field. */
export const InputRow: FC<{ label: string; value: string; opacity: number }> = ({ label, value, opacity }) => (
  <div
    style={{
      opacity,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      background: colors.ink900,
      border: `1px solid ${colors.ink700}`,
      borderRadius: 16,
      padding: "24px 32px",
    }}
  >
    <div style={{ fontFamily: sansFont, fontSize: 30, fontWeight: 600, color: colors.ink200 }}>{label}</div>
    <div style={{ fontFamily: headingFont, fontWeight: 800, fontSize: 40, color: colors.accent400 }}>{value}</div>
  </div>
);
