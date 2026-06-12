# Client Welcome & Reference Guide — Fillable Template
_Created 2026-06-08 — closes the #2-ranked gap identified in the architect-level platform review (see `ROADMAP.md`'s 2026-06-08 entries for the full ranking and rationale)_

> **What this is:** a durable, leave-behind reference document to hand the client at go-live (`ONBOARDING_SOP.md` Phase 5, step 1) — something they can re-read after the walkthrough call ends, share with their staff, and come back to in week 6 when they've forgotten exactly what "Hot" means on their own spreadsheet. Currently Phase 5 hands them nothing but a verbal walkthrough; this fills that gap with something tangible, professional, and reusable.
>
> **How to use it:** Copy this file, fill in every `[BRACKETED]` value from the client's intake answers and deployment configuration (`CLIENT_DEPLOYMENT_GUIDE.md` §3), delete this header block and the italicized operator-notes throughout, and hand the result to the client as a clean one-page-per-section PDF or printed packet at the Phase 5 walkthrough. **Read it aloud together at that meeting** — that's the single highest-value five minutes you'll spend on this document; a guide that's handed over silently gets skimmed once and filed away, but one that's walked through together becomes the shared reference both of you point back to later.
>
> **Reusability note:** every section below is written in plain, industry-agnostic language — "leads," "appointments," "your customers," "your team" — deliberately avoiding roofing-specific phrasing so the same template clones cleanly for HVAC, plumbing, dental, legal, or any other vertical with only the bracketed values and the one clearly-marked example section changing. This is the client-facing counterpart to the same lens already applied to Workflow 12's report copy and the Client Acquisition Playbook's ICP — keep it consistent.

---

# Welcome to Your New [System Name — e.g., "Lead Response System"], [Client Company Name]

**Built and supported by Valfin Tech**
**Your point of contact:** [Operator Name] · [Operator Phone] · [Operator Email]
**Go-live date:** [Date]

---

## 1. What this system does for you, in plain language

You're paying for one outcome: **no lead, call, or customer message ever sits unanswered — even when you and your team are busy, asleep, or out on a job.** Here's specifically how that happens for your business:

- **Every inbound call you miss gets an instant text-back** — within seconds, not hours — so the person on the other end knows you got their message and you're already working on it
- **Every new lead — from your website, a form, or a referral — gets read, scored, and replied to automatically**, and the urgent ones get flagged straight to your phone the moment they come in
- **Leads that don't book right away get followed up with automatically** on a schedule (not forgotten, not left to "I'll call them back later" that never happens)
- **Appointments get confirmed, reminded, and tracked** — your customers get a friendly reminder before their appointment, and if they need to reschedule or cancel, the system handles that conversation and lets you know
- **You get told what's happening, on a schedule you can count on** — see section 2 below for exactly what that looks like and when

In short: **the system is the front door to your business, and it never goes home for the night.**

---

## 2. What to expect — your regular updates

You'll start receiving these automatically once the system goes live. None of these require you to do anything — they're built to keep you informed without adding to your workload.

| What | When | What it tells you |
|---|---|---|
| **Instant alerts on urgent leads** | The moment a high-priority lead comes in, any time, day or night | "[Customer Name] just reached out about [need] — this looks urgent, here's their number" |
| **Daily pipeline digest** | Every evening around [time, e.g., 6 PM] | A quick read on where things stand: new leads today, what's booked, what needs your attention |
| **Weekly summary report** | Every [day, e.g., Monday morning] | The bigger picture across the past week — trends, totals, what's working |
| **Monthly results recap** | Every 30 days | A plain-language look back at what the system did for your business that month — leads captured, missed calls recovered, appointments booked and kept. This is the one designed specifically to answer "is this worth what I'm paying for it" — read it, and if any number looks off or you want to see the math behind it, just reply to that text. We mean it when we say we'll walk you through it |

> _Operator note: confirm these cadences match the actual schedule-trigger configuration for this client (see `CLIENT_DEPLOYMENT_GUIDE.md` §3d) before filling in the times above — they're configurable per client and may not match the Valfin Tech defaults shown in this template's placeholder examples._

---

## 3. Your customer record system (the spreadsheet where everything lives)

Every lead, appointment, and conversation the system handles gets written down automatically in one place — your **[CRM Sheet Name]**, a Google Sheet you already have access to at: [link].

You don't need to maintain it — the system does that — but you'll want to know how to read it:

| Term you'll see | What it means |
|---|---|
| **New / Contacted / Booked / Stale** | Where someone is in your pipeline — straight from "just came in" through "on the calendar," with "Stale" meaning it's been a while since anyone heard back from them (the system will keep gently following up regardless) |
| **Follow-up Count** | How many times the system has already reached back out to this person — it stops at a sensible limit so nobody gets pestered |

> _Operator note: this table intentionally uses the exact `Status` vocabulary verified live in `docs/CRM_SHEET_SCHEMA.md` (`Leads` tab) — keep it in sync with that document if the underlying schema ever changes for this client. **V1.1 (2026-06-11):** `Temperature`/`Hot`/`Warm`/`Cold` were removed from the schema — every new lead triggers the same owner notification (email by default), so there's no separate "Hot lead" concept to explain to the client._

---

## 4. What your customers will experience

Here's exactly what the people contacting your business will see and receive — read through these so you can speak to them confidently if a customer ever asks "did I really get a text back from a person?" (You can answer honestly: it's an automated system built specifically for your business, and it's there so a real person — you or your team — never misses what matters.)

- **A missed call** → an immediate text acknowledging it and inviting them to share what they need
- **A form submission or new inquiry** → a prompt, friendly confirmation that someone's looking into it
- **A booked appointment** → a confirmation with the date, time, and what to expect
- **An upcoming appointment** → a reminder the day before and a couple hours ahead, so no-shows go down
- **A request to reschedule or cancel** → a same-conversation reply that handles it gracefully and lets your team know to follow up

> _Operator note: read 2–3 of the actual live SMS scripts aloud at the walkthrough meeting (per `ONBOARDING_SOP.md` Phase 5, step 1) — hearing the actual words in your customer's voice is far more reassuring to a new client than a description of what the words do. Pull them from the relevant workflow's Code/Twilio nodes, rewritten in this client's brand voice per `CLIENT_ONBOARDING_INTAKE.md` Section E._

---

## 5. If something looks off

You will probably never need this section — but here's exactly what to do if you ever think something isn't working right:

1. **Text or call [Operator Phone]** — that's the fastest way to reach us, and it goes directly to a real person (not a ticket queue)
2. **Tell us what you saw and roughly when** — "I didn't get my evening digest last night" or "a customer said they didn't get a confirmation text" is plenty; we can usually trace exactly what happened from there
3. **You don't have to diagnose it yourself.** That's our job, not yours — and as of [date], we run our own automated daily check that's specifically designed to catch a scheduled process going quiet *before* you'd ever notice it missing. If you do notice something first, that's useful information for us either way — tell us.

We'd genuinely rather hear about something small and false-alarm than have you sit on something real. There's no such thing as bothering us with this.

---

## 6. Quick answers to the questions every new client asks in week one

**"How do I know it's actually working?"**
Watch for your first daily digest tonight, and the very first time a call comes in after-hours — you'll get a copy of exactly what the customer received. That's the system, live, doing its job.

**"Can I change the hours it operates, or the times I get updates?"**
Yes — these are configured around your business, not the other way around. Tell [Operator Name] what you'd like changed and we'll handle it.

**"What if a customer texts back something the system can't handle?"**
It's built to recognize what it can and can't confidently handle, and to flag anything uncertain straight to you rather than guess. You'll never be surprised by something it said on your behalf.

**"What if I want to add a team member, change my service area, or update my hours?"**
Just tell us — these are exactly the kinds of updates we handle as part of ongoing support, not a "change request" process you have to navigate.

**"Is this replacing me or my team?"**
No — it's making sure nothing falls through the cracks *before* it gets to you or your team, so the things that do reach you are the ones that actually need a person's judgment. Think of it as the front door that's always staffed, not a replacement for the people inside.

---

## 7. One more thing

This system is new for your business, and it'll keep getting sharper the longer it runs — that's part of what you're paying for, not a one-time install we walk away from. If anything ever feels like it's not quite matching how your business actually works, that's exactly the kind of thing to tell us. We'd rather adjust it to fit you than have you adjust how you work to fit it.

**Welcome aboard.**

— [Operator Name], Valfin Tech

---

> _Operator checklist before handing this to a client (delete this block in the final version):_
> - [ ] Every `[BRACKETED]` value filled in from intake + deployment configuration
> - [ ] Section 2's cadence table matches the live schedule-trigger times for *this* client (§3d of `CLIENT_DEPLOYMENT_GUIDE.md`)
> - [ ] Section 3's CRM terminology matches the live `Leads`/`Appointments` schema for *this* client (especially if any business-rule constants — lead-score bands, status names — were customized per `CLIENT_DEPLOYMENT_GUIDE.md` §3e)
> - [ ] Section 4's sample scripts are the *actual* brand-voice-rewritten copy this client's customers will receive, not the Valfin Tech defaults
> - [ ] Read aloud together at the Phase 5 walkthrough call — not emailed cold
