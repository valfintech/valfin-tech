# Pricing & Packaging
_Created 2026-06-07 — companion to CLIENT_DEPLOYMENT_GUIDE.md / CLIENT_ONBOARDING_INTAKE.md_

## Purpose

This is the document that turns the platform into something that can actually be **sold**. Everything built so far (workflows 01–10, the deployment guide) answers "can we build this for a client?" — this document answers "what do we charge, and what do they get?"

**Important framing note (per the locked brand-foundation positioning):** Valfin Tech sells **Revenue Operations Infrastructure**, not "an automation tool" or "an AI chatbot." Price and package it like infrastructure (setup + ongoing platform fee), not like a one-off project or an hourly service. This is a deliberate move up the value chain — it's also simply more defensible: infrastructure is hard to rip out once it's running a business's lead flow, and recurring revenue compounds.

> **These are recommended starting numbers, not market-validated prices.** They're grounded in the ROI logic below and in typical SMB-vertical-SaaS/managed-automation pricing patterns. Treat them as the opening anchor for client #1's conversation — refine based on what the market actually bears, then update this doc (it should evolve into the canonical price list).

---

## The ROI Anchor (use this in every pricing conversation)

A roofing job (replacement or major repair) typically nets a contractor **$8,000–$15,000+** in revenue. The entire pitch compresses to one sentence:

> **"If this system recovers even one job per month that you would otherwise have lost to a missed call or a slow follow-up, it has already paid for itself many times over — every month, indefinitely."**

This system directly attacks the two highest-leakage points in a roofing company's funnel:
- **Missed calls** (workflow 03) — the average home-services business misses 30–60% of inbound calls during business hours, and the lead almost never calls back; a 60-second auto-SMS recaptures a meaningful share of those
- **Slow/no follow-up** (workflows 02/04/05) — leads contacted within 5 minutes convert at dramatically higher rates than leads contacted an hour later; this system responds in seconds, 24/7, and follows up automatically for up to a week

Anchor every pricing conversation here, not on "how many workflows do you get" — the brand-foundation persona (the Owner-Operator) "cares only about booked jobs," not feature counts.

---

## Packaging Tiers

Three tiers, each a strict superset of the one below it — mirrors the natural grouping of the workflows already built (lead capture/response vs. full pipeline operations vs. complete + ongoing optimization).

### Tier 1 — **Lead Capture & Response** ("Never Lose a Lead Again")
The foundational package — stops revenue leakage at the top of the funnel.

| Included | Workflow(s) |
|---|---|
| CRM Adapter (Google Sheets-based CRM, swappable later) | 01 |
| Missed-Call Auto-SMS (instant recovery text within seconds) | 03 |
| Form Capture + AI Lead Scoring (Sonnet-graded Hot/Warm/Cold + Emergency flagging) | 02 |
| Hot Lead Instant Owner Alert | 04 |
| Automated Follow-Up Sequence (Day 1 / 3 / 7, auto-stops at booking) | 05 |

**Suggested pricing:** $1,500 one-time setup + **$397/month**

### Tier 2 — **Full Pipeline Automation** ("Run the Whole Funnel on Autopilot") — *Recommended default for most prospects*
Everything in Tier 1, plus the operational layer that turns captured leads into kept appointments and owner visibility.

| Included (in addition to Tier 1) | Workflow(s) |
|---|---|
| Appointment Booking (owner-facing form → CRM → confirmation SMS) | 06 |
| Daily Pipeline Status Digest (owner SMS each evening) | 07 |
| Weekly Pipeline Report (trailing-7-day metrics SMS) | 08 |
| Appointment Reminders (24h + 2h automated SMS, no-show reduction) | 09 |
| Reschedule/Cancel Handling (inbound-SMS self-service + owner alerting) | 10 |

**Suggested pricing:** $2,500 one-time setup + **$697/month**

### Tier 3 — **Pro / Scale** ("White-Glove + Growth Add-Ons")
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

**Suggested pricing:** Tier 2 base + **$300–$1,000/mo** per add-on bundle, scoped per client. Treat Tier 3 as a *menu*, not a fixed package — the highest-margin items here come from genuine post-launch trust, not a Day-1 pitch.

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
- See `docs/CLIENT_SERVICE_AGREEMENT_TEMPLATE.md` *(future deliverable — not yet written; flagged in ROADMAP as a Tier-1 V1 item once client #1 is closer to signing)* for the actual legal template — this pricing doc defines the commercial terms; a template service agreement should formalize them before the first signature.

---

## Using This Doc in a Sales Conversation

1. Open with the ROI anchor (one recovered job pays for the system many times over)
2. Default to pitching **Tier 2** — it's the complete operational system and the most natural "this just runs your funnel for you" story; Tier 1 is the fallback for a price-sensitive prospect, not the lead pitch
3. Mention Tier 3 add-ons only if the prospect asks "what else can this do" — they're expansion revenue, not closing arguments
4. Always frame the setup fee as "what it costs to professionally install your revenue infrastructure," never as "a deposit" or "a trial fee"
