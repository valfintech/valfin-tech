# Client Acquisition Playbook — Finding & Starting the Conversation With Client #1
_Created 2026-06-08 — closes the highest-ranked gap identified in the architect-level platform review (see `ROADMAP.md`'s 2026-06-08 entry for the full ranking and rationale)_

> **Companion to `PRICING_PACKAGING.md` and `ONBOARDING_SOP.md` — but it covers the step *before* both of them.** Read this first if you don't yet have a prospect on the phone.

## Why this document exists (the gap it closes)

Every commercial asset this project has built so far — `PRICING_PACKAGING.md`, `CLIENT_ONBOARDING_INTAKE.md`, `ONBOARDING_SOP.md`, `CLIENT_SERVICE_AGREEMENT_TEMPLATE.md`, the entire deployment/monitoring/reporting stack — picks up at the exact moment `ONBOARDING_SOP.md` Phase 0 begins: **"Trigger: Prospect agrees to move forward."**

That's a real gap, and on inspection it's the *largest* one left. Nothing in the repository — not the docs, not the website — answers the more fundamental question: **how does a prospect arrive at "agrees to move forward" in the first place?** The website (in active parallel development) is built to *convert* a visitor who already found their way to it — that's its job, and it's doing it well (the Lead Leak Calculator, the honest "measurement in progress" case-study framing, the "who this is for" list). But a brand-new local-services company with no inbound traffic, no search ranking, no existing audience, and no published case study has approximately zero visitors arriving at that website on their own. **Something has to generate the first conversation.** Right now, nothing does — that's the literal bottleneck sitting in front of every other piece of infrastructure this project has built. A fully-tested 12-workflow automation stack, a complete onboarding runbook, and a polished website all sit idle without it.

This is also, not coincidentally, the gap that's hardest to "build" in the conventional sense — it's not a workflow or a template, it's a *plan for a human being (you) to have conversations with other human beings*. That's exactly why it's been the easiest thing to leave undocumented while building out the (genuinely impressive, genuinely necessary) system underneath it — and exactly why closing it now, in writing, with a concrete first move, is the highest-leverage thing this session can do.

---

## The Ideal First-Client Profile (ICP)

### The generalized pattern (write this once, reuse for every vertical)
The system — and therefore the pitch — works best for a business that is **all four** of these at once:
1. **Lead- or appointment-driven** — new business arrives via inbound calls, texts, forms, or referrals, not a sales team or long enterprise procurement cycles
2. **Owner-operator or small-team** — the person who'd say yes to this is the same person who feels the pain of a missed call personally (not a committee, not a franchise corporate office, not a business large enough to already have a dedicated intake/dispatch team)
3. **A missed response visibly costs them money** — an unanswered call or un-followed-up lead is a lost job, not just a minor inconvenience (this is *exactly* the website's own framing: "If a missed response ever costs you money — this is for you")
4. **Currently handling intake manually** — voicemail, a shared inbox, "whoever picks up the phone," sticky notes, or a CRM nobody actually updates

This is deliberately the same filter the website already applies (`homepage.ts`'s "Who this is for" list: Roofing, HVAC, Plumbing, Electrical, Solar, Contractors, Real Estate, Insurance, Legal, Dental, Med Spas, Consulting) — **don't invent a different ICP for outreach than the one the website already promises visitors.** Consistency between "who we say we're for" and "who we actually approach" is itself a trust signal, and a contradiction here would be the kind of thing a sharp prospect notices.

### The concrete starting point: Boston-area roofing
Per the original brief and the live deployment's actual configuration (`Valfin Tech`, Boston-area, single owner-operator), **roofing in the greater Boston metro is still the right first hunting ground** — not because it's the only fit, but because:
- It's the vertical the system was *proven* in (the live deployment, the case study in progress, every customer-facing SMS template) — pitching inside that vertical means every claim you make is backed by something real and explainable in the room, not a hypothetical
- Roofing is exceptionally lead-driven and time-sensitive (a missed call after a storm is a lost five-figure job, not a lost ticket) — the ROI story writes itself, which is exactly what the Lead Leak Calculator is built to surface
- It's a fragmented market of small, local, owner-operated companies — there is no shortage of qualifying businesses within a 30-mile radius of Boston, and zero need to "go national" to find the first one

**Roofing is Version 1 of the framework, not the final market — and the same is true of "Boston-area roofing companies" as a prospect list.** The moment client #1 is live and the case study has real numbers, this same playbook re-runs against the *next* adjacent vertical (HVAC and plumbing are the most natural next steps — same trade-show circuits, same owner-operator profile, same "missed call = lost job" urgency, and the website already lists them). Don't over-invest in roofing-only sourcing infrastructure; build the *pattern*, prove it once, then repoint it.

---

## Where to actually find them (concrete, this-week-doable)

In rough order of conversion likelihood (warmest → coldest):

1. **Your own network first.** Anyone you know — directly or one degree removed — who owns or manages a roofing, HVAC, plumbing, or similar local trade business. A warm introduction converts at a dramatically higher rate than any cold channel below, and it's the fastest path to a first "yes." Spend 30 minutes today just listing names — this step costs nothing and is frequently skipped in favor of more "official-feeling" channels that convert worse.
2. **Local trade associations & chambers of commerce.** The Massachusetts/Greater Boston roofing-contractor associations and local chambers of commerce hold member directories and regular events — both a sourcing list and a venue to meet owners face-to-face (which converts far better than a cold email, especially for a business with no published track record yet).
3. **Google Maps / local-search listings.** Search "roofing company [Boston neighborhood/suburb]" and work outward — this surfaces exactly the kind of small, local, owner-operated businesses the ICP describes, and gives you a name, phone number, and (often) a sense of how responsive they currently are (call them as a "mystery customer" first — see below).
4. **Local Facebook groups / Nextdoor / town business pages.** Owner-operators in this segment are often more reachable through these informal local channels than through their own (frequently neglected) websites.
5. **Referrals from adjacent-trade professionals.** Insurance adjusters, public adjusters, real-estate agents, and home inspectors regularly refer business to roofers and hear firsthand which ones are slow to respond — they're a uniquely well-informed source of warm introductions to businesses that would visibly benefit from this system.

> **Do the "mystery customer" test before you ever reach out.** Call 5–10 candidate businesses yourself, posing as a prospective customer with a real-sounding need ("I think I might have storm damage, can someone come take a look?"). Time how long it takes to get a real human response. The businesses where that test goes badly — slow pickup, no callback, voicemail that goes nowhere — are not just *qualified* prospects, they are prospects who will **viscerally recognize the exact problem this system solves** the moment you describe it back to them. This single exercise turns a cold list into a warm, evidence-backed approach list, and gives you a true, specific, first-person opening line for the conversation ("I actually called your office last week pretending to be a customer, and here's what happened...").

---

## The opening approach — and the "no case study yet" objection

You will, for a while, be approaching prospects without a published case study. **Don't hide that. Lead with it — the same way the website already does.**

The website's entire trust section is built around radical honesty: *"We'd rather show you one real result than tell you about a hundred imaginary ones,"* and the in-progress case study page says, in plain language, "there's no number here yet, and here's exactly why, and here's exactly how we're measuring it when there is one." **That positioning is not a weakness to work around in sales conversations — it is the single most differentiated thing you have to say, and it should be said out loud, deliberately, as the opening move, not discovered later as a disappointing footnote.**

This reframes "you have no case study" from an objection you have to survive into a **founding-partner offer** you get to make:

> *"I'll be straight with you — we're early. We built this system inside one real roofing company here in the Boston area, it's live and running their business right now, and we're in the middle of measuring exactly what it's done for them so we can publish real, verified numbers — not estimates, the actual before-and-after from their own records. You'd be one of the first businesses outside that one to run it. Here's what that means for you: you get more attention during setup than a client #50 ever will, you get a say in how it evolves, and you lock in founding pricing that won't be on the table once we have a track record to charge a premium against. In exchange, I'm going to ask if we can use your real numbers — good or not-as-good — in how we tell this story afterward, the same honest way we're telling it now."*

This does several things at once: it's **true** (so it's sustainable across dozens of conversations without ever needing to be walked back), it **mirrors the website's voice exactly** (so a prospect who later visits the site feels reinforced, not confused by a different story), it converts the single biggest weakness into the single most memorable thing said in the room, and it **pre-negotiates the case-study consent** that `CASE_STUDY_DATA_PLAN.md` and `ONBOARDING_SOP.md` Phase 6 already need to collect later — closing two gaps with one conversation.

### First-contact templates (adapt the channel, keep the honesty)

**Warm introduction (in person or by phone) — the highest-converting option, use whenever available:**
> "Hey [Name], I'm building something for local trade businesses — it answers every missed call and lead within seconds, day or night, so nothing falls through the cracks. I tested it for real inside a roofing company here in Boston and it's live and running today. I'm looking for one or two more businesses to bring on as founding partners — more hands-on attention, locked-in pricing, and a real say in how it works. Worth fifteen minutes to see if it'd be useful for you?"

**Cold outreach (email or a short voicemail) — use when there's no warm path:**
> "Hi [Name] — quick one. I help local roofing/[trade] businesses make sure no inbound call or lead ever goes unanswered, even after hours — the system replies in seconds and gets it onto your calendar automatically. It's live and running inside a real Boston-area roofing company right now (happy to be specific about what that looks like day to day). I'm bringing on a couple of founding clients with hands-on setup and locked-in pricing before this becomes a bigger, more expensive thing to join. If a missed call or slow follow-up has ever cost you a job, I'd like fifteen minutes to show you exactly what this looks like for a business like yours — no pitch, just a walkthrough of the math using your own numbers."

**In-person (trade events, chamber meetings, supplier counters) — the 20-second version:**
> "I help local trade businesses stop losing jobs to missed calls and slow follow-ups — there's a system that answers and books for you automatically, and it's live inside a roofing company here in Boston right now. Can I grab fifteen minutes with you sometime this week to show you what it'd look like for your business specifically?"

In every version: **lead with the real, the live, and the local** — not adjectives, not projections. That's the throughline connecting this playbook, the website, and the product itself.

---

## The first real conversation (the 15-minute discovery call)

This is where you hand off into the assets that already exist — don't reinvent anything here, just sequence what's already built:

1. **Open by listening, not pitching.** Ask how they currently handle inbound calls/leads, what happens after hours, and — if you did the mystery-customer test on this exact business — reference it honestly ("I actually tried calling your office last week as a customer, and here's what I found..."). This does more to earn trust in two minutes than any feature list could in twenty.
2. **Walk them through the Lead Leak Calculator** (`/calculator` on the live site) using *their* numbers — monthly leads, average job value — and let the resulting recoverable-revenue figure make the case. This is the site's designed core conversion mechanism and `PRICING_PACKAGING.md` already documents it as the right opening move; use it exactly as designed rather than reinventing a pitch around it.
3. **Make the founding-partner offer explicitly** (see the framing above) — and if they're receptive, that's the literal moment this playbook hands off to `ONBOARDING_SOP.md` Phase 0 ("prospect agrees to move forward") and `PRICING_PACKAGING.md`'s existing sales-conversation guidance (default to the **Growth** tier, never state a price first, frame the setup fee as infrastructure investment).
4. **If they're not ready, don't let the conversation evaporate.** Ask permission to follow up in a few weeks, and put them in the simple tracker below — "not yet" is overwhelmingly the most common outcome of a first conversation in any sales process, and a prospect who said "call me in a month" is dramatically warmer than a new cold name.

---

## Tracking prospects (don't let this become its own mess to manage)

You don't need new software for this — **use the same pattern the product itself uses**, because it's proven, because it's already familiar, and because it's a small, satisfying piece of "eating your own cooking" that's worth mentioning in a sales conversation if it ever comes up ("I track my own pipeline the same simple way your customers' leads get tracked — it's the same philosophy: simple, visible, nothing falls through the cracks").

A single Google Sheet with these columns is enough — deliberately mirroring the live CRM's `Leads` tab shape (see `docs/CRM_SHEET_SCHEMA.md`) so the pattern stays familiar:

```
Prospect Name | Business | Phone | Source (network/association/maps/referral/event) |
First Contact Date | Status (Not Yet Contacted / Contacted / Call Booked / Discovery Done /
Proposal Sent / Won / Lost / Follow Up Later) | Follow-Up Date | Notes
```

Update it after every single touch, the same way the system insists nothing about a real customer lead goes untracked. The discipline is the same; only the spreadsheet's purpose has changed.

---

## How this generalizes (V2 and beyond)

When it's time to expand beyond roofing — likely HVAC or plumbing first, per the shared owner-operator profile and the website's own "who this is for" ordering — **re-run this exact playbook with three changes and nothing else:**
1. Swap "roofing" for the new vertical in the ICP step and the outreach scripts
2. Swap the sourcing channels in step 2 ("local trade associations") for that vertical's equivalent bodies
3. Update the founding-partner pitch's "tested inside a real roofing company" line to reference whichever flagship case study is live and verified by then — by that point, you'll likely have *two* real, named results to point to instead of one in-progress story, which makes the entire opening dramatically stronger without changing its structure at all

That's the whole multi-industry expansion plan for the *acquisition* side of the business: not a different playbook per vertical, but the same honest, locally-grounded, proof-led approach, re-pointed. Exactly the same "build the reusable pattern once, clone the specifics" philosophy this project already applies to the technical deployment stack.

---

## The one-page summary (pin this next to the `ONBOARDING_SOP.md` summary)

```
This week:  List 10 names from your own network → call 5-10 candidates as a "mystery
            customer" → start the prospect tracker

Next:       Reach out (warm intro first, always) using the founding-partner framing —
            true, honest, and the single most differentiated thing you can say

Then:       15-minute discovery call → Lead Leak Calculator with their numbers →
            founding-partner offer → hands off directly into ONBOARDING_SOP.md Phase 0
```
