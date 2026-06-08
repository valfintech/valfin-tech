import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  eyebrow: string;
  headline: string;
  subheadline?: string;
  align?: "left" | "center";
  className?: string;
};

/**
 * Standard section header block: eyebrow + headline + optional sub-headline.
 * Reused across every homepage section and industry pages for visual
 * consistency, per the component inventory in /CLAUDE.md.
 */
export function SectionHeader({
  eyebrow,
  headline,
  subheadline,
  align = "left",
  className,
}: SectionHeaderProps) {
  return (
    <ScrollReveal
      as="header"
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      <p className="text-eyebrow">{eyebrow}</p>
      <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-ink-50 sm:text-4xl lg:text-[2.5rem]">
        {headline}
      </h2>
      {subheadline ? (
        <p className="mt-5 text-lg leading-relaxed text-ink-200">{subheadline}</p>
      ) : null}
    </ScrollReveal>
  );
}
