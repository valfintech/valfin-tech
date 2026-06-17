import type { FC } from "react";
import { AbsoluteFill, Audio, interpolate, staticFile, useCurrentFrame } from "remotion";
import { GradientBackground } from "../../components/GradientBackground";
import {
  CalendarIcon,
  ChatBubbleIcon,
  FormIcon,
  InboxIcon,
  MessageIcon,
  PhoneIcon,
} from "../../components/carousel/icons";
import { colors } from "../../config/colors";
import { sansFont } from "../../config/fonts";
import { CalmCard } from "./CalmCard";
import { ChaosCard, type ChaosItem } from "./ChaosCard";

export const TOTAL_DURATION = 300; // 10s @ 30fps

const WIPE_START = 40;
const WIPE_END = 260;

const CHAOS_ITEMS: ChaosItem[] = [
  {
    icon: <PhoneIcon size={28} color={colors.error} />,
    title: "Missed call",
    subtitle: "Unknown number",
    color: colors.error,
    top: 120,
    left: 40,
    width: 460,
    rotate: -7,
    jitterSeed: 0,
  },
  {
    icon: <MessageIcon size={28} color={colors.warning} />,
    title: "New message",
    subtitle: "Unread",
    color: colors.warning,
    top: 300,
    left: 560,
    width: 470,
    rotate: 5,
    jitterSeed: 1.4,
  },
  {
    icon: <CalendarIcon size={28} color={colors.error} />,
    title: "Appointment",
    subtitle: "Not confirmed",
    color: colors.error,
    top: 580,
    left: 90,
    width: 470,
    rotate: 3,
    jitterSeed: 2.6,
  },
  {
    icon: <FormIcon size={28} color={colors.warning} />,
    title: "Invoice #4471",
    subtitle: "Overdue",
    color: colors.warning,
    top: 860,
    left: 540,
    width: 480,
    rotate: -5,
    jitterSeed: 3.8,
  },
  {
    icon: <InboxIcon size={28} color={colors.error} />,
    title: "New lead",
    subtitle: "No follow-up",
    color: colors.error,
    top: 1140,
    left: 60,
    width: 470,
    rotate: 6,
    jitterSeed: 5.1,
  },
  {
    icon: <ChatBubbleIcon size={28} color={colors.warning} />,
    title: "Voicemail",
    subtitle: "Not heard",
    color: colors.warning,
    top: 1420,
    left: 520,
    width: 480,
    rotate: -4,
    jitterSeed: 6.3,
  },
];

const crossfade = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

/**
 * HOOK-03 — "Chaos-to-Calm Split Screen" (revised execution)
 *
 * Built entirely in Remotion as a deterministic before/after wipe — no
 * Higgsfield footage. The left side (revealed progressively) is a single
 * clean, organized card; the right side is a scattered stack of unresolved
 * notifications. A glowing vertical divider sweeps left-to-right, turning
 * chaos into calm — an elegant, structured transformation rather than a
 * glitch effect.
 */
export const HOOK03: FC = () => {
  const frame = useCurrentFrame();

  const lineX = interpolate(frame, [WIPE_START, WIPE_END], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const dividerOpacity =
    crossfade(frame, WIPE_START - 10, WIPE_START) *
    (1 - crossfade(frame, WIPE_END, WIPE_END + 15));

  const wordmarkOpacity = crossfade(frame, WIPE_END + 10, WIPE_END + 30);

  return (
    <AbsoluteFill style={{ backgroundColor: colors.ink950 }}>
      <Audio src={staticFile("audio/hooks/hook03-music.m4a")} volume={0.85} />
      <Audio src={staticFile("audio/hooks/hook03-sfx.mp3")} volume={1} />

      <GradientBackground />

      {/* Calm layer: revealed on the left as the wipe progresses */}
      <AbsoluteFill
        style={{
          clipPath: `inset(0 ${100 - lineX}% 0 0)`,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CalmCard />
      </AbsoluteFill>

      {/* Chaos layer: visible on the right, shrinks as the wipe progresses */}
      <AbsoluteFill style={{ clipPath: `inset(0 0 0 ${lineX}%)` }}>
        {CHAOS_ITEMS.map((item, i) => (
          <ChaosCard key={i} item={item} />
        ))}
      </AbsoluteFill>

      {/* Glowing divider */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: `${lineX}%`,
          width: 6,
          background: colors.accent400,
          boxShadow: `0 0 60px 10px ${colors.accent400}`,
          opacity: dividerOpacity,
        }}
      />

      {/* Brand mark, settles once the calm state is fully revealed */}
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "flex-end",
          paddingBottom: 140,
          opacity: wordmarkOpacity,
        }}
      >
        <div
          style={{
            fontFamily: sansFont,
            fontWeight: 700,
            fontSize: 30,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: colors.ink200,
          }}
        >
          Valfin
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
