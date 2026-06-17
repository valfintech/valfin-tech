import type { FC } from "react";
import { Composition } from "remotion";
import { compositions } from "./compositions";

export const RemotionRoot: FC = () => {
  return (
    <>
      {compositions.map(
        ({ id, component, durationInFrames, fps, width, height, defaultProps }) => (
          <Composition
            key={id}
            id={id}
            component={component}
            durationInFrames={durationInFrames}
            fps={fps}
            width={width}
            height={height}
            defaultProps={defaultProps}
          />
        ),
      )}
    </>
  );
};
