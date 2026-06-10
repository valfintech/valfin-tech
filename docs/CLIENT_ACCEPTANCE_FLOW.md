# Client Acceptance Flow
_Created 2026-06-10 — the end-to-end flow tying proposal → agreement → payment → kickoff together. This is the connective document: each step below names the exact other doc to use and the exact message/action to take. Read alongside `PROPOSAL_PLAYBOOK.md` (how the proposal itself is built/sent) and `ONBOARDING_SOP.md` (what happens once kickoff begins)._

> **Where this fits:** `DISCOVERY_CALL_WORKBOOK.md` ends with "I'll send over a proposal." This document picks up from there and ends where `ONBOARDING_SOP.md` Phase 1 begins. Everything in between — proposal, signature, payment, kickoff — is covered here.

---

## The flow at a glance

```
1. Proposal sent (CLIENT_PROPOSAL_TEMPLATE.docx, per PROPOSAL_PLAYBOOK.md)
        ↓
2. Client says yes
        ↓
3. Service agreement sent (CLIENT_SERVICE_AGREEMENT_TEMPLATE.md, filled in)
        ↓
4. Agreement signed
        ↓
5. Setup-fee Payment Link sent (per STRIPE_SETUP_GUIDE.md §3)
        ↓
6. Setup fee paid  ◄── HARD GATE — nothing below this line happens before this
        ↓
7. Kickoff: send CLIENT_ONBOARDING_INTAKE.md (= ONBOARDING_SOP.md Phase 1)
        ↓
8. Onboarding/Deployment proceeds (ONBOARDING_SOP.md Phases 2-5)
        ↓
9. At go-live: recurring subscription set up live (per STRIPE_SETUP_GUIDE.md §4)
```

---

## Step 1-2: Proposal sent → client says yes

Covered fully in `PROPOSAL_PLAYBOOK.md`. The short version: the proposal (`CLIENT_PROPOSAL_TEMPLATE.docx`) is sent within 24-48 hours of the discovery call, with that client's specific numbers (tier, setup fee, monthly fee, calculator result) filled in.

When the client responds positively ("looks good," "let's move forward," "where do I sign"), proceed immediately to Step 3 — **same day if possible**. Momentum at this stage matters as much as it does at intake (`ONBOARDING_SOP.md` Phase 1).

---

## Step 3: Send the service agreement

1. Open `CLIENT_SERVICE_AGREEMENT_TEMPLATE.md`
2. Fill in **every** `[BRACKETED]` placeholder for this client:
   - Client legal/business name and address
   - Service tier and description (matching what was in the proposal)
   - One-time setup fee and recurring monthly fee (must match the proposal exactly — these numbers are now becoming contractual)
   - Effective date
   - Any other client-specific fields
3. **Reminder from the template's own header**: this is a structured starting draft, not an attorney-reviewed final contract. If a real legal review hasn't happened yet, that review should happen before the *first* signature is collected from any client — track this as the open item it is (see `ONBOARDING_SOP.md` Open Items table).
4. Send the filled-in agreement to the client. For V1, a simple approach is sufficient:
   - Export the filled-in markdown to PDF (or send as a Google Doc) and use a free e-signature tool (e.g., the client can sign and return a PDF, or use a tool like Google Docs' built-in signature support, or a free tier of an e-signature service)
   - Don't over-engineer this — the goal is a clear, professional, signed record. A scanned signature on a PDF is legally meaningful and sufficient at this stage.

**Email/message template for sending the agreement:**

> Subject: [Business Name] — Service Agreement
>
> Hi [Name],
>
> Thanks again for moving forward — excited to get started! Attached is our service agreement covering everything we discussed: [Tier name] setup, the monthly platform fee, and the terms for both of us.
>
> Take a look, and if everything looks right, just sign and send it back. Once I have that, I'll send over the setup payment link and we can get the clock started on your onboarding — most clients are live within a few weeks of this step.
>
> Let me know if anything needs clarifying before you sign — happy to hop on a quick call if that's easier.
>
> [Founder name]

---

## Step 4-5: Agreement signed → setup-fee Payment Link sent

The moment the signed agreement comes back:

1. **Same day**, create (if not already created) and send the setup-fee Payment Link per `STRIPE_SETUP_GUIDE.md` §3
2. Use this message template:

> Subject: [Business Name] — Let's get started
>
> Got it, thank you! 🎉
>
> Next step is the setup payment — here's a secure link to take care of that:
>
> [Stripe Payment Link]
>
> Once that's through, I'll send over a short onboarding form (just a handful of questions about how your business runs — should take about [X] minutes), and we'll start the clock on getting your number set up. Most clients are fully live within a few weeks from here.
>
> Talk soon!
>
> [Founder name]

---

## Step 6: Setup fee paid — the hard gate

**Do not proceed to Step 7 until Stripe confirms this payment** (Dashboard → Payments, or the email notification Stripe sends).

This mirrors `ONBOARDING_SOP.md` Phase 0's existing hard gate ("signed agreement and payment terms confirmed") — this document makes that gate concrete: it is specifically the **setup-fee Payment Link showing as paid in Stripe**.

If a few days pass with no payment, follow up personally — see `PAYMENT_PROCESS.md` §4 for the friendly-follow-up approach. There is no automated reminder system at this stage; a short personal check-in is both faster and more appropriate for a founder-led relationship.

---

## Step 7-8: Kickoff and onboarding/deployment

Once the setup fee is confirmed paid:

1. **Send `CLIENT_ONBOARDING_INTAKE.md` the same day** — this is `ONBOARDING_SOP.md` Phase 1, step 1
2. Everything from here forward follows `ONBOARDING_SOP.md` Phases 1-5 exactly as documented — this document does not duplicate that process, only hands off to it cleanly

---

## Step 9: Go-live — recurring subscription setup

At `ONBOARDING_SOP.md` Phase 5 (Go Live), during the kickoff/walkthrough call:

1. Share your screen and walk the client through completing the recurring Payment Link checkout (per `STRIPE_SETUP_GUIDE.md` §4) as part of the call
2. Frame it positively — this is a celebratory moment ("you're officially live!") not a billing chore
3. Confirm the subscription shows as active in Stripe before ending the call

---

## Summary table — who does what, and when

| Step | Trigger | Action | Responsible doc |
|---|---|---|---|
| 1 | Discovery call ends positively | Send proposal | `PROPOSAL_PLAYBOOK.md` |
| 2 | Client accepts proposal | — | (this doc) |
| 3 | Client says yes | Send filled-in service agreement | `CLIENT_SERVICE_AGREEMENT_TEMPLATE.md` |
| 4 | Agreement signed | — | (this doc) |
| 5 | Same day as #4 | Send setup-fee Payment Link | `STRIPE_SETUP_GUIDE.md` §3 |
| 6 | Payment confirmed in Stripe | **Hard gate clears** | `PAYMENT_PROCESS.md` §4 |
| 7 | Same day as #6 | Send onboarding intake | `ONBOARDING_SOP.md` Phase 1 |
| 8 | Intake returned | Configure, verify, deploy | `ONBOARDING_SOP.md` Phases 2-5 |
| 9 | Go-live call | Set up recurring subscription live | `STRIPE_SETUP_GUIDE.md` §4 |

---

## What happens if the client goes quiet at any step

- **After proposal sent (Step 1-2):** follow the "Let me think about it" / "Not right now" guidance in `DISCOVERY_CALL_WORKBOOK.md` Step 4 — set a follow-up date, log it in the prospect tracker (`CLIENT_ACQUISITION_PLAYBOOK.md`)
- **After agreement sent (Step 3-4):** a short, friendly nudge after a few days ("just checking this didn't get buried — happy to answer any questions before you sign") is appropriate. No automated follow-up needed at this volume.
- **After setup-fee link sent (Step 5-6):** see `PAYMENT_PROCESS.md` §4 — a card decline is common and self-resolving; total non-payment after a week or so warrants a direct check-in
