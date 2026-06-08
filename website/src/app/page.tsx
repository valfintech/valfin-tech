import type { Metadata } from "next";
import { Hero } from "@/components/sections/hero";
import { Wound } from "@/components/sections/wound";
import { Reframe } from "@/components/sections/reframe";
import { HowItWorks } from "@/components/sections/how-it-works";
import { SystemUnderneath } from "@/components/sections/system-underneath";
import { Proof } from "@/components/sections/proof";
import { Industries } from "@/components/sections/industries";
import { Trust } from "@/components/sections/trust";
import { Faq } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: siteConfig.title,
  description: siteConfig.description,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <Wound />
      <Reframe />
      <HowItWorks />
      <SystemUnderneath />
      <Proof />
      <Industries />
      <Trust />
      <Faq />
      <FinalCta />
    </>
  );
}
