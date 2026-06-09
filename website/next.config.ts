import type { NextConfig } from "next";

const securityHeaders = [
  // Prevents the page from being rendered inside a frame — blocks clickjacking
  { key: "X-Frame-Options", value: "DENY" },
  // Prevents browsers from MIME-sniffing the content-type
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Referrer sent on same-origin; stripped to origin-only on cross-origin HTTPS
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Restricts access to browser features not needed by this site
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  // Enforces HTTPS for 1 year (applied by Vercel/Cloudflare edge too, belt-and-suspenders)
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
  // Basic XSS filter for older browsers (modern browsers use CSP instead)
  { key: "X-XSS-Protection", value: "1; mode=block" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        // Apply to every route
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
