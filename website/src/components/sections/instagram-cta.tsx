import { InstagramIcon } from "@/components/icons/instagram";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { siteConfig } from "@/lib/site-config";

export function InstagramCta() {
  return (
    <section className="section-padding border-t border-ink-700/60">
      <div className="section-container">
        <ScrollReveal>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-eyebrow">Follow along</p>
              <p className="mt-2.5 text-xl font-semibold tracking-tight text-ink-50">
                We share the work as we go.
              </p>
              <p className="mt-1.5 max-w-sm text-sm leading-relaxed text-ink-400">
                Behind-the-scenes, tips for service business owners, and honest updates from the build.
              </p>
            </div>
            <a
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-2.5 rounded-lg border border-ink-700 bg-ink-900/60 px-5 py-2.5 text-sm font-medium text-ink-200 transition-colors hover:border-ink-500 hover:text-ink-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
            >
              <InstagramIcon className="size-4" />
              @valfintech
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
