/**
 * Legal — Privacy Policy and Terms & Conditions copy.
 *
 * Plain-language legal content for a small operating business. Written to
 * accurately describe what the Valfin website actually does (contact form +
 * calculator submissions flow to an internal lead-tracking pipeline; no
 * accounts, no payments processed on-site, cookie-less analytics).
 *
 * If Valfin's structure changes (e.g. incorporation state, new data
 * processors, paid product launches with accounts/billing), this file
 * should be updated accordingly — ideally with counsel review.
 */

export type LegalSection = {
  heading: string;
  paragraphs?: string[];
  list?: string[];
};

export type LegalDocument = {
  eyebrow: string;
  title: string;
  effectiveDate: string;
  intro: string[];
  sections: LegalSection[];
};

const EFFECTIVE_DATE = "June 10, 2026";

export const privacyPolicy: LegalDocument = {
  eyebrow: "Legal",
  title: "Privacy Policy",
  effectiveDate: EFFECTIVE_DATE,
  intro: [
    "This Privacy Policy explains what information Valfin Tech (\"Valfin,\" \"we,\" \"us,\" or \"our\") collects through valfintech.com (the \"Site\"), how we use it, and the choices you have.",
    "Valfin is an operational system for service businesses — this Site is informational, and the only personal information we collect is what you choose to give us when you reach out or use the Lead Leak Calculator.",
  ],
  sections: [
    {
      heading: "Information We Collect",
      paragraphs: [
        "We collect information you voluntarily provide through the contact form and the Lead Leak Calculator on this Site, which may include:",
      ],
      list: [
        "Your name, email address, phone number (if provided), and business name",
        "The message or details you share about your business and how leads currently come in",
        "Calculator inputs and outputs, such as estimated monthly leads, average customer value, and estimated monthly revenue loss",
      ],
    },
    {
      heading: "How We Use Your Information",
      paragraphs: ["We use the information you submit to:"],
      list: [
        "Respond to your inquiry and follow up about Valfin's services",
        "Keep an internal record of inquiries so nothing falls through the cracks",
        "Understand, with your consent where required, how to best reach you (including by phone, email, or SMS) about your specific request",
      ],
    },
    {
      heading: "How We Share Your Information",
      paragraphs: [
        "We do not sell your information. To operate the Site and respond to inquiries, submissions are processed by a small set of service providers acting on our behalf:",
      ],
      list: [
        "Vercel — hosts the Site and provides cookie-less, privacy-preserving analytics",
        "n8n (workflow automation) — receives form submissions and routes them to our internal tools",
        "Google (Google Sheets) — stores submitted lead information in an internal record",
        "Twilio — used to send SMS notifications related to your inquiry",
        "Resend — a backup email provider used only if our primary systems are temporarily unreachable, so your message is never silently lost",
      ],
      // Note: each processor above only receives the data necessary to perform its function
      // (lead routing, storage, and notification) — none of them are permitted to use it
      // for their own marketing purposes.
    },
    {
      heading: "SMS Communications & Consent",
      paragraphs: [
        "If you provide a phone number and submit the contact form, you consent to receive communications from Valfin Tech related to your inquiry, which may include SMS messages.",
        "Message frequency varies based on your inquiry. Message and data rates may apply. You can opt out of SMS communications at any time by replying STOP, or by contacting us at hello@valfintech.com. Consent to receive SMS messages is not a condition of any purchase.",
      ],
    },
    {
      heading: "Cookies & Analytics",
      paragraphs: [
        "This Site uses Vercel Analytics, a privacy-focused analytics tool that does not use cookies and does not track you across other websites. It helps us understand aggregate traffic patterns (e.g. which pages are visited) so we can improve the Site.",
      ],
    },
    {
      heading: "Data Retention",
      paragraphs: [
        "We retain information submitted through the contact form and calculator for as long as is reasonably necessary to respond to your inquiry and maintain accurate business records, or until you ask us to delete it.",
      ],
    },
    {
      heading: "Your Rights & Choices",
      paragraphs: [
        "You can ask us to access, correct, or delete the personal information we hold about you, or to stop contacting you, at any time by emailing hello@valfintech.com. We will respond promptly.",
      ],
    },
    {
      heading: "Data Security",
      paragraphs: [
        "We use reasonable administrative and technical safeguards — including encrypted connections (HTTPS/TLS) and access-controlled third-party services — to protect the information you share with us. No method of transmission or storage is completely secure, but we work to protect your information appropriately.",
      ],
    },
    {
      heading: "Children's Privacy",
      paragraphs: [
        "This Site is intended for business owners and operators. It is not directed at, and we do not knowingly collect information from, children under 13.",
      ],
    },
    {
      heading: "Changes to This Policy",
      paragraphs: [
        "We may update this Privacy Policy from time to time. The \"Effective Date\" above reflects the most recent revision. Material changes will be reflected on this page.",
      ],
    },
    {
      heading: "Contact Us",
      paragraphs: [
        "Questions about this Privacy Policy or your information? Email us at hello@valfintech.com.",
      ],
    },
  ],
};

export const termsAndConditions: LegalDocument = {
  eyebrow: "Legal",
  title: "Terms & Conditions",
  effectiveDate: EFFECTIVE_DATE,
  intro: [
    "These Terms & Conditions (\"Terms\") govern your use of valfintech.com (the \"Site\"), operated by Valfin Tech (\"Valfin,\" \"we,\" \"us,\" or \"our\"). By using the Site, you agree to these Terms.",
  ],
  sections: [
    {
      heading: "Use of the Site",
      paragraphs: [
        "You may use this Site to learn about Valfin's services, use the Lead Leak Calculator, and contact us. You agree not to misuse the Site — including attempting to disrupt it, scrape it at scale, or submit false or fraudulent information through its forms.",
      ],
    },
    {
      heading: "The Lead Leak Calculator",
      paragraphs: [
        "The Lead Leak Calculator provides an illustrative estimate based on the figures you enter. It is intended to help you think about the cost of slow follow-up — it is not a guarantee of results, savings, or revenue, and should not be relied upon as financial or business advice. Actual outcomes depend on your specific business.",
      ],
    },
    {
      heading: "Intellectual Property",
      paragraphs: [
        "The content on this Site — including text, graphics, logos, and the Valfin name and brand — is owned by Valfin Tech or its licensors and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works from this content without our written permission.",
      ],
    },
    {
      heading: "Third-Party Links and Services",
      paragraphs: [
        "This Site may reference or link to third-party services. We are not responsible for the content, policies, or practices of any third-party sites or services.",
      ],
    },
    {
      heading: "Disclaimer of Warranties",
      paragraphs: [
        "This Site and its content are provided \"as is\" and \"as available,\" without warranties of any kind, express or implied, to the fullest extent permitted by law.",
      ],
    },
    {
      heading: "Limitation of Liability",
      paragraphs: [
        "To the fullest extent permitted by law, Valfin Tech will not be liable for any indirect, incidental, or consequential damages arising from your use of this Site.",
      ],
    },
    {
      heading: "Governing Law",
      paragraphs: [
        "These Terms are governed by the laws applicable in the jurisdiction in which Valfin Tech operates, without regard to conflict-of-law principles.",
      ],
    },
    {
      heading: "Changes to These Terms",
      paragraphs: [
        "We may update these Terms from time to time. The \"Effective Date\" above reflects the most recent revision. Continued use of the Site after a change constitutes acceptance of the updated Terms.",
      ],
    },
    {
      heading: "Contact Us",
      paragraphs: [
        "Questions about these Terms? Email us at hello@valfintech.com.",
      ],
    },
  ],
};
