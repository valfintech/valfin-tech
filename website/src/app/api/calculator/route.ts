import { NextResponse } from "next/server";
import { estimateLeakage, type CalculatorInput } from "@/lib/calculator";

export const runtime = "edge";

/**
 * Scores a Lead Leak Calculator submission. Kept as a thin server-side
 * wrapper around the shared `estimateLeakage` function so the same
 * scoring logic can be reused for: (a) the inline client-side preview,
 * (b) server-validated results attached to a captured lead, and
 * (c) a future webhook handoff into the n8n pipeline / CRM.
 */
export async function POST(request: Request) {
  let body: Partial<CalculatorInput>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const monthlyLeads = Number(body.monthlyLeads);
  const avgCustomerValue = Number(body.avgCustomerValue);

  if (!Number.isFinite(monthlyLeads) || !Number.isFinite(avgCustomerValue) || monthlyLeads < 0 || avgCustomerValue < 0) {
    return NextResponse.json(
      { error: "monthlyLeads and avgCustomerValue must be non-negative numbers." },
      { status: 422 }
    );
  }

  const result = estimateLeakage({ monthlyLeads, avgCustomerValue });

  // NOTE: This is the seam where a future iteration would forward the
  // captured estimate (plus contact details, once collected) into the
  // n8n lead pipeline / CRM — see /docs and /workflows in the project
  // root for the existing automation architecture this should join.

  return NextResponse.json({ input: { monthlyLeads, avgCustomerValue }, result });
}
