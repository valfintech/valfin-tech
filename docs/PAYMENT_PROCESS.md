# Payment Process (Founder-Stage)
_Created 2026-06-10 — the canonical design document for how Valfin Tech collects money from clients at V1. `STRIPE_SETUP_GUIDE.md` is the step-by-step setup that implements this design; `INVOICE_TEMPLATE.docx` and `CLIENT_ACCEPTANCE_FLOW.md` are the documents that reference it._

> **Scope note:** this document describes the process for a solo founder closing the first handful of clients — not a scaled billing system. It is deliberately manual in places where automation would cost more time to build than it saves. Revisit once volume justifies it (see "What this is not" at the bottom).

---

## 1. Principles

1. **Optimize for speed and professionalism, not automation.** A Stripe Payment Link sent in an email, paid in two clicks, looks just as professional to a client as a fully automated billing system — and takes minutes to set up instead of days.
2. **Get paid before doing configuration work.** Per `ONBOARDING_SOP.md` Phase 0, the signed agreement + setup-fee payment is the **hard gate** before any deployment work begins. Payment is not just revenue — it's the qualification filter that ensures only serious clients enter the onboarding pipeline.
3. **Two charges, two purposes:**
   - **Setup fee** (one-time): covers real, non-recurring labor — deployment configuration (~2-4 hrs per `PRICING_PACKAGING.md`) and Twilio carrier verification. Non-refundable once configuration begins (per `CLIENT_SERVICE_AGREEMENT_TEMPLATE.md` §2a).
   - **Recurring platform fee** (monthly, starts at go-live): the ongoing subscription, billed month-to-month with 30-day notice to cancel (per `CLIENT_SERVICE_AGREEMENT_TEMPLATE.md` §3).
4. **Every dollar figure quoted to a client is the number from their signed proposal** — never the internal anchor pricing from `PRICING_PACKAGING.md` directly. The proposal is the source of truth for that client's numbers from this point forward.

---

## 2. The two payments, end to end

### Payment 1 — Setup Fee (one-time)

| | |
|---|---|
| **When sent** | Immediately after the client signs the service agreement (Phase 0 of `ONBOARDING_SOP.md`) |
| **How sent** | Stripe Payment Link, emailed directly to the client (see `STRIPE_SETUP_GUIDE.md` §3) |
| **Amount** | The one-time setup fee from that client's signed proposal |
| **What it unlocks** | Configuration work begins (Phase 1-3 of `ONBOARDING_SOP.md`) — **only after this payment is confirmed** |
| **Receipt** | Stripe sends an automatic receipt; founder also sends `INVOICE_TEMPLATE.docx` as a formal invoice for the client's records (see §5 below) |

### Payment 2 — Recurring Platform Fee (monthly)

| | |
|---|---|
| **When started** | At go-live (Phase 5 of `ONBOARDING_SOP.md`) — not at signing, not at setup-payment time |
| **How sent** | A second Stripe Payment Link configured as a **recurring subscription** (see `STRIPE_SETUP_GUIDE.md` §4), set up during the kickoff call |
| **Amount** | The monthly platform fee from that client's signed proposal |
| **Billing date** | Anchors to the date the client completes the recurring-payment setup at go-live — Stripe will bill that same day-of-month going forward |
| **What it covers** | Ongoing system operation, monitoring (Workflow 11), monthly ROI reporting (Workflow 12), and support per `CLIENT_SERVICE_AGREEMENT_TEMPLATE.md` §9 |

---

## 3. Timing — how payment maps onto the founder-led journey

```
Proposal sent
   ↓
Agreement signed  ──────────────►  Setup-fee Payment Link sent same day
                                          ↓
                                    Setup fee PAID  ◄── HARD GATE
                                          ↓
                                    Configuration begins (Onboarding SOP Phase 1-3)
                                          ↓
                                    Verification (Phase 4)
                                          ↓
                                    Go-live kickoff call (Phase 5)
                                          ↓
                                    Recurring subscription set up live, on the call
                                          ↓
                                    First recurring charge occurs ~immediately,
                                    subsequent charges monthly on that anchor date
```

**Why setup fee gates configuration, but the recurring fee doesn't gate go-live the same way:** the setup fee is the one-time "are they serious / will they pay" filter — it's collected before any labor is spent. The recurring fee, by contrast, is set up *during* the go-live call itself, as part of a single smooth motion: "let's get your subscription set up while we're live on this call together" — turning a billing task into part of the celebratory kickoff moment rather than a separate awkward ask.

---

## 4. Failed payment handling

### Setup fee fails or is never paid
- This is not really a "failed payment" scenario in the traditional sense — it simply means **onboarding has not started**. No Stripe-side retry logic is needed.
- If a client signs the agreement but doesn't pay within a few days, the founder follows up directly (a short, friendly email/text — "just making sure the payment link came through okay"). No automated dunning needed at this volume.
- If the card is declined at checkout, Stripe's hosted payment page shows the client a generic "your card was declined" message and lets them retry with a different card immediately — no founder action needed unless they reach out.

### Recurring platform fee fails (after go-live)
- **Stripe's built-in retry logic** (Smart Retries) is enabled by default on Stripe subscriptions — Stripe automatically retries a failed card charge over the following days using its own optimized schedule. No setup required; this is the default.
- Stripe automatically emails the client when a payment fails and when a retry succeeds (enable "Customer emails" in Stripe's subscription settings — see `STRIPE_SETUP_GUIDE.md` §5).
- **If all retries fail** (Stripe will eventually mark the subscription `past_due` then `unpaid`/`canceled` per its dunning settings): the founder gets a notification (email, from Stripe) and should **personally reach out to the client** — a failed card is far more often "the card on file expired" than "the client wants to cancel." This is also a relationship check-in opportunity.
- **Per `CLIENT_SERVICE_AGREEMENT_TEMPLATE.md` §3**, non-payment is grounds for immediate termination of service — but in practice, for a founder-led relationship with a handful of clients, a personal phone call/text resolves the vast majority of failed-payment situations within a day or two. Treat the contract clause as a backstop, not a first response.

---

## 5. Invoicing

- Stripe automatically generates and emails a receipt for every successful Payment Link transaction — this satisfies most clients' record-keeping needs on its own.
- For clients who need a more formal invoice (common for small businesses doing their own bookkeeping), send `INVOICE_TEMPLATE.docx`, filled in with that client's numbers, **at the same time as the Stripe Payment Link** — not instead of it. The invoice documents what's owed; the Payment Link is how it gets paid.
- Do not enable Stripe's separate "Invoicing" product for V1 — Payment Links + the invoice template cover this need with far less setup. Revisit if a client specifically requires Stripe-hosted invoices for their accounting workflow.

---

## 6. What requires manual founder involvement

This process is deliberately manual in the following places — these are not gaps, they're the right level of automation for this stage:

| Action | Why manual |
|---|---|
| Creating each client's Stripe Payment Link(s) | Each client has different numbers (from their proposal) — there's no "one link fits all." Takes ~2 minutes per client (`STRIPE_SETUP_GUIDE.md` §3-4). |
| Sending the setup-fee Payment Link | Sent personally, same email/message as the signed-agreement confirmation — keeps the relationship personal at this stage. |
| Confirming setup-fee payment before starting configuration | This is the Phase 0 hard gate — a deliberate manual checkpoint, not something to automate away. |
| Setting up the recurring subscription at go-live | Done live, on the kickoff call, as part of the relationship-building moment described in §3. |
| Following up on failed recurring payments | A personal touch resolves these faster than automated dunning emails alone, and preserves the relationship. |
| Sending `INVOICE_TEMPLATE.docx` | Filled in per-client with their specific numbers and proposal reference. |

---

## 7. What this is not

This document does **not** cover (per the explicit V1 scope boundaries):
- Automated billing systems, usage-based billing, or proration logic
- Multi-seat/team billing
- Tax collection automation (Stripe Tax) — if/when sales tax becomes relevant, revisit
- A customer-facing billing portal (Stripe's self-serve "Customer Portal" can be enabled later if clients start asking to update their own card details — note this as a future option, not a V1 requirement)

These are explicitly **future-scale infrastructure** and out of scope until real client volume creates the need.
