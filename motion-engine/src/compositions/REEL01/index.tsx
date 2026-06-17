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

export const TOTAL_DURATION = 450; // 15s @ 30fps

// ── Scene timing ──────────────────────────────────────────────────
const S1_ENTER = 0;
const S1_EXIT = 95;
const S2_ENTER = 80;
const SMS_OUT_FRAME = 100;
const TYPING_IN = 148;
const SMS_IN_FRAME = 178;
const S2_EXIT = 225;
const S3_ENTER = 212;
const S3_EXIT = 368;
const S4_ENTER = 352;
const COUNTER_END = 415;
const WORDMARK_IN = 420;

// ── Helpers ───────────────────────────────────────────────────────
const reveal = (frame: number, start: number, duration = 20): number =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

const sceneFade = (frame: number, inStart: number, outStart?: number): number => {
  const inVal = reveal(frame, inStart, 18);
  if (outStart === undefined) return inVal;
  const outVal = interpolate(frame, [outStart, outStart + 18], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return Math.min(inVal, outVal);
};

// ── Scene 1: Missed Call Card ─────────────────────────────────────
const MissedCallCard: FC<{ frame: number }> = ({ frame }) => {
  const enterP = reveal(frame, S1_ENTER, 24);
  const opacity = sceneFade(frame, S1_ENTER, S1_EXIT);
  const translateY = interpolate(enterP, [0, 1], [-48, 0]);

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity }}>
      <div
        style={{
          position: "absolute",
          top: 200,
          fontFamily: sansFont,
          fontWeight: 600,
          fontSize: 17,
          letterSpacing: 4,
          textTransform: "uppercase",
          color: colors.ink400,
        }}
      >
        What happens next?
      </div>

      <div
        style={{
          transform: `translateY(${translateY}px)`,
          background: colors.ink800,
          border: `1px solid ${colors.error}44`,
          borderRadius: 26,
          padding: "32px 40px",
          width: 660,
          display: "flex",
          alignItems: "center",
          gap: 24,
          boxShadow: `0 24px 70px rgba(0,0,0,0.5), 0 0 40px ${colors.error}18`,
        }}
      >
        <div
          style={{
            width: 68,
            height: 68,
            borderRadius: "50%",
            background: `${colors.error}18`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <PhoneIcon size={34} color={colors.error} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: sansFont, fontWeight: 700, fontSize: 30, color: colors.ink50 }}>
            Missed call
          </div>
          <div
            style={{
              fontFamily: headingFont,
              fontWeight: 600,
              fontSize: 22,
              color: colors.error,
              marginTop: 6,
            }}
          >
            Tom H. — 7:42 PM
          </div>
        </div>
        <div
          style={{
            fontFamily: sansFont,
            fontWeight: 700,
            fontSize: 13,
            color: colors.error,
            letterSpacing: 2.5,
            textTransform: "uppercase",
            background: `${colors.error}14`,
            borderRadius: 8,
            padding: "7px 14px",
          }}
        >
          Missed
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 2: SMS Thread ───────────────────────────────────────────
type BubbleProps = { frame: number; delay: number; text: string; type: "sent" | "received" };

const SMSBubble: FC<BubbleProps> = ({ frame, delay, text, type }) => {
  const localFrame = frame - delay;
  if (localFrame < 0) return null;
  const enterP = reveal(localFrame, 0, 18);
  const translateY = interpolate(enterP, [0, 1], [18, 0]);
  const isRight = type === "sent";

  return (
    <div
      style={{
        opacity: enterP,
        transform: `translateY(${translateY}px)`,
        display: "flex",
        justifyContent: isRight ? "flex-end" : "flex-start",
      }}
    >
      <div
        style={{
          background: isRight ? colors.accent500 : colors.ink700,
          borderRadius: isRight ? "22px 22px 5px 22px" : "22px 22px 22px 5px",
          padding: "19px 28px",
          maxWidth: 580,
          fontFamily: headingFont,
          fontWeight: 600,
          fontSize: 24,
          color: colors.ink50,
          lineHeight: 1.4,
        }}
      >
        {text}
      </div>
    </div>
  );
};

const TypingDots: FC<{ frame: number }> = ({ frame }) => {
  const visible = frame >= TYPING_IN && frame < SMS_IN_FRAME;
  if (!visible) return null;
  const opacity = Math.min(
    reveal(frame, TYPING_IN, 12),
    interpolate(frame, [SMS_IN_FRAME - 10, SMS_IN_FRAME], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const dot = frame % 24;

  return (
    <div
      style={{
        opacity,
        display: "flex",
        gap: 9,
        alignItems: "center",
        background: colors.ink700,
        borderRadius: "22px 22px 22px 5px",
        padding: "18px 24px",
        width: 90,
      }}
    >
      {([0, 8, 16] as const).map((offset) => (
        <div
          key={offset}
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: colors.ink400,
            opacity: interpolate((dot - offset + 24) % 24, [0, 6, 12], [0.3, 1, 0.3], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        />
      ))}
    </div>
  );
};

const SMSThread: FC<{ frame: number }> = ({ frame }) => {
  const opacity = sceneFade(frame, S2_ENTER, S2_EXIT);
  const labelOpacity = sceneFade(frame, S2_ENTER, S2_ENTER + 40);

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity }}>
      <div style={{ width: 740, display: "flex", flexDirection: "column", gap: 20 }}>
        <div
          style={{
            textAlign: "center",
            fontFamily: sansFont,
            fontWeight: 600,
            fontSize: 17,
            color: colors.ink400,
            letterSpacing: 3.5,
            textTransform: "uppercase",
            opacity: labelOpacity,
            marginBottom: 8,
          }}
        >
          23 seconds later
        </div>

        <SMSBubble
          frame={frame}
          delay={SMS_OUT_FRAME}
          text="Hi Tom — sorry we missed you. Still need a hand?"
          type="sent"
        />
        <TypingDots frame={frame} />
        <SMSBubble
          frame={frame}
          delay={SMS_IN_FRAME}
          text="Yes please. Is Thursday 2pm available?"
          type="received"
        />
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 3: Appointment Confirmed ────────────────────────────────
const AppointmentCard: FC<{ frame: number }> = ({ frame }) => {
  const enterP = reveal(frame, S3_ENTER, 24);
  const opacity = sceneFade(frame, S3_ENTER, S3_EXIT);
  const scale = interpolate(enterP, [0, 1], [0.91, 1]);

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity }}>
      <div
        style={{
          transform: `scale(${scale})`,
          background: `linear-gradient(145deg, ${colors.ink800} 0%, ${colors.navy900} 100%)`,
          border: `1px solid ${colors.success}40`,
          borderRadius: 30,
          padding: "48px 56px",
          width: 700,
          boxShadow: `0 32px 90px rgba(0,0,0,0.55), 0 0 50px ${colors.success}12`,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            marginBottom: 22,
          }}
        >
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              background: `${colors.success}18`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <CalendarIcon size={30} color={colors.success} />
          </div>
          <div
            style={{
              fontFamily: sansFont,
              fontWeight: 700,
              fontSize: 14,
              color: colors.success,
              letterSpacing: 3.5,
              textTransform: "uppercase",
            }}
          >
            Appointment Booked
          </div>
        </div>

        <div
          style={{ fontFamily: sansFont, fontWeight: 800, fontSize: 36, color: colors.ink50, marginBottom: 10 }}
        >
          Tom H.
        </div>
        <div
          style={{
            fontFamily: headingFont,
            fontWeight: 600,
            fontSize: 26,
            color: colors.ink200,
            marginBottom: 30,
          }}
        >
          Thursday, March 20 — 2:00 PM
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            background: `${colors.success}12`,
            borderRadius: 14,
            padding: "18px 26px",
          }}
        >
          <CheckIcon size={26} color={colors.success} />
          <span
            style={{ fontFamily: headingFont, fontWeight: 700, fontSize: 22, color: colors.success }}
          >
            $485 confirmed
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Scene 4: Outcome ──────────────────────────────────────────────
const OutcomeScene: FC<{ frame: number }> = ({ frame }) => {
  const opacity = sceneFade(frame, S4_ENTER);
  const rawValue = interpolate(frame, [S4_ENTER, COUNTER_END], [0, 485], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });
  const value = Math.round(rawValue);
  const wordmarkOpacity = reveal(frame, WORDMARK_IN);

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity }}>
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontFamily: sansFont,
            fontWeight: 600,
            fontSize: 16,
            color: colors.success,
            letterSpacing: 4,
            textTransform: "uppercase",
            marginBottom: 16,
          }}
        >
          Opportunity Recovered
        </div>
        <div
          style={{
            fontFamily: sansFont,
            fontWeight: 800,
            fontSize: 120,
            color: colors.success,
            lineHeight: 1,
            letterSpacing: -2,
          }}
        >
          ${value}
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 130,
          fontFamily: sansFont,
          fontWeight: 700,
          fontSize: 28,
          letterSpacing: 8,
          textTransform: "uppercase",
          color: colors.ink200,
          opacity: wordmarkOpacity,
        }}
      >
        Valfin
      </div>
    </AbsoluteFill>
  );
};

// ── Main composition ──────────────────────────────────────────────
export const REEL01: FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: colors.ink950 }}>
      <Audio src={staticFile("audio/reels/reel01-music.m4a")} volume={0.8} />
      <Audio src={staticFile("audio/reels/reel01-sfx.mp3")} volume={0.85} />
      <GradientBackground />
      <MissedCallCard frame={frame} />
      <SMSThread frame={frame} />
      <AppointmentCard frame={frame} />
      <OutcomeScene frame={frame} />
    </AbsoluteFill>
  );
};
