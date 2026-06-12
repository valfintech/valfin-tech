# Client Onboarding Intake Packet
_Created 2026-06-07 — companion to CLIENT_DEPLOYMENT_GUIDE.md / PRICING_PACKAGING.md / ONBOARDING_SOP.md / CASE_STUDY_DATA_PLAN.md_

## Purpose

`docs/CLIENT_DEPLOYMENT_GUIDE.md` tells **us** every value that must be configured to clone the system for a new client. This document is the **client-facing counterpart** — the questionnaire we send (or walk through live) to actually *collect* those values, in plain language, before deployment work begins.

Without this document, collecting ~30 configuration values would happen ad hoc over email and phone calls — slow, error-prone, and a poor first impression. With it, the client receives one clean packet on Day 1, and by the time it comes back, deployment can start immediately (see `ONBOARDING_SOP.md` for exactly when to send this and what happens next).

**How to use this:** Send as a fillable doc (Google Form / Google Doc / PDF — whichever the client prefers) immediately after the service agreement is signed. Every question below maps directly to a row in `CLIENT_DEPLOYMENT_GUIDE.md` §3 — the "Maps to deployment guide" column shows exactly where each answer lands.

---

## Section A — Business Identity & Branding

| # | Question | Why we need it | Maps to deployment guide |
|---|---|---|---|
| A1 | What is your exact legal/brand name as you want it to appear in customer text messages? (e.g., "Valfin Tech" — keep it short, this appears in every SMS) | Appears in every customer-facing message across the system | §3a "Company name" |
| A2 | What's your primary service area (city/region)? | Used in customer-facing copy and the confirmation-SMS prompt | §3e business-rule context |
| A3 | What services do you offer that this system should know about? (e.g., roof replacement, repair, inspection, gutter work, emergency tarping) | Drives the AI confirmation-SMS prompt's understanding of your services | Workflow 02 system prompt tuning |

## Section B — Contact & Phone Setup

| # | Question | Why we need it | Maps to deployment guide |
|---|---|---|---|
| B1 | What mobile number should receive instant lead alerts and daily/weekly reports? (This is the number our system will text *you* — not your business line) | The "owner phone" that every alerting workflow sends to | §3a "Owner phone" |
| B2 | Do you already have a Twilio account/number, or do you need us to provision one for you? | Determines whether we're configuring an existing number or starting carrier verification from scratch — **this can take several days, so we ask it first** | §1 prerequisites — "#1 go-live blocker" |
| B3 | What's your business's main public phone number (the one customers call)? | Used for missed-call detection wiring and customer-facing copy | Workflow 03 setup |

## Section C — Hours, Booking & Scheduling

| # | Question | Why we need it | Maps to deployment guide |
|---|---|---|---|
| C1 | What are your normal business hours (days + times)? | Drives the booking-form time slots and the `CONFIG` business-hours constants (Workflow 06) | §3e "Booking time slots" |
| C2 | When you book a job/estimate visit, what appointment lengths or time slots do you typically offer? (e.g., hourly slots 8 AM–5 PM, or fixed morning/afternoon blocks) | Configures the appointment-booking form's dropdown options | §3e "Booking time slots" |
| C3 | What timezone are you in? | All scheduled messages (digests, reports, reminders, follow-ups) are timed around this — **getting it wrong means texts arrive at inconvenient hours, which is both bad UX and a compliance concern** | §3d schedule & cadence values |
| C4 | How far in advance do you want customers reminded of an appointment? (Our default: 24 hours and 2 hours before — let us know if you'd prefer different windows) | Configures the reminder workflow's timing windows | §3e "Reminder windows" |

## Section D — Lead Handling Preferences

| # | Question | Why we need it | Maps to deployment guide |
|---|---|---|---|
| D1 | What makes a lead "urgent" to you? (e.g., active leak, storm damage, insurance claim deadline) | Helps us tailor brand-voice copy and prioritize support — every lead triggers the same owner alert (V1.1 removed AI lead scoring/Hot-Emergency classification) | Workflow 02 system prompt (brand voice) |
| D2 | If we follow up automatically with leads who haven't responded, how many touches feels right before we stop? (Our default: 3 attempts over 7 days) | Configures the follow-up sequence cadence | §3e "Follow-up cadence" |
| D3 | Where do your leads currently come from? (Website form, Google/Facebook ads, referrals, signs/trucks, etc.) | Helps us tune source-tracking and gives the weekly report meaningful categories | Workflow 08 "top sources" |
| D4 | What's your average revenue on a completed job — a typical roof replacement, major repair, whatever your usual "win" looks like? | Sharpens the ROI conversation beyond industry-average figures, and is the multiplier behind every "$ recovered" estimate we'll ever show you | `PRICING_PACKAGING.md` ROI anchor; `CASE_STUDY_DATA_PLAN.md` Metric 4 ($-recovered calculation) |
| D5 | Roughly, in a typical month *before* working with us: how many calls do you think go unanswered, and how many jobs do you book? | This becomes our **baseline** — the "before" half of every before/after comparison we'll ever be able to show. **We only get one chance to capture this honestly, before the system changes anything** — so we ask it on Day 1, not after go-live | `CASE_STUDY_DATA_PLAN.md` Window 1 (baseline capture) — feeds the flagship case-study numbers directly |

## Section E — Brand Voice (what your customers will actually read)

| # | Question | Why we need it | Maps to deployment guide |
|---|---|---|---|
| E1 | When we text your customers automatically (confirmations, reminders, missed-call follow-ups), what tone fits your brand — friendly & casual, professional & concise, or something else? Give us 1–2 example phrases you'd actually say to a customer. | Every customer-facing SMS template is rewritten in the client's voice before go-live, not left as generic boilerplate | §3c customer-facing surfaces |
| E2 | Is there anything you'd never want an automated text to say or imply to a customer? | Avoids brand-damaging surprises; also surfaces compliance concerns early (e.g., promises about pricing, timelines, warranties) | §7 known compliance considerations |

## Section F — Existing Tools & Data

| # | Question | Why we need it | Maps to deployment guide |
|---|---|---|---|
| F1 | Do you currently track leads/customers anywhere (spreadsheet, CRM, paper, nothing)? If yes, can you share a sample/export? | Determines whether we're starting fresh or migrating existing data into the new CRM sheet | §1 "Google Sheet template copy" |
| F2 | Do you use any other software we should know about (QuickBooks, scheduling apps, review-request tools, etc.)? | Flags future integration opportunities (not required for V1, but informs the Tier 3 conversation) | `PRICING_PACKAGING.md` Tier 3 menu |

## Section G — Compliance & Consent (important — read carefully)

| # | Question | Why we need it | Maps to deployment guide |
|---|---|---|---|
| G1 | Do your current lead-intake forms (website, paper, etc.) collect customer consent to receive text messages? | Automated SMS to customers requires documented consent (TCPA) — if this isn't currently happening (or even if it is and could be stronger), we'll hand you `docs/SMS_CONSENT_LANGUAGE_GUIDE.md`: ready-to-use language for whichever channels you actually use (website forms, paper sheets, phone scripts) before go-live | §7 compliance considerations; `docs/SMS_CONSENT_LANGUAGE_GUIDE.md` |
| G2 | Are you aware that carriers require phone-number verification (A2P 10DLC / toll-free) before business SMS can be reliably delivered, and that this can take several days? | Sets expectations early — this is the single longest lead-time item and the actual gate on go-live, not anything on our side | §1 prerequisites table |

---

## What Happens After You Submit This

1. We begin Twilio number provisioning/verification immediately (it has the longest lead time — see G2)
2. We set up your dedicated CRM and configure all ten workflows using your answers above
3. We rewrite every customer-facing message in your voice (Section E) and send you the full script for review before anything goes live
4. We run a full live-data verification pass (see `CLIENT_DEPLOYMENT_GUIDE.md` §5) — nothing reaches a real customer until this passes
5. We schedule a go-live walkthrough call with you

**Typical timeline: 1–2 weeks from submission to go-live**, gated almost entirely by carrier verification (item B2/G2) — not by our configuration work, which is usually complete within the first 2–4 hours.
