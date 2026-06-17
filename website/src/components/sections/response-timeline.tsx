import { ScrollReveal, ScrollRevealGroup, ScrollRevealItem } from "@/components/motion/scroll-reveal";

type TimelineEvent = {
  time: string;
  title: string;
  detail: string;
  variant?: "lead" | "gap" | "lost" | "auto" | "booked";
};

const WITHOUT: TimelineEvent[] = [
  {
    time: "2:14 PM",
    title: "Customer submits inquiry",
    detail: "Form submitted. Waiting for someone to notice.",
    variant: "lead",
  },
  {
    time: "—",
    title: "No immediate response",
    detail: "The team is busy. The notification gets missed. It'll get handled later.",
    variant: "gap",
  },
  {
    time: "2:41 PM",
    title: "First contact attempt",
    detail: "27 minutes later. Rings twice. Goes to voicemail.",
    variant: "gap",
  },
  {
    time: "2:43 PM",
    title: "Customer already moved on",
    detail: "They filled out two other forms. One of those businesses already called back.",
    variant: "lost",
  },
];

const WITH: TimelineEvent[] = [
  {
    time: "2:14 PM",
    title: "Customer submits inquiry",
    detail: "Form submitted.",
    variant: "lead",
  },
  {
    time: "2:14:22 PM",
    title: "Valfin responds automatically",
    detail: "Personalized message sent in 22 seconds. Customer is still at their phone.",
    variant: "auto",
  },
  {
    time: "2:15 PM",
    title: "Customer replies",
    detail: "They engage. Valfin continues the conversation and offers available times.",
    variant: "auto",
  },
  {
    time: "2:17 PM",
    title: "Appointment confirmed",
    detail: "Booking locked in. Owner notified with full contact details.",
    variant: "booked",
  },
];

const variantStyles: Record<NonNullable<TimelineEvent["variant"]>, { dot: string; stem: string }> = {
  lead:  { dot: "bg-ink-400 border-ink-600",              stem: "bg-ink-700" },
  gap:   { dot: "bg-ink-700 border-ink-600",              stem: "bg-ink-800" },
  lost:  { dot: "bg-error/70 border-error/40",            stem: "bg-ink-800" },
  auto:  { dot: "bg-accent-500 border-accent-500/40 shadow-[0_0_8px_rgba(37,99,235,0.5)]", stem: "bg-accent-500/30" },
  booked:{ dot: "bg-success border-success/40 shadow-[0_0_8px_rgba(43,213,118,0.4)]",      stem: "bg-ink-800" },
};

function TimelineRow({ event, isLast }: { event: TimelineEvent; isLast: boolean }) {
  const v = event.variant ?? "gap";
  const styles = variantStyles[v];

  return (
    <div className="flex gap-4">
      {/* Dot + stem */}
      <div className="flex flex-col items-center pt-1">
        <div className={`size-2.5 shrink-0 rounded-full border ${styles.dot}`} />
        {!isLast && <div className={`mt-1 w-px flex-1 ${styles.stem}`} style={{ minHeight: "2.5rem" }} />}
      </div>

      {/* Content */}
      <div className="pb-6">
        <p className="text-[11px] font-semibold tracking-widest text-ink-500 uppercase">{event.time}</p>
        <p
          className={`mt-0.5 text-sm font-semibold ${
            v === "lost"
              ? "text-error/80"
              : v === "booked"
              ? "text-success"
              : v === "auto"
              ? "text-accent-400"
              : "text-ink-200"
          }`}
        >
          {event.title}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-ink-500">{event.detail}</p>
      </div>
    </div>
  );
}

export function ResponseTimeline() {
  return (
    <section className="section-padding border-t border-ink-700/60">
      <div className="section-container">
        <ScrollReveal className="mb-12 max-w-2xl">
          <p className="text-eyebrow">The difference that speed makes</p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-ink-50 sm:text-4xl">
            Same inquiry. Two completely different outcomes.
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-ink-200">
            The customer doesn&apos;t wait around. The business that responds first wins the job. That&apos;s it.
          </p>
        </ScrollReveal>

        <ScrollRevealGroup className="grid grid-cols-1 gap-6 sm:grid-cols-2" staggerAmount={0.1}>
          {/* WITHOUT */}
          <ScrollRevealItem>
            <div className="h-full rounded-2xl border border-error/20 bg-ink-900/40 p-7">
              <div className="mb-6 flex items-center gap-2.5">
                <span className="size-2 rounded-full bg-error/60" />
                <p className="text-sm font-semibold uppercase tracking-widest text-error/70">
                  Without Valfin
                </p>
              </div>
              {WITHOUT.map((event, i) => (
                <TimelineRow key={i} event={event} isLast={i === WITHOUT.length - 1} />
              ))}
              <div className="mt-2 rounded-lg border border-error/20 bg-error/5 px-4 py-3">
                <p className="text-sm font-semibold text-error/80">Opportunity lost</p>
                <p className="mt-0.5 text-sm text-ink-500">
                  Revenue already spent to generate this lead. Gone.
                </p>
                <p className="mt-2 text-xs text-ink-600 italic">
                  They needed help before they heard back.
                </p>
              </div>
            </div>
          </ScrollRevealItem>

          {/* WITH */}
          <ScrollRevealItem>
            <div className="h-full rounded-2xl border border-success/20 bg-ink-900/40 p-7">
              <div className="mb-6 flex items-center gap-2.5">
                <span className="size-2 rounded-full bg-success" />
                <p className="text-sm font-semibold uppercase tracking-widest text-success/70">
                  With Valfin
                </p>
              </div>
              {WITH.map((event, i) => (
                <TimelineRow key={i} event={event} isLast={i === WITH.length - 1} />
              ))}
              <div className="mt-2 rounded-lg border border-success/25 bg-success/8 px-4 py-3">
                <p className="text-sm font-semibold text-success">✓ Appointment Confirmed</p>
                <p className="mt-0.5 text-sm text-ink-400">
                  3 minutes from inquiry to confirmed booking. No manual work required.
                </p>
                <p className="mt-2 text-xs text-success/50 italic">
                  They booked while the opportunity was still there.
                </p>
              </div>
            </div>
          </ScrollRevealItem>
        </ScrollRevealGroup>

        <ScrollReveal delay={0.15} className="mt-10 max-w-xl">
          <p className="text-base leading-relaxed text-ink-400">
            Speed is the differentiator. Valfin makes sure you&apos;re always the first to respond, without
            requiring you or your team to be watching every channel, every minute.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
