import { SectionHeader } from "@/components/sections/section-header";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faq } from "@/content/homepage";

export function Faq() {
  return (
    <section className="section-padding border-t border-ink-700/60">
      <div className="section-container">
        <SectionHeader eyebrow={faq.eyebrow} headline={faq.headline} />

        <ScrollReveal delay={0.05} className="mt-10 max-w-3xl">
          <Accordion className="w-full">
            {faq.items.map((item, index) => (
              <AccordionItem
                key={item.question}
                value={`item-${index}`}
                className="border-ink-700"
              >
                <AccordionTrigger className="text-left text-base font-medium text-ink-50 hover:text-accent-400 hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-base leading-relaxed text-ink-400">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollReveal>
      </div>
    </section>
  );
}
