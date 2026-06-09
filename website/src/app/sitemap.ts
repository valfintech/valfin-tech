import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { industryList } from "@/content/industries";
import { caseStudies, flagshipInProgress } from "@/content/results";

/**
 * Dynamic sitemap — generated from the same typed content sources that
 * drive the pages themselves (industry vocabulary list, case study list)
 * so that adding a new industry or case study automatically surfaces it
 * here too. No manually-maintained URL list to forget to update.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/how-it-works`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/industries`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/results`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/pricing`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/company`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/calculator`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
  ];

  const industryRoutes: MetadataRoute.Sitemap = industryList.map((industry) => ({
    url: `${baseUrl}/industries/${industry.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: industry.isFlagship ? 0.8 : 0.6,
  }));

  // `caseStudies` stays empty until a result is fully verified (see
  // src/content/results.ts); the in-progress flagship story still gets
  // its own detail page and belongs in the sitemap regardless.
  const caseStudyRoutes: MetadataRoute.Sitemap = [...caseStudies, flagshipInProgress].map((study) => ({
    url: `${baseUrl}${study.href}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...industryRoutes, ...caseStudyRoutes];
}
