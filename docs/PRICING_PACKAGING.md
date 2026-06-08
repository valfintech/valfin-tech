# Pricing & Packaging
_Created 2026-06-07 — companion to CLIENT_DEPLOYMENT_GUIDE.md / CLIENT_ONBOARDING_INTAKE.md_

## Purpose

This is the document that turns the platform into something that can actually be **sold**. Everything built so far (workflows 01–10, the deployment guide) answers "can we build this for a client?" — this document answers "what do we charge, and what do they get?"

**Important framing note (per the locked brand-foundation positioning):** Valfin Tech sells **Revenue Operations Infrastructure**, not "an automation tool" or "an AI chatbot." Price and package it like infrastructure (setup + ongoing platform fee), not like a one-off project or an hourly service. This is a deliberate move up the value chain — it's also simply more defensible: infrastructure is hard to rip out once it's running a business's lead flow, and recurring revenue compounds.

> **These are recommended starting numbers, not market-validated prices.** They're grounded in the ROI logic below and in typical SMB-vertical-SaaS/managed-automation pricing patterns. Treat them as the opening anchor for client #1's conversation — refine based on what the market actually bears, then update this doc (it should evolve into the canonical *internal* price reference — see the reconciliation note immediately below for why "internal" matters).

---

## ⚠️ Reconciliation With the Live Website (read this before quoting anyone)

A parallel session is actively building `website/` — and it has already shipped a fully-realized pricing page (`website/src/content/pricing.ts`) with **deliberate, considered decisions that this document must defer to** for anything client-facing:

- **Tier names are "Foundation," "Growth," and "Built for you"** — not the names originally drafted below. The mapping is 1:1 (Foundation = Tier 1, Growth = Tier 2, Built for you = Tier 3), and the section headers below now use the website's names as primary, with the original descriptive names kept as subtitles for context.
- **The public site deliberately publishes NO price.** Its own FAQ states the rationale plainly: *"the honest answer depends on how many leads come through your business and how your team works today — and a number that ignores that would either be misleading or wrong."* Every tier reads `priceLabel: "Custom"`. **This is the correct, considered public stance — do not contradict it** by publishing the dollar figures below anywhere client-facing (no website copy, no public one-pagers, no ads).
- **The ROI mechanism is the "Lead Leak Calculator"** (`website/src/lib/calculator.ts` — live, interactive, already built), not a static "one job pays for it" line. It runs `monthlyLeads × 30% assumed-lost-rate × 35% assumed-recoverable-conversion-rate × avgCustomerValue` to produce a personalized recoverable-revenue estimate. **Use the calculator in live conversations** — it's more persuasive than any anchor number because the prospect generates it themselves with their own figures (the site's own UX principle: "prove the problem to themselves before being asked to commit").

**So: what is this document actually for, if not for quoting clients directly?**

It's the **internal anchor reference** — the numbers *you* (the seller) keep in your head walking into a "custom" conversation, so "custom" doesn't mean "improvised." Use it to:
1. Sanity-check that a quote you're about to give is in a defensible, sustainable range (not pricing yourself into an unprofitable engagement, and not over-asking relative to what the value actually supports)
2. Anchor your own mental model of "what does Foundation vs. Growth vs. Built-for-you actually cost to deliver and support, and what should that translate to"
3. Have a number ready *the moment a prospect forces the issue* ("just give me a ballpark") — even a "custom pricing" company needs an internal floor and ceiling before that conversation happens, or risks freezing or guessing badly under pressure

**Bottom line: the tier names, the "no published price" stance, and the calculator-as-ROI-engine are now the canonical public-facing decisions — they were made deliberately and recently, and this document has been updated to defer to them rather than compete with them. The dollar figures below remain useful, but strictly as the seller's private compass, never as a quote sheet to hand across the table.**

---

## The ROI Anchor (use this in every pricing conversation)

> **Update:** the website now has a live, interactive **Lead Leak Calculator** (`/calculator`, built on `website/src/lib/calculator.ts`) that does this math *for* the prospect, with *their* numbers — `monthlyLeads × 30% assumed-lost-rate × 35% assumed-recoverable-conversion-rate × avgCustomerValue`. **Lead every live conversation with that tool, not with the static framing below** — a number the prospect generates themselves lands harder than any number you hand them. The framing below remains useful as your own mental model and as a fallback for conversations where pulling up the calculator isn't practical (e.g., a phone call with no shared screen).

A roofing job (replacement or major repair) typically nets a contractor **$8,000–$15,000+** in revenue (refine this once `CLIENT_ONBOARDING_INTAKE.md` Section D collects the client's *actual* average job value — see the addition made there as part of `CASE_STUDY_DATA_PLAN.md`). The entire pitch compresses to one sentence:

> **"If this system recovers even one job per month that you would otherwise have lost to a missed call or a slow follow-up, it has already paid for itself many times over — every month, indefinitely."**

This system directly attacks the two highest-leakage points in a roofing company's funnel:
- **Missed calls** (workflow 03) — the average home-services business misses 30–60% of inbound calls during business hours, and the lead almost never calls back; a 60-second auto-SMS recaptures a meaningful share of those
- **Slow/no follow-up** (workflows 02/04/05) — leads contacted within 5 minutes convert at dramatically higher rates than leads contacted an hour later; this system responds in seconds, 24/7, and follows up automatically for up to a week

Anchor every pricing conversation here, not on "how many workflows do you get" — the brand-foundation persona (the Owner-Operator) "cares only about booked jobs," not feature counts.

---

## Packaging Tiers

Three tiers, each a strict superset of the one below it — mirrors the natural grouping of the workflows already built (lead capture/response vs. full pipeline operations vs. complete + ongoing optimization).

### Foundation _(internal working name: "Lead Capture & Response")_
The foundational package — stops revenue leakage at the top of the funnel.

| Included | Workflow(s) |
|---|---|
| CRM Adapter (Google Sheets-based CRM, swappable later) | 01 |
| Missed-Call Auto-SMS (instant recovery text within seconds) | 03 |
| Form Capture + AI Lead Scoring (Sonnet-graded Hot/Warm/Cold + Emergency flagging) | 02 |
| Hot Lead Instant Owner Alert | 04 |
| Automated Follow-Up Sequence (Day 1 / 3 / 7, auto-stops at booking) | 05 |

**Internal anchor (do not quote verbatim — see reconciliation note above):** ~$1,500 one-time setup + ~$397/month as your private floor-of-reference for this scope of work

### Growth _(internal working name: "Full Pipeline Automation")_ — *Recommended default for most prospects*
Everything in Tier 1, plus the operational layer that turns captured leads into kept appointments and owner visibility.

| Included (in addition to Tier 1) | Workflow(s) |
|---|---|
| Appointment Booking (owner-facing form → CRM → confirmation SMS) | 06 |
| Daily Pipeline Status Digest (owner SMS each evening) | 07 |
| Weekly Pipeline Report (trailing-7-day metrics SMS) | 08 |
| Appointment Reminders (24h + 2h automated SMS, no-show reduction) | 09 |
| Reschedule/Cancel Handling (inbound-SMS self-service + owner alerting) | 10 |

**Internal anchor (do not quote verbatim — see reconciliation note above):** ~$2,500 one-time setup + ~$697/month as your private floor-of-reference for this scope of work

### Built for you _(internal working name: "Pro / Scale")_
Everything in Tier 2, plus higher-touch service and the optional enhancements cataloged in `CLIENT_DEPLOYMENT_GUIDE.md` §6 — sold individually or bundled as the relationship matures (these become the natural "expansion revenue" path with an existing happy client, not Day-1 asks).

| Add-on (à la carte or bundled) | Notes |
|---|---|
| Branded embeddable web intake form | Replaces the generic n8n-hosted form URL with the client's own branded page |
| Client-facing ROI / performance report | Distinct from the owner's operational digests — built for "show the client the system is working" / contract-renewal conversations |
| Priority support SLA (e.g., same-business-day response) | vs. standard best-effort support in Tiers 1–2 |
| Multi-location / multi-crew configuration | For clients who outgrow the single-owner-phone assumption baked into the current build |
| CRM migration (e.g., Google Sheets → GoHighLevel) | The CRM Adapter pattern already isolates this swap to one workflow — see `CLIENT_DEPLOYMENT_GUIDE.md` §6 |
| Calendar sync (Google Calendar / Outlook) | For field-crew scheduling |
| Phase 5 Retention workflows (review requests, referral invites, seasonal campaigns) | The natural "next phase" once the core funnel is running cleanly |

**Internal anchor:** Growth-tier base + ~$300–$1,000/mo per add-on bundle, scoped per client — your private reference range, not a quote sheet. Treat "Built for you" as a *menu* to navigate live with the prospect (matching the site's own framing — "We design the system around how your business actually runs"), not a fixed package — the highest-margin items here come from genuine post-launch trust, not a Day-1 pitch.

---

## What's Included at Every Tier (the "infrastructure" framing)

Regardless of tier, every client gets:
- A fully configured, live, tested deployment (following `CLIENT_DEPLOYMENT_GUIDE.md` end-to-end)
- Their own dedicated CRM (Google Sheet today; swappable without re-platforming, by design)
- Standard monthly maintenance: credential health checks, schedule-trigger verification, Twilio delivery monitoring
- A direct line to report issues (see `ONBOARDING_SOP.md` for the support-handling pattern)

What's **not** included (and should be priced separately if requested): custom workflow development beyond the standard 10, design/branding work beyond the standard SMS templates, and CRM platform migrations.

---

## Setup Fee Rationale (why charge it at all)

The one-time setup fee exists for two reasons, and both should be said plainly to the prospect:
1. **It covers real, non-recurring labor** — following the ~2–4 hour clone process in `CLIENT_DEPLOYMENT_GUIDE.md`, plus the Twilio carrier-verification process (which can take days and requires back-and-forth), plus live testing against the client's real Sheet/numbers before go-live.
2. **It filters for serious buyers.** A $0-setup, month-to-month offer attracts churn-prone clients who treat the relationship as disposable. A setup fee signals — to both sides — that this is infrastructure being installed, not a trial being sampled.

---

## Contract Structure (recommendation)

- **Month-to-month after setup**, no long-term lock-in — removes the prospect's biggest objection ("what if it doesn't work for us") while the infrastructure-stickiness argument (once it's running their lead flow, ripping it out is costly) does the retention work for you
- **30-day notice to cancel** — standard, fair, easy to say out loud
- Setup fee is **non-refundable once configuration work begins** (it covers real labor, including carrier verification time that can't be "undone")
- `docs/CLIENT_SERVICE_AGREEMENT_TEMPLATE.md` (created 2026-06-07) now formalizes exactly these terms into a fillable contract draft — the commercial terms above are exactly what its §2 ("Fees & Payment") and §3 ("Term & Termination") sections encode. **It still needs an attorney's review before the first real signature** — that template's own header explains why and how to route around the gap in the meantime (its draft form is already a major upgrade over "document terms via email").

---

## Using This Doc in a Live Sales Conversation

1. **Open with the Lead Leak Calculator** (`/calculator` on the live site) — walk the prospect through entering their own monthly-lead and average-job-value numbers, and let *their* recoverable-revenue figure do the persuading. This is the site's designed primary conversion mechanism; use it as designed rather than reinventing a pitch around it.
2. Default to recommending **Growth** — it's the complete operational system and the most natural "this just runs your funnel for you" story; Foundation is the graceful fallback for a price-sensitive prospect, not the lead recommendation (mirrors the live site's own `isFeatured: true` flag on the Growth plan).
3. Mention "Built for you" add-ons only if the prospect asks "what else can this do" — they're expansion revenue, not closing arguments.
4. **Never state a number first.** Per the live site's own FAQ copy: *"we'd rather understand your situation for fifteen minutes and give you a real answer than publish a number that doesn't apply to you."* Say exactly that — then use this document's internal anchors (never spoken aloud) to make sure the number you eventually do give is sound.
5. Always frame the setup fee as "what it costs to professionally install your revenue infrastructure," never as "a deposit" or "a trial fee."
