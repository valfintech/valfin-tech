import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

/**
 * robots.txt — wide-open for crawlers (this is a marketing site, not an
 * app with private routes), with an explicit pointer to the sitemap and
 * the API namespace disallowed since it serves no indexable content.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
