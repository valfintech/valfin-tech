"use client";

import { useId, useMemo, useState, useEffect, useRef } from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { animate } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { Label } from "@/components/ui/label";
import {
  ASSUMED_LOST_LEAD_RATE,
  ASSUMED_RECOVERABLE_CONVERSION_RATE,
  estimateLeakage,
  formatCurrency,
} from "@/lib/calculator";
import { cn } from "@/lib/utils";

type Step = "leads" | "value" | "result";

const STEP_ORDER: Step[] = ["leads", "value", "result"];

const PRESET_LEADS = [10, 25, 50, 100];
const PRESET_VALUES = [500, 2500, 7500, 15000];

const STEP_LABELS = ["Your leads", "Your numbers", "Your result"];

/**
 * The Lead Leak Calculator — Valfin's primary conversion mechanism.
 *
 * A 60-second, low-friction self-diagnostic: the visitor enters two
 * numbers they already know (how many leads they get, what a customer
 * is worth) and sees, immediately, a personalized estimate of what slow
 * follow-up is likely costing them. No email gate up front — the goal is
 * to let them prove the problem to themselves first; "Talk to us" only
 * appears once they've seen their own number.
 */
export function LeadLeakCalculator() {
  const [step, setStep] = useState<Step>("leads");
  const [monthlyLeads, setMonthlyLeads] = useState<number | null>(null);
  const [avgCustomerValue, setAvgCustomerValue] = useState<number | null>(null);
  const leadsInputId = useId();
  const valueInputId = useId();

  const stepIndex = STEP_ORDER.indexOf(step);

  const result = useMemo(() => {
    if (monthlyLeads === null || avgCustomerValue === null) return null;
    return estimateLeakage({ monthlyLeads, avgCustomerValue });
  }, [monthlyLeads, avgCustomerValue]);

  function goTo(next: Step) {
    setStep(next);
  }

  function handleLeadsSubmit(value: number) {
    setMonthlyLeads(value);
    goTo("value");
  }

  function handleValueSubmit(value: number) {
    setAvgCustomerValue(value);
    goTo("result");
  }

  function reset() {
    setMonthlyLeads(null);
    setAvgCustomerValue(null);
    setStep("leads");
  }

  return (
    <div className="relative mx-auto w-full max-w-xl">
      {/* Ambient glow — marks this as the site's primary interactive moment */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-6 -inset-y-10 -z-10 rounded-[2.5rem] bg-[radial-gradient(ellipse_80%_70%_at_50%_0%,var(--navy-900)_0%,transparent_70%)] opacity-70 blur-2xl sm:-inset-x-12"
      />

      {/* Progress indicator */}
      <div className="mb-3 flex items-center gap-2 text-xs font-medium text-ink-400" aria-hidden="true">
        {STEP_LABELS.map((label, i) => (
          <span key={label} className={cn("flex-1 text-center", i <= stepIndex ? "text-accent-400" : "text-ink-600")}>
            {label}
          </span>
        ))}
      </div>
      <div className="mb-8 flex items-center gap-2" aria-hidden="true">
        {STEP_ORDER.map((s, i) => (
          <div
            key={s}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors duration-300",
              i <= stepIndex ? "bg-accent-500" : "bg-ink-700"
            )}
          />
        ))}
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-ink-700 bg-ink-900/60 p-8 shadow-[0_0_80px_-24px_rgba(37,99,235,0.3)] backdrop-blur-sm sm:p-10">
        {/*
          Defensive design note — this is the site's primary conversion
          mechanism, so the step transition is built to fail safe:

          1. Only the CURRENT step is ever rendered. There's no "exiting"
             panel kept around to animate out — when `step` changes, React
             unmounts the old panel outright on the very same render that
             mounts the new one. Progress is driven by state, full stop;
             no animation has to "finish" first, so nothing can block it.
          2. The crossfade-in is a native CSS `@keyframes` animation
             (`.calc-step-enter`, see globals.css), re-triggered each time
             by keying the panel on `step`. CSS animations run on the
             browser's own compositor — they always play through to their
             final, fully-visible state on their own, independent of any
             JS animation engine. A throttled background tab or an
             environment where requestAnimationFrame never ticks (we hit
             exactly this in automated testing) can't leave a panel stuck
             invisible or overlapping the next one.

          Net effect: worst case under a stalled animation engine is that
          the new step simply appears without its entrance flourish —
          never blocked, never overlapping, never a dead end.
        */}
        <div key={step} className="calc-step-enter">
          {step === "leads" && (
            <div>
              <StepQuestion
                eyebrow="Step 1 of 2"
                question="About how many new leads does your business get in a typical month?"
                helpText="A rough number is fine: calls, form submissions, messages, walk-ins, anything that could become a customer."
              />
              <NumberStepForm
                inputId={leadsInputId}
                label="Leads per month"
                placeholder="e.g. 40"
                presets={PRESET_LEADS}
                presetFormatter={(n) => `${n}/mo`}
                onSubmit={handleLeadsSubmit}
                submitLabel="Continue"
              />
            </div>
          )}

          {step === "value" && (
            <div>
              <StepQuestion
                eyebrow="Step 2 of 2"
                question="And roughly what's an average customer or job worth to your business?"
                helpText="Think in terms of the typical revenue from one booked job, case, sale, or new client relationship."
              />
              <NumberStepForm
                inputId={valueInputId}
                label="Average customer value ($)"
                placeholder="e.g. 4500"
                presets={PRESET_VALUES}
                presetFormatter={(n) => formatCurrency(n)}
                onSubmit={handleValueSubmit}
                submitLabel="See my number"
                prefix="$"
              />
              <button
                type="button"
                onClick={() => goTo("leads")}
                className="mt-5 inline-flex items-center gap-1.5 text-sm text-ink-400 transition-colors hover:text-ink-200"
              >
                <ArrowLeft className="size-3.5" />
                Back
              </button>
            </div>
          )}

          {step === "result" && result && (
            <ResultPanel
              monthlyLeads={monthlyLeads ?? 0}
              avgCustomerValue={avgCustomerValue ?? 0}
              result={result}
              onReset={reset}
            />
          )}

          {/*
            Defensive fallback: by construction this should never happen —
            both numbers are validated before we ever advance to "result",
            and `estimateLeakage` always returns a value for finite,
            positive inputs. But a calculator that's the site's primary
            conversion mechanism shouldn't have a single code path that
            can leave a visitor looking at a blank panel with no way
            forward. If state ever lands here anyway — a future refactor,
            an unexpected input edge case, anything — they get a plain
            explanation and one click back to a working state. Never a
            dead end.
          */}
          {step === "result" && !result && (
            <div>
              <p className="text-eyebrow">One moment</p>
              <h2 className="mt-3 text-xl font-semibold leading-snug text-ink-50 sm:text-2xl">
                We didn&apos;t catch your numbers. Let&apos;s try that again.
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-400">
                Nothing&apos;s wrong on your end, this is just a quick reset so we can calculate your estimate
                correctly.
              </p>
              <Button
                type="button"
                size="lg"
                className="mt-7 bg-accent-500 text-white hover:bg-accent-400"
                onClick={reset}
              >
                Start over
                <ArrowRight className="ml-1 size-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StepQuestion({
  eyebrow,
  question,
  helpText,
}: {
  eyebrow: string;
  question: string;
  helpText: string;
}) {
  return (
    <div className="mb-7">
      <p className="text-eyebrow">{eyebrow}</p>
      <h2 className="mt-3 text-xl font-semibold leading-snug text-ink-50 sm:text-2xl">{question}</h2>
      <p className="mt-2 text-sm leading-relaxed text-ink-400">{helpText}</p>
    </div>
  );
}

function NumberStepForm({
  inputId,
  label,
  placeholder,
  presets,
  presetFormatter,
  onSubmit,
  submitLabel,
  prefix,
}: {
  inputId: string;
  label: string;
  placeholder: string;
  presets: number[];
  presetFormatter: (n: number) => string;
  onSubmit: (value: number) => void;
  submitLabel: string;
  prefix?: string;
}) {
  const [raw, setRaw] = useState("");
  const [error, setError] = useState<string | null>(null);

  function commit(value: number) {
    if (!Number.isFinite(value) || value <= 0) {
      setError("Enter a number greater than zero.");
      return;
    }
    setError(null);
    onSubmit(value);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    commit(Number(raw));
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <Label htmlFor={inputId} className="text-ink-200">
        {label}
      </Label>
      <div className="relative mt-2">
        {prefix ? (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400">
            {prefix}
          </span>
        ) : null}
        <input
          id={inputId}
          type="number"
          inputMode="numeric"
          min={0}
          step="any"
          placeholder={placeholder}
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          className={cn(
            "h-12 w-full rounded-lg border border-ink-700 bg-ink-950 px-3.5 text-base text-ink-50 outline-none transition-colors placeholder:text-ink-600 focus-visible:border-accent-500 focus-visible:ring-2 focus-visible:ring-accent-500/40",
            prefix && "pl-7"
          )}
          aria-describedby={error ? `${inputId}-error` : undefined}
          aria-invalid={Boolean(error)}
        />
      </div>
      {error ? (
        <p id={`${inputId}-error`} className="mt-2 text-sm text-error">
          {error}
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        {presets.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => {
              setRaw(String(preset));
              commit(preset);
            }}
            className="rounded-full border border-ink-700 px-3.5 py-1.5 text-xs text-ink-200 transition-colors hover:border-accent-500/50 hover:text-ink-50"
          >
            {presetFormatter(preset)}
          </button>
        ))}
      </div>

      <Button
        type="submit"
        size="lg"
        className="mt-7 w-full bg-accent-500 text-white hover:-translate-y-0.5 hover:bg-accent-400 sm:w-auto"
      >
        {submitLabel}
        <ArrowRight className="ml-1 size-4" />
      </Button>
    </form>
  );
}

type RevealPhase = "anticipating" | "counting" | "done";

function ResultPanel({
  monthlyLeads,
  avgCustomerValue,
  result,
  onReset,
}: {
  monthlyLeads: number;
  avgCustomerValue: number;
  result: ReturnType<typeof estimateLeakage>;
  onReset: () => void;
}) {
  const [phase, setPhase] = useState<RevealPhase>("anticipating");
  const [displayMonthly, setDisplayMonthly] = useState(0);
  const prefersReduced =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  const numberRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (prefersReduced) {
      setPhase("done");
      setDisplayMonthly(result.recoverableMonthlyRevenue);
      return;
    }

    // Phase 1 → 2: short anticipation hold, then start counting
    const t1 = setTimeout(() => {
      setPhase("counting");

      const controls = animate(0, result.recoverableMonthlyRevenue, {
        duration: 1.8,
        ease: [0.16, 1, 0.3, 1],
        onUpdate: (v) => setDisplayMonthly(v),
        onComplete: () => setPhase("done"),
      });

      return () => controls.stop();
    }, 800);

    return () => clearTimeout(t1);
  }, [result.recoverableMonthlyRevenue, prefersReduced]);

  return (
    <div>
      <p className="text-eyebrow">Your estimate</p>
      <h2 className="mt-3 text-2xl font-semibold leading-snug text-ink-50 sm:text-3xl">
        Based on your numbers, slow follow-up could be costing you around
      </h2>

      {/* Number reveal area */}
      <div className="relative mt-4">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-8 -inset-y-6 -z-10 rounded-[2rem] bg-[radial-gradient(ellipse_70%_70%_at_20%_50%,var(--accent-500)_0%,transparent_70%)] opacity-[0.18] blur-2xl"
        />

        {/* Anticipation state — blurred placeholder */}
        {phase === "anticipating" && (
          <div aria-hidden="true">
            <p
              className="select-none text-5xl font-semibold tracking-tight text-accent-400 sm:text-6xl"
              style={{ filter: "blur(10px)", opacity: 0.4 }}
            >
              {formatCurrency(result.recoverableMonthlyRevenue)}
              <span className="ml-2 text-xl font-medium text-ink-400">/ month</span>
            </p>
            <p className="mt-2 text-sm text-ink-500 animate-pulse">
              Running your numbers...
            </p>
          </div>
        )}

        {/* Count-up and final revealed state */}
        {(phase === "counting" || phase === "done") && (
          <p
            ref={numberRef}
            className="calc-number-reveal text-5xl font-semibold tracking-tight text-accent-400 sm:text-6xl"
            aria-label={formatCurrency(result.recoverableMonthlyRevenue) + " per month"}
          >
            {formatCurrency(displayMonthly)}
            <span className="ml-2 text-xl font-medium text-ink-400">/ month</span>
          </p>
        )}
      </div>

      {/* Supporting context — slides up after number lands */}
      {phase === "done" && (
        <div className="calc-detail-reveal">
          <p className="mt-2 text-sm text-ink-400">
            Revenue missed because follow-up took too long.{" "}
            <span className="text-ink-200">{formatCurrency(result.recoverableAnnualRevenue)}</span> over a full year.
          </p>

          <div className="mt-8 rounded-xl border border-ink-700 bg-ink-950/60 p-6">
            <p className="text-sm font-medium text-ink-200">Here&apos;s the math, in plain sight:</p>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink-400">
              <li>
                • You told us you get about <span className="text-ink-50">{monthlyLeads} leads</span> a month, each
                worth roughly <span className="text-ink-50">{formatCurrency(avgCustomerValue)}</span> if they become a customer.
              </li>
              <li>
                • On average, businesses like yours lose around{" "}
                <span className="text-ink-50">{Math.round(ASSUMED_LOST_LEAD_RATE * 100)}%</span> of leads to slow or
                missed follow-up. That&apos;s roughly <span className="text-ink-50">{result.lostLeadsPerMonth}</span> people a month who
                wanted to do business with you and never heard back in time.
              </li>
              <li>
                • Conservatively, roughly <span className="text-ink-50">{Math.round(ASSUMED_RECOVERABLE_CONVERSION_RATE * 100)}%</span> of
                those would have converted with faster follow-up. That&apos;s where the number above comes from.
              </li>
            </ul>
            <p className="mt-3 text-xs text-ink-600">
              Conservative, industry-informed estimates, shown plainly. Your real number may be higher or lower.
              We&apos;ll walk through your actual numbers on a call.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <ButtonLink
              href="/company#contact"
              size="lg"
              className="bg-accent-500 text-white hover:-translate-y-0.5 hover:bg-accent-400"
            >
              Book Your Strategy Call
              <ArrowRight className="ml-1 size-4" />
            </ButtonLink>
            <Button variant="ghost" size="lg" className="text-ink-300 hover:bg-ink-800 hover:text-ink-50" onClick={onReset}>
              Run it again with different numbers
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
