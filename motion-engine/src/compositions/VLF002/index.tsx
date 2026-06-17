import type { FC } from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import { SceneFade } from "../../components/SceneFade";
import { colors } from "../../config/colors";
import { SCENE_DURATIONS, TOTAL_DURATION } from "./constants";
import { Scene1Hook } from "./Scene1Hook";
import { Scene2Quiet } from "./Scene2Quiet";
import { Scene3Voicemail } from "./Scene3Voicemail";
import { Scene4NextBusiness } from "./Scene4NextBusiness";
import { Scene5EmptyCRM } from "./Scene5EmptyCRM";
import { Scene6EndCard } from "./Scene6EndCard";

const SCENES = [
  { duration: SCENE_DURATIONS.hook, Component: Scene1Hook },
  { duration: SCENE_DURATIONS.quiet, Component: Scene2Quiet },
  { duration: SCENE_DURATIONS.voicemail, Component: Scene3Voicemail },
  { duration: SCENE_DURATIONS.nextBusiness, Component: Scene4NextBusiness },
  { duration: SCENE_DURATIONS.emptyCRM, Component: Scene5EmptyCRM },
  { duration: SCENE_DURATIONS.endCard, Component: Scene6EndCard },
];

// One-shot sound-design accents layered over the music bed: a notification
// chime on the incoming call, a soft voicemail tone on the missed-call
// card, whooshes on each scene transition, and a confirm chime when the
// next business picks up.
const SFX = [
  { src: "audio/vlf002-sfx-notification.mp3", from: 0, duration: 31, volume: 0.45 },
  { src: "audio/vlf002-sfx-whoosh.mp3", from: 145, duration: 31, volume: 0.4 },
  { src: "audio/vlf002-sfx-voicemail.mp3", from: 300, duration: 31, volume: 0.45 },
  { src: "audio/vlf002-sfx-whoosh.mp3", from: 445, duration: 31, volume: 0.4 },
  { src: "audio/vlf002-sfx-confirm.mp3", from: 488, duration: 31, volume: 0.5 },
  { src: "audio/vlf002-sfx-whoosh.mp3", from: 595, duration: 31, volume: 0.4 },
  { src: "audio/vlf002-sfx-whoosh.mp3", from: 775, duration: 31, volume: 0.45 },
];

/**
 * VLF-002 — "The 7:42 PM Call"
 * Motion-graphics Reel: a quiet phone-at-night hook, a calm after-hours
 * beat, a missed-call/voicemail card, the lead going to the next business,
 * and an empty-CRM beat, ending on a follow CTA. Scored with a sparse,
 * reflective instrumental bed plus UI sound-design accents — no
 * voiceover/narration.
 */
export const VLF002: FC = () => {
  let from = 0;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.ink950 }}>
      <Audio
        src={staticFile("audio/vlf002-music-bed.m4a")}
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
