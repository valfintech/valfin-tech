import type { FC } from "react";
import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  staticFile,
  useCurrentFrame,
} from "remotion";
import { GradientBackground } from "../../components/GradientBackground";
import { CalendarIcon, CheckIcon, PhoneIcon } from "../../components/carousel/icons";
import { colors } from "../../config/colors";
import { headingFont, sansFont } from "../../config/fonts";

export const TOTAL_DURATION = 540; // 18s @ 30fps

// ── Timing ────────────────────────────────────────────────────────
const D01_IN = 0;
const D01_OUT = 130;
const D07_IN = 115;
const D07_OUT = 250;
const D30_IN = 235;
const D30_OUT = 375;
const D60_IN = 358;
const D60_OUT = 475;
const PROOF_IN = 458;
const PROOF_OUT = 525;
const WORDMARK_IN = 508;

// ── Helpers ───────────────────────────────────────────────────────
const reveal = (frame: number, start: number, duration = 20): number =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

const sceneFade = (frame: number, inStart: number, outStart?: number): number => {
  const inVal = reveal(frame, inStart, 20);
  if (outStart === undefined) return inVal;
  const outVal = interpolate(frame, [outStart, outStart + 18], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return Math.min(inVal, outVal);
};

// ── Progress Bar ──────────────────────────────────────────────────
const ProgressBar: FC<{ frame: number }> = ({ frame }) => {
  const progress = interpolate(frame, [0, D60_OUT], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const width = progress * 760;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 80,
        left: "50%",
        transform: "translateX(-50%)",
        width: 760,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontFamily: sansFont,
          fontWeight: 600,
          fontSize: 14,
          color: colors.ink400,
          letterSpacing: 2,
          textTransform: "uppercase",
          marginBottom: 10,
        }}
      >
        <span>Day 0</span>
        <span>Day 60</span>
      </div>
      <div
        style={{ height: 3, background: colors.ink700, borderRadius: 2, position: "relative" }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: "100%",
            width,
            background: colors.accent400,
            borderRadius: 2,
            boxShadow: `0 0 8px ${colors.accent400}80`,
            transition: "none",
          }}
        />
      </div>
    </div>
  );
};

// ── Day Badge + Milestone Layout ──────────────────────────────────
type DaySceneProps = {
  frame: number;
  inStart: number;
  outStart: number;
  day: string;
  headline: string;
  children: JSX.Element;
};

const DayScene: FC<DaySceneProps> = ({ frame, inStart, outStart, day, headline, children }) => {
  const opacity = sceneFade(frame, inStart, outStart);
  const enterP = reveal(frame, inStart, 22);
  const dayTranslate = interpolate(enterP, [0, 1], [-30, 0]);

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        opacity,
        paddingTop: 200,
        flexDirection: "column",
        gap: 0,
      }}
    >
      {/* Day badge */}
      <div style={{ textAlign: "center", transform: `translateY(${dayTranslate}px)` }}>
        <div
          style={{
            fontFamily: sansFont,
            fontWeight: 600,
            fontSize: 18,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: colors.ink400,
            marginBottom: 4,
          }}
        >
          Day
        </div>
        <div
          style={{
            fontFamily: sansFont,
            fontWeight: 800,
            fontSize: 156,
            color: colors.ink50,
            lineHeight: 0.9,
            letterSpacing: -6,
          }}
        >
          {day}
        </div>
        <div
          style={{
            fontFamily: headingFont,
            fontWeight: 700,
            fontSize: 32,
            color: colors.ink200,
            marginTop: 18,
            letterSpacing: -0.5,
          }}
        >
          {headline}
        </div>
      </div>

      {/* Detail content */}
      <div style={{ marginTop: 52, width: 720 }}>{children}</div>
    </AbsoluteFill>
  );
};

// ── Day 01: System goes live ──────────────────────────────────────
const Day01Detail: FC<{ frame: number }> = ({ frame }) => {
  const op = reveal(frame, D01_IN + 14, 18);
  return (
    <div
      style={{
        opacity: op,
        background: `${colors.success}0d`,
        border: `1px solid ${colors.success}35`,
        borderRadius: 18,
        padding: "26px 32px",
        display: "flex",
        alignItems: "center",
        gap: 18,
      }}
    >
      <div
        style={{
          width: 12,
          height: 12,
          borderRadius: "50%",
          background: colors.success,
          boxShadow: `0 0 12px ${colors.success}`,
          flexShrink: 0,
        }}
      />
      <div
        style={{
          fontFamily: sansFont,
          fontWeight: 700,
          fontSize: 24,
          color: colors.success,
          letterSpacing: 2,
          textTransform: "uppercase",
        }}
      >
        Systems active
      </div>
      <div style={{ marginLeft: "auto", display: "flex", gap: 14 }}>
        <PhoneIcon size={24} color={colors.ink400} />
        <CalendarIcon size={24} color={colors.ink400} />
        <CheckIcon size={24} color={colors.ink400} />
      </div>
    </div>
  );
};

// ── Day 07: Leads captured ────────────────────────────────────────
const Day07Detail: FC<{ frame: number }> = ({ frame }) => {
  const localFrame = frame - D07_IN;
  const rawCount = interpolate(localFrame, [10, 55], [0, 12], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const count = Math.round(rawCount);
  const op = reveal(frame, D07_IN + 8, 16);

  return (
    <div style={{ opacity: op, textAlign: "center" }}>
      <div
        style={{
          fontFamily: sansFont,
          fontWeight: 800,
          fontSize: 100,
          color: colors.accent400,
          lineHeight: 1,
          letterSpacing: -3,
        }}
      >
        {count}
      </div>
      <div
        style={{
          fontFamily: sansFont,
          fontWeight: 600,
          fontSize: 18,
          color: colors.ink400,
          letterSpacing: 3.5,
          textTransform: "uppercase",
          marginTop: 8,
        }}
      >
        Leads captured
      </div>
    </div>
  );
};

// ── Day 30: Appointments booking ──────────────────────────────────
const APPTS = [
  { name: "Marcus B.", time: "Mon, 9:00 AM", amount: "$320" },
  { name: "Sarah W.", time: "Tue, 2:30 PM", amount: "$485" },
  { name: "Jake T.", time: "Thu, 11:00 AM", amount: "$260" },
];

const Day30Detail: FC<{ frame: number }> = ({ frame }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
    {APPTS.map((appt, i) => {
      const op = reveal(frame, D30_IN + 16 + i * 22, 18);
      return (
        <div
          key={appt.name}
          style={{
            opacity: op,
            background: colors.ink800,
            border: `1px solid ${colors.ink700}`,
            borderRadius: 16,
            padding: "20px 28px",
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <CheckIcon size={22} color={colors.success} />
          <div style={{ flex: 1 }}>
            <div
              style={{ fontFamily: sansFont, fontWeight: 700, fontSize: 22, color: colors.ink50 }}
            >
              {appt.name}
            </div>
            <div
              style={{
                fontFamily: headingFont,
                fontWeight: 600,
                fontSize: 18,
                color: colors.ink400,
                marginTop: 3,
              }}
            >
              {appt.time}
            </div>
          </div>
          <div
            style={{ fontFamily: sansFont, fontWeight: 700, fontSize: 22, color: colors.success }}
          >
            {appt.amount}
          </div>
        </div>
      );
    })}
  </div>
);

// ── Day 60: Revenue in motion ─────────────────────────────────────
const Day60Detail: FC<{ frame: number }> = ({ frame }) => {
  const localFrame = frame - D60_IN;
  const rawValue = interpolate(localFrame, [10, 65], [0, 5200], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const value = Math.round(rawValue);
  const op = reveal(frame, D60_IN + 8, 18);

  return (
    <div style={{ opacity: op, textAlign: "center" }}>
      <div
        style={{
          fontFamily: sansFont,
          fontWeight: 800,
          fontSize: 96,
          color: colors.success,
          lineHeight: 1,
          letterSpacing: -3,
        }}
      >
        ${value.toLocaleString("en-US")}
      </div>
      <div
        style={{
          fontFamily: sansFont,
          fontWeight: 600,
          fontSize: 18,
          color: colors.ink400,
          letterSpacing: 3.5,
          textTransform: "uppercase",
          marginTop: 10,
        }}
      >
        Revenue in motion
      </div>
    </div>
  );
};

// ── Proof Period Banner ───────────────────────────────────────────
const ProofBanner: FC<{ frame: number }> = ({ frame }) => {
  const opacity = sceneFade(frame, PROOF_IN, PROOF_OUT);
  const enterP = reveal(frame, PROOF_IN, 22);
  const scale = interpolate(enterP, [0, 1], [0.93, 1]);

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity }}>
      <div
        style={{
          transform: `scale(${scale})`,
          background: `${colors.accent500}0e`,
          border: `1px solid ${colors.accent500}40`,
          borderRadius: 24,
          padding: "40px 56px",
          width: 720,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: sansFont,
            fontWeight: 700,
            fontSize: 13,
            color: colors.accent400,
            letterSpacing: 3.5,
            textTransform: "uppercase",
            marginBottom: 18,
          }}
        >
          60-Day Proof Period
        </div>
        <div
          style={{
            fontFamily: sansFont,
            fontWeight: 700,
            fontSize: 32,
            color: colors.ink50,
            lineHeight: 1.3,
          }}
        >
          Delivered.
        </div>
        <div
          style={{
            fontFamily: headingFont,
            fontWeight: 600,
            fontSize: 22,
            color: colors.ink200,
            marginTop: 14,
          }}
        >
          We proved it works.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Wordmark ──────────────────────────────────────────────────────
const Wordmark: FC<{ frame: number }> = ({ frame }) => {
  const opacity = reveal(frame, WORDMARK_IN);
  return (
    <AbsoluteFill
      style={{ alignItems: "center", justifyContent: "flex-end", paddingBottom: 130, opacity }}
    >
      <div
        style={{
          fontFamily: sansFont,
          fontWeight: 700,
          fontSize: 28,
          letterSpacing: 8,
          textTransform: "uppercase",
          color: colors.ink200,
        }}
      >
        Valfin
      </div>
    </AbsoluteFill>
  );
};

// ── Main composition ──────────────────────────────────────────────
export const REEL03: FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: colors.ink950 }}>
      <Audio src={staticFile("audio/reels/reel03-music.m4a")} volume={0.8} />
      <Audio src={staticFile("audio/reels/reel03-sfx.mp3")} volume={0.85} />
      <GradientBackground />

      <DayScene frame={frame} inStart={D01_IN} outStart={D01_OUT} day="01" headline="System goes live.">
        <Day01Detail frame={frame} />
      </DayScene>

      <DayScene frame={frame} inStart={D07_IN} outStart={D07_OUT} day="07" headline="Leads captured.">
        <Day07Detail frame={frame} />
      </DayScene>

      <DayScene frame={frame} inStart={D30_IN} outStart={D30_OUT} day="30" headline="Appointments booking.">
        <Day30Detail frame={frame} />
      </DayScene>

      <DayScene frame={frame} inStart={D60_IN} outStart={D60_OUT} day="60" headline="Revenue in motion.">
        <Day60Detail frame={frame} />
      </DayScene>

      <ProofBanner frame={frame} />
      <ProgressBar frame={frame} />
      <Wordmark frame={frame} />
    </AbsoluteFill>
  );
};
