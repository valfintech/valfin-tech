import type { FC } from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { SceneFade } from "../../components/SceneFade";
import { colors } from "../../config/colors";
import { SCENE_DURATIONS, TOTAL_DURATION } from "./constants";
import { Scene1Hook } from "./Scene1Hook";
import { Scene2Calculator } from "./Scene2Calculator";
import { Scene3Inputs } from "./Scene3Inputs";
import { Scene4Result } from "./Scene4Result";
import { Scene5EndCard } from "./Scene5EndCard";

const SCENES = [
  { duration: SCENE_DURATIONS.hook, Component: Scene1Hook },
  { duration: SCENE_DURATIONS.calculator, Component: Scene2Calculator },
  { duration: SCENE_DURATIONS.inputs, Component: Scene3Inputs },
  { duration: SCENE_DURATIONS.result, Component: Scene4Result },
  { duration: SCENE_DURATIONS.endCard, Component: Scene5EndCard },
];

// Denser sound-design pass for the re-cut (Revision Round 1): a riser into
// the hook's glitch-to-"?" moment, a notification on the headline landing,
// whooshes on every scene transition, and confirm/notification dings on each
// input and reveal beat — roughly one hit every ~1.5-2s.
const SFX = [
  { src: "audio/sfx-whoosh.mp3", from: 0, duration: 31, volume: 0.4 },
  { src: "audio/sfx-riser.mp3", from: 18, duration: 60, volume: 0.35 },
  { src: "audio/sfx-notification.mp3", from: 34, duration: 31, volume: 0.45 },
  { src: "audio/sfx-whoosh.mp3", from: 100, duration: 31, volume: 0.4 },
  { src: "audio/sfx-confirm.mp3", from: 119, duration: 31, volume: 0.45 },
  { src: "audio/sfx-whoosh.mp3", from: 190, duration: 31, volume: 0.4 },
  { src: "audio/sfx-notification.mp3", from: 198, duration: 31, volume: 0.4 },
  { src: "audio/sfx-notification.mp3", from: 230, duration: 31, volume: 0.4 },
  { src: "audio/sfx-whoosh.mp3", from: 340, duration: 31, volume: 0.4 },
  { src: "audio/sfx-confirm.mp3", from: 382, duration: 31, volume: 0.5 },
  { src: "audio/sfx-whoosh.mp3", from: 490, duration: 31, volume: 0.4 },
  { src: "audio/sfx-confirm.mp3", from: 516, duration: 31, volume: 0.45 },
];

/**
 * VLF-004 — "See Your Number"
 * Motion-graphics conversion Reel: a Revenue Recovery Calculator UI mockup
 * — two inputs feeding a clearly-labeled example result — ending on the
 * "no pitch, just your number" CTA. Light, friendly instrumental bed plus
 * UI sound-design accents — no voiceover/narration.
 */
export const VLF004: FC = () => {
  let from = 0;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.ink950 }}>
      <Audio
        src={staticFile("audio/vlf004-music-bed.m4a")}
        volume={(f) =>
          interpolate(
            f,
            [0, 20, TOTAL_DURATION - 25, TOTAL_DURATION],
            [0, 0.4, 0.4, 0],
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
