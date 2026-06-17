import type { FC } from "react";
import { AbsoluteFill } from "remotion";
import { Caption } from "../../components/Caption";
import { GradientBackground } from "../../components/GradientBackground";
import { PipelineStages } from "../../components/PipelineStages";
import { RevenueCounter } from "../../components/RevenueCounter";

const STAGES = ["Capture", "Respond", "Follow up", "Book"];

/**
 * Scene 5 — Recovery (0:22–0:28)
 * "Speed is fixable." The pipeline runs clean end-to-end, then an
 * illustrative recovered-revenue counter ties it to the dollar impact.
 */
export const Scene5Recovery: FC = () => {
  return (
    <AbsoluteFill>
      <GradientBackground />
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          gap: 96,
        }}
      >
        <PipelineStages stages={STAGES} startFrame={10} stepDuration={22} />
        <RevenueCounter
          from={0}
          to={4250}
          startFrame={104}
          durationInFrames={50}
          label="example: revenue recovered per month"
        />
      </AbsoluteFill>
      <Caption text="Speed is fixable." delay={20} />
    </AbsoluteFill>
  );
};
