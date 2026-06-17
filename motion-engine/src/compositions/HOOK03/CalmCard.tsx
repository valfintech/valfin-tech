import type { FC } from "react";
import { CheckIcon } from "../../components/carousel/icons";
import { colors } from "../../config/colors";
import { headingFont, sansFont } from "../../config/fonts";

const ITEMS = [
  "Missed call — answered",
  "New message — replied",
  "Appointment — confirmed",
  "Invoice #4471 — paid",
  "New lead — followed up",
  "Voicemail — handled",
];

/**
 * The resolved, organized state: one clean card, everything checked off.
 * Static, deterministic, fully readable — the "I want my business to feel
 * like that" beat.
 */
export const CalmCard: FC = () => (
  <div
    style={{
      background: colors.ink800,
      border: `1px solid ${colors.ink700}`,
      borderRadius: 28,
      padding: "44px 48px",
      width: 760,
      boxShadow: "0 30px 80px rgba(0,0,0,0.55)",
    }}
  >
    <div
      style={{
        fontFamily: sansFont,
        fontWeight: 700,
        fontSize: 30,
        color: colors.ink50,
        marginBottom: 28,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <span>All caught up</span>
      <CheckIcon size={36} color={colors.success} />
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {ITEMS.map((label) => (
        <div
          key={label}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontFamily: headingFont,
            fontWeight: 600,
            fontSize: 24,
            color: colors.ink200,
          }}
        >
          <CheckIcon size={26} color={colors.success} />
          <span>{label}</span>
        </div>
      ))}
    </div>
  </div>
);
