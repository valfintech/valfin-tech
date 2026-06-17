import { SmsThread } from "@/components/motion/sms-thread";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

export function SmsSection() {
  return (
    <section className="section-padding border-t border-ink-700/60 bg-ink-900/20">
      <div className="section-container">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: copy */}
          <ScrollReveal>
            <p className="text-eyebrow">See it in action</p>
            <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-ink-50 sm:text-4xl">
              A new lead comes in. Your business responds before anyone else does.
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-ink-200">
              Most businesses take hours to follow up. By then, the customer has already moved on to whoever
              answered first. Valfin fires a response within seconds, automatically, every time, on any channel.
            </p>
            <ul className="mt-7 space-y-3">
              {[
                "Responds in under 30 seconds, day or night",
                "Keeps the conversation going until they book",
                "Notifies you the moment something needs attention",
              ].map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm text-ink-300">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-success/15 text-[10px] font-bold text-success">
                    ✓
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </ScrollReveal>

          {/* Right: live SMS thread */}
          <ScrollReveal delay={0.1}>
            <SmsThread />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
