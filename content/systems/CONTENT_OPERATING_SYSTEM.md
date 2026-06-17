# Valfin Tech — Content Operating System (Phase 5)
**Version 1.0 | Created 2026-06-13**
**Governed by:** [`docs/CONTENT_BRAND_GUIDELINES.md`](../../docs/CONTENT_BRAND_GUIDELINES.md)

> The end-to-end workflow that turns a raw idea into a published, tracked, optimized piece of content — and the map of what to automate now, what to keep human, and what to automate later. This is the operating manual for the content department itself.

---

## 1. The Pipeline (10 stages)

```
1. Idea Generation
   → 2. Approval
      → 3. Script Creation
         → 4. Asset Creation
            → 5. Video Production
               → 6. Repurposing
                  → 7. Scheduling
                     → 8. Publishing
                        → 9. Performance Tracking
                           → 10. Optimization ──┐
                                                │
        (feeds back into Idea Generation) ◄─────┘
```

Each stage below lists: **what happens**, **who/what owns it**, **the output**, and **the gate** (what must be true to move forward).

---

### Stage 1 — Idea Generation
- **What:** Pull from the [100-idea database](../ideas/CONTENT_IDEA_DATABASE.md); generate fresh ideas from real signals (prospect calls, support questions, comments, the Operating Manual's lessons).
- **Owner:** AI-assisted (Claude generates against the brand guidelines) + founder taste.
- **Output:** A queue of candidate ideas tagged by pillar + funnel stage in the content tracker.
- **Gate:** Idea maps to a pillar, fits a current monthly theme, and isn't a near-duplicate of recent content.

### Stage 2 — Approval
- **What:** Founder greenlights which ideas become production packages. This is the founder's highest-leverage touchpoint.
- **Owner:** **Founder (human — required).**
- **Output:** Approved idea moved to "In Production."
- **Gate:** Founder yes. Brand fit confirmed. Honesty risk flagged if any claim is involved.

### Stage 3 — Script Creation
- **What:** Build (or pull) the full production package — script, hook, VO, scenes, on-screen text, CTA.
- **Owner:** AI-assisted draft (Claude, using the package format) → human polish.
- **Output:** A complete package file in [`/production/packages/`](../production/packages/).
- **Gate:** Passes the [approval checklist](../checklists/CONTENT_APPROVAL_CHECKLIST.md) §"Script."

### Stage 4 — Asset Creation
- **What:** Generate visuals (AI images/video), gather B-roll, create on-screen text graphics, source music.
- **Owner:** AI generation (image/video tools) + human curation.
- **Output:** Asset folder per the [file conventions](../FILE_STRUCTURE_AND_CONVENTIONS.md).
- **Gate:** Visuals are on-brand (no AI/robot aesthetics; real, warm local-business imagery).

### Stage 5 — Video Production
- **What:** Assemble the video — edit, captions burned in, VO (recorded or AI), music, end card.
- **Owner:** Human editor or AI-assisted editor; founder VO for P5 founder pieces.
- **Output:** Final 9:16 master video.
- **Gate:** Watchable on mute; hook lands in first 2s; under target length; CTA present.

### Stage 6 — Repurposing
- **What:** Spin the master into derivatives per [`REPURPOSING_SYSTEM.md`](REPURPOSING_SYSTEM.md).
- **Owner:** AI-assisted drafting → human approval.
- **Output:** Native cuts + carousel + blog + email + per-platform captions.
- **Gate:** Each derivative passes the approval checklist independently.

### Stage 7 — Scheduling
- **What:** Queue everything across platforms with proper spacing and UTM-tagged links.
- **Owner:** Scheduling tool (Buffer/later n8n) + human final sequence check.
- **Output:** Scheduled posts with correct times, links, and tags.
- **Gate:** Spacing follows the weekly rhythm; bio link matches current campaign.

### Stage 8 — Publishing
- **What:** Posts go live; founder/operator is ready to engage with early comments/DMs.
- **Owner:** Automated publish + human community management (first 60–90 min).
- **Output:** Live content; replies to early engagement.
- **Gate:** Live links work; Calculator/contact destinations are functioning.

### Stage 9 — Performance Tracking
- **What:** Record the metrics that matter (Calculator visits from social, contact-form submissions, saves/shares, hook retention) — not vanity counts.
- **Owner:** Analytics (Vercel Analytics on site; platform insights) + tracker logging.
- **Output:** Per-post performance row tied back to the source idea.
- **Gate:** UTM data flows; results logged within 7 days.

### Stage 10 — Optimization
- **What:** Read the data. Double down on idea types/hooks that drive Calculator visits; retire formats that don't. Feed learnings back into Stage 1.
- **Owner:** AI surfaces patterns → founder decides.
- **Output:** Updated idea priorities; refined hooks; brand-guideline/strategy tweaks if needed.
- **Gate:** Decisions are based on business signal (Calculator/contact), not likes.

---

## 2. Automation Tiering

### ✅ Automate immediately (low risk, high leverage)
- **Idea drafting** against the brand guidelines (Claude).
- **First drafts** of scripts, captions, hashtags, carousel copy, blog, email (Claude using package + repurposing templates).
- **Per-platform caption/description formatting.**
- **Scheduling** the spaced multi-platform rollout (Buffer).
- **UTM tagging** of bio/links.
- **Performance data collection** into the tracker.

### 🟡 Automate later (needs guardrails / tooling maturity)
- **AI visual generation** end-to-end (image/video) — automate generation, keep human curation.
- **AI voiceover** (ElevenLabs) and **avatar video** (HeyGen) — automate after voice/brand is dialed in.
- **Auto-assembly** of the full video from script + assets.
- **Auto-repurposing** triggered when a master is approved.
- **Pattern detection** in performance data → ranked idea suggestions.

### 🔴 Keep human (always)
- **Stage 2 Approval** — the founder's greenlight.
- **Any proof claim** — every number is human-verified against the proof standard. No AI ever invents or publishes a statistic.
- **Final brand-voice gut check** before publish — the "does this sound like Valfin / does this sound like an AI agency?" call.
- **Community management** for real prospect conversations (DMs that look like leads → route to the real sales process).
- **Founder (P5) content authenticity** — founder pieces must be genuinely the founder.

> **The North Star:** automate production, never automate judgment. The goal is 80–90% of *production effort* automated, with the founder's time concentrated on approval, the brand-voice gut check, and real conversations.

---

## 3. Roles (even if one person wears all the hats today)

| Role | Responsibility | Can be AI-assisted? |
|---|---|---|
| **Head of Content (founder)** | Approval, brand integrity, proof-claim sign-off, taste | No — human judgment |
| **Strategist** | Pillar/theme planning, idea prioritization | Yes, heavily |
| **Copywriter** | Scripts, captions, blogs, emails | Yes, first drafts |
| **Producer/Editor** | Assets, video assembly | Yes, increasingly |
| **Scheduler/Analyst** | Queue, publish, track, report | Yes, mostly |
| **Community Manager** | Comments, DMs, routing leads | Partly — humans handle real leads |

This maps to the design goal: scale from a solo founder to a small team without redesigning the system.

---

## 4. The Weekly Operating Rhythm

| Day | Activity |
|---|---|
| **Mon** | Review last week's performance (Stage 9/10). Pick this week's ideas (Stage 1–2). Publish Monday's P4 lesson. |
| **Tue–Thu** | Produce + publish the week's videos (Stages 3–8). Repurpose as you go (Stage 6). |
| **Fri** | Publish Friday's P3/P5 piece. Build + send the weekly email. Schedule next week's queue. |
| **Ongoing** | Community management daily (first 60–90 min after each post). Route any real lead to the sales process. |

Target: ~4 source videos/week, each fully repurposed — a high-leverage output from a small number of decisions.

---

## 5. Quality Gates Summary

No piece advances without:
1. A pillar + funnel-stage tag.
2. Founder approval (Stage 2).
3. A clean pass on the [approval checklist](../checklists/CONTENT_APPROVAL_CHECKLIST.md).
4. Verified honesty on any claim (human).
5. One CTA matched to the funnel stage.
6. UTM tagging for tracking.

The system is intentionally simple. Like the product itself (V1.1 removed complexity that didn't earn its cost), the content system favors a few reliable, repeatable moves over a sprawling toolchain.
