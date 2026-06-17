import type { FC } from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { SceneFade } from "../../components/SceneFade";
import { colors } from "../../config/colors";
import { SCENE_DURATIONS, TOTAL_DURATION } from "./constants";
import { Scene1Hook } from "./Scene1Hook";
import { Scene2LeadDrop } from "./Scene2LeadDrop";
import { Scene3PhoneUI } from "./Scene3PhoneUI";
import { Scene4Comparison } from "./Scene4Comparison";
import { Scene5Recovery } from "./Scene5Recovery";
import { Scene6EndCard } from "./Scene6EndCard";
import { SceneTurningPoint } from "./SceneTurningPoint";

const SCENES = [
  { duration: SCENE_DURATIONS.hook, Component: Scene1Hook },
  { duration: SCENE_DURATIONS.leadDrop, Component: Scene2LeadDrop },
  { duration: SCENE_DURATIONS.phoneUI, Component: Scene3PhoneUI },
  { duration: SCENE_DURATIONS.turningPoint, Component: SceneTurningPoint },
  { duration: SCENE_DURATIONS.comparison, Component: Scene4Comparison },
  { duration: SCENE_DURATIONS.recovery, Component: Scene5Recovery },
  { duration: SCENE_DURATIONS.endCard, Component: Scene6EndCard },
];

// One-shot sound-design accents layered over the music bed: a riser building
// into the hook's pattern-interrupt cut, whooshes on the bigger scene
// transitions, and notification/confirm dings synced to the on-screen UI
// beats (missed-call stack, "Appointment booked" card, CTA reveal).
const SFX = [
  { src: "audio/sfx-riser.mp3", from: 0, duration: 60, volume: 0.5 },
  { src: "audio/sfx-whoosh.mp3", from: 33, duration: 30, volume: 0.55 },
  { src: "audio/sfx-notification.mp3", from: 208, duration: 31, volume: 0.35 },
  { src: "audio/sfx-notification.mp3", from: 300, duration: 31, volume: 0.5 },
  { src: "audio/sfx-notification.mp3", from: 365, duration: 31, volume: 0.5 },
  { src: "audio/sfx-notification.mp3", from: 430, duration: 31, volume: 0.5 },
  { src: "audio/sfx-whoosh.mp3", from: 510, duration: 30, volume: 0.55 },
  { src: "audio/sfx-confirm.mp3", from: 518, duration: 31, volume: 0.6 },
  { src: "audio/sfx-whoosh.mp3", from: 570, duration: 30, volume: 0.5 },
  { src: "audio/sfx-confirm.mp3", from: 616, duration: 31, volume: 0.5 },
  { src: "audio/sfx-whoosh.mp3", from: 818, duration: 30, volume: 0.4 },
  { src: "audio/sfx-confirm.mp3", from: 870, duration: 31, volume: 0.55 },
  { src: "audio/sfx-whoosh.mp3", from: 900, duration: 30, volume: 0.55 },
  { src: "audio/sfx-confirm.mp3", from: 916, duration: 31, volume: 0.6 },
];

/**
 * VLF-001 — "They just call back faster"
 * Motion-graphics Reel: kinetic typography, phone UI, lead pipeline,
 * response-time comparison, and a recovery counter, ending on the
 * Lead Leak Calculator CTA. Scored with a premium instrumental bed plus
 * UI sound-design accents — no voiceover/narration.
 */
export const VLF001: FC = () => {
  let from = 0;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.ink950 }}>
      <Audio
        src={staticFile("audio/music-bed.m4a")}
        volume={(f) =>
          interpolate(
            f,
            [0, 20, TOTAL_DURATION - 25, TOTAL_DURATION],
            [0, 0.45, 0.45, 0],
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
