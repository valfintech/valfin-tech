import { NextResponse } from "next/server";

export const runtime = "edge";

type ContactPayload = {
  name?: string;
  email?: string;
  business?: string;
  message?: string;
  phone?: string;
  // Optional calculator context — passed when the user flowed from the
  // calculator page before submitting the contact form.
  calcMonthlyLeads?: number | null;
  calcAvgValue?: number | null;
  calcMonthlyLoss?: string | null;
  smsConsent?: boolean;
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isLikelyEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/**
 * Forwards the lead to the n8n "Valfin — Website Lead Capture" webhook
 * (workflow OIakSYLK2iMWsB32). Returns true if n8n acknowledged receipt.
 */
async function forwardToN8n(payload: object): Promise<boolean> {
  const webhookUrl = process.env.N8N_VALFIN_LEADS_WEBHOOK_URL;
  if (!webhookUrl) return false;

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Failsafe: if n8n is unreachable, send a backup email via Resend so the
 * lead is never silently lost. Requires RESEND_API_KEY in the environment.
 * If no key is set, the lead data is written to server logs (Vercel logs)
 * where it can still be recovered manually.
 */
async function failsafeEmail(payload: object): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.error(
      "[contact/failsafe] n8n unreachable — no RESEND_API_KEY set. Lead data:",
      JSON.stringify(payload),
    );
    return;
  }

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: "noreply@valfintech.com",
        to: "hello@valfintech.com",
        subject: "[FAILSAFE] Valfin lead — n8n was unreachable at submission time",
        text: `A lead arrived but the n8n webhook could not be reached.\n\nLead data:\n\n${JSON.stringify(payload, null, 2)}\n\nAction required: manually enter this lead into the Valfin Leads Google Sheet.`,
      }),
      signal: AbortSignal.timeout(5000),
    });
  } catch (err) {
    console.error(
      "[contact/failsafe] Resend also failed. Lead data:",
      JSON.stringify(payload),
      err,
    );
  }
}

/**
 * Captures a "talk to us" inquiry from the Company page contact form.
 *
 * Every valid submission is forwarded to the n8n "Valfin — Website Lead
 * Capture" webhook, which appends the lead to the Valfin Internal Leads
 * Google Sheet and sends an email + SMS alert. If n8n is unreachable, a
 * failsafe email fires via Resend so no lead is silently dropped.
 *
 * The browser always receives { received: true } — form UX never degrades
 * based on the state of the internal pipeline.
 */
export async function POST(request: Request) {
  let body: ContactPayload;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { name, email, business, message, phone, calcMonthlyLeads, calcAvgValue, calcMonthlyLoss, smsConsent } =
    body;

  if (!isNonEmptyString(name) || !isNonEmptyString(email) || !isNonEmptyString(message)) {
    return NextResponse.json(
      { error: "Name, email, and message are required." },
      { status: 422 },
    );
  }

  if (!isLikelyEmail(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 422 });
  }

  const leadPayload = {
    source: "contact_form",
    name: name.trim(),
    email: email.trim(),
    phone: isNonEmptyString(phone) ? phone.trim() : null,
    businessName: isNonEmptyString(business) ? business.trim() : null,
    message: message.trim(),
    smsConsent: smsConsent === true,
    calcMonthlyLeads: calcMonthlyLeads ?? null,
    calcAvgValue: calcAvgValue ?? null,
    calcMonthlyLoss: calcMonthlyLoss ?? null,
  };

  const forwarded = await forwardToN8n(leadPayload);

  if (!forwarded) {
    await failsafeEmail(leadPayload);
  }

  return NextResponse.json({ received: true });
}
