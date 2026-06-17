import type { FC, ReactNode } from "react";
import { colors } from "../../config/colors";
import { headingFont, sansFont } from "../../config/fonts";
import { ArrowRightIcon, CheckIcon, InboxIcon } from "./icons";

/** Small pill label — "MYTH", "REALITY", "EXAMPLE". */
export const Eyebrow: FC<{ text: string; color?: string }> = ({ text, color = colors.accent400 }) => (
  <div
    style={{
      fontFamily: sansFont,
      fontWeight: 700,
      fontSize: 28,
      letterSpacing: "0.22em",
      textTransform: "uppercase",
      color,
      border: `2px solid ${color}`,
      borderRadius: 999,
      padding: "10px 28px",
    }}
  >
    {text}
  </div>
);

/** Row of labeled icons converging into a single inbox icon. */
export const IconRow: FC<{ items: { icon: ReactNode; label: string }[]; toInbox?: boolean }> = ({
  items,
  toInbox = false,
}) => (
  <div style={{ display: "flex", alignItems: "center", gap: 28, flexWrap: "wrap", justifyContent: "center" }}>
    {items.map((item, i) => (
      <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
        <div
          style={{
            width: 88,
            height: 88,
            borderRadius: 24,
            background: colors.ink800,
            border: `1px solid ${colors.ink700}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {item.icon}
        </div>
        <div style={{ fontFamily: sansFont, fontSize: 24, fontWeight: 600, color: colors.ink200 }}>
          {item.label}
        </div>
      </div>
    ))}
    {toInbox && (
      <>
        <ArrowRightIcon size={36} color={colors.ink400} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: 24,
              background: colors.accent500,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <InboxIcon size={48} color={colors.ink950} />
          </div>
          <div style={{ fontFamily: sansFont, fontSize: 24, fontWeight: 700, color: colors.ink50 }}>You</div>
        </div>
      </>
    )}
  </div>
);

/** Horizontal Day 1 / Day 3 / Day 7 style timeline of dots + labels. */
export const Timeline: FC<{ steps: { label: string; sub?: string; active?: boolean }[] }> = ({ steps }) => (
  <div style={{ display: "flex", alignItems: "flex-start", gap: 0, width: "100%", maxWidth: 640 }}>
    {steps.map((step, i) => (
      <div key={i} style={{ display: "flex", alignItems: "center", flex: i === steps.length - 1 ? "0 0 auto" : 1 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, minWidth: 100 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: step.active ? colors.accent400 : colors.ink700,
              border: `2px solid ${step.active ? colors.accent400 : colors.ink600}`,
            }}
          />
          <div style={{ fontFamily: headingFont, fontSize: 32, fontWeight: 700, color: colors.ink50, whiteSpace: "nowrap" }}>
            {step.label}
          </div>
          {step.sub && (
            <div style={{ fontFamily: sansFont, fontSize: 22, color: colors.ink400, textAlign: "center" }}>{step.sub}</div>
          )}
        </div>
        {i < steps.length - 1 && (
          <div style={{ flex: 1, height: 2, background: colors.ink700, marginTop: -50 }} />
        )}
      </div>
    ))}
  </div>
);

/** A single giant statistic with a label above and a sublabel below. */
export const BigStat: FC<{ value: string; label?: string; sublabel?: string; color?: string }> = ({
  value,
  label,
  sublabel,
  color = colors.accent400,
}) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
    {label && (
      <div style={{ fontFamily: sansFont, fontSize: 28, fontWeight: 600, color: colors.ink200, textTransform: "uppercase", letterSpacing: "0.1em" }}>
        {label}
      </div>
    )}
    <div style={{ fontFamily: headingFont, fontWeight: 800, fontSize: 140, color, lineHeight: 1 }}>{value}</div>
    {sublabel && (
      <div style={{ fontFamily: sansFont, fontSize: 28, color: colors.ink400 }}>{sublabel}</div>
    )}
  </div>
);

/** Side-by-side comparison of two big values, e.g. "50" vs "3". */
export const ComparisonBars: FC<{
  left: { value: string; label: string };
  right: { value: string; label: string };
}> = ({ left, right }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 48 }}>
    {[left, right].map((item, i) => (
      <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
        <div
          style={{
            fontFamily: headingFont,
            fontWeight: 800,
            fontSize: 110,
            color: i === 0 ? colors.ink400 : colors.accent400,
            lineHeight: 1,
          }}
        >
          {item.value}
        </div>
        <div style={{ fontFamily: sansFont, fontSize: 26, fontWeight: 600, color: colors.ink200, textAlign: "center", maxWidth: 220 }}>
          {item.label}
        </div>
      </div>
    ))}
  </div>
);

/** Vertical checklist with circular checkmarks. */
export const Checklist: FC<{ items: string[] }> = ({ items }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 28, alignItems: "flex-start" }}>
    {items.map((item, i) => (
      <div key={i} style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: colors.success,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <CheckIcon size={26} color={colors.ink950} strokeWidth={3} />
        </div>
        <div style={{ fontFamily: sansFont, fontSize: 34, fontWeight: 600, color: colors.ink50 }}>{item}</div>
      </div>
    ))}
  </div>
);

/** Row of dots representing "N of total", with N highlighted in accent. */
export const DotGrid: FC<{ total: number; highlighted: number }> = ({ total, highlighted }) => (
  <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center", maxWidth: 480 }}>
    {Array.from({ length: total }).map((_, i) => (
      <div
        key={i}
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: i < highlighted ? colors.accent400 : colors.ink700,
        }}
      />
    ))}
  </div>
);

/** Single icon in a rounded card — for one-icon visual slots. */
export const IconCard: FC<{ icon: ReactNode; size?: number }> = ({ icon, size = 160 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: size * 0.2,
      background: colors.ink800,
      border: `1px solid ${colors.ink700}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    {icon}
  </div>
);

/** Small numbered step badge — accent circle with a bold digit. */
export const NumberBadge: FC<{ n: number; size?: number }> = ({ n, size = 64 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: colors.accent500,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: headingFont,
      fontWeight: 800,
      fontSize: size * 0.5,
      color: colors.ink950,
    }}
  >
    {n}
  </div>
);

/** Bottom-of-slide CTA row: accent arrow chip + "Link in bio". */
export const CTAFooter: FC<{ label?: string }> = ({ label = "Link in bio" }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
    <div
      style={{
        width: 64,
        height: 64,
        borderRadius: "50%",
        background: colors.accent500,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ArrowRightIcon size={32} color={colors.ink950} strokeWidth={2.5} />
    </div>
    <div style={{ fontFamily: sansFont, fontSize: 32, fontWeight: 700, color: colors.ink50 }}>{label}</div>
  </div>
);
