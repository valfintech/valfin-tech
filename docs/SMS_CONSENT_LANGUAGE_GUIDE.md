# SMS Consent Language — Standard Recommendations
_Created 2026-06-07 — closes the "Open Item" flagged in ONBOARDING_SOP.md: "No standard TCPA consent-language snippet to hand clients... improvised per-client during Phase 3, step 4. Real fix: draft a one-paragraph standard consent-language recommendation once, reuse every time."_

> ## ⚠️ READ THIS FIRST — RECOMMENDATIONS, NOT LEGAL ADVICE
>
> Like `docs/CLIENT_SERVICE_AGREEMENT_TEMPLATE.md`, **this document is a starting point that removes "we have nothing to hand the client" — it is not a substitute for an attorney's review of the client's specific situation.** TCPA exposure depends on jurisdiction, message content/purpose (informational vs. marketing), and how consent was actually obtained and documented — details that vary client to client. What follows are **commonly-recommended patterns**, written so that:
> 1. You have something concrete and professional to hand a client on Day 1 instead of improvising language live during the onboarding call (the exact failure mode this doc exists to remove)
> 2. The client's own attorney (or yours, during the service-agreement review pass) has a real draft to mark up instead of a blank page
>
> **Tell the client directly: "here's our standard recommendation — if your business has unique factors (e.g., you operate in multiple states, or you already have a privacy policy/legal counsel), have them confirm this fits before you publish it."** That sentence alone does most of the liability-routing work — say it every time, not just the first time.

---

## The One Idea That Matters Most

**Consent has to be collected *before* the first automated text goes out — not implied, not assumed, not retrofitted.** Every other recommendation in this document is a variation on that one rule. The system's own safeguards (see "What the System Already Does," below) are a *backstop* for when something slips through — they are not a substitute for doing this right at the point of intake.

---

## Where Consent Needs to Live (map this to the client's actual intake channels — intake question G1 asks exactly this)

A roofing company typically has 2-4 places a phone number first enters their world. Each one needs consent language appropriate to its format:

### 1. Digital forms (website contact/quote forms, Facebook lead ads, Google LSA, etc.)
**Recommended checkbox/disclosure language** (place directly below the phone number field, visible without scrolling past it):

> *"By providing your phone number, you agree to receive text messages from [Business Name] about your inquiry, including appointment confirmations, reminders, and follow-ups. Message and data rates may apply. Message frequency varies. Reply STOP at any time to opt out, or HELP for help."*

**Why each clause is there** (so the client understands it's not boilerplate filler — and so you can defend each line if asked):
- *"about your inquiry, including..."* — describes the actual purpose (informational/transactional, not marketing-blast) — this is the single biggest factor in how the message is classified
- *"Message and data rates may apply. Message frequency varies."* — standard carrier-expected disclosure language
- *"Reply STOP... HELP..."* — the explicit, plain-language opt-out instruction carriers and TCPA guidance both expect to be visible *at the point of consent*, not just buried in a privacy policy

### 2. Paper intake forms / on-site estimate sheets
Same substance, shorter, written for a form a homeowner signs on a clipboard:

> *"I agree to receive text messages from [Business Name] regarding my service request (confirmations, reminders, follow-ups). Reply STOP to any message to opt out. — Signature: ______"*

A signature line matters more here than on a digital form — it's the documentation trail if consent is ever questioned later.

### 3. Phone calls (when the office answers and books a job/estimate verbally)
A short verbal script the office staff can say naturally — **this is the easiest one to skip, and the easiest one to lose track of having said**:

> *"Just so you know, we'll text you a confirmation and a reminder before your appointment — that okay with you?"*

Recommend the client note "(verbal SMS consent given — [date])" in whatever system they jot the lead down in (their CRM sheet, a notebook, wherever) — it's a thirty-second habit that closes the one channel with no natural paper trail.

### 4. The first automated message the system ever sends to a new contact
**Reinforce consent at first contact, regardless of how it was originally collected** — this is a "belt and suspenders" recommendation that costs nothing and adds real protection:

> *"Hi, this is [Business Name] — thanks for reaching out! We'll keep you posted by text about your request. Reply STOP anytime to opt out."*

This can usually be folded into the very first confirmation/acknowledgment message the system already sends (Workflow 02's confirmation SMS, or Workflow 03's missed-call auto-reply) — **it does not need to be a separate message**. When configuring a new client (`ONBOARDING_SOP.md` Phase 3, step 3 — rewriting customer-facing copy in the client's voice), fold a short opt-out reminder into that first-touch template rather than adding new message volume.

---

## What the System Already Does (the backstop — explain this to clients, it's a real selling point)

This is worth walking the client through explicitly, because it's a genuine point of trust-building, not just a compliance checkbox:

- **Standalone opt-out keyword detection** (`Normalize Inbound SMS`, Workflow 10 — see `docs/PROJECT_AUDIT.md` "Compliance Fix," 2026-06-07, verified live in executions 67/68): any inbound text that consists *solely* of an opt-out signal (`STOP`, `STOPALL`, `UNSUBSCRIBE`, `QUIT`, `END`, `CANCEL ALL`, `OPT-OUT`, `REMOVE`, etc.) is detected and routed to silent suppression — **guaranteed zero automated reply**. This runs as a defense-in-depth layer *underneath* Twilio's own carrier-level Advanced Opt-Out handling — two independent layers, not one relying on the other.
- **Why this matters in a sales conversation:** most competitors' "AI texting" pitches never mention opt-out handling at all — being able to say "here's exactly how our system guarantees it never replies to someone who's told it to stop, and here's the test execution that proves it" is a level of specificity prospects rarely hear, and it's exactly the kind of "radical specificity over implied breadth" the brand stands on.

**What this backstop does *not* do:** it cannot retroactively create consent that was never collected. It only guarantees correct behavior *after* a customer asks to stop. The upstream consent-collection patterns above are what prevent the conversation from needing to happen in the first place.

---

## How This Plugs Into the Existing Onboarding Flow

| Step | What happens | Reference |
|---|---|---|
| Intake question G1 | Client tells us whether their current forms collect consent | `CLIENT_ONBOARDING_INTAKE.md` Section G |
| Phase 3, step 4 | If G1 reveals a gap, **hand the client this document** — specifically the channel(s) that match their actual intake methods (most roofing companies will need #1 and #3 above; #2 only if they still use paper) | `ONBOARDING_SOP.md` Phase 3 |
| Phase 3, step 3 | Fold the "first automated message" reinforcement language (pattern #4) into the client's rewritten customer-facing templates — no separate message, no added volume | `ONBOARDING_SOP.md` Phase 3 |
| Go-live verification | Confirm the client has actually *implemented* the recommended language on their live forms before flipping workflows to active — a recommendation that was handed over but never implemented closes nothing | `CLIENT_DEPLOYMENT_GUIDE.md` §5 / §7 |

---

## Operator Notes (delete before handing to a client)

- **Customize `[Business Name]`** in every snippet before sending — copy-pasting Valfin-flavored placeholder text to a client is the exact "feels templated, not custom" mistake `ONBOARDING_SOP.md` Phase 3 already warns against for SMS scripts; this is the same principle applied to compliance copy
- If a prospective client operates in a state with stricter telemarketing rules than the federal TCPA baseline (a small but real list), or has an existing privacy policy / legal counsel, route the question to them rather than guessing — "have your attorney confirm this fits your situation" is always a safe, professional sentence to say
- Once a client has implemented their consent language, **note it as confirmed in their record** (the same place you'd log "agreement signed" / "Twilio verified") — it belongs in the same go/no-go checklist as carrier verification, not as a soft "we mentioned it" item
