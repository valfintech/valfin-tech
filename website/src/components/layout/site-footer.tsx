import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

const footerLinks = [
  {
    heading: "Product",
    links: [
      { label: "How It Works", href: "/how-it-works" },
      { label: "Lead Leak Calculator", href: "/calculator" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    heading: "Proof",
    links: [
      { label: "Industries", href: "/industries" },
      { label: "Results", href: "/results" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Valfin", href: "/company" },
      { label: "Talk to us", href: "/company#contact" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-ink-700 bg-ink-950">
      <div className="section-container py-16">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="text-lg font-semibold tracking-tight text-ink-50 lowercase">
              {siteConfig.name}
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-400">
              Valfin makes sure your business never loses another customer to
              slow follow-up: answered, followed up, and booked, automatically.
            </p>
          </div>

          {footerLinks.map((group) => (
            <div key={group.heading}>
              <h3 className="text-eyebrow">{group.heading}</h3>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-ink-200 transition-colors hover:text-ink-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 rounded-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="divider-hairline my-10" />

        <div className="flex flex-col items-start justify-between gap-4 text-xs text-ink-400 sm:flex-row sm:items-center">
          <p>&copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link
              href="/privacy"
              className="text-ink-400 transition-colors hover:text-ink-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 rounded-sm"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-ink-400 transition-colors hover:text-ink-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 rounded-sm"
            >
              Terms &amp; Conditions
            </Link>
          </div>
          <p className="text-ink-600">Built in the field. Proven before promised.</p>
        </div>
      </div>
    </footer>
  );
}
