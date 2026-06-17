import type { FC } from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { SceneFade } from "../../components/SceneFade";
import { colors } from "../../config/colors";
import { SCENE_DURATIONS, TOTAL_DURATION } from "./constants";
import { Scene1Hook } from "./Scene1Hook";
import { Scene2Caught } from "./Scene2Caught";
import { Scene3Replied } from "./Scene3Replied";
import { Scene4FollowUp } from "./Scene4FollowUp";
import { Scene5Booked } from "./Scene5Booked";
import { Scene6EndCard } from "./Scene6EndCard";

const SCENES = [
  { duration: SCENE_DURATIONS.hook, Component: Scene1Hook },
  { duration: SCENE_DURATIONS.caught, Component: Scene2Caught },
  { duration: SCENE_DURATIONS.replied, Component: Scene3Replied },
  { duration: SCENE_DURATIONS.followUp, Component: Scene4FollowUp },
  { duration: SCENE_DURATIONS.booked, Component: Scene5Booked },
  { duration: SCENE_DURATIONS.endCard, Component: Scene6EndCard },
];

// Denser sound-design pass for the re-cut (Revision Round 1): a notification
// hit on the incoming-inquiry card in the hook, a whoosh + landing accent on
// every scene transition, and confirm dings on each step's payoff beat —
// roughly one hit every ~1.5s to keep the motion feeling responsive.
const SFX = [
  { src: "audio/sfx-notification.mp3", from: 0, duration: 31, volume: 0.45 },
  { src: "audio/sfx-whoosh.mp3", from: 109, duration: 31, volume: 0.45 },
  { src: "audio/sfx-confirm.mp3", from: 121, duration: 31, volume: 0.4 },
  { src: "audio/sfx-whoosh.mp3", from: 224, duration: 31, volume: 0.45 },
  { src: "audio/sfx-confirm.mp3", from: 236, duration: 31, volume: 0.45 },
  { src: "audio/sfx-whoosh.mp3", from: 329, duration: 31, volume: 0.45 },
  { src: "audio/sfx-notification.mp3", from: 341, duration: 31, volume: 0.4 },
  { src: "audio/sfx-whoosh.mp3", from: 444, duration: 31, volume: 0.45 },
  { src: "audio/sfx-confirm.mp3", from: 456, duration: 31, volume: 0.5 },
  { src: "audio/sfx-confirm.mp3", from: 480, duration: 31, volume: 0.45 },
  { src: "audio/sfx-whoosh.mp3", from: 564, duration: 31, volume: 0.45 },
  { src: "audio/sfx-confirm.mp3", from: 592, duration: 31, volume: 0.5 },
];

/**
 * VLF-003 — "The 30 Seconds After Someone Calls"
 * Motion-graphics explainer Reel: a pulsing incoming-inquiry hook leads
 * straight into four numbered steps (Caught, Replied, Followed up, Booked)
 * on a clean kinetic-typography pipeline, ending on the "see how it works"
 * CTA. Re-cut for Revision Round 1 — tighter scenes, earlier visual pattern
 * interrupt, and a punchier energetic music bed plus denser SFX. No
 * voiceover/narration.
 */
export const VLF003: FC = () => {
  let from = 0;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.ink950 }}>
      <Audio
        src={staticFile("audio/vlf003-music-bed.m4a")}
        volume={(f) =>
          interpolate(
            f,
            [0, 14, TOTAL_DURATION - 20, TOTAL_DURATION],
            [0, 0.42, 0.42, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          )
        }
      />
      {SFX.map(({ src, from: sfxFrom, duration, volume }, i) => (
        <Sequence key={`sfx-${i}`} from={sfxFrom} durationInFrames={duration} layout="none">
          <Audio src={staticFile(src)} volume={volume} />
        </Sequence>
      ))}
      {SCENES.map(({ duration, Component }, i) => {
        const sequenceFrom = from;
        from += duration;

        return (
          <Sequence key={i} from={sequenceFrom} durationInFrames={duration} layout="none">
            <SceneFade durationInFrames={duration}>
              <Component />
            </SceneFade>
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
