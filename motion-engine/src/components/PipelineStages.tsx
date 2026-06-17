import type { FC } from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { colors } from "../config/colors";
import { sansFont } from "../config/fonts";

type Props = {
  stages: string[];
  /** Frame (relative to the scene) the first stage starts lighting up. */
  startFrame?: number;
  /** Frames between each stage activating. */
  stepDuration?: number;
};

/**
 * Vertical pipeline of stages that light up sequentially — used to show
 * the "fixed" capture → respond → follow up → book flow.
 */
export const PipelineStages: FC<Props> = ({ stages, startFrame = 0, stepDuration = 24 }) => {
  const frame = useCurrentFrame();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
      {stages.map((label, i) => {
        const activation = startFrame + i * stepDuration;
        const progress = interpolate(frame, [activation, activation + stepDuration], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        const dotColor = progress > 0.5 ? colors.success : colors.ink700;
        const textColor = progress > 0 ? colors.ink50 : colors.ink400;
        const connectorColor = progress > 0.5 ? colors.success : colors.ink700;

        return (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 28 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  background: dotColor,
                  transform: `scale(${0.7 + progress * 0.3})`,
                  flexShrink: 0,
                }}
              />
              {i < stages.length - 1 && (
                <div
                  style={{
                    width: 4,
                    height: 36,
                    background: connectorColor,
                    marginTop: 4,
                    marginBottom: 4,
                  }}
                />
              )}
            </div>
            <div
              style={{
                fontFamily: sansFont,
                fontSize: 40,
                fontWeight: 600,
                color: textColor,
                transform: `translateX(${(1 - progress) * 24}px)`,
                opacity: interpolate(progress, [0, 0.3], [0.3, 1], {
                  extrapolateLeft: "clamp",
                  extrapolateRight: "clamp",
                }),
              }}
            >
              {label}
            </div>
          </div>
        );
      })}
    </div>
  );
};
