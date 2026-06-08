"use client";

import { useId, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { Label } from "@/components/ui/label";
import {
  ASSUMED_LOST_LEAD_RATE,
  ASSUMED_RECOVERABLE_CONVERSION_RATE,
  estimateLeakage,
  formatCurrency,
} from "@/lib/calculator";
import { duration, easing } from "@/lib/motion-tokens";
import { cn } from "@/lib/utils";

type Step = "leads" | "value" | "result";

const STEP_ORDER: Step[] = ["leads", "value", "result"];

const PRESET_LEADS = [10, 25, 50, 100];
const PRESET_VALUES = [500, 2500, 7500, 15000];

const slideVariants = {
  enter: { opacity: 0, x: 24 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
};

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
  const shouldReduceMotion = useReducedMotion();
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

  const transition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: duration.base, ease: easing.out };

  return (
    <div className="mx-auto w-full max-w-xl">
      {/* Progress indicator */}
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

      <div className="rounded-2xl border border-ink-700 bg-ink-900/60 p-8 sm:p-10">
        <AnimatePresence mode="wait" initial={false}>
          {step === "leads" && (
            <motion.div
              key="leads"
              initial="enter"
              animate="center"
              exit="exit"
              variants={slideVariants}
              transition={transition}
            >
              <StepQuestion
                eyebrow="Step 1 of 2"
                question="About how many new leads does your business get in a typical month?"
                helpText="A rough number is fine — calls, form submissions, messages, walk-ins, anything that could become a customer."
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
            </motion.div>
          )}

          {step === "value" && (
            <motion.div
              key="value"
              initial="enter"
              animate="center"
              exit="exit"
              variants={slideVariants}
              transition={transition}
            >
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
            </motion.div>
          )}

          {step === "result" && result && (
            <motion.div
              key="result"
              initial="enter"
              animate="center"
              exit="exit"
              variants={slideVariants}
              transition={transition}
            >
              <ResultPanel
                monthlyLeads={monthlyLeads ?? 0}
                avgCustomerValue={avgCustomerValue ?? 0}
                result={result}
                onReset={reset}
              />
            </motion.div>
          )}
        </AnimatePresence>
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
        className="mt-7 w-full bg-accent-500 text-white hover:bg-accent-400 sm:w-auto"
      >
        {submitLabel}
        <ArrowRight className="ml-1 size-4" />
      </Button>
    </form>
  );
}

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
  return (
    <div>
      <p className="text-eyebrow">Your estimate</p>
      <h2 className="mt-3 text-2xl font-semibold leading-snug text-ink-50 sm:text-3xl">
        Based on your numbers, slow follow-up could be costing you around
      </h2>

      <p className="mt-4 text-5xl font-semibold tracking-tight text-accent-400 sm:text-6xl">
        {formatCurrency(result.recoverableMonthlyRevenue)}
        <span className="ml-2 text-xl font-medium text-ink-400">/ month</span>
      </p>
      <p className="mt-2 text-sm text-ink-400">
        That&apos;s roughly <span className="text-ink-200">{formatCurrency(result.recoverableAnnualRevenue)}</span> a year — money
        already spent to generate these leads, sitting unconverted.
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
            missed follow-up — about <span className="text-ink-50">{result.lostLeadsPerMonth}</span> people a month who
            wanted to do business with you and never heard back in time.
          </li>
          <li>
            • Conservatively, roughly <span className="text-ink-50">{Math.round(ASSUMED_RECOVERABLE_CONVERSION_RATE * 100)}%</span> of
            those would have converted with fast, consistent follow-up — which is where the number above comes from.
          </li>
        </ul>
        <p className="mt-3 text-xs text-ink-600">
          These are conservative, industry-informed estimates, shown plainly rather than dressed up — your real number
          may be higher or lower. We&apos;ll happily walk through your actual numbers on a call.
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <ButtonLink
          href="/company#contact"
          size="lg"
          className="bg-accent-500 text-white hover:bg-accent-400"
        >
          Talk to us about this number
          <ArrowRight className="ml-1 size-4" />
        </ButtonLink>
        <Button variant="ghost" size="lg" className="text-ink-300 hover:bg-ink-800 hover:text-ink-50" onClick={onReset}>
          Run it again with different numbers
        </Button>
      </div>
    </div>
  );
}
