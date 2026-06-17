import type { FC } from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { SceneFade } from "../../components/SceneFade";
import { colors } from "../../config/colors";
import { SCENE_DURATIONS, TOTAL_DURATION } from "./constants";
import { Scene1Hook } from "./Scene1Hook";
import { Scene2CallsDontStop } from "./Scene2CallsDontStop";
import { Scene3TheLeak } from "./Scene3TheLeak";
import { Scene4BusyDays } from "./Scene4BusyDays";
import { Scene5Employee } from "./Scene5Employee";
import { Scene6EndCard } from "./Scene6EndCard";

const SCENES = [
  { duration: SCENE_DURATIONS.hook, Component: Scene1Hook },
  { duration: SCENE_DURATIONS.callsDontStop, Component: Scene2CallsDontStop },
  { duration: SCENE_DURATIONS.theLeak, Component: Scene3TheLeak },
  { duration: SCENE_DURATIONS.busyDays, Component: Scene4BusyDays },
  { duration: SCENE_DURATIONS.employee, Component: Scene5Employee },
  { duration: SCENE_DURATIONS.endCard, Component: Scene6EndCard },
];

// One-shot sound-design accents layered over the music bed: a whoosh into
// each new beat, notification dings as missed calls stack up, and a
// confirm ding on the CTA reveal. The quiet "employee" beat (705-870) gets
// no SFX — the music duck there carries the tonal shift on its own.
const SFX = [
  { src: "audio/sfx-whoosh.mp3", from: 175, duration: 31, volume: 0.4 },
  { src: "audio/sfx-notification.mp3", from: 210, duration: 31, volume: 0.35 },
  { src: "audio/sfx-notification.mp3", from: 250, duration: 31, volume: 0.35 },
  { src: "audio/sfx-whoosh.mp3", from: 340, duration: 31, volume: 0.4 },
  { src: "audio/sfx-notification.mp3", from: 365, duration: 31, volume: 0.35 },
  { src: "audio/sfx-notification.mp3", from: 410, duration: 31, volume: 0.35 },
  { src: "audio/sfx-notification.mp3", from: 455, duration: 31, volume: 0.35 },
  { src: "audio/sfx-whoosh.mp3", from: 535, duration: 31, volume: 0.4 },
  { src: "audio/sfx-notification.mp3", from: 600, duration: 31, volume: 0.3 },
  { src: "audio/sfx-whoosh.mp3", from: 865, duration: 31, volume: 0.4 },
  { src: "audio/sfx-confirm.mp3", from: 895, duration: 31, volume: 0.5 },
];

/**
 * VLF-005 — "The Vacation Test"
 * Motion-graphics Reel: a sunny beach-towel phone hook gives way to a
 * stack of missed-call losses, a busy-days-too dashboard beat, a quiet
 * "you're its employee" gut-check, and a warm CTA close. Scored with a
 * warm acoustic bed that ducks during the quiet beat — no
 * voiceover/narration.
 */
export const VLF005: FC = () => {
  let from = 0;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.ink950 }}>
      <Audio
        src={staticFile("audio/vlf005-music-bed.m4a")}
        volume={(f) =>
          interpolate(
            f,
            [0, 20, 540, 705, 870, TOTAL_DURATION - 25, TOTAL_DURATION],
            [0, 0.4, 0.4, 0.15, 0.15, 0.4, 0],
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
