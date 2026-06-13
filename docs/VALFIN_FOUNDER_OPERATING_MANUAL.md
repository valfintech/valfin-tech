# Valfin Tech — Founder Operating Manual
**Version 1.0 | Created 2026-06-08**
**Status: Living document — update after every major decision, client, or lesson**

> **What this is:** The single source of truth for how Valfin Tech operates. Not a polished pitch document — a working manual. Includes honest mistakes, inefficient paths taken, and what we'd do differently. If something here contradicts a marketing document, this document wins. If something here is out of date, update it immediately — stale operating manuals cause bad decisions.

---

## Table of Contents

1. [Executive Overview](#1-executive-overview)
2. [Company Mission, Vision & Principles](#2-company-mission-vision--principles)
3. [The Business: What We Sell](#3-the-business-what-we-sell)
4. [Offer Architecture](#4-offer-architecture)
5. [Positioning & Messaging](#5-positioning--messaging)
6. [Target Customers](#6-target-customers)
7. [Sales Process](#7-sales-process)
8. [Client Onboarding](#8-client-onboarding)
9. [Delivery Process](#9-delivery-process)
10. [Pricing Philosophy](#10-pricing-philosophy)
11. [Operations](#11-operations)
12. [Technical Architecture](#12-technical-architecture)
13. [Workflow Inventory](#13-workflow-inventory)
14. [Knowledge Base: Terminology & Glossary](#14-knowledge-base-terminology--glossary)
15. [Design Decisions & Rationale](#15-design-decisions--rationale)
16. [What We Intentionally Did Not Build](#16-what-we-intentionally-did-not-build)
17. [Training Guides](#17-training-guides)
18. [Lessons Learned: Honest History](#18-lessons-learned-honest-history)
19. [Gaps Currently Open](#19-gaps-currently-open)

---

## 1. Executive Overview

Valfin Tech builds Revenue Operations Infrastructure for local service businesses. The core product is the **Revenue Recovery System** — an end-to-end automated system that captures every inbound lead (calls, texts, forms), responds within seconds, follows up automatically across multiple touches, and books appointments onto the business's calendar.

**Where we are today (2026-06-10):**
- V1 of the Revenue Recovery System is fully built, live, and tested inside a Boston-area roofing company
- 13 workflows + 1 internal lead-capture workflow running in production on n8n (valfin.app.n8n.cloud)
- Marketing website live at `https://valfintech.com` (Vercel + Cloudflare, SSL active, deployed Jun 9 2026)
- Internal lead capture (contact form → n8n → Sheet + Gmail + SMS) wired and verified end-to-end as of Jun 10 2026
- Zero paying clients (the roofing deployment is the founding internal case study, not a paid client)
- All previously identified launch blockers are resolved: domain redirect fixed, env vars confirmed, real test lead submitted and received via Gmail
- V1 is operationally launch-ready — all tooling, documentation, and operational assets exist to acquire and deploy client #1

**The fundamental business idea:** Local service businesses (roofing, HVAC, plumbing, dental, legal, etc.) lose revenue not because they lack leads, but because those leads go unanswered or un-followed-up. The Revenue Recovery System fixes that, automatically, 24/7. One recovered job per month typically pays for the system many times over.

**What makes this defensible:** We built the system inside a real business before calling it a product. We're building trust through radical honesty (no fake numbers, no estimated results dressed up as proof) rather than marketing hype. The system is designed as a reusable vertical-market framework — roofing is Version 1, not the final market.

---

## 2. Company Mission, Vision & Principles

### Mission
Make sure no business loses a customer it already earned the right to — because of something as fixable as a slow response.

### Vision (Long-Term)
Build the quiet infrastructure that runs underneath lead-driven businesses — protecting every dollar of revenue already generated, end to end, without the business owner having to manage another dashboard to make it happen.

**Important distinction:** This is not an "AI Employee company." AI is a capability inside a larger system. Our category is **Revenue Operations Infrastructure**. This distinction matters in sales conversations, hiring conversations, and investor conversations — the mechanism stays secondary to the outcome.

### Operating Principles
These principles govern every decision — product, sales, operations, communication:

1. **Build in the field, not in a lab.** Every capability gets proven inside a real, operating business before it reaches anyone else's. We shipped the Revenue Recovery System inside a real roofing company before calling it a product.

2. **Show our numbers, not our adjectives.** No "results may vary." No invented statistics. No rounded-up estimates dressed as proof. If we can't show a real number, we say so plainly — and when we do have real numbers, we show the math, not just the headline.

3. **Design for businesses, not for demos.** A system that looks impressive in a sales call but adds friction to Tuesday afternoon is not worth shipping. Optimize for the user's actual daily experience.

4. **Stay after the install.** This is infrastructure we run for clients, not software we hand over. We build it around each business and keep it tuned as the business changes.

5. **Honest over impressive.** "We don't have a published case study yet — and here's exactly why, and here's when we will" is more powerful than a fabricated proof point. Every competitor who fakes it gives us a positioning advantage.

---

## 3. The Business: What We Sell

### The Revenue Recovery System (V1)

**What it is in one sentence:** A system that makes sure a business never loses a customer to a slow response — by guaranteeing that every inbound call, text, and form gets answered fast, followed up automatically, and converted to a booking.

**The four stages (canonical — every description traces back here):**

| Stage | What happens | When it runs |
|---|---|---|
| **Capture** | Every inbound contact (call, text, form) is captured the moment it happens | 24/7, including nights, weekends, holidays |
| **Respond** | Fast, qualifying conversation in the business's voice | Within seconds of the inbound contact |
| **Follow up** | Automatic multi-touch follow-up until the lead books or gives a clear no | Day 1, Day 3, Day 7 — then stops |
| **Book** | Successful conversations end in a booked appointment on the business's calendar | Integrated with the business's existing calendar/CRM |

**What V1 is NOT (important — do not round up in sales conversations):**
- It does not generate new leads. It recovers leads that already existed.
- It is not a chatbot bolted to a website. It covers calls, texts, and forms.
- It does not operate without human oversight. Active tuning is a feature, not a gap.
- It is not "AI software." It is infrastructure that includes AI as one component.

### The Revenue Operating System (Future Vision)
V1 is the Revenue Recovery System — the "stop the bleeding" product. The longer-term vision is a **Revenue Operating System** that sits underneath the entire revenue function of a business: not just recovery, but full pipeline operations, reporting, forecasting, and optimization. This is the 3–5 year vision, not what we sell today. Do not pitch V2 as part of a V1 conversation.

---

## 4. Offer Architecture

Three tiers, each a strict superset of the tier below. Tier names are deliberately generic — the website uses "Foundation," "Growth," and "Built for you."

### Foundation — "Lead Capture & Response"
Stops revenue leakage at the top of the funnel. Core components:

| What it does | Workflow |
|---|---|
| Single database for all leads (Google Sheets CRM) | 01 — CRM Adapter |
| Instant text-back on missed calls (within seconds) | 03 — Missed-Call Auto-SMS |
| Form/webhook capture + CRM upsert + AI confirmation SMS | 02 — Form Capture + Confirmation |
| Instant owner alert (email by default, SMS optional) for every lead | 04 — Every Lead Alert |
| Automated Day 1/3/7 follow-up sequence (stops at booking) | 05 — Follow-Up Sequence |

**Internal pricing anchor (do not quote to clients — use the calculator first):** ~$1,500 setup + ~$397/month

### Growth — "Full Pipeline Automation" *(Default recommendation)*
Everything in Foundation plus operational visibility and appointment management:

| What it adds | Workflow |
|---|---|
| Owner books appointments via a simple form | 06 — Appointment Booking |
| Daily evening email digest: pipeline status (SMS optional) | 07 — Pipeline Status Digest |
| Weekly Monday morning email: trailing-7-day metrics (SMS optional) | 08 — Weekly Pipeline Report |
| Automated 24h + 2h appointment reminders | 09 — Appointment Reminders |
| Inbound SMS handling for reschedule/cancel requests | 10 — Reschedule/Cancel |

**Internal pricing anchor:** ~$2,500 setup + ~$697/month

### Built for You — "Scale / Custom"
Everything in Growth plus add-ons priced individually. **This is an expansion-revenue menu for existing happy clients, not a Day-1 pitch:**
- Client ROI Report (Workflow 12 — already built, normally included with Growth as part of V1)
- System Health Monitor (Workflow 11 — already built, normally included as part of V1)
- Branded web intake form replacing the generic n8n form URL
- Multi-location / multi-crew configuration
- CRM migration (Google Sheets → GoHighLevel or similar)
- Calendar sync (Google Calendar / Outlook)
- Phase 5 retention workflows (review requests, referral invites, seasonal campaigns)
- Priority support SLA

**Internal pricing anchor:** Growth base + $300–$1,000/mo per add-on bundle

### What's Included at Every Tier (Non-Negotiable Baseline)
- Fully configured, live, tested deployment
- Dedicated CRM (Google Sheets, swappable by design)
- Standard maintenance: credential health checks, schedule verification, Twilio monitoring
- Direct support line (text/call)
- Client ROI Report every 30 days (Workflow 12)
- System Health Monitor protecting operator visibility (Workflow 11)

---

## 5. Positioning & Messaging

### The Category
**Revenue Operations Infrastructure** — not "AI Employee company," not "automation tool," not "chatbot."

This choice is deliberate and important:
- "Chatbot" actively undercuts the positioning — chatbots answer questions on websites. This system covers calls, texts, forms, and follows up over days.
- "AI Employee" is accurate as a mechanism description but frames us as a player in a crowded, feature-fight category.
- "Revenue Operations Infrastructure" positions us closer to the value (revenue operations) and the durability (infrastructure = hard to rip out once running your business).

### The Core Insight
> "This was never a marketing problem."

The businesses we serve aren't struggling to generate leads. They're struggling to capture, respond to, and convert the leads they already have. That reframe — from "you need more leads" to "you're losing the ones you already have" — is the most important sentence in our positioning.

### The Proof Standard
We do not publish estimated results, rounded-up numbers, or "typical results" language. Every proof claim either:
1. Has a specific, verifiable number from a real client's own records
2. Is clearly labeled as "in progress" / "being measured"

This is a competitive advantage, not just an ethical standard. In a market full of AI companies with invented case studies, "we'll tell you when we know, and here's exactly how we're measuring it" builds the kind of trust that AI hype erodes.

### Brand Voice Rules
- Plain language. Business-owner vocabulary (not startup vocabulary, not developer vocabulary).
- Pain-first framing: start with the problem, not the solution.
- Never lead with "AI." The mechanism is secondary to the outcome.
- Five-second clarity on every claim. If a prospect can't parse it in a sentence, rewrite it.
- No exclamation points, no "revolutionary," no "game-changing."
- Specific is more trustworthy than impressive. "4 out of 10 calls were going unanswered" beats "dramatically better response rates."

### What Not to Say (Never, In Any Context)
- "AI Employee" (as our primary identity)
- "Chatbot" or "bot"
- "Software" (we are infrastructure, not a SaaS tool to operate)
- "Results may vary" or similar hedging language
- Any unverified statistic dressed up as proof
- Promises about lead generation

---

## 6. Target Customers

### The Ideal Customer Profile (ICP)
Four criteria — must meet **all four**:

1. **Lead- or appointment-driven business** — new revenue arrives via inbound calls, texts, forms, or referrals. Not enterprise procurement, not retail walk-in.
2. **Owner-operator or small team** — the person who decides to buy is the same person who feels the pain of a missed call. No committee, no procurement department.
3. **A missed response visibly costs money** — an unanswered call = a lost job. The owner feels this in their gut. This is what makes the ROI conversation easy and genuine.
4. **Currently handling intake manually** — voicemail, shared inbox, "whoever picks up," sticky notes. The gap between what they have and what we provide is concrete and immediate.

### The Best Starting Vertical: Local Trade Businesses (Boston Metro, V1)
- **Roofing** — the proving ground. Highest lead urgency (storm damage, emergency repairs), highest job value ($8–15K+), owner-operator structure, seasonal concentration makes missed calls extremely costly.
- **HVAC, Plumbing, Electrical** — same profile. Natural second wave.
- **Dental, Legal, Med Spas** — similar urgency dynamics with appointment-based structure.

### Who Is NOT the Right Client (V1)
- Multi-location franchise operations requiring complex team routing (V2+)
- Businesses whose primary new-business channel is outbound sales or long-cycle procurement
- Businesses with an existing, functioning intake/dispatch team (the problem doesn't exist or isn't felt)
- Clients expecting immediate, published case study proof before starting (we don't have it yet — see founding partner framing below)

### The "Founding Partner" Reframe
For the period before a published case study exists: **don't hide it, lead with it.**

> *"We built this inside one real roofing company, it's live and running their business right now, and we're in the middle of measuring exactly what it's done for them. You'd be one of the first businesses outside that one to run it. That means more hands-on attention than a client #50 ever gets, a say in how it evolves, and founding pricing that won't be available once we have a track record to charge against. In exchange, I'm asking if we can use your real numbers — good or not-as-good — in how we tell this story afterward."*

This framing is true, differentiating, and turns the single biggest objection ("no case study") into the single most memorable offer. It also pre-negotiates the testimonial/case study consent.

---

## 7. Sales Process

### Step 1: Finding Prospects (See `docs/CLIENT_ACQUISITION_PLAYBOOK.md`)
In order of conversion likelihood:
1. Personal network (direct + 1 degree removed)
2. Local trade associations, chambers of commerce
3. Google Maps / local search (mystery-customer test first — call them as a prospect, observe their response time)
4. Local Facebook groups, Nextdoor
5. Referrals from adjacent professionals (insurance adjusters, real estate agents, home inspectors)

**The mystery customer test:** Before any outreach, call 5–10 candidate businesses as a prospective customer. Time how long it takes to get a real response. Businesses where this goes badly — slow pickup, no callback, voicemail that goes nowhere — are not just qualified prospects, they are prospects who will viscerally recognize the problem the moment you describe it.

### Step 2: Opening the Conversation
Three templates in the acquisition playbook for warm intro, cold outreach, and in-person. Core rules:
- **Lead with the real, the live, and the local.** Not projections, not estimates.
- **Say upfront you're early.** The founding-partner framing, said confidently, beats "we've been doing this for years" when you haven't.
- **Ask for 15 minutes.** Not a demo, not a pitch — a conversation.

### Step 3: The 15-Minute Discovery Call
Structured sequence — the full talk track, with exact language for each step and an objection-handling reference table, lives in `docs/DISCOVERY_CALL_WORKBOOK.md` (added 2026-06-10). Fill in `docs/DISCOVERY_CALL_NOTES_TEMPLATE.md` during/after every call, and `docs/DISCOVERY_CALL_SCORECARD.md` afterward — after 3-5 calls, the scorecards reveal patterns worth feeding back into this playbook. Summary:
1. **Listen first.** Ask how they currently handle inbound calls and leads, and what happens after hours. If you ran the mystery-customer test on their specific business, reference it.
2. **Run the Lead Leak Calculator** (valfintech.com/calculator) with their real numbers — monthly leads, average job value. Let the number they generate do the persuading. Do not narrate over it; let the silence work.
3. **Make the founding-partner offer explicitly** (if they seem receptive). This is the moment the conversation either advances or schedules a follow-up.
4. **If "not yet," capture them properly.** "Not yet" is the most common outcome of any first conversation. Ask for permission to follow up, record them in the prospect tracker.

### Step 4: Proposing and Closing
- Open `PRICING_PACKAGING.md` (internal reference, never shared with clients)
- Default pitch: Growth tier (matches the website's featured/recommended tier)
- **Never state a price first.** The calculator number sets the frame. Let them anchor against what they're losing, not against what software usually costs.
- Frame setup fee as "installing your revenue infrastructure," not as a deposit or trial fee
- Within 24-48 hours, send `docs/CLIENT_PROPOSAL_TEMPLATE.docx` filled in with this prospect's numbers — see `docs/PROPOSAL_PLAYBOOK.md` (added 2026-06-10) for exactly how to fill it out and send it
- The service agreement template (`CLIENT_SERVICE_AGREEMENT_TEMPLATE.md`) formalizes the deal — **have a lawyer review it before the first real signature**
- Once signed, send the setup-fee Stripe Payment Link + `docs/INVOICE_TEMPLATE.docx` (`docs/STRIPE_SETUP_GUIDE.md` §3, `docs/PAYMENT_PROCESS.md`) — payment confirmed in Stripe is the hard gate before any configuration work begins

### Step 5: Handoff to Onboarding
Once "yes" — move to `ONBOARDING_SOP.md` Phase 0. The full proposal → agreement → payment sequence is documented end-to-end in `docs/CLIENT_ACCEPTANCE_FLOW.md` (added 2026-06-10), which is the connective document between this section and the onboarding SOP. The acquisition phase is complete.

### Common Objections and Honest Responses

| Objection | Honest Response |
|---|---|
| "You don't have any case studies yet." | "You're right — we're measuring our first one inside a real business right now. Here's exactly what we're tracking and when we'll publish. You'd get more attention, better pricing, and more say over how this evolves than any client #50 will." |
| "Is this just a chatbot?" | "No — chatbots answer questions on websites. This covers every way a customer might try to reach you — calls, texts, forms — and follows up over days until they book or give a clear no." |
| "What if it doesn't work for my business?" | "Month-to-month after setup. No long-term lock-in. The setup fee covers the real labor of installing and configuring it — but there's no contract trap." |
| "I don't want to replace my team." | "You won't — it takes the part of the job nobody likes (chasing cold leads, repeating the same follow-up five times) off their plate. Your team spends time on the people who are actually ready." |
| "How long does setup take?" | "Most businesses are live within a few weeks. The one variable that can stretch the timeline is a phone number verification process on the carrier side — we start that on Day 1 and everything else runs parallel." |
| "What does this cost?" | "Less than what you're currently losing. Most businesses see it pay for itself within months. But let me show you your specific number first — it takes about a minute." [→ Calculator] |

---

## 8. Client Onboarding

**Full runbook: `docs/ONBOARDING_SOP.md`** — this section summarizes the structure; the SOP is the operational document.

### The Six Phases

**Phase 0 — Close the Deal**
Hard gate: signed agreement + setup-fee payment confirmed in Stripe before any configuration work. No exceptions. Full sequence (proposal → agreement → Stripe setup-fee Payment Link → confirmation) documented in `docs/CLIENT_ACCEPTANCE_FLOW.md` and `docs/PAYMENT_PROCESS.md`.

**Phase 1 — Kick Off Intake (Day 0–1)**
Send `CLIENT_ONBOARDING_INTAKE.md` the same day the agreement is signed. Momentum matters.

**Two critical data points to capture in Phase 1 — do not let these slip:**
1. The **close date and target go-live date** (needed for case study Metric 5 — weeks to launch)
2. **Intake question D5** — the client's own estimate of their pre-launch missed-call rate and monthly bookings. This baseline becomes **permanently unrecoverable** once the system goes live and changes the picture. It is the single most perishable data point in the entire client relationship.

**Phase 2 — Start Carrier Verification (Day 1, runs in background)**
Twilio carrier verification (A2P 10DLC / toll-free) can take days to weeks. Start it immediately on Day 1 and let everything else run parallel. This is the one external dependency that blocks go-live.

**Phase 3 — Configure the Deployment (Day 1–3)**
Follow `CLIENT_DEPLOYMENT_GUIDE.md` §4 exactly. Key decisions:
- Set up the Google Sheet first
- Create credentials before importing workflows
- Re-point all sub-workflow references to the new instance's IDs
- Rewrite every customer-facing SMS in the client's own voice (most important single step for making the system feel custom)

**Phase 4 — Verify Before Anyone Sees It (Day 3–5)**
Run every workflow against real data, in order. Check compliance paths (opt-out handling) and timezone alignment. Do not announce go-live until a real end-to-end SMS has been sent to a real phone.

**Phase 5 — Go Live (Day 5–14)**
Fill in `CLIENT_WELCOME_GUIDE_TEMPLATE.md` from the intake answers. Read it aloud together with the client — this is not documentation to email over silently. Walk through what they'll receive and when, read real SMS scripts aloud, confirm the support channel. On the same call, set up the recurring monthly Stripe Payment Link together (`docs/STRIPE_SETUP_GUIDE.md` §4) — framed as part of the "you're officially live" moment.

**Phase 6 — Ongoing Support & Client Success**
- First month: weekly health checks
- Ongoing: monthly review of Workflow 11 (health monitor) alerts
- Every 30 days: Workflow 12 (ROI report) fires automatically — walk the client through the first one on a call
- At 60–90 days: close the measurement period, assemble case study data (see `CASE_STUDY_DATA_PLAN.md`), open expansion conversation

---

## 9. Delivery Process

### The Standard Deployment Sequence (Reference: `CLIENT_DEPLOYMENT_GUIDE.md`)

**Four things that change per client (all are in §3 of the deployment guide):**

1. **Identity & Contact Values** — business name, owner phone, Twilio "from" number, Google Sheet ID. These appear in every workflow and must be set consistently. A find-and-replace mindset doesn't work — use the config catalog.

2. **Customer-Facing Copy** — every SMS template and AI prompt must be rewritten in the client's voice. The roofing copy must never ship to an HVAC company. This single step is what makes the system feel built for their business, not templated.

3. **Schedule & Cadence** — all schedule triggers are in UTC. The deployment guide converts to the client's timezone. Confirm with the client that digest/reminder times make sense for how their business actually works.

4. **Business-Rule Constants** — follow-up cadence, booking time slots/business hours (`CONFIG` block in 06), email/SMS alert toggles (`CONFIG` block in 04/07/08/11/12). These are judgment calls that should be confirmed with each client, not assumed to match the roofing defaults.

### The Deployment Order That Matters
Import order matters because of sub-workflow dependencies:
1. CRM Adapter (01) first — everything else calls this
2. Every Lead Alert (04) second — called by Form Capture for every submission
3. Everything else (02, 03, 05, 06, 10) — after 01/04 are live with their new IDs
4. Monitoring and reporting (07, 08, 09, 11, 12) last

After every import, re-point all references to the live IDs in the new instance. This step is the one most commonly forgotten and the one that causes the most confusing errors.

### Customization: The Brand Voice Rewrite
This is the highest-leverage 30 minutes of any deployment. The client has described their voice in intake Section E. Take those answers and rewrite:
- The missed-call SMS (Workflow 03)
- The form confirmation SMS (Workflow 02)
- The follow-up sequence messages (Workflow 05)
- The appointment confirmation and reminders (Workflows 06, 09)
- The reschedule/cancel replies (Workflow 10)
- The ROI report message (Workflow 12 — use client's brand name)
- The Claude system prompt for the Haiku 4.5 confirmation SMS (Workflow 02)

Use the client's actual words from the intake wherever possible. If they said "we're the team Boston trusts to show up on time," that phrase belongs in the SMS.

### Post-Deployment Verification Non-Negotiables
1. Every workflow must execute clean against real (or test) data
2. A real SMS must be sent to a real phone end-to-end before go-live
3. Twilio carrier verification must be confirmed before going live
4. Compliance path must be tested: send "STOP" → confirm zero reply

---

## 10. Pricing Philosophy

### The Frame That Governs Everything
**Price against what they're losing, not against what software costs.**

The Lead Leak Calculator puts a specific dollar figure on what the business is losing monthly to slow follow-up. That number — generated by the prospect using their own inputs — is the price anchor. Our monthly fee is then a fraction of that number, which makes the ROI conversation simple and emotionally compelling.

A business losing $12,000/month to missed leads does not evaluate a $697/month system by comparing it to other software. They evaluate it against $12,000.

### What Never Gets Published
- No price on the website. Ever. "Custom" for all tiers.
- Reason: the honest answer depends on call volume, team size, and business type. Publishing a number that doesn't account for that is either misleading or wrong.

### Internal Anchors (These Are Private Floor/Ceiling References)
- Foundation: ~$1,500 setup + ~$397/month
- Growth: ~$2,500 setup + ~$697/month
- Built for you: Growth base + $300–$1,000/month per add-on

These are starting references, not fixed quotes. They were not market-tested against real prospects — treat them as hypotheses to be updated after the first 5 conversations.

### The Setup Fee Is Non-Negotiable Once Work Begins
Two reasons to say plainly to prospects:
1. It covers real, non-recurring labor (2–4 hour configuration + Twilio verification process)
2. It filters for serious buyers. A $0-setup offer attracts churn-prone clients who'll leave the moment something feels hard.

### Contract Structure
- Month-to-month after setup
- 30-day cancellation notice
- Non-refundable setup fee once configuration begins
- No long-term lock-in (the infrastructure stickiness does the retention work)

---

## 11. Operations

### Valfin's Own Lead System (Internal)

Every "Talk to us" submission on valfintech.com flows through the internal lead pipeline:
```
Contact Form → /api/contact → n8n Webhook (OIakSYLK2iMWsB32)
    → Google Sheet ("Valfin Internal Leads")
    → Gmail alert to valfintechnologies@gmail.com
    → SMS alert to Kejsi's mobile
```

**Status as of 2026-06-10:** ✅ Live and verified. `/api/contact` forwards every submission to the n8n webhook (`OIakSYLK2iMWsB32`), which appends a row to the Google Sheet, sends a Gmail alert to `valfintechnologies@gmail.com`, and texts Kejsi's mobile. The Gmail alert node was the last piece — fixed and verified via two successful test sends (executions 144/145) on 2026-06-10. See `docs/INTERNAL_LEAD_CAPTURE_SETUP.md` for the full reference.

**One thing not yet confirmed:** a *real* end-to-end test — submitting the live `/company` contact form on `valfintech.com` and confirming the email actually lands — hasn't been observed yet (only n8n's internal test executions have been verified). Also confirm `N8N_VALFIN_LEADS_WEBHOOK_URL` is set in Vercel's production environment variables — without it, `/api/contact` silently falls back to the Resend/log failsafe instead of the full pipeline.

### Internal Lead Tracking (Google Sheet: "Valfin Internal Leads")
Columns: Lead ID | Date Created | Source | Name | Email | Phone | Business Name | Message | Calc Monthly Leads | Calc Avg Value | Calc Monthly Loss | Status | Last Contact | Notes

Status workflow: New → Contacted → Qualified → Proposal Sent → Won / Lost

Update Status and Last Contact after every interaction. No lead should sit at "New" for more than 48 hours.

### Prospect Tracking (Sales Pipeline)
Before a prospect fills out the website form, they exist only in the founder's own prospect tracker. Use the format from `CLIENT_ACQUISITION_PLAYBOOK.md`:
```
Prospect Name | Business | Phone | Source | First Contact Date | Status | Follow-Up Date | Notes
```
This is a deliberate mirror of the product's own CRM structure — "eating your own cooking" is a small but real trust signal in prospect conversations.

### Support Operations
When a client reports something wrong:
1. Receive calmly. No panic. Ask: what did you see, and roughly when?
2. Open n8n, find the relevant workflow, check recent executions
3. Use `get_execution` with both workflowId and executionId to see the full data path
4. Most issues trace to: credential expiry, Twilio status change, or a Sheet column the client edited themselves
5. Respond to the client within the same business day, ideally the same hour

The System Health Monitor (Workflow 11) runs daily and will often catch issues before the client does. When it alerts, treat it as a 24-hour clock to investigate and resolve before the client notices.

---

## 12. Technical Architecture

### Full Stack Overview

| Layer | Technology | Purpose |
|---|---|---|
| Workflow orchestration | n8n (valfin.app.n8n.cloud) | Runs all 13 workflows + internal lead capture |
| Database | Google Sheets (Google account: valfintechnologies@gmail.com) | CRM — Leads, Appointments, Communication Log |
| SMS | Twilio | Confirmation/follow-up/reminder SMS; webhook trigger for missed calls; SMS alerts built but off by default (V1.1) |
| Email | Gmail OAuth2 (`valfintechnologies@gmail.com`) | Owner/client alerts and reports (04, 07, 08, 11, 12) — default delivery channel as of V1.1 |
| AI | Claude API (Anthropic) — Haiku 4.5 | Customer-facing confirmation SMS generation only (V1.1: lead-scoring Sonnet 4.6 calls removed) |
| Website | Next.js 15, Tailwind CSS v4, shadcn/ui, Framer Motion | Marketing site at valfintech.com |
| Website hosting | Vercel (deployed Jun 9 2026, Cloudflare DNS) |
| Domain | valfintech.com (DNS: Cloudflare) |
| Source control | GitHub: valfintech/valfin-tech, branch main |

### n8n Architecture

**Instance:** `valfin.app.n8n.cloud`  
**Authentication:** Credentials set in n8n UI:
- Google Sheets OAuth2 (`googleSheetsOAuth2Api`)
- Anthropic Header Auth (`httpHeaderAuth`, key `x-api-key`) — used only by Workflow 02's confirmation-SMS node
- Twilio API (`twilioApi`)
- Gmail OAuth2 (`gmailOAuth2`, account `valfintechnologies@gmail.com`) — added V1.1 for email alerts/reports (04, 07, 08, 11, 12)

**Key architectural decision — the CRM Adapter pattern:**
Workflow 01 is the only workflow that writes to Google Sheets. Every other workflow that needs to create or update a lead record calls Workflow 01 as a sub-workflow. This means:
- No duplicate records
- No inconsistent field naming
- A single place to update if the Sheet schema changes
- Easy to replace Google Sheets with a different CRM later (change only Workflow 01)

This was one of the best early decisions. Do not break this pattern in future workflow development.

**Key architectural decision — AI model selection:**
- Customer-facing SMS generation uses Claude Haiku 4.5 (volume, speed, lower cost)
- All other messages are static templates (zero AI for follow-ups, digests, reports, reminders, owner/client alerts)
- **V1.1 (2026-06-11):** AI lead scoring (Claude Sonnet 4.6 — `Lead Score`/`Temperature`/`Urgency`) was removed system-wide; Haiku 4.5 is now the only model in production use, for the confirmation SMS only. This cost/quality split is deliberate — don't add AI where static templates are sufficient

### Twilio Architecture

**Account status:** Trial account, toll-free number pending carrier verification (error 30032)  
**Phone number:** +18889839308 (Twilio "from" number for all outbound SMS)  
**Twilio call-status webhook:** `https://valfin.app.n8n.cloud/webhook/twilio-call-status` → triggers Workflow 03 on missed calls  
**Inbound SMS trigger:** Workflow 10 uses the native n8n Twilio Trigger (no manual webhook configuration required)  
**Known issue:** Error 30032 blocks SMS delivery at carrier level until toll-free verification completes. This was explicitly designated non-blocking by the founder.

### Website Architecture

**Framework:** Next.js 15 (App Router, static-first output)  
**Content layer:** All copy lives in `website/src/content/*.ts` — structured TypeScript objects, not hard-coded in JSX. This is intentional — content updates don't require touching component code.  
**Key pages:** Home, How It Works, Industries, Results, Pricing, Calculator (/calculator), Company  
**Lead capture:** Two API routes — `/api/contact` (form submissions) and `/api/calculator` (calculator completions). Both are currently stubs. **Must be wired before launch.**  
**Environment variables needed for launch:**
- `N8N_VALFIN_LEADS_WEBHOOK_URL` — the n8n webhook URL for the internal lead capture workflow
- `RESEND_API_KEY` — optional failsafe email if n8n is down

**Production URL:** valfintech.com (hardcoded as canonical URL in `src/lib/site-config.ts`)

### GitHub Structure

```
valfin-tech/
├── README.md                    — Project overview + workflow inventory
├── workflows/                   — Importable JSON exports for all 13 workflows
│   ├── 01_crm_adapter_google_sheets.json
│   ├── 02_form_capture_scoring.json
│   ├── ...
│   ├── 11_system_health_monitor.json
│   ├── 11_system_health_monitor.ts   ← SDK source (design rationale preserved)
│   └── 12_client_roi_report.json
├── prompts/                     — Reference copies of Claude system prompts
│   ├── lead_scoring.system.md       ← historical (V1.1: scoring removed, see below)
│   ├── form_confirmation.system.md
│   └── missed_call_sms.system.md
├── templates/                   — Clone-ready templates
│   └── Roofing_CRM_Google_Sheets_TEMPLATE.xlsx
├── docs/                        — All operational documentation
│   ├── VALFIN_FOUNDER_OPERATING_MANUAL.md   ← This document
│   ├── VALFIN_EXECUTIVE_BRIEF.docx
│   ├── REVENUE_RECOVERY_SYSTEM_V1.md
│   ├── PRICING_PACKAGING.md
│   ├── CLIENT_ACQUISITION_PLAYBOOK.md
│   ├── CLIENT_ONBOARDING_INTAKE.md
│   ├── CLIENT_DEPLOYMENT_GUIDE.md
│   ├── ONBOARDING_SOP.md
│   ├── CLIENT_SERVICE_AGREEMENT_TEMPLATE.md
│   ├── CLIENT_WELCOME_GUIDE_TEMPLATE.md
│   ├── SMS_CONSENT_LANGUAGE_GUIDE.md
│   ├── CRM_SHEET_SCHEMA.md
│   ├── CASE_STUDY_DATA_PLAN.md
│   ├── FOUNDER_TRAINING_PLAN.md
│   ├── INTERNAL_LEAD_CAPTURE_SETUP.md
│   ├── LAUNCH_DEPLOYMENT_PLAN.md
│   ├── PROJECT_STATUS.md
│   ├── PROJECT_AUDIT.md
│   └── ROADMAP.md
└── website/                     — Next.js marketing site
    └── src/content/             — All website copy (TypeScript)
```

---

## 13. Workflow Inventory

All 13 workflows are live in production and have importable JSON exports in `workflows/`.

| # | Name | n8n ID | Schedule/Trigger | What it does | Who receives output |
|---|---|---|---|---|---|
| 01 | CRM Adapter | `wVRHChyFrUNRaH4M` | Called by other workflows | Writes/updates leads + communication log in Google Sheets. Only workflow that touches the database. | Internal (data layer) |
| 02 | Form Capture + Confirmation | `HdJc5cy8cmqMBfGR` | Webhook (form/API submissions) | Creates/updates the CRM record via the adapter, sends an AI (Haiku 4.5) confirmation SMS, and triggers Every Lead Alert for every submission. **V1.1: AI lead scoring removed — no Hot/Warm/Cold branching.** | Customer (SMS) + internal (CRM) |
| 03 | Missed-Call Auto-SMS | `u9I1bqrLW6V5LtLp` | Webhook (Twilio call status) | Fires on missed calls. Sends instant recovery text within seconds. Logs to Communication Log only. | Customer (SMS) |
| 04 | Every Lead Alert (formerly "Hot Lead Alert") | `KIpMMKM8H5IZB9wb` | Called by Workflow 02, every submission | Sub-workflow. Emails the owner a branded summary for every lead (email by default, SMS built but off by default — toggled via `CONFIG`). | Owner (email by default, SMS optional) |
| 05 | Follow-Up Sequence | `chYfABnQdnPfiHQx` | Daily 9 AM ET | Sends Day 1/3/7 follow-up SMS to unbooked leads. Stops at 3 attempts or status change. Auto-excludes booked leads. | Customer (SMS) |
| 06 | Appointment Booking | `ax2sMbvv0lqyJHMg` | Owner submits booking form | Takes owner's structured date/time-slot booking input (`CONFIG`-driven business hours), writes appointment to CRM, sends customer confirmation SMS, marks lead as Booked. | Customer (SMS) + internal (CRM) |
| 07 | Pipeline Status Digest | `ehqNYjZRirX5L3sX` | Daily 6 PM ET | Summarizes today's new leads, bookings, and Stale leads that need attention. Emails the owner by default (SMS optional via `CONFIG`). | Owner (email by default, SMS optional) |
| 08 | Weekly Pipeline Report | `Y7ruzhYGMhE001fr` | Monday 8 AM ET | Trailing 7-day metrics: leads, bookings, sources, conversion rate. Emails the owner by default (SMS optional via `CONFIG`). | Owner (email by default, SMS optional) |
| 09 | Appointment Reminders | `bJcO5ox2u190bxTr` | Hourly check | Sends 24h and 2h SMS reminders to customers before appointments using DST-safe Luxon `America/New_York` math. Uses idempotency flags to prevent duplicates. | Customer (SMS) |
| 10 | Reschedule/Cancel | `Bj5b3sUexa8EeQcK` | Inbound SMS (Twilio Trigger) | Classifies inbound texts as reschedule/cancel/`confirm_yes`/`confirm_no`/other. Reschedule/cancel: updates appointment status, replies to customer, alerts owner. `confirm_yes`/`confirm_no` (**added 2026-06-12**): handles customer replies to Workflow 13's reschedule SMS — YES sets `Reschedule Status = Confirmed` and emails the owner; NO increments `Reschedule Attempts`, sets `Reschedule Status = Customer Requested Different Time` (or `Manual Follow-Up Required` at 2+ attempts, stopping further automated rescheduling), replies to customer, and alerts owner per `CONFIG`. | Customer (SMS) + owner (email by default, SMS optional via `CONFIG`) |
| 11 | System Health Monitor | `U6t0b7M6lN8eA1JO` | Daily 4 PM UTC | Checks CRM data freshness. Emails the operator if appointment reminders or follow-up sequences look stale (SMS optional via `CONFIG`). Silent if clean. | Operator (email by default, SMS optional) |
| 12 | Client ROI Report | `ocAnTMCh068BxxXz` | Every 30 days, 2 PM UTC | Computes 30-day metrics (leads captured, missed calls recovered, appointments booked/kept). Emails the client in their brand name by default (SMS optional via `CONFIG`). | Client (email by default, SMS optional) |
| 13 | Appointment Reschedule Notifier | `WzWw9vCYOCS6dSSS` | Hourly check | **Added 2026-06-12, redesigned same-day** as an owner-controlled checkbox flow (replacing the original automatic mismatch-detection trigger). Owner edits `Appt Date`/`Appt Time` (as many times as needed), then checks `Notify Customer = TRUE`. On the next hourly run: texts the customer a YES/NO reschedule-confirmation SMS for the current appointment time, sets `Reschedule Status = Pending Customer Confirmation`, emails the owner (SMS optional via `CONFIG`), updates the `Notified Appt Date`/`Notified Appt Time` columns, clears `Reminder 24h`/`Reminder 2h` so Workflow 09 sends fresh reminders, resets `Notify Customer = FALSE`, and logs the SMS via the CRM Adapter. The customer's reply is handled by Workflow 10's `confirm_yes`/`confirm_no` branches. | Customer (SMS) + owner (email by default, SMS optional) |

**Internal lead capture (Valfin's own):**
- Workflow `OIakSYLK2iMWsB32` — "Valfin — Website Lead Capture" — handles valfintech.com contact form submissions → Sheets + email + SMS alert. Requires one-time configuration (see `INTERNAL_LEAD_CAPTURE_SETUP.md`).

---

## 14. Knowledge Base: Terminology & Glossary

### Business Terms

| Term | Definition |
|---|---|
| **Revenue Recovery System** | The name of the product — the four-stage system (Capture, Respond, Follow Up, Book) |
| **Revenue Operating System** | The long-term vision beyond V1 — full pipeline operations infrastructure |
| **Revenue Operations Infrastructure** | The company category — how we describe what Valfin is |
| **Founding Partner** | What we call our first clients during the pre-case-study phase — accurate, honest, and turns the "no case study" objection into an offer |
| **Lead Leak** | Revenue lost to slow/no response to inbound leads — the problem we solve |
| **Foundation / Growth / Built for you** | The three tiers of the Revenue Recovery System |
| **Vertical** | An industry category (roofing, HVAC, dental, etc.) — we clone the framework per vertical |
| **Baseline** | The pre-system measurement period — establishes the "before" for case study proof |

### Technical Terms

| Term | Definition |
|---|---|
| **n8n** | The workflow automation platform that runs all our workflows. Think "backend logic engine." |
| **Workflow** | A sequence of automated steps in n8n. We have 12 for the Revenue Recovery System + 1 internal. |
| **CRM Adapter** | Workflow 01. The single gateway to the Google Sheets database. All other workflows route through it. |
| **Sub-workflow** | A workflow called by another workflow (not triggered directly). Workflows 01 (CRM Adapter) and 04 (Every Lead Alert) are sub-workflows. |
| **Twilio** | The phone/SMS service. Handles missed-call detection, all outbound SMS, and inbound SMS processing. |
| **Toll-free verification / A2P 10DLC** | Carrier-level approval process for business SMS. Required before SMS actually delivers to customers. Can take days to weeks. |
| **Credential** | An authentication key stored in n8n for a third-party service (Google Sheets, Anthropic, Twilio). Must be re-created and re-assigned when cloning to a new client. |
| **Execution** | A single run of a workflow. Referenced by ID in n8n. |
| **Schedule trigger** | A workflow that runs on a timer (e.g., daily at 6 PM ET). |
| **Webhook** | A URL that receives incoming data from external services (e.g., Twilio sends missed-call data to our webhook). |
| **Communication Log** | The audit trail tab in Google Sheets. Every customer interaction is logged here (SMS sent, calls missed, follow-ups, etc.). |
| **CONFIG block** | A `const CONFIG = {...}` object at the top of a workflow's Code node holding business-rule constants (alert toggles, timezone, business hours, etc.) so they can be changed without redesigning the workflow. Added V1.1 to workflows 04, 06, 07, 08, 09, 10, 11, 12. |

### CRM Terminology

| Term | Definition |
|---|---|
| **New** | Lead just created, no outreach yet |
| **Contacted** | First contact sent (form confirmation or follow-up #1) |
| **Booked** | Appointment scheduled via Workflow 06 |
| **Stale** | 3 follow-up attempts made, no response. Still in the system but no more automatic follow-ups. |
| **LEAD-####** | Lead ID format (e.g., LEAD-0001). Auto-assigned by CRM Adapter. |
| **APT-##############** | Appointment ID format (e.g., APT-20260607144823). Timestamp-based. |

---

## 15. Design Decisions & Rationale

**These are the "why" behind the decisions — so future founders, developers, and partners understand them and don't accidentally undo them.**

### Why Google Sheets (Not a "Real" CRM)
**Decision:** Use Google Sheets as the CRM for V1.  
**Reason:** Fast to configure, free, owned by the client, accessible without login for business owners, and easily replaceable later via the CRM Adapter pattern. The adapter isolates all database writes to one workflow — swapping Google Sheets for GoHighLevel later means changing one workflow, not twelve.  
**Risk:** Doesn't scale to high-volume (500+ leads/month) or multi-location clients. Accepted for V1.  
**What we'd do differently:** Same decision. The adapter pattern was the right call.

### Why n8n (Not Custom Code)
**Decision:** Use n8n as the workflow engine rather than building custom serverless functions.  
**Reason:** Visual workflow editor allows non-developer debugging. Pre-built integrations for Google Sheets, Twilio, and HTTP. Hosted instance eliminates infrastructure management. Claude MCP integration enables AI-assisted workflow development.  
**Risk:** n8n is a dependency. If it changes its pricing or API, our delivery depends on their platform.  
**What we'd do differently:** Same decision for V1. For V3+ (enterprise), evaluate moving critical paths to custom code.

### Why a Single AI Model (Haiku for Confirmation SMS Only)
**Decision:** Claude Haiku 4.5 generates the customer-facing confirmation SMS (Workflow 02). Everything else — follow-ups, digests, reports, reminders, owner/client alerts — is a static template.  
**Reason:** Confirmation SMS requires speed and low latency at volume — Haiku is fast and cheap for that job. Static templates are sufficient everywhere else, and "sufficient" beats "AI everywhere."  
**Cost principle:** AI should not be used where a static template does the job equally well.  
**V1.1 (2026-06-11):** Previously, Claude Sonnet 4.6 also scored every lead (`Lead Score`/`Temperature`/`Urgency`) to drive Hot Lead Alert routing. That scoring system was removed system-wide — every lead now follows the same notification path (Every Lead Alert, Workflow 04), and Haiku 4.5 is the only model in production use.

### Why Industry-Agnostic SMS Copy (In the Architecture, If Not in V1)
**Decision:** All workflow SMS copy is designed to be brand-voice-rewritten per client, not hardcoded.  
**Reason:** A roofing company's customers should not receive an SMS that sounds like it was built for HVAC. The intake process (Section E) collects brand voice guidance and the deployment process mandates rewriting all copy before go-live.  
**Implication:** Never ship the default/Valfin-branded SMS copy to a client. This is a deployment-guide requirement, not a nice-to-have.

### Why "No Published Price" on the Website
**Decision:** All pricing tiers show "Custom" on the website. No dollar amounts published.  
**Reason:** The honest answer to "what does this cost" genuinely depends on the prospect's call volume, team structure, and specific needs. Publishing a price creates either false impressions ("I'll pay exactly that") or a race-to-the-bottom comparison with cheaper tools. Leading with the calculator puts the ROI number first; price then enters as a fraction of that number.  
**Trade-off:** Some qualified prospects will leave without pricing information. Accepted — they're also the prospects who evaluate tools like commodities, which isn't our target buyer.

### Why Month-to-Month Contracts
**Decision:** Month-to-month after setup fee, 30-day notice to cancel.  
**Reason:** Removes the biggest objection ("what if it doesn't work") while infrastructure stickiness does the retention work. A business running its entire lead pipeline through our system does not rip it out lightly, regardless of contract terms.  
**Risk:** Higher theoretical churn. Accepted — bad-fit clients who'd churn anyway are better served by easy exits than lock-in resentment.

### Why Radical Honesty as a Brand Stance
**Decision:** We don't publish estimated results, don't exaggerate capabilities, and explicitly say "we don't have verified numbers yet" where that's true.  
**Reason:** Every competitor in the AI/automation space exaggerates. "We'd rather show you one real result than tell you about a hundred imaginary ones" is the most differentiating sentence on our website — because we mean it. This also future-proofs us: we will never need to walk back a fabricated claim.  
**Trade-off:** Longer proof timeline (waiting for real measured results). Accepted — the alternative is joining a credibility race we don't want to win.

---

## 16. What We Intentionally Did Not Build

**These are not gaps. These are deliberate exclusions. Before building anything new, check if it's on this list and understand why it isn't there.**

| What we didn't build | Why |
|---|---|
| **Email automation** | SMS is the highest-response channel for local service businesses. Email adds complexity without proportional value in V1. Add in V2 with real demand data. |
| **Customer-facing dashboard** | Clients don't need another thing to check. The system delivers information to them on schedule. A dashboard that nobody uses is complexity that breaks. |
| **Lead generation / ads integration** | "This was never a marketing problem." We don't promise more leads — we recover the ones that already exist. Mixing lead-gen into V1 blurs the positioning. |
| **Multi-location support** | V1 assumes single-owner-operator. Multi-location requires team routing, permission layers, and reporting rollups that add significant complexity. |
| **Calendar sync (Google Calendar / Outlook)** | The current booking system (owner form → Appointments tab) works for V1 client profiles. Calendar sync adds integration complexity for a client type that often doesn't have a structured digital calendar already. |
| **Phase 5 retention workflows** | Review requests, referral programs, and seasonal campaigns are expansion-revenue conversations for month 2–3, not day-1 features. Build from real demand. |
| **Custom web intake form** | The n8n-hosted form URL works for V1. A branded embedded form is a polish item for clients who care about brand consistency on their website — it's a "Built for you" add-on. |
| **White-label product** | V1 is operator-branded (Valfin deploys and manages it). White-label requires a different business model, support infrastructure, and pricing. Not a V1 decision. |
| **GoHighLevel migration** | The CRM Adapter pattern makes this possible as an upgrade path. It wasn't needed in V1 because Google Sheets covers the use case. |
| **Self-serve onboarding** | V1 requires hands-on configuration per client. Self-serve requires documentation, guardrails, and support infrastructure that don't exist yet. The manual process also produces better outcomes during the case-study measurement period. |
| **Formal SLA commitments** | We can't commit to response times we haven't measured from real operations. "Best effort + you can always text me directly" is the honest V1 SLA. |

---

## 17. Training Guides

### What a New Founder Should Learn First

**In this order — do not skip ahead:**

1. **Understand the system as a business story** (not as a list of workflows). Re-read Section 3 of this document and `REVENUE_RECOVERY_SYSTEM_V1.md`. Be able to narrate a single lead's journey from first contact to booked appointment in plain language, from memory.

2. **Internalize the positioning.** Re-read Section 5 (Positioning). You need to be able to answer "is this just a chatbot?" in your sleep. The category distinction — Revenue Operations Infrastructure vs. AI Employee vs. chatbot — matters every time you speak to a prospect.

3. **Run a practice discovery call.** Read `CLIENT_ACQUISITION_PLAYBOOK.md`, then run the 15-minute discovery call structure with a friend playing prospect. Do it at least twice: once where they say yes, once where they say "not yet."

4. **Walk through the calculator with your own numbers.** Go to valfintech.com/calculator (or the local dev version) and run it for your own hypothetical business. The number it produces is what you lead with in sales conversations.

5. **Read the deployment guide as a buyer.** Open `CLIENT_DEPLOYMENT_GUIDE.md` and read it as if you were a client being deployed. You should know what changes per client, what the most error-prone steps are, and what "working" looks like.

6. **Do the brand voice exercise.** Take two of the live SMS templates and rewrite them for a hypothetical HVAC client with a different voice. This builds the instinct for what "customized" looks and sounds like.

### What a Salesperson Should Understand

- The core positioning: Revenue Recovery, not chatbot, not AI software
- The 10-second, 30-second, and 2-minute versions of "what Valfin does"
- How to run the Lead Leak Calculator with a prospect's numbers
- The founding-partner offer and why it's stronger than having case studies
- The six common objections and their honest responses (Section 7 of this document)
- What they are NOT selling: lead generation, chatbots, guarantees, "AI employees"
- The commercial structure: custom pricing, no published numbers, setup fee rationale
- The intake process: what happens after "yes" and why the agreement/payment gate matters

**What a salesperson does NOT need to know:** technical workflow architecture, n8n, Twilio account management, deployment procedures. Those are delivery, not sales.

### What a Delivery Specialist Should Understand

- The four-stage system architecture (Capture → Respond → Follow Up → Book)
- The 12-workflow inventory: what each one does, when it runs, who receives its output
- The CRM Adapter pattern: why all writes go through Workflow 01, and why you never break this
- The deployment order: 01 → 04 → everything else (sub-workflow dependency sequencing)
- The brand voice rewrite requirement: roofing copy NEVER ships to non-roofing clients
- Credential management: every new client deployment requires three new credentials
- Post-deployment verification: the complete checklist in `CLIENT_DEPLOYMENT_GUIDE.md` §5
- Compliance requirements: opt-out handling, TCPA consent, what the `SMS_CONSENT_LANGUAGE_GUIDE.md` covers
- Support operations: how to triage using n8n execution logs, common failure causes

**What a delivery specialist does NOT need to know:** sales process, pricing philosophy, investor story. Those are business, not delivery.

---

## 18. Lessons Learned: Honest History

**This section is the honest account of what happened, what went wrong, what was inefficient, and what we'd do differently. It is not revised history. Do not sanitize this section.**

### From the Revenue Recovery System Build

**Lesson 1: Twilio verification was a surprise blocker we didn't plan for.**
Toll-free SMS requires A2P carrier verification. We didn't know this when we started building. Error 30032 silently blocked all SMS delivery until verification was submitted. We decided to treat it as non-blocking for development (correct), but it will still block a real client go-live until it's resolved. **What to do differently:** Start Twilio verification on Day 1 of any client engagement, and explain it to the client explicitly ("this is the one thing we don't control and it can take time").

**Lesson 2: The appointment booking form was built with free-text date fields, which broke reminder parsing.**
Workflow 06 originally used plain text inputs for date and time ("e.g. Tuesday, June 10"). Workflow 09 (appointment reminders) needed machine-parseable dates to compute reminder windows. The mismatch created silent failures — reminders fired zero times during testing, with no error, because the dates couldn't be parsed. **What to do differently:** Any field that will be used for date math should be a structured field (date picker, dropdown) from day one. Free-text fields that "look like a date" are a future bug waiting to happen.

**Lesson 3: A TCPA compliance bug existed in production for weeks before being caught.**
Workflow 10 used a keyword regex that included the word "stop" in its cancel-intent matching. This meant a customer sending a plain "STOP" opt-out message would have been classified as "cancel my appointment" and received an automated reply — the opposite of what TCPA/carrier rules require. The bug was found and fixed during a systematic review (not during a real incident), but it was a real, in-production compliance exposure. **What to do differently:** Compliance review (opt-out handling, TCPA consent) should be part of the initial build checklist, not a later audit pass. Specifically: any workflow that handles inbound SMS must explicitly handle opt-out keywords as a first-class case.

**Lesson 4: The CRM schema existed only in memory until well into the build.**
No document described the column layout of the Google Sheets CRM until `CRM_SHEET_SCHEMA.md` was created during a documentation pass. Workflow 01 (the CRM Adapter) encoded the schema implicitly in its code. This meant every new workflow that needed to read from the sheet had to go figure out the schema from the code. **What to do differently:** Document the data schema before writing any workflow that touches it. Fifteen minutes of schema documentation on Day 1 saves hours of debugging on Day 30.

**Lesson 5: Workflow exports were an afterthought.**
Workflows 11 and 12 were built and deployed without ever being exported as importable JSON files. The deployment guide told operators to "import workflow 11" — but the JSON didn't exist in the repo. This was caught during a systematic review, not in a client deployment. **What to do differently:** Export workflow JSON immediately after every successful deployment, commit it to `workflows/`, and verify it matches the existing export convention (credential placeholder blocks). Make this a step in the deployment checklist.

**Lesson 6: Acquisition was the last thing documented.**
All the infrastructure for deploying, supporting, and retaining clients was built and documented before anyone documented how to find a prospect. The `CLIENT_ACQUISITION_PLAYBOOK.md` was created last — after twelve workflows, a complete deployment guide, a pricing guide, an onboarding SOP, and a service agreement template. Every one of those assets assumed a prospect already existed. **What to do differently:** Think about the full business loop (acquire → onboard → deploy → support → retain → expand) before starting to build. Even a one-page acquisition outline would have been valuable from day one.

**Lesson 7: Nothing was handed to the client at go-live.**
The onboarding SOP (Phase 5) described a verbal walkthrough call where the client would be shown things and told things — but nothing was left with them afterward. No document they could re-read, share with a staff member, or refer to when they forgot something a month later. The `CLIENT_WELCOME_GUIDE_TEMPLATE.md` was created after the system was fully built. **What to do differently:** The client-facing welcome/reference document should be part of the initial onboarding asset set, not a bolt-on. Every client deserves something tangible at go-live.

**Lesson 8: The sub-workflow wiring step is easily forgotten and causes confusing errors.**
After cloning workflows to a new n8n instance, Workflows 02 and 05 (which call sub-workflows 01 and 04) must be updated to point at the new instance's workflow IDs. This step is documented but not enforced — it's easy to import all 13 workflows and forget to re-point the references, which results in the system silently calling the original Valfin deployment's sub-workflows instead of the client's. **What to do differently:** This is the #1 thing to verify during the post-deployment checklist. Consider adding a named constant for sub-workflow IDs to make the step impossible to miss.

### From the Website Build

**Lesson 1: The contact form was a no-op stub and nobody flagged it as a launch blocker.**
The website has a contact form. The contact form submits to an API route. The API route validates the input and returns "success" — without actually sending the data anywhere. This was built as a placeholder with a comment saying "wire this up later" — and "later" became "at launch." A real prospect who fills out the contact form today receives a confident "we'll be in touch" message and is then permanently, silently lost. **What to do differently:** Any form that touches a real prospect should be wired to a real destination before the URL is live. "We'll add the backend later" is a promise to yourself that is almost guaranteed to become a launch surprise.

**Lesson 2: No analytics were integrated during the build.**
The website launched without any analytics. This means: no pageview data, no calculator-completion data, no contact-form-submission data, no way to know which pages people are visiting or what the conversion funnel looks like. **What to do differently:** Add analytics (Plausible or Vercel Analytics) during the build, not after the first 30 days of unknown traffic. At minimum: instrument calculator completions and form submissions as named events from day one.

**Lesson 3: Copy humanization was needed after the initial build.**
The initial website copy was functional but sounded slightly "generated" in places. It required a humanization pass before being considered final. **What to do differently:** Establish brand voice rules (plain language, pain-first framing, five-second clarity, no startup vocabulary) before writing any copy, and apply them as a first-pass standard rather than a revision step.

**Lesson 4: Domain connection went live on Jun 9 2026.**
The website is now deployed at `https://valfintech.com` via Vercel + Cloudflare DNS. SSL is active. The deployment itself was straightforward — Vercel's GitHub integration handled the build automatically once the repo was connected and the root directory was set to `website`. The main remaining setup item is adding the Vercel env var `N8N_VALFIN_LEADS_WEBHOOK_URL` so production form submissions route to n8n.

**Lesson 5: The two-session architecture created coordination friction.**
The Revenue Recovery System and the website were developed in parallel sessions with different contexts. This created occasional duplication of effort, inconsistent naming (tier names "Tier 2" vs. "Growth"), and the need for explicit coordination artifacts (the `CASE_STUDY_DATA_PLAN.md` exists specifically to bridge the two tracks). **What to do differently:** For V2, maintain a single unified repository and development context. The parallel-session model was a constraint of the development environment, not a design choice — don't replicate it.

---

## 19. Gaps Currently Open

**These are real, acknowledged gaps — not items to be embarrassed about, but items to be tracked and closed before they cause problems.**

| Gap | Severity | Status | Who must act |
|---|---|---|---|
| Vercel domain redirect direction (`valfintech.com` ↔ `www`) | **LAUNCH** | ✅ Resolved — site loads cleanly, no redirect loop | Vercel + Cloudflare |
| Contact form wiring to n8n | **OPERATIONAL** | ✅ Resolved — wired Jun 9 2026 | n8n workflow `OIakSYLK2iMWsB32` active |
| Vercel env var `N8N_VALFIN_LEADS_WEBHOOK_URL` | **OPERATIONAL** | ✅ Resolved — confirmed set | — |
| Internal lead capture pipeline | **OPERATIONAL** | ✅ Resolved — active + verified end-to-end (Jun 10 2026) | Sheet, SMS, and Gmail alert all confirmed via test executions 144/145 |
| Real-world test lead through live `/company` form | **OPERATIONAL** | ✅ Resolved — real test lead submitted, Gmail alert received | — |
| Website deployed to production | **LAUNCH** | ✅ Resolved — live at valfintech.com Jun 9 2026 | Vercel + Cloudflare |
| n8n Gmail email node | ✅ Resolved Jun 10 2026 | Fixed: restored `resource`/`operation`/credential, verified via executions 144/145 (Gmail `SENT`) | — |
| Twilio toll-free verification | Medium | Submitted, pending Twilio review | No action — wait for carrier review |
| Twilio trial account (SMS only to verified numbers) | Medium | Unresolved | Add +18575261499 as Verified Caller ID in Twilio console |
| Service agreement template needs attorney review | Medium | Unresolved | Route to attorney before first signature |
| No published case study (roofing measurement in progress) | Medium | In progress | Completes naturally 60–90 days after client #1 is live |
| Vercel Analytics | ✅ Added | Live | @vercel/analytics added to layout.tsx |
| Privacy policy / Terms pages missing from website | Medium | Unresolved | Needed for Twilio verification submission |
| Resend failsafe domain verification | Low (optional) | Unresolved | Verify `valfintech.com` in Resend, add `RESEND_API_KEY` to Vercel |
| No second or third verified case study | Low | Expected post-V1 | Completes naturally with each new client deployment |
| Phase 5 retention workflows (review requests, referrals) | Low | Deferred to V2 | Developer when client demand justifies |
| Framework architecture doc (technical) | Low | Deferred to post-client-#1 | Better written from real clone experience |
| No discovery-call workbook, proposal template, or payment process | **GAP** | ✅ Resolved 2026-06-10 | `DISCOVERY_CALL_WORKBOOK.md`/`SCORECARD`/`NOTES_TEMPLATE`, `PROPOSAL_PLAYBOOK.md` + `CLIENT_PROPOSAL_TEMPLATE.docx`, `PAYMENT_PROCESS.md` + `STRIPE_SETUP_GUIDE.md` + `INVOICE_TEMPLATE.docx`, and `CLIENT_ACCEPTANCE_FLOW.md` (the connective doc) now cover the full Interested Prospect → Discovery → Proposal → Agreement → Payment → Kickoff → Deployment journey |

---

*End of Valfin Founder Operating Manual v1.0*
*Next version should be updated after: (1) the Vercel domain redirect-direction fix is applied and `valfintech.com` loads cleanly for an outside visitor, (2) a real end-to-end test lead is confirmed via the live contact form, (3) client #1 is signed and live, (4) the roofing case study measurement period closes.*
