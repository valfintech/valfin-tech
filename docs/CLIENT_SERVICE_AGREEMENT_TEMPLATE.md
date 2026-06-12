# Client Service Agreement — Template
_Created 2026-06-07 — closes the "Open Item" flagged in ONBOARDING_SOP.md Phase 0 (the hard gate: "do not proceed without a signed agreement")_

> ## ⚠️ READ THIS FIRST — THIS IS A STARTING DRAFT, NOT A FINISHED CONTRACT
>
> **This document was generated to remove the single biggest blocker to closing client #1: having *nothing in writing* to send. It is explicitly a structured starting point — not a substitute for review by a licensed attorney in your jurisdiction.** Contracts carry real legal and financial weight; getting this wrong costs far more than getting it slow. Specifically:
> - Every `[BRACKETED]` field must be filled in with real, considered values before this is sent to anyone
> - **Have an attorney review this before the first signature** — at minimum, the Limitation of Liability, Data & Privacy, and Compliance sections, which carry the most jurisdiction-specific risk
> - Until that review happens, treat this as a **structured conversation aid and a placeholder for "we have a real process,"** not as a binding instrument — `ONBOARDING_SOP.md` Phase 0 currently instructs documenting terms via email as the interim path; use this template to make that email far more complete and professional, and to fast-track the eventual attorney review by giving them a concrete draft to mark up instead of a blank page
>
> Closing this gap with a considered draft today is far higher-leverage than waiting for a perfect contract before the first conversation can even start — but "started" must not become "shipped without review."

---

## SERVICE AGREEMENT

**Between:** Valfin Tech ("Provider," "we," "us") and **[CLIENT LEGAL BUSINESS NAME]** ("Client," "you")

**Effective Date:** [DATE]

**Engagement Tier:** [Foundation / Growth / Built for you — per `docs/PRICING_PACKAGING.md`; spell out exactly what's included by referencing the tier table, not just the name, so there's no ambiguity later about what was promised]

---

### 1. Services Provided

Provider will design, configure, deploy, and maintain an automated lead-response and pipeline-management system (the "System") for Client's business, consisting of the workflows and capabilities specified in the Engagement Tier above. The System will be configured specifically for Client using the information Client provides via the onboarding intake process (`docs/CLIENT_ONBOARDING_INTAKE.md`), including but not limited to: business identity and contact details, service hours and booking parameters, lead-handling preferences, and brand voice for customer-facing communications.

**What Provider does NOT do under this Agreement** (call this out explicitly to prevent scope-creep disputes later): [e.g., generate leads/run ad campaigns, provide legal/compliance advice beyond the standard recommendations referenced in §6, develop custom features beyond the Engagement Tier's scope, guarantee any specific volume of leads, bookings, or revenue]

### 2. Fees & Payment

| Item | Amount | When Due |
|---|---|---|
| One-time setup fee | $[AMOUNT] | Due before configuration work begins; **non-refundable once work commences** (covers real, non-recoverable labor — see §2a) |
| Recurring platform fee | $[AMOUNT] / month | Billed monthly in advance, beginning on the go-live date |
| [Add-on fees, if any — per the "Built for you" menu] | $[AMOUNT] / month | [terms] |

**§2a — Why the setup fee is non-refundable once work begins:** It covers genuinely non-recoverable labor and third-party processes — most notably the carrier (Twilio A2P 10DLC / toll-free) verification process, which involves submitted paperwork and waiting periods that cannot be "undone" once started. This should be explained to the Client plainly and in person before they sign — not discovered as fine print later (see `docs/PRICING_PACKAGING.md` §"Setup Fee Rationale").

**Late payment:** [e.g., a $X late fee or Y% interest applies to payments more than Z days overdue; Provider may suspend System operation for accounts more than [N] days delinquent, with [M] days' written notice]

### 3. Term & Termination

- This Agreement begins on the Effective Date and continues **month-to-month** following go-live.
- Either party may terminate with **30 days' written notice**.
- Upon termination: [specify what happens to the Client's data — see §5 — and whether any prorated fees apply]
- Provider may terminate immediately for: non-payment beyond [N] days, Client's material breach of §6 (Compliance), or Client's misuse of the System in a manner that risks Provider's standing with third-party providers (e.g., generating carrier complaints through misuse).

### 4. Client Responsibilities

Client agrees to:
- Provide complete and accurate information via the onboarding intake process, and to update Provider promptly if any of that information changes (e.g., business hours, owner contact number, service offerings)
- Maintain their own accounts in good standing with required third parties (Twilio, Google) where Client-owned credentials are used
- Designate a primary point of contact for onboarding, go-live approval, and ongoing support communications
- **Ensure that Client's own customer-facing intake channels (website forms, paper intake sheets, etc.) collect proper consent for automated text-message communication** — Provider will supply standard consent-language recommendations (see §6), but the Client's forms are the Client's responsibility to update and maintain

### 5. Data & Privacy

- **Client owns all of its business data** — leads, customer records, communication logs, appointment history — for the full duration of this Agreement and after its termination.
- The System stores Client's data in a dedicated Google Sheet (or successor CRM, per `docs/CLIENT_DEPLOYMENT_GUIDE.md` §6 "CRM migration") that Client can access directly at any time; Provider does not claim ownership of, or any independent right to use, Client's business or customer data beyond what is necessary to operate the System.
- **Upon termination, Provider will export and deliver Client's complete data** in a standard format (e.g., spreadsheet export) within [N] business days, and will deactivate/delete Provider-side copies within [M] days thereafter, except as required for legal/financial recordkeeping.
- [Add any jurisdiction-specific data-protection clauses your attorney recommends — e.g., state privacy law references, breach-notification timelines]

### 6. Compliance — SMS, TCPA, and Carrier Rules

Both parties acknowledge that automated text messaging to customers is subject to telecommunications regulations (including the U.S. Telephone Consumer Protection Act and individual carrier rules) that require, among other things, documented customer consent to receive messages and honoring opt-out requests.

- **Provider's commitment:** the System includes built-in safeguards — including standalone opt-out keyword detection that silently suppresses any automated reply to likely opt-out messages (STOP, UNSUBSCRIBE, etc. — see `docs/PROJECT_AUDIT.md`, "Compliance Fix," 2026-06-07) — as a defense-in-depth measure alongside carrier-level protections. Provider will also supply Client with standard consent-language recommendations for Client's intake forms.
- **Client's acknowledgment:** Client is responsible for ensuring that consent is properly collected through Client's own customer touchpoints, and for promptly informing Provider of any regulatory complaint or carrier notice it receives related to System-generated messages.
- **Shared responsibility, not finger-pointing:** this section exists so both sides know exactly where their responsibility starts and ends — not to create a blame mechanism. Frame it that way when walking the Client through it.

### 7. Intellectual Property

- Provider retains all rights, title, and interest in the underlying System — its workflows, templates, prompts, and configuration architecture — including all improvements made generally across Provider's client base.
- Client receives a **non-exclusive license to use their specifically-configured instance of the System** for the duration of this Agreement.
- Client's own business data, brand assets, and any custom copy/voice guidance they provide remain Client's property (see §5).

### 8. Limitation of Liability & Disclaimers

> **This is the section most likely to need real attorney customization for your jurisdiction — what follows is a structural placeholder, not language to use verbatim.**

- The System depends on third-party infrastructure (Twilio/carriers for SMS delivery, Google for data storage and email delivery, Anthropic for AI-based message generation) that is outside Provider's direct control; Provider does not guarantee uninterrupted delivery or availability of these third-party services.
- Provider does not guarantee any specific number of leads, bookings, conversions, or amount of revenue — the System is a tool that improves response speed and consistency; business outcomes depend on many factors outside the System's control (market conditions, Client's pricing, crew availability, etc.).
- [Standard limitation-of-liability cap language — e.g., "Provider's total liability under this Agreement shall not exceed the fees paid by Client in the [3/6/12] months preceding the claim" — to be set with attorney input]
- [Standard disclaimer of warranties language — to be set with attorney input]

### 9. Support & Maintenance

Included in the monthly platform fee:
- Standard maintenance: credential health checks, schedule-trigger verification, delivery monitoring (per `docs/ONBOARDING_SOP.md` Phase 6)
- Best-effort support response within [N business days] for non-urgent issues; [same-business-day / X-hour] response for system-down issues
- [If selling a "priority support SLA" add-on per `docs/PRICING_PACKAGING.md` "Built for you" menu, define its specific terms here or in an attached schedule]

### 10. General Provisions

- **Governing law:** This Agreement is governed by the laws of the State of [STATE] *(set this with your attorney — likely Massachusetts, given the Boston-area flagship deployment, but confirm)*.
- **Entire agreement:** This Agreement, together with any attached schedules (pricing tier details, SLA terms), constitutes the entire agreement between the parties regarding the System.
- **Amendment:** Changes to this Agreement must be in writing and signed by both parties — including changes to the Engagement Tier, fees, or scope.
- **Assignment:** [Standard assignment clause — to be set with attorney input]

---

### Signatures

| | |
|---|---|
| **Provider:** Valfin Tech | **Client:** [CLIENT LEGAL BUSINESS NAME] |
| By: ___________________________ | By: ___________________________ |
| Name: [NAME] | Name: [NAME] |
| Title: [TITLE] | Title: [TITLE] |
| Date: ___________________________ | Date: ___________________________ |

---

## How to Use This Template (operator notes — delete before sending to a client)

1. **Fill every `[BRACKETED]` field** with real values — pull the Engagement Tier and fees directly from `docs/PRICING_PACKAGING.md`'s internal anchors (never quote the dollar figures from that doc verbatim to the client without having actually scoped their specific situation — see that doc's reconciliation note on why "custom" pricing means "scoped," not "improvised")
2. **Send it to an attorney before the first real signature** — ideally in parallel with the first sales conversations, so the review isn't the thing standing between "verbal yes" and "signed and paid." A flat-fee contract review from a small-business attorney is a one-time cost that protects every future engagement, not just this one
3. Once reviewed and finalized, this becomes the artifact referenced in `docs/ONBOARDING_SOP.md` Phase 0, step 2 — replacing the "document terms via email" interim workaround
4. **Update `docs/ONBOARDING_SOP.md`'s "Open Items" table** to mark this item closed once the attorney-reviewed version exists (cross-reference this file's path so future-you/future-team finds the real version, not this draft)
