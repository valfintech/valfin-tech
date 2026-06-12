# Founder Training Plan — From "I Built This" to "I Can Sell, Deploy, and Run This"
_Created 2026-06-08 — the moment the project crossed from build mode into founder-training mode. V1 was declared launch-ready the same day (see `ROADMAP.md`'s 2026-06-08 conclusion entry); this document is the deliberate next step — not "build more," but "make sure the person about to sell, deploy, and support this actually knows it cold before client #1 walks in the door."_

> **What this is not:** a rehash of the existing documentation. Every module below points you at the *real, canonical* source document for that topic — `CLIENT_ACQUISITION_PLAYBOOK.md`, `PRICING_PACKAGING.md`, `ONBOARDING_SOP.md`, `CLIENT_DEPLOYMENT_GUIDE.md`, `CLIENT_WELCOME_GUIDE_TEMPLATE.md` — and tells you exactly what to internalize from it, in what order, and how to know you've actually got it (not just read it). The one place this document *does* teach directly, rather than point, is Module 1 — because no existing doc teaches the system at the altitude a founder needs first, and everything else in this curriculum depends on having that mental model solid before you build on top of it.
>
> **How to use this:** work through the modules in order. Each one assumes the ones before it are solid — this is a deliberately *sequenced* curriculum, not a reading list to skim in any order. Don't rush past the practice exercises; reading about a discovery call and being able to run one cold are very different things, and the gap between them is exactly what the exercises are for.

---

## Why this order (the reasoning behind the sequence)

You asked for ten things, in a list. Here they are, re-sequenced by **leverage** — meaning: which one, learned first, makes every subsequent one easier and faster to learn?

The answer follows the same logic as the acquisition playbook's "founding partner" framing or the welcome guide's plain-language voice: **you cannot convincingly explain, sell, demo, or support something you don't have a clear mental model of** — and every one of those downstream skills draws on the *same* underlying model of "what actually happens, in what order, when a real lead comes in." Build that model first, explicitly and narratively (not as a workflow inventory — as a *story*), and modules 2 through 4 stop being separate things to memorize and start being the same story told to three different audiences in three different formats. From there, the sequence simply follows the real chronological arc of the business itself — pitch → discover → demo → price → onboard → deploy → verify → customize → support — because that arc *is* the most natural learning progression: each stage hands you exactly the context the next one needs.

| Order | Module | What you'll be able to do when you're done | Canonical source |
|---|---|---|---|
| 1 | Understand how it all fits together | Tell the system's story, end to end, from a lead's first contact to a closed job — without looking anything up | *(taught directly below — no single existing doc covers this at the right altitude)* |
| 2 | Explain the system to prospects | Give a confident 10-second, 30-second, and 2-minute version of "what this is and why it matters to you" | `CLIENT_ACQUISITION_PLAYBOOK.md` |
| 3 | Run discovery calls | Run a structured 15-minute call that uncovers real pain and naturally leads to "can I show you what this would look like for your business" | `CLIENT_ACQUISITION_PLAYBOOK.md` §"The first real conversation" |
| 4 | Demo the system | Walk a prospect through the live CRM and real SMS scripts in a way that makes the abstract concrete | Module 1's narrative + the live n8n/CRM instance |
| 5 | Use pricing & packaging materials | Quote, anchor, and structure an offer without ever feeling like you're "selling," using the website's own numbers | `PRICING_PACKAGING.md` |
| 6 | Onboard a new client | Run Phases 0–2 of the onboarding sequence without missing the one hard gate or the one unrecoverable data point | `ONBOARDING_SOP.md` Phases 0–2 |
| 7 | Deploy a client using the framework | Know *what* has to change per client and *why* — without needing to write a line of workflow code yourself | `CLIENT_DEPLOYMENT_GUIDE.md` + `ONBOARDING_SOP.md` Phase 3 |
| 8 | Verify a deployment is working | Know exactly what "working" looks like, and how to confirm it before a client ever sees the system | `CLIENT_DEPLOYMENT_GUIDE.md` §5 + `ONBOARDING_SOP.md` Phase 4 |
| 9 | Customize the system for a client | Make the system sound like *their* business, not a template, using their own words | `CLIENT_ONBOARDING_INTAKE.md` §E + `CLIENT_DEPLOYMENT_GUIDE.md` §3 |
| 10 | Handle common support requests | Respond to the six questions every new client asks in week one — calmly, correctly, and without panic | `ONBOARDING_SOP.md` Phase 6 + `CLIENT_WELCOME_GUIDE_TEMPLATE.md` §5–6 |

---

## Module 1 — Understand how it all fits together
### *(Highest leverage. Start here. Don't skip it, even if you think you already "get it" from having overseen the build.)*

Here's the thing about having overseen twelve workflows getting built one at a time, over several sessions, each with its own validation runs and execution numbers: **you know the system was built correctly far better than you know what it *feels like* as a continuous story.** A prospect will never ask you "did execution 85 match expectations." They'll ask "okay, so what actually happens when someone calls me at 11 PM and I don't pick up?" — and the honest, confident, *complete* answer to that question, told as a story rather than recited as a feature list, is the single most valuable thing you can carry into every conversation this business will ever have.

So: forget the workflow numbers for a few minutes. Here is the story.

### The story: a single lead's journey, start to finish

**Saturday, 11:47 PM — a missed call.**
Someone calls the business with a real need. It's late, nobody picks up. Within seconds — not minutes, not "first thing Monday" — they get a text back: *"Thanks for reaching out to [Company] — we got your message and we're on it. If this is urgent, just reply here and we'll get back to you right away."* That's **Workflow 03 (Missed-Call Auto-SMS)**. Notice what it *doesn't* do: it doesn't pretend to be a person having a conversation. It's a fast, honest acknowledgment — the digital equivalent of someone picking up and saying "got it, hang tight" — and it's logged quietly to the business's communication record. No formal "lead" gets created from this alone; it's a soft touch, a promise kept in real time.

**Sunday, 9:14 AM — that same person fills out a form on the website.**
This is where things get interesting. **Workflow 02 (Form Capture + Confirmation)** catches the submission, creates a proper record in the business's lead-tracking sheet (the actual write to that sheet happens through **Workflow 01, the CRM Adapter** — a quiet, invisible piece of plumbing that every other workflow routes through, so the business's data always lands in one consistent place no matter which workflow touched it last), and has an AI model send the customer a warm, specific confirmation text. In the same instant, **Workflow 04 (Every Lead Alert)** fires for *every* submission — no scoring, no "is this one worth it": the owner gets an email (and, if enabled, a text) with the lead's name, what they need, and their number — "here's everything you need to call them back."

**Sunday, 9:20 AM — the owner calls back and books the job.**
Using a simple form (**Workflow 06, Appointment Booking**), the owner picks the date and time, and the system handles the rest: writes the appointment to the schedule, sends the customer a friendly confirmation text with exactly what to expect, and flips that lead's status to "Booked" — automatically, everywhere it needs to change.

**Monday, 6:00 PM — the owner's evening digest.**
**Workflow 07 (Pipeline Status Digest)** sends one email (text optional): how many new leads came in today, what got booked, and — importantly — it calls out anything that's gone quiet and still needs attention, by name and number, so nothing valuable slips through unnoticed.

**The following Monday, 8:00 AM — the weekly step-back.**
**Workflow 08 (Weekly Pipeline Report)** zooms out: the past seven days in one email (text optional) — how many leads, how many turned into bookings, where they came from. The kind of "how's the business actually doing" view an owner usually only gets by sitting down and doing math they don't have time for.

**Monday at noon (the day before the appointment), and again two hours out.**
**Workflow 09 (Appointment Reminders)** sends the customer a friendly heads-up the day before, and once more a couple of hours ahead — the single highest-leverage thing any service business can do to cut down on no-shows, running with zero effort from anyone.

**What if the customer needs to change something?**
They just reply to any of these texts — "can we move this to Thursday?" — and **Workflow 10 (Reschedule/Cancel)** reads the intent, finds their appointment, updates the record, replies to them directly (confirming the cancellation and inviting them to rebook, or acknowledging the reschedule and promising a callback), and lets the owner know to follow up. The customer never has to know — or care — that they're talking to a system designed to make sure a real person follows up fast.

**What about the leads that don't book right away?**
This is the part most businesses lose without ever realizing it. **Workflow 05 (Follow-Up Sequence)** quietly checks in on Day 1, Day 3, and Day 7 with a different, natural-sounding nudge each time — then stops on its own, so nobody gets pestered into annoyance. This is "the call you meant to make but didn't get around to," running every single day, for every single lead, without fail.

**And two more workflows that nobody outside this conversation will ever directly see:**
**Workflow 11 (System Health Monitor)** runs once a day and asks one question on your behalf: *is everything actually still running the way it's supposed to?* If a scheduled process has gone quiet when it shouldn't have, *you* get a text about it — before the client ever notices something feels "off." This is the thing that lets you say, with a completely straight face, "we usually catch a problem before you do."

**Workflow 12 (Client ROI Report)** runs every 30 days and texts the *client* — not you, them, addressed to their own business by name — a plain-language recap of exactly what the system did for them that month: how many leads came in, how many were urgent and got flagged instantly, how many missed calls turned into real opportunities because of that first text-back, how many appointments got booked and kept. This is the text message that answers "is this actually worth what I'm paying for it" before the client ever has to ask it out loud — and it's the foundation of every renewal and expansion conversation that follows.

### Why this story matters more than the workflow list

Notice what's *missing* from that whole story: **you, doing any of it manually.** No one had to remember to text that customer back at midnight. No one had to keep a mental list of who hadn't booked yet. No one had to do the math on this week versus last week. That absence — the things that *used* to require a person's constant attention and now simply... happen — is the entire product, the entire pitch, and the entire demo, all at once. Everything from here forward in this curriculum is just that same story, retold for a different audience, in a different format, at a different length.

### Practice exercise
Out loud, in under three minutes, with no notes: tell that whole story to an empty room, in your own words, as if you were explaining it to a friend who runs a small local business and has never heard of any of this. Do it three times. By the third time, it should feel less like reciting and more like just... explaining something you understand.

### Mastery check
You've got this when you can answer, instantly and conversationally, without looking anything up: *"Okay — walk me through exactly what happens, start to finish, when someone calls this business after hours and doesn't get an answer."* If you find yourself reaching for a workflow number to answer that question, you're not done with this module yet — go back through the story until the *numbers* feel like the supporting detail and the *story* feels like the thing you actually know.

---

## Module 2 — Explain the system to prospects

**What you're building on top of Module 1:** the same story, compressed into three lengths, for three different moments in a conversation.

**Source material:** `CLIENT_ACQUISITION_PLAYBOOK.md` — specifically its first-contact templates (warm introduction, cold outreach, in-person) and the "founding partner" reframe of the "no case study yet" objection. Read that section closely; notice that every version of the pitch is just a *short, honest summary* of the story you just learned in Module 1, with one additional ingredient: the deliberate, upfront honesty about being early — turned from a weakness into the single most memorable thing said in the room.

**What to internalize, specifically:**
- **The 10-second version** (your "what do you do" answer at a chamber-of-commerce mixer): "I help local trade businesses make sure no call or lead ever goes unanswered — even after hours — using a system that's live and running inside a real business right now."
- **The 30-second version** (when someone says "tell me more"): walks through one concrete moment from Module 1's story — almost always the missed-call-at-11-PM moment, because it's the most viscerally relatable — and lands on the founding-partner offer.
- **The 2-minute version** (the start of a discovery call): the fuller story, but told with *their* business in mind — "so for a business like yours, here's what that would actually look like..."

**Practice exercise:** Pick three real people you could plausibly say this to this week (start the list the acquisition playbook tells you to start — your own network, first). For each one, say the 10-second and 30-second versions out loud, *using their actual name and their actual business*. Notice how much more natural it feels with a real person in mind than with an imagined one.

**Mastery check:** A friend or family member who knows nothing about this business can repeat the 10-second version back to you, roughly correctly, after hearing it once.

---

## Module 3 — Run discovery calls

**Source material:** `CLIENT_ACQUISITION_PLAYBOOK.md` §"The first real conversation (the 15-minute discovery call)" — read the four-step structure closely; it is deliberately sequenced (listen first, *then* use the calculator, *then* make the offer, *then* handle "not yet" gracefully) and that sequence is the entire skill. **`docs/DISCOVERY_CALL_WORKBOOK.md`** (added 2026-06-10) is the live, run-the-call companion built from this same structure — open it during the actual call, and pair it with `DISCOVERY_CALL_NOTES_TEMPLATE.md` and `DISCOVERY_CALL_SCORECARD.md` for capturing and reviewing each conversation.

**What to internalize, specifically:**
- **Step 1 is the one people skip, and it's the one that matters most.** Asking "how do you currently handle calls and leads, and what happens after hours?" — and then *actually listening to the answer* — does more in two minutes than any pitch could in twenty. If you did the "mystery customer" exercise on this exact business beforehand (the playbook tells you to), this is the moment to use it: *"actually, I called your office last week pretending to be a customer, and here's what happened..."* That sentence alone usually ends any need to "convince" anyone of anything.
- **The Lead Leak Calculator does the selling for you.** Your job in step 2 isn't to build a case — it's to plug in *their* real numbers (monthly leads, average job value) and let the resulting number speak. Resist the urge to narrate over it; let the silence after the number lands do the work.
- **The founding-partner offer (step 3) is not a fallback for not having a case study — it's the strongest thing you can say.** Say it plainly, exactly as written in the playbook. Don't soften it, don't apologize for it, don't rush past it.
- **"Not yet" is the most common outcome of any first conversation, in any sales process, ever** — and it's not a failure. Step 4 exists because a prospect who says "check back with me in a month" is dramatically warmer than a brand-new cold name. Write them down. Follow up. That's the whole skill.

**Practice exercise:** Run the entire 15-minute structure, out loud, with a friend or family member playing the prospect — including improvising answers to "how do you currently handle this." Do it twice: once where they say yes to the next step, once where they say "let me think about it." Notice that the second one isn't actually harder — it just ends differently.

**Mastery check:** You can run the whole call without consulting notes, and you instinctively know what to say next no matter which of the four directions the conversation goes.

---

## Module 4 — Demo the system

**Here's the good news: you already wrote the demo script. It's Module 1's story.**

**What "demoing" actually means here** (this isn't a polished slide deck or a staged screen-share — it's something much more powerful): showing a real prospect the *actual, live* system — the real CRM sheet with real (anonymized, or the prospect's own test-submission) entries in it, and 2–3 of the *actual* SMS messages a customer would receive, read aloud in the moment. `CLIENT_WELCOME_GUIDE_TEMPLATE.md` §4 (operator note) makes exactly this point for the client-welcome moment — the same principle applies even more strongly in a sales demo: **hearing the actual words land is far more convincing than any description of what the words do.**

**A simple demo flow that follows directly from Module 1:**
1. Open with the missed-call moment — it's the most universally relatable. "Let's say it's 11 PM on a Saturday and your phone rings..." — then *show* the actual text that goes out, in seconds.
2. Walk to the CRM sheet — show how that same lead would appear, scored, tracked, with its full history visible in one place.
3. Show the owner-side alert — "and if this one looked urgent, here's what *you'd* see, the same instant."
4. Close the loop — show a booking confirmation and a reminder text, completing the story from "missed call" to "job on the calendar."

**Practice exercise:** Run this exact four-step flow, live, against the real Valfin Tech instance (with anonymized or test data — never a real customer's private information), narrating it the way you'd narrate it to a prospect sitting across from you. Time yourself — the whole thing should comfortably fit inside five minutes, leaving room for questions.

**Mastery check:** You can run the demo smoothly even if something on-screen doesn't go exactly as expected — because you're narrating *the story*, and the live system is illustrating it, not the other way around.

---

## Module 5 — Use pricing & packaging materials

**Source material:** `PRICING_PACKAGING.md` — read it as what it actually is: **your own private anchor-number reference, never a quote sheet to publish or hand across a table.** Note its explicit reconciliation with the live website's actual public-facing model (Foundation / Growth / "Built for you" — no published price, every conversation opens with the calculator).

**What to internalize, specifically:**
- **Never state a price first.** The number that matters is the one the calculator produces from *their* data — your job is to let that number set the frame before any price of yours enters the conversation.
- **Default to pitching Growth** (matching the website's own featured/recommended tier) unless the discovery conversation clearly points somewhere else.
- **Frame the setup fee as an infrastructure investment, not a cost** — it's the thing that makes "founding partner" pricing make sense as a real, limited-time offer rather than a gimmick.
- **The contract handoff is `CLIENT_SERVICE_AGREEMENT_TEMPLATE.md`** — know, before you ever need it in the room, that it's a structured starting draft awaiting attorney review (its own header says so), not a finished legal instrument — and that saying so out loud, plainly, is itself part of the same radical-honesty positioning that runs through everything else here.

**Practice exercise:** Using the calculator, generate a recoverable-revenue number for three different hypothetical businesses (a small one, a medium one, a busy one). For each, say out loud how you'd transition from "here's what this could be worth to you" to "here's what getting started looks like" — without ever naming a number first.

**Mastery check:** You can describe the entire commercial structure — tiers, setup fee rationale, contract — in plain language, in under two minutes, without sounding like you're reciting a price sheet.

---

## Module 6 — Onboard a new client

**Source material:** `ONBOARDING_SOP.md` Phases 0–2 — this is the literal runbook; don't paraphrase it from memory once you're doing this for real, *use it*, the same way a pilot uses a checklist regardless of how many hours they've logged.

**What to internalize, specifically:**
- **Phase 0 has exactly one hard gate: a signed agreement and confirmed payment terms before any configuration work begins.** This is the one place in the whole sequence where "let's just get started and sort out the paperwork later" is the wrong call, every time.
- **Phase 1's momentum matters — send the intake packet the same day the agreement is signed.** And within that packet, **two things are quietly the most important and most perishable in the entire onboarding process:** the close-date/target-go-live-date pair (the literal source of the website's "weeks from first conversation to live" statistic), and intake question D5 — the client's own estimate of their *current* missed-call rate and booking volume. That number becomes permanently unrecoverable the moment the system goes live and changes the picture. Get it on day one, in writing, even under time pressure.
- **Phase 2 (carrier verification) starts immediately and runs quietly in the background** — it's the one part of the whole process that can take days, so the instinct to "start that first thing and configure while it processes" is exactly correct.

**Practice exercise:** Run Phases 0–2 on paper, end to end, against a hypothetical client — write down, in order, every single thing you'd actually say and do, including the exact moment you'd ask for D5 and why you wouldn't let it slip past that conversation.

**Mastery check:** You can explain, to someone who's never seen this SOP, *why* the agreement gate exists, *why* D5 can't wait, and *why* carrier verification starts on day one rather than after configuration — not just *that* these things happen, but *why* each one is positioned exactly where it is.

---

## Module 7 — Deploy a client using the framework

**This module is deliberately not about learning to build workflows.** That's engineering work, and it's already done — twelve times over, tested, exported, and sitting in `workflows/` ready to clone. What you need is the founder-level understanding of **what changes, per client, and why** — so you can scope the work accurately, explain it confidently, and know when something looks right versus when it needs a second look.

**Source material:** `CLIENT_DEPLOYMENT_GUIDE.md` §3 (the full per-client configuration catalog) and `ONBOARDING_SOP.md` Phase 3.

**What to internalize, specifically — the four categories of "things that change":**
1. **Identity & contact values** — the business's name, phone number, brand voice. The single highest-leverage of these: rewriting every customer-facing message in the client's own words (intake §E). `ONBOARDING_SOP.md` Phase 3 calls this out directly as *"the single highest-leverage 'feels custom, not templated' touch in the whole process"* — internalize that line; it's the difference between a client who feels like a number and one who feels like a partner.
2. **Schedules & cadence** — when digests go out, when reminders fire, all set against the client's actual time zone and business hours.
3. **Business-rule constants** — things like email/SMS alert toggles, business hours, and follow-up cadence, which `CLIENT_DEPLOYMENT_GUIDE.md` §3e is careful to flag as **"Valfin-specific judgment calls, not universal truths"** — meaning: always confirm these still fit, never assume the defaults are universally correct.
4. **Sub-workflow wiring** — every workflow that calls another one needs to be re-pointed at the *new* instance's IDs after cloning. You don't need to do this yourself, but you need to know it's a real, sequenced step (see `CLIENT_DEPLOYMENT_GUIDE.md` §4's exact order — CRM Adapter and Every Lead Alert get imported and re-IDed *first*, because everything else depends on pointing at them correctly) — so that if a deployment ever goes sideways, you know roughly where to look first.

**Practice exercise:** Pick one hypothetical client (different name, different city, same trade). Walk through `CLIENT_DEPLOYMENT_GUIDE.md` §3 line by line and write down, for each value, what it would actually become for that client. This is the exact exercise that turns "I trust the deployment guide exists" into "I could supervise this deployment and know if something looked off."

**Mastery check:** You can explain to a prospect, in plain language and without hand-waving, *why* their version of this system will feel custom-built to them rather than like a template — and you'd notice if a cloned deployment still had someone else's brand voice or business hours baked into it.

---

## Module 8 — Verify a deployment is working correctly

**Source material:** `CLIENT_DEPLOYMENT_GUIDE.md` §5 (the post-deploy verification checklist) and `ONBOARDING_SOP.md` Phase 4.

**What to internalize, specifically — not the technical test mechanics, but the *founder-level* version of "how do I know this actually works":**
- **The non-negotiable sequencing:** carrier (Twilio) verification confirmed, *and* a real end-to-end SMS sent to a real phone — *before* anyone announces go-live. `ONBOARDING_SOP.md` calls this "the one mistake that turns a smooth launch into an embarrassing one," and it's worth memorizing that exact framing, because it's the one verification step where skipping it doesn't just risk a bug — it risks the client's very first impression.
- **"Working" has a concrete, checkable shape**, not a vague one: every workflow runs, in order, against real data, and produces the result it's supposed to. You don't have to run these tests yourself — but you should be able to look at a completed verification checklist and know whether it actually proves the system works, or just proves that nothing *crashed*. Those are very different bars, and the checklist is written to the higher one.
- **Pay special attention to the two compliance-sensitive paths** named explicitly in Phase 4: opt-out keyword handling (a real, previously-fixed, now-tested issue — see `PROJECT_AUDIT.md` executions 67/68 for exactly what "catching this matters" looks like in practice) and reminder/digest timing against the client's *actual* time zone.

**Practice exercise:** Read through `CLIENT_DEPLOYMENT_GUIDE.md` §5 and, for each checklist item, write one sentence answering: "if this *failed*, what would the client actually experience, and how bad would that be?" This builds the instinct for *which* checks matter most when you're moving fast.

**Mastery check:** If someone showed you a "verification complete" checklist with one item quietly skipped, you'd know — from the founder's seat, not the engineer's — whether that skipped item was a "fine, catch it later" or a "stop, do not go live yet."

---

## Module 9 — Customize the system for a client

**This is really Module 7's highest-leverage piece, given its own spotlight — because it's the single thing most likely to make or break whether a client feels like "a real partner built me something" versus "I bought a templated product."**

**Source material:** `CLIENT_ONBOARDING_INTAKE.md` Section E (brand voice) and `CLIENT_DEPLOYMENT_GUIDE.md` §3c (customer-facing surfaces).

**What to internalize, specifically:**
- **The rule is absolute and explicit: never ship the Valfin-Tech-flavored copy to a new client verbatim.** Every customer-facing SMS, every AI system prompt, gets rewritten in *that* client's words, for *that* client's customers.
- **This isn't a cosmetic find-and-replace.** It's the difference between a text that says "Thanks for contacting us" and one that says "Thanks for reaching out to Riverside Roofing — Dave will give you a call back personally" — same system, same reliability, completely different feeling on the receiving end.
- **The same logic extends to the welcome guide and the ROI report** — `CLIENT_WELCOME_GUIDE_TEMPLATE.md` and Workflow 12 are *built* to be filled in per-client (the brand name, the operator's name, the actual cadence times) — not handed over with someone else's name still in them. Treat every bracketed placeholder, in every document and every piece of system copy, as a checklist item that fails the deployment if it's missed.

**Practice exercise:** Take three of the actual live SMS templates (pull them from the workflow exports or `prompts/`) and rewrite each one twice — once for a hypothetical HVAC company with a folksy, friendly voice, and once for a hypothetical legal practice with a more formal one. Notice how much the *underlying mechanics* (instant reply, clear next step, warm tone) stay exactly the same while the *voice* changes completely. That's the whole skill, demonstrated to yourself in fifteen minutes.

**Mastery check:** Handed any customer-facing message from the live system, you can rewrite it convincingly in a different business's voice in under a minute — and you instinctively notice when a piece of client-facing copy still "sounds like Valfin Tech" instead of sounding like the client.

---

## Module 10 — Handle common support requests

**Source material:** `ONBOARDING_SOP.md` Phase 6 and `CLIENT_WELCOME_GUIDE_TEMPLATE.md` §5–6 — read §6 of the welcome guide especially closely: it's *literally* the six questions every new client asks in week one, with the answers already written in the calm, reassuring voice you'll want to have internalized before you ever hear the live version of one of these questions on the phone.

**What to internalize, specifically — less a set of facts, more a stance:**
- **"You don't have to diagnose it yourself" is true for the client — and it should be your stance toward yourself, too.** When something comes in, your job in the moment is to *receive it calmly, without panic*, get the basic facts ("what did you see, and roughly when"), and know that the actual triage process (the same `get_execution`/`test_workflow` pattern proven across this entire build) is a known, repeatable thing — not a fire to put out from scratch every time.
- **Most real issues trace back to one of three known external dependencies**: a credential that expired, a Twilio status change, or a Sheet schema the client edited themselves. Knowing this short list *before* the first support call comes in means you'll often have a strong hunch about where to look within the first thirty seconds of hearing the symptom.
- **"We'd rather hear about something small and false-alarm than have you sit on something real."** That line from the welcome guide isn't just client-facing copy — it's the actual internal posture that makes support sustainable. A founder who treats every incoming message as a potential five-alarm fire burns out fast; one who treats each one as "okay, let's go look" stays calm, and that calm is itself part of what the client is paying for.

**Practice exercise:** Read the six FAQ questions in `CLIENT_WELCOME_GUIDE_TEMPLATE.md` §6 once. Then close the document, and answer all six again from memory, out loud, in your own words — in the same warm, plain, no-jargon voice the document uses. Compare your answers to the original; notice how close you already are.

**Mastery check:** A late-night text from a new client saying "hey, I don't think I got my digest last night, is something wrong?" doesn't trigger a flicker of panic — it triggers a calm, practiced sequence: acknowledge warmly, ask the two clarifying questions, and know exactly where you'd look first.

---

## How to actually work through this (pacing)

Don't binge this in one sitting — the practice exercises are where the real learning happens, and they need a little room to breathe between sessions. A reasonable cadence:

- **Days 1–2:** Module 1 (the story) — repeat the practice exercise until it's genuinely effortless. Everything else leans on this.
- **Days 3–4:** Modules 2–4 (explain → discover → demo) — these three reinforce each other; working them close together compounds the effect.
- **Day 5:** Module 5 (pricing) — by now you've got the story and the conversation structure; pricing slots naturally in behind both.
- **Days 6–7:** Modules 6–8 (onboard → deploy → verify) — the operational backbone; work these as a connected sequence, the same way they connect in real life.
- **Day 8:** Modules 9–10 (customize → support) — the "make it feel like theirs, then keep it running smoothly" pair; naturally the last things you'll need, and naturally the easiest to absorb once everything before them is solid.

Then — and this is the real point of all of it — **stop training and go run Module 3 for real.** The acquisition playbook's "this week" checklist is still exactly where it was: list ten names, make a few mystery-customer calls, start the tracker. Everything in this document exists to make that first real conversation go well. The fastest way to find out what you still don't know is to have it.

---

## One-page summary (pin this next to the other one-page summaries)

```
Day 1-2:   Learn the story (Module 1) — repeat until effortless
Day 3-4:   Explain it, discover with it, demo it (Modules 2-4) — same story, three formats
Day 5:     Price it (Module 5) — let the calculator's number do the talking
Day 6-7:   Onboard, deploy, verify (Modules 6-8) — the operational backbone, in sequence
Day 8:     Customize it, support it (Modules 9-10) — make it theirs, then keep it running

Then:      Close this document. Open CLIENT_ACQUISITION_PLAYBOOK.md. Make the calls.
```
