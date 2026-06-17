import type { FC } from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { Caption } from "../../components/Caption";
import { GradientBackground } from "../../components/GradientBackground";
import { PhoneFrame } from "../../components/PhoneFrame";
import { colors } from "../../config/colors";
import { headingFont, sansFont } from "../../config/fonts";

// Minutes from midnight, formatted as "H:MM AM/PM".
const formatClock = (totalMinutes: number) => {
  const mins = Math.floor(totalMinutes) % (24 * 60);
  const hour24 = Math.floor(mins / 60);
  const minute = mins % 60;
  const period = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${hour12}:${minute.toString().padStart(2, "0")} ${period}`;
};

const NOTIFICATIONS = [
  { time: "2:14 PM", arriveAt: 30 },
  { time: "4:08 PM", arriveAt: 95 },
  { time: "6:42 PM", arriveAt: 160 },
];

/**
 * Scene 3 — Phone UI / missed calls (0:09–0:17)
 * "You meant to call back." A phone collects missed-call notifications
 * while the clock ticks forward through the afternoon.
 */
export const Scene3PhoneUI: FC = () => {
  const frame = useCurrentFrame();

  const phoneScale = interpolate(frame, [0, 18], [0.92, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const phoneOpacity = interpolate(frame, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 1:58 PM -> 6:42 PM, expressed as minutes from midnight (13*60+58 -> 18*60+42).
  const clockMinutes = interpolate(frame, [0, 220], [838, 1122], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const missedCount = NOTIFICATIONS.filter((n) => frame >= n.arriveAt).length;

  // Buzz wobble: a short decaying shake right when a notification lands.
  let buzz = 0;
  for (const n of NOTIFICATIONS) {
    const t = frame - n.arriveAt;
    if (t >= 0 && t < 10) {
      buzz += Math.sin(t * 3) * (1 - t / 10) * 2.5;
    }
  }

  return (
    <AbsoluteFill>
      <GradientBackground />
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        <div
          style={{
            transform: `scale(${phoneScale}) rotate(${buzz}deg)`,
            opacity: phoneOpacity,
          }}
        >
          <PhoneFrame>
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
              {/* Status bar */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontFamily: sansFont,
                  fontSize: 26,
                  fontWeight: 600,
                  color: colors.ink50,
                }}
              >
                <span>{formatClock(clockMinutes)}</span>
                <span
                  style={{
                    fontSize: 22,
                    color: colors.error,
                    fontWeight: 700,
                  }}
                >
                  {missedCount > 0 ? `${missedCount} missed` : ""}
                </span>
              </div>

              {/* Notification stack */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                  marginTop: 48,
                }}
              >
                {NOTIFICATIONS.map((notification, i) => {
                  const enter = interpolate(
                    frame,
                    [notification.arriveAt, notification.arriveAt + 14],
                    [0, 1],
                    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
                  );
                  const translateY = interpolate(enter, [0, 1], [-40, 0]);

                  return (
                    <div
                      key={i}
                      style={{
                        opacity: enter,
                        transform: `translateY(${translateY}px)`,
                        background: colors.ink800,
                        border: `1px solid ${colors.ink700}`,
                        borderRadius: 18,
                        padding: "20px 24px",
                        display: "flex",
                        alignItems: "center",
                        gap: 16,
                      }}
                    >
                      <div
                        style={{
                          width: 14,
                          height: 14,
                          borderRadius: "50%",
                          background: colors.error,
                          flexShrink: 0,
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontFamily: sansFont,
                            fontWeight: 700,
                            fontSize: 28,
                            color: colors.ink50,
                          }}
                        >
                          Missed call
                        </div>
                        <div
                          style={{
                            fontFamily: sansFont,
                            fontSize: 22,
                            color: colors.ink200,
                            marginTop: 2,
                          }}
                        >
                          Unknown number
                        </div>
                      </div>
                      <div
                        style={{
                          fontFamily: headingFont,
                          fontSize: 24,
                          color: colors.ink400,
                        }}
                      >
                        {notification.time}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </PhoneFrame>
        </div>
      </AbsoluteFill>
      <Caption text="You meant to call back." delay={25} />
    </AbsoluteFill>
  );
};
