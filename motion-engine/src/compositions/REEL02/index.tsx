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
import {
  CalendarIcon,
  FormIcon,
  MessageIcon,
  PhoneIcon,
} from "../../components/carousel/icons";
import { colors } from "../../config/colors";
import { headingFont, sansFont } from "../../config/fonts";

export const TOTAL_DURATION = 540; // 18s @ 30fps

// ── Timing ────────────────────────────────────────────────────────
const HEADLINE_IN = 0;
const HEADLINE_OUT = 70;
const F1_IN = 75;
const F2_IN = 138;
const F3_IN = 200;
const F4_IN = 260;
const FEATURES_OUT = 310;
const PRICE_IN = 295;
const PRICE_OUT = 435;
const PROOF_IN = 418;
const PROOF_OUT = 515;
const WORDMARK_IN = 498;

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

// ── Hero Headline ─────────────────────────────────────────────────
const HeroHeadline: FC<{ frame: number }> = ({ frame }) => {
  const opacity = sceneFade(frame, HEADLINE_IN, HEADLINE_OUT);
  const enterP = reveal(frame, HEADLINE_IN, 28);
  const scale = interpolate(enterP, [0, 1], [0.94, 1]);

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity }}>
      <div style={{ textAlign: "center", transform: `scale(${scale})` }}>
        <div
          style={{
            fontFamily: sansFont,
            fontWeight: 600,
            fontSize: 16,
            letterSpacing: 5,
            textTransform: "uppercase",
            color: colors.accent400,
            marginBottom: 18,
          }}
        >
          Valfin
        </div>
        <div
          style={{
            fontFamily: sansFont,
            fontWeight: 800,
            fontSize: 64,
            color: colors.ink50,
            lineHeight: 1.1,
            letterSpacing: -1,
          }}
        >
          The Growth
          <br />
          Package
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Feature Card ──────────────────────────────────────────────────
type FeatureProps = {
  frame: number;
  delay: number;
  icon: JSX.Element;
  label: string;
  top: number;
  outStart?: number;
};

const FeatureCard: FC<FeatureProps> = ({ frame, delay, icon, label, top, outStart }) => {
  const localFrame = frame - delay;
  if (localFrame < 0) return null;
  const enterP = reveal(localFrame, 0, 20);
  const translateY = interpolate(enterP, [0, 1], [20, 0]);
  const opacity = outStart
    ? Math.min(enterP, interpolate(frame, [outStart, outStart + 18], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }))
    : enterP;

  return (
    <div
      style={{
        position: "absolute",
        top,
        left: "50%",
        transform: `translateX(-50%) translateY(${translateY}px)`,
        width: 680,
        opacity,
        background: colors.ink800,
        border: `1px solid ${colors.ink700}`,
        borderRadius: 18,
        padding: "24px 32px",
        display: "flex",
        alignItems: "center",
        gap: 22,
        boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
      }}
    >
      <div
        style={{
          width: 54,
          height: 54,
          borderRadius: "50%",
          background: `${colors.accent400}18`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div style={{ fontFamily: sansFont, fontWeight: 700, fontSize: 28, color: colors.ink50 }}>
        {label}
      </div>
    </div>
  );
};

const FeatureList: FC<{ frame: number }> = ({ frame }) => (
  <>
    <FeatureCard
      frame={frame}
      delay={F1_IN}
      icon={<PhoneIcon size={28} color={colors.accent400} />}
      label="Missed Call Recovery"
      top={560}
      outStart={FEATURES_OUT}
    />
    <FeatureCard
      frame={frame}
      delay={F2_IN}
      icon={<MessageIcon size={28} color={colors.accent400} />}
      label="Auto Follow-Up SMS"
      top={674}
      outStart={FEATURES_OUT}
    />
    <FeatureCard
      frame={frame}
      delay={F3_IN}
      icon={<CalendarIcon size={28} color={colors.accent400} />}
      label="Appointment Booking"
      top={788}
      outStart={FEATURES_OUT}
    />
    <FeatureCard
      frame={frame}
      delay={F4_IN}
      icon={<FormIcon size={28} color={colors.accent400} />}
      label="Revenue Tracking"
      top={902}
      outStart={FEATURES_OUT}
    />
  </>
);

// ── Price Card ────────────────────────────────────────────────────
const PriceCard: FC<{ frame: number }> = ({ frame }) => {
  const enterP = reveal(frame, PRICE_IN, 26);
  const opacity = sceneFade(frame, PRICE_IN, PRICE_OUT);
  const scale = interpolate(enterP, [0, 1], [0.92, 1]);

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity }}>
      <div
        style={{
          transform: `scale(${scale})`,
          background: `linear-gradient(155deg, ${colors.ink800} 0%, ${colors.ink900} 100%)`,
          border: `1px solid ${colors.ink700}`,
          borderRadius: 30,
          padding: "56px 64px",
          width: 700,
          textAlign: "center",
          boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
        }}
      >
        <div
          style={{
            fontFamily: sansFont,
            fontWeight: 600,
            fontSize: 14,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: colors.ink400,
            marginBottom: 24,
          }}
        >
          Monthly
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "center",
            gap: 6,
            marginBottom: 20,
          }}
        >
          <span
            style={{
              fontFamily: sansFont,
              fontWeight: 800,
              fontSize: 130,
              color: colors.ink50,
              letterSpacing: -4,
              lineHeight: 1,
            }}
          >
            $497
          </span>
          <span
            style={{
              fontFamily: sansFont,
              fontWeight: 600,
              fontSize: 32,
              color: colors.ink400,
              lineHeight: 1,
            }}
          >
            /mo
          </span>
        </div>

        <div
          style={{
            fontFamily: headingFont,
            fontWeight: 700,
            fontSize: 28,
            color: colors.ink200,
            marginBottom: 12,
          }}
        >
          Growth Package
        </div>
        <div
          style={{
            fontFamily: sansFont,
            fontWeight: 500,
            fontSize: 18,
            color: colors.ink400,
          }}
        >
          Includes everything. Cancel anytime.
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── Proof Period ──────────────────────────────────────────────────
const ProofPeriod: FC<{ frame: number }> = ({ frame }) => {
  const opacity = sceneFade(frame, PROOF_IN, PROOF_OUT);
  const enterP = reveal(frame, PROOF_IN, 22);
  const translateY = interpolate(enterP, [0, 1], [24, 0]);

  return (
    <AbsoluteFill style={{ alignItems: "center", justifyContent: "center", opacity }}>
      <div
        style={{
          transform: `translateY(${translateY}px)`,
          background: `${colors.accent500}0e`,
          border: `1px solid ${colors.accent500}40`,
          borderRadius: 22,
          padding: "36px 52px",
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
            marginBottom: 16,
          }}
        >
          60-Day Proof Period
        </div>
        <div
          style={{
            fontFamily: sansFont,
            fontWeight: 700,
            fontSize: 30,
            color: colors.ink50,
            lineHeight: 1.35,
          }}
        >
          We prove this works.
          <br />
          Or you don't pay.
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
      style={{
        alignItems: "center",
        justifyContent: "flex-end",
        paddingBottom: 130,
        opacity,
      }}
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
export const REEL02: FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: colors.ink950 }}>
      <Audio src={staticFile("audio/reels/reel02-music.m4a")} volume={0.8} />
      <Audio src={staticFile("audio/reels/reel02-sfx.mp3")} volume={0.85} />
      <GradientBackground />
      <HeroHeadline frame={frame} />
      <FeatureList frame={frame} />
      <PriceCard frame={frame} />
      <ProofPeriod frame={frame} />
      <Wordmark frame={frame} />
    </AbsoluteFill>
  );
};
