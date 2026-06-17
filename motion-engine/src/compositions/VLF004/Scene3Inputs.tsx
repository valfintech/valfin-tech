import type { FC } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Caption } from "../../components/Caption";
import { GradientBackground } from "../../components/GradientBackground";
import { CalculatorCard, CardHeader, InputRow } from "./components";

/**
 * Scene 3 — Two inputs (0:11–0:18)
 * "You put in two things: how many leads you get in a month, and what an
 * average job is worth to you." Both values count up as they "type in".
 */
export const Scene3Inputs: FC = () => {
  const frame = useCurrentFrame();

  const row1Opacity = interpolate(frame, [0, 10], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const row2Opacity = interpolate(frame, [35, 45], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const leadsValue = Math.round(
    interpolate(frame, [8, 32], [0, 40], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );
  const jobValue = Math.round(
    interpolate(frame, [40, 68], [0, 450], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  );

  return (
    <AbsoluteFill>
      <GradientBackground />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <CalculatorCard>
          <CardHeader title="Revenue Recovery Calculator" />
          <InputRow label="Leads per month" value={`${leadsValue}`} opacity={row1Opacity} />
          <InputRow label="Average job value" value={`$${jobValue}`} opacity={row2Opacity} />
        </CalculatorCard>
      </AbsoluteFill>
      <Caption
        text="You put in two things: how many leads you get a month, and what an average job is worth."
        delay={75}
      />
    </AbsoluteFill>
  );
};
