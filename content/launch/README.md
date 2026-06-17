# Valfin Tech — Launch Campaign (Execution Command Center)
**Version 1.0 | Created 2026-06-13 | Status: READY TO PRODUCE**

> Everything the founder needs to open CapCut, assemble a few assets, and hit Post — five times. This is execution, not strategy. Strategy is already settled in [`docs/CONTENT_BRAND_GUIDELINES.md`](../../docs/CONTENT_BRAND_GUIDELINES.md) and the existing content department; this folder operationalizes it.

---

## The five priority pieces (production-ready)

| # to post | Content_ID | Piece | Funnel | Difficulty | Edit time | Post slot |
|---|---|---|---|---|---|---|
| 1 | VLF-001 | [They Just Call Back Faster](pieces/LAUNCH-01_they-just-call-back-faster.md) | Consideration | Low | 40 min | Tue 7:15 AM |
| 2 | VLF-002 | [The 7:42 PM Call](pieces/LAUNCH-02_the-742pm-call.md) | Awareness | Low | 35 min | Thu 8:00 PM |
| 3 | VLF-005 | [The Vacation Test](pieces/LAUNCH-05_the-vacation-test.md) | Consideration | Low | 40 min | Sat 9:30 AM |
| 4 | VLF-003 | [The 30 Seconds After Someone Calls](pieces/LAUNCH-03_30-seconds-after-call.md) | Consideration | Medium | 55 min | Tue 12:15 PM |
| 5 | VLF-004 | [See Your Number](pieces/LAUNCH-04_see-your-number.md) | Conversion | Low | 30 min | Thu 7:30 AM |

Each piece file is fully self-contained: final hook + 2 alternates, script, VO, scene-by-scene, AI visual prompts per scene, B-roll, on-screen text, thumbnail/cover, transitions, CapCut editing notes, music direction, primary + 2 alternate CTAs, IG caption + 2 alternates, pinned comment, hashtags, posting time, TikTok + YouTube adaptations, and an ElevenLabs voice recommendation for later.

---

## Final Deliverables (the 8 answers)

### 1. Production assets — organized
All five pieces live in [`pieces/`](pieces/), each execution-ready. Assets get generated into the Drive hub per [`google-drive/DRIVE_SETUP_GUIDE.md`](google-drive/DRIVE_SETUP_GUIDE.md), one `VLF-00X` folder per piece.

### 2. Google Sheets implementation package
Six pre-populated CSVs + setup guide in [`google-sheets/`](google-sheets/): Content Pipeline, Performance Dashboard, Content Insights, Hook Library, CTA Library, Experiment Tracker. The launch 5 are already loaded. Setup ≈ 15 min: [`SHEETS_SETUP_GUIDE.md`](google-sheets/SHEETS_SETUP_GUIDE.md).

### 3. Google Drive implementation package
Full folder hierarchy + copy-paste README/cheat-sheet files in [`google-drive/DRIVE_SETUP_GUIDE.md`](google-drive/DRIVE_SETUP_GUIDE.md). Setup ≈ 20 min. Hub: the founder's `Valfin Content Engine` folder.

### 4. Missing assets required before publishing
Small and concrete — none are blockers, but gather these first:
- **A profile/handle decided + bio set** on IG, TikTok, YouTube, LinkedIn, with the **bio link pointing to `valfintech.com/calculator`** (UTM-tagged). *(Confirm the contact email shown publicly is the intended one — recent repo change swapped to a temporary Gmail.)*
- **One screen-recording of the live Calculator** on a phone (hero asset for VLF-004; also reusable). ~5 min.
- **AI stills generated in ChatGPT Pro** from the prompts in each piece (≈3–5 per piece). ~10 min/piece.
- **A few real phone B-roll clips** (phone ringing, missed-call screen, calendar add). ~10 min total, reusable across pieces.
- **Voiceover decision:** founder records VO on a phone (recommended — authenticity) OR go text-only with music for launch. No paid tool needed.
- **CapCut Free installed** (desktop or mobile).
- **Confirm Twilio/Calculator path is live** so link clicks actually work (Calculator is live; Twilio SMS verification is still pending but does NOT block content — the Calculator and contact form are the content destinations, not SMS).

### 5. Exact publish sequence
1. **Day 1 (Tue 7:15 AM)** — VLF-001 *They Just Call Back Faster*. **Pin it** as the account anchor.
2. **Day 3 (Thu 8:00 PM)** — VLF-002 *The 7:42 PM Call* (posted at the hour it describes).
3. **Day 5 (Sat 9:30 AM)** — VLF-005 *The Vacation Test* (weekend resonance).
4. **Day 8 (Tue 12:15 PM)** — VLF-003 *The 30 Seconds After Someone Calls* (lunch explainer).
5. **Day 10 (Thu 7:30 AM)** — VLF-004 *See Your Number* (conversion closer, after awareness is built).
Post natively to IG + TikTok + YouTube Shorts each time; adapt VLF-001/003 to LinkedIn as text+video. Log each in the Content Dashboard.

### 6. Which piece first, and why
**VLF-001 — They Just Call Back Faster.** It is the brand's thesis in one sentence, it's instantly clear with zero context, it's the lowest-difficulty piece (so it actually ships), and it makes the perfect **pinned anchor** that frames everything posted after it. Awareness pieces can out-reach it later, but the first thing a new visitor sees should explain what Valfin stands for — and this line does that in five seconds.

### 7. Founder time to execute the full launch (current free stack)
| Task | Time |
|---|---|
| Drive + Sheets setup (one-time) | ~35 min |
| Generate AI stills + B-roll for all 5 (batched) | ~60 min |
| Record VO for all 5 (batched, optional) | ~30 min |
| Edit in CapCut (40+35+40+55+30) | ~3.3 hrs |
| Covers/thumbnails (5) | ~30 min |
| Captions/scheduling/posting (already written) | ~30 min |
| **Total to get all 5 produced + ready** | **~6 hours** |
Spread across the 10-day publish window, that's **under an hour a day**. A single 3–4 hour "batch day" can get all five filmed and most editing done at once — the recommended path.

### 8. Smallest set of upgrades for the largest return on time
In priority order:
1. **ElevenLabs (~$11–22/mo)** — *the single highest-leverage upgrade.* Removes the VO bottleneck entirely; lets you produce consistent, professional voiceovers without recording or being on camera. Per-piece voice recommendations are already in each file. **Do this first, after the launch 5 validate the content.**
2. **Buffer (free–low tier)** — schedule once, publish to all four platforms automatically. Saves the daily posting chore and protects consistency.
3. **A CapCut Pro or simple stock-image sub (optional)** — only if asset quality becomes the limiter. Usually not needed early.
> Deliberately *not* yet: HeyGen and Google Veo. They're powerful but solve a bottleneck (talent-on-camera at scale / generative video) you won't hit until volume is much higher. Adding them now is cost without return. Revisit per [`AUTOMATION_BLUEPRINT.md`](../systems/AUTOMATION_BLUEPRINT.md) Phase D.

---

## The one-batch-day playbook (recommended)

1. **Set up** Drive + Sheets (35 min).
2. **Generate** all AI stills (ChatGPT Pro) + shoot all phone B-roll in one sitting (60 min).
3. **Record** VO for all 5, or decide text-only (30 min).
4. **Edit** VLF-001 first, post it, pin it. Then edit the rest and schedule per the sequence.
5. **Log** everything in the Content Dashboard as you go.
6. **Engage** for the first 60–90 min after each post; route any real lead into the sales pipeline.

By the end of one focused day, the entire 10-day launch is in the can. After it runs, read the Content Dashboard, see what drove Calculator visits, and let that decide what to make next — then add ElevenLabs.

---

## Guardrails (unchanged, non-negotiable)
- Outcomes over AI. Never "AI Employee," "chatbot," or "software."
- Every number verified-real or clearly labeled an example. Never invent proof.
- One CTA per piece. ~8th-grade level. No exclamation points.
- Run [`CONTENT_APPROVAL_CHECKLIST.md`](../checklists/CONTENT_APPROVAL_CHECKLIST.md) before each post.
