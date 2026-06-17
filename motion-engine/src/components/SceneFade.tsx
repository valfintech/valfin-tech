import type { FC, ReactNode } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

const FADE_FRAMES = 8;

/**
 * Wraps a scene's content with a quick fade-in/out so cuts between scenes
 * feel smooth rather than abrupt. `useCurrentFrame()` is relative to the
 * enclosing `<Sequence>`, so this works per-scene without global timing.
 */
export const SceneFade: FC<{ durationInFrames: number; children: ReactNode }> = ({
  durationInFrames,
  children,
}) => {
  const frame = useCurrentFrame();

  const opacity = interpolate(
    frame,
    [0, FADE_FRAMES, durationInFrames - FADE_FRAMES, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return <AbsoluteFill style={{ opacity }}>{children}</AbsoluteFill>;
};
