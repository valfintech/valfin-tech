"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * The signature visual of the homepage: a single animated sequence showing
 * what happens to a lead with Valfin running, versus what normally happens
 * without it.
 *
 * A pulse travels left to right through five stages — Lead comes in →
 * Valfin intercepts → Owner notified → Appointment booked → Revenue
 * recovered — lighting up each node as it arrives. A second, dimmer pulse
 * branches off the first node toward a "The normal outcome" dead end,
 * fading to nothing — the contrast is the entire pitch in one glance.
 *
 * Renders a horizontal SVG timeline on larger screens and a simpler
 * vertical step list on small screens. Fully static under
 * prefers-reduced-motion.
 */

const STAGES = [
  { label: "A lead comes in", detail: "Call, text, or form, any hour" },
  { label: "Valfin intercepts", detail: "Answered in seconds, not hours" },
  { label: "Owner notified", detail: "You see it happen, live" },
  { label: "Appointment booked", detail: "Placed straight on the calendar" },
  { label: "Revenue recovered", detail: "A job that would've been lost" },
];

const GHOST = { label: "The normal outcome", detail: "No follow-up. The opportunity just goes away." };

// Desktop SVG layout
const VIEW_W = 1200;
const VIEW_H = 320;
const NODE_Y = 190;
const NODE_X = [120, 360, 600, 840, 1080];
const GHOST_X = 280;
const GHOST_Y = 70;

const CYCLE = 5.5; // seconds, full loop including pause
const TRAVEL = 4; // seconds for the main pulse to cross all nodes

export function LeadJourneyDiagram({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      className={className}
      role="img"
      aria-label="Diagram: a lead comes in, Valfin intercepts it, the owner is notified, an appointment gets booked, and revenue is recovered. Versus normally going quiet with no follow-up."
    >
      {/* Desktop / tablet: animated horizontal timeline */}
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        className={compact ? "hidden" : "hidden w-full sm:block"}
        aria-hidden="true"
      >
        {/* Main connector line */}
        <line
          x1={NODE_X[0]}
          y1={NODE_Y}
          x2={NODE_X[NODE_X.length - 1]}
          y2={NODE_Y}
          stroke="var(--ink-700)"
          strokeWidth="1.5"
          strokeDasharray="4 6"
        />

        {/* Ghost branch connector */}
        <line
          x1={NODE_X[0]}
          y1={NODE_Y}
          x2={GHOST_X}
          y2={GHOST_Y}
          stroke="var(--ink-700)"
          strokeWidth="1.5"
          strokeDasharray="3 5"
          opacity="0.6"
        />

        {/* Ghost end node */}
        <circle cx={GHOST_X} cy={GHOST_Y} r="7" fill="var(--ink-800)" stroke="var(--ink-600)" strokeWidth="1.5" />
        <text
          x={GHOST_X}
          y={GHOST_Y - 18}
          textAnchor="middle"
          fill="var(--ink-400)"
          fontSize="14"
          fontFamily="var(--font-sans)"
        >
          {GHOST.label}
        </text>
        <text
          x={GHOST_X}
          y={GHOST_Y - 1}
          textAnchor="middle"
          fill="var(--ink-600)"
          fontSize="11"
          fontFamily="var(--font-sans)"
        >
          {GHOST.detail}
        </text>

        {/* Main stage nodes + labels */}
        {STAGES.map((stage, i) => {
          const x = NODE_X[i];
          const isFirst = i === 0;
          const isLast = i === STAGES.length - 1;
          const fill = isLast ? "var(--success)" : isFirst ? "var(--ink-600)" : "var(--accent-500)";
          return (
            <g key={stage.label}>
              <circle
                cx={x}
                cy={NODE_Y}
                r={isFirst ? 8 : 11}
                fill={isFirst ? "var(--ink-700)" : "var(--ink-900)"}
                stroke={fill}
                strokeWidth="1.5"
              />
              {!isFirst && <circle cx={x} cy={NODE_Y} r="4" fill={fill} />}
              <text
                x={x}
                y={NODE_Y + 38}
                textAnchor="middle"
                fill="var(--ink-50)"
                fontSize="15"
                fontWeight="600"
                fontFamily="var(--font-sans)"
              >
                {stage.label}
              </text>
              <text
                x={x}
                y={NODE_Y + 58}
                textAnchor="middle"
                fill="var(--ink-400)"
                fontSize="12"
                fontFamily="var(--font-sans)"
              >
                {stage.detail}
              </text>
            </g>
          );
        })}

        {!shouldReduceMotion ? (
          <>
            {/* Main traveling pulse */}
            <motion.circle
              r="5"
              fill="var(--ink-50)"
              cy={NODE_Y}
              initial={{ cx: NODE_X[0], opacity: 0 }}
              animate={{
                cx: [NODE_X[0], ...NODE_X.slice(1), NODE_X[NODE_X.length - 1]],
                opacity: [0, 1, 1, 1, 1, 0],
              }}
              transition={{
                duration: TRAVEL,
                ease: "easeInOut",
                repeat: Infinity,
                repeatDelay: CYCLE - TRAVEL,
              }}
            />

            {/* Ring flash on each non-first node as the pulse arrives */}
            {STAGES.map((stage, i) => {
              if (i === 0) return null;
              const x = NODE_X[i];
              const arrival = (i / (STAGES.length - 1)) * TRAVEL;
              const isLast = i === STAGES.length - 1;
              return (
                <motion.circle
                  key={`ring-${stage.label}`}
                  cx={x}
                  cy={NODE_Y}
                  r="11"
                  fill="transparent"
                  stroke={isLast ? "var(--success)" : "var(--accent-400)"}
                  strokeWidth="2"
                  initial={{ opacity: 0, scale: 1 }}
                  animate={{ opacity: [0, 0.9, 0], scale: [1, 1.9, 2.4] }}
                  transition={{
                    duration: 0.7,
                    ease: "easeOut",
                    repeat: Infinity,
                    repeatDelay: CYCLE - 0.7,
                    delay: arrival,
                  }}
                  style={{ transformOrigin: `${x}px ${NODE_Y}px` }}
                />
              );
            })}

            {/* Ambient glow on the final "Revenue recovered" node */}
            <motion.circle
              cx={NODE_X[NODE_X.length - 1]}
              cy={NODE_Y}
              r="26"
              fill="var(--success)"
              initial={{ opacity: 0.06 }}
              animate={{ opacity: [0.06, 0.16, 0.06] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              style={{ filter: "blur(16px)" }}
            />

            {/* Ghost pulse — fades out before reaching the dead end */}
            <motion.circle
              r="4"
              fill="var(--ink-400)"
              initial={{ cx: NODE_X[0], cy: NODE_Y, opacity: 0 }}
              animate={{
                cx: [NODE_X[0], GHOST_X],
                cy: [NODE_Y, GHOST_Y],
                opacity: [0, 0.7, 0],
              }}
              transition={{
                duration: 1.1,
                ease: "easeOut",
                repeat: Infinity,
                repeatDelay: CYCLE - 1.1,
              }}
            />
          </>
        ) : (
          // Static end-state for reduced motion: every main node lit, final node glowing
          <circle cx={NODE_X[NODE_X.length - 1]} cy={NODE_Y} r="22" fill="var(--success)" opacity="0.14" />
        )}
      </svg>

      {/* Mobile: simple vertical step list */}
      {!compact && (
        <div className="flex flex-col gap-0 sm:hidden">
          {STAGES.map((stage, i) => {
            const isFirst = i === 0;
            const isLast = i === STAGES.length - 1;
            return (
              <div key={stage.label} className="relative flex gap-4 pb-6 last:pb-0">
                {!isLast && (
                  <span
                    aria-hidden="true"
                    className="absolute left-[7px] top-5 h-[calc(100%-0.5rem)] w-px bg-[repeating-linear-gradient(to_bottom,var(--ink-700)_0,var(--ink-700)_4px,transparent_4px,transparent_10px)]"
                  />
                )}
                <span
                  aria-hidden="true"
                  className="relative z-10 mt-1.5 size-3.5 flex-shrink-0 rounded-full border"
                  style={{
                    borderColor: isLast ? "var(--success)" : isFirst ? "var(--ink-600)" : "var(--accent-500)",
                    backgroundColor: isFirst ? "var(--ink-700)" : "var(--ink-900)",
                  }}
                />
                <div>
                  <p className="text-sm font-semibold text-ink-50">{stage.label}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-ink-400">{stage.detail}</p>
                </div>
              </div>
            );
          })}

          {/* Ghost branch, de-emphasized */}
          <div className="mt-2 flex items-start gap-2 rounded-lg border border-dashed border-ink-700 px-3 py-2.5 opacity-70">
            <span aria-hidden="true" className="mt-1 size-2 flex-shrink-0 rounded-full border border-ink-600 bg-ink-800" />
            <div>
              <p className="text-xs font-semibold text-ink-400">{GHOST.label}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-ink-600">{GHOST.detail}</p>
            </div>
          </div>
        </div>
      )}

      {/* Compact: animated vertical step list, used in the hero side card at every breakpoint */}
      {compact && (
        <div className="flex flex-col gap-0">
          {STAGES.map((stage, i) => {
            const isFirst = i === 0;
            const isLast = i === STAGES.length - 1;
            const arrival = (i / (STAGES.length - 1)) * TRAVEL;
            const ringColor = isLast ? "var(--success)" : "var(--accent-400)";
            return (
              <div key={stage.label} className="relative flex gap-4 pb-6 last:pb-0">
                {!isLast && (
                  <span
                    aria-hidden="true"
                    className="absolute left-[7px] top-5 h-[calc(100%-0.5rem)] w-px bg-[repeating-linear-gradient(to_bottom,var(--ink-700)_0,var(--ink-700)_4px,transparent_4px,transparent_10px)]"
                  />
                )}
                <span className="relative mt-1.5 flex-shrink-0">
                  <span
                    aria-hidden="true"
                    className="relative z-10 block size-3.5 rounded-full border"
                    style={{
                      borderColor: isLast ? "var(--success)" : isFirst ? "var(--ink-600)" : "var(--accent-500)",
                      backgroundColor: isFirst ? "var(--ink-700)" : "var(--ink-900)",
                    }}
                  />
                  {!shouldReduceMotion && !isFirst && (
                    <motion.span
                      aria-hidden="true"
                      className="absolute inset-0 -m-1.5 rounded-full border-2"
                      style={{ borderColor: ringColor }}
                      initial={{ opacity: 0, scale: 1 }}
                      animate={{ opacity: [0, 0.9, 0], scale: [1, 1.8, 2.2] }}
                      transition={{
                        duration: 0.7,
                        ease: "easeOut",
                        repeat: Infinity,
                        repeatDelay: CYCLE - 0.7,
                        delay: arrival,
                      }}
                    />
                  )}
                </span>
                <div>
                  <p className="text-sm font-semibold text-ink-50">{stage.label}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-ink-400">{stage.detail}</p>
                </div>
              </div>
            );
          })}

          {/* Ghost branch, de-emphasized */}
          <div className="mt-2 flex items-start gap-2 rounded-lg border border-dashed border-ink-700 px-3 py-2.5 opacity-70">
            <span aria-hidden="true" className="mt-1 size-2 flex-shrink-0 rounded-full border border-ink-600 bg-ink-800" />
            <div>
              <p className="text-xs font-semibold text-ink-400">{GHOST.label}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-ink-600">{GHOST.detail}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
