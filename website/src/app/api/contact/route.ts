import { NextResponse } from "next/server";

export const runtime = "edge";

type ContactPayload = {
  name?: string;
  email?: string;
  business?: string;
  message?: string;
};

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isLikelyEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

/**
 * Captures a "talk to us" inquiry from the Company page contact form.
 *
 * Kept intentionally simple and dependency-free for now — validates the
 * payload and acknowledges receipt. This is the same kind of seam as
 * /api/calculator: the natural next step is to forward the captured
 * inquiry into the n8n lead pipeline / CRM described in /docs and
 * /workflows at the project root, so every "talk to us" submission
 * lands in the same place the rest of the lead pipeline already does.
 */
export async function POST(request: Request) {
  let body: ContactPayload;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { name, email, business, message } = body;

  if (!isNonEmptyString(name) || !isNonEmptyString(email) || !isNonEmptyString(message)) {
    return NextResponse.json(
      { error: "Name, email, and message are required." },
      { status: 422 }
    );
  }

  if (!isLikelyEmail(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 422 });
  }

  // NOTE: forward to the n8n lead pipeline / CRM here once that handoff
  // is wired up — see /docs and /workflows in the project root.

  return NextResponse.json({
    received: true,
    inquiry: {
      name: name.trim(),
      email: email.trim(),
      business: isNonEmptyString(business) ? business.trim() : null,
      message: message.trim(),
    },
  });
}
