import type { Metadata } from "next";
import { LeadLeakCalculator } from "@/components/calculator/lead-leak-calculator";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

const TITLE = "Lead Leak Calculator — See what slow follow-up is costing you";
const DESCRIPTION =
  "Answer two quick questions and see a personalized estimate of how much revenue your business is likely losing each month to slow or missed lead follow-up.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/calculator" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/calculator",
  },
};

export default function CalculatorPage() {
  return (
    <>
      <section className="section-padding pb-16 sm:pb-20">
        <div className="section-container">
          <ScrollReveal className="mx-auto max-w-2xl text-center">
            <p className="text-eyebrow justify-center">Lead Leak Calculator</p>
            <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-ink-50 sm:text-4xl lg:text-5xl">
              See what slow follow-up is costing you — in about 60 seconds
            </h1>
            <p className="mt-5 text-base leading-relaxed text-ink-300 sm:text-lg">
              You already know roughly how many leads come in, and roughly what a customer is worth. That&apos;s
              all it takes to see the number that matters most: how much of your own marketing spend is
              quietly slipping through the cracks every month.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="pb-24 sm:pb-32 lg:pb-40">
        <div className="section-container">
          <ScrollReveal delay={0.1}>
            <LeadLeakCalculator />
          </ScrollReveal>

          <ScrollReveal delay={0.15} className="mx-auto mt-10 max-w-xl text-center">
            <p className="text-sm leading-relaxed text-ink-600">
              No email required to see your number. These are conservative, plainly-stated estimates —
              built to start a conversation, not to replace one.
            </p>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
