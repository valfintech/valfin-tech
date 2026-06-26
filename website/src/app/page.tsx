import type { Metadata } from "next";
import { Hero } from "@/components/sections/hero";
import { Wound } from "@/components/sections/wound";
import { ResponseTimeline } from "@/components/sections/response-timeline";
import { HowItWorks } from "@/components/sections/how-it-works";
import { CalculatorCta } from "@/components/sections/calculator-cta";
import { Faq } from "@/components/sections/faq";
import { InstagramCta } from "@/components/sections/instagram-cta";
import { JsonLd } from "@/components/seo/json-ld";
import { faq } from "@/content/homepage";
import { siteConfig } from "@/lib/site-config";
import { faqPageSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={faqPageSchema(faq.items)} />
      <Hero />
      <ResponseTimeline />
      <Wound />
      <HowItWorks />
      <CalculatorCta />
      <Faq />
      <InstagramCta />
    </>
  );
}
