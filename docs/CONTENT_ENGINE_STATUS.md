# Valfin Tech — Content Engine Status
**Version 1.0 | Created 2026-06-13**
**Branch: `feature/content-launch-v1`**

> **What this is:** A snapshot of the content department built on 2026-06-13 — what exists, where it lives, what's left before the first post goes live, and what to do after that. Governed by [`docs/CONTENT_BRAND_GUIDELINES.md`](CONTENT_BRAND_GUIDELINES.md) → [`docs/VALFIN_FOUNDER_OPERATING_MANUAL.md`](VALFIN_FOUNDER_OPERATING_MANUAL.md). Per the Operating Manual §15, this is a status report, not a license to keep building — return to "Do Not Proactively Invent Features" once the launch sequence is in motion.

---

## 1. What Has Been Completed

A full content operating system, built 2026-06-13, now committed on `feature/content-launch-v1`:

- **Brand rulebook** — [`docs/CONTENT_BRAND_GUIDELINES.md`](CONTENT_BRAND_GUIDELINES.md): translates the Operating Manual into copy-ready rules (voice, banned words, proof standard, hooks/CTAs, 5 content pillars, pre-publish checklist).
- **90-day strategy** — pillars, monthly themes, cadence, funnel mix, platform priorities.
- **100-idea content database** — human-readable + CSV, organized by pillar/category for automation.
- **15 production-ready video packages** — full scripts, hooks, B-roll, AI visual prompts, captions, hashtags.
- **Operating systems** — repurposing system (1 video → 7+ assets), end-to-end content operating system (idea → publish → optimize), and a future automation blueprint (plan only, not implemented).
- **Templates & checklists** — video script, LinkedIn post, carousel, blog, email newsletter, caption/hashtag bank, content approval checklist, publishing checklist.
- **Launch campaign (execution-ready)** — 5 of the 15 packages selected, expanded into fully self-contained launch pieces (script, scenes, on-screen text, captions, hashtags, posting times, cross-platform adaptations), plus a Google Sheets implementation package (6 pre-populated CSVs) and a Google Drive folder hierarchy + setup guide.
- **All 5 launch reels fully produced (2026-06-14)** — built end-to-end in Remotion (`motion-engine/`) as motion-graphics videos with Higgsfield object-based hero shots (no AI humans), original music beds, and UI sound design (no voiceover). Each has a finished MP4 + cover image and a publish-ready Instagram posting package (caption, hashtags, pinned comment, CTA, posting time, alt text). **All 5 are publish-ready — no further production work needed before posting.**

All of this is now committed to git in commits on `feature/content-launch-v1` (brand guidelines; department overview/strategy; idea database; production packages; templates/checklists/systems; launch campaign; Remotion motion engine + 5 finished reels).

---

## 2. Folder Locations

```
docs/
└── CONTENT_BRAND_GUIDELINES.md          # Rulebook — read first, always

content/
├── README.md                            # Department overview + map
├── FILE_STRUCTURE_AND_CONVENTIONS.md    # Naming/folder/versioning standards
├── GROWTH_PLAYBOOK_AND_NEXT_STEPS.md    # Executive layer: quick wins → automation
├── strategy/
│   └── 90_DAY_CONTENT_STRATEGY.md
├── ideas/
│   ├── CONTENT_IDEA_DATABASE.md         # 100 ideas
│   └── content_ideas.csv
├── production/
│   ├── README.md
│   └── packages/PKG-001 .. PKG-015      # 15 full production packages
├── systems/
│   ├── REPURPOSING_SYSTEM.md
│   ├── CONTENT_OPERATING_SYSTEM.md
│   └── AUTOMATION_BLUEPRINT.md          # Plan only — not implemented
├── templates/                           # Script, LinkedIn, carousel, blog, email, hashtag bank
├── checklists/
│   ├── CONTENT_APPROVAL_CHECKLIST.md
│   └── PUBLISHING_CHECKLIST.md
└── launch/
    ├── README.md                        # Execution command center for the launch 5
    ├── pieces/LAUNCH-01 .. LAUNCH-05    # The 5 launch-ready pieces (VLF-001..005)
    ├── pieces/VLF-001_PRODUCTION_PACKAGE.md  # VLF-001 asset+IG package
    ├── google-sheets/                   # 6 CSVs + SHEETS_SETUP_GUIDE.md
    └── google-drive/DRIVE_SETUP_GUIDE.md

content/production/packages/
└── VLF-002..005_POSTING_PACKAGE.md      # Finished asset list + IG package for each reel

motion-engine/                           # Remotion production engine
└── out/
    ├── vlf-001.mp4, vlf-001-cover.png   # VLF-001 final render + cover
    ├── VLF-002/VLF-002.mp4, cover.png   # VLF-002 final render + cover
    ├── VLF-003/VLF-003.mp4, cover.png   # VLF-003 final render + cover
    ├── VLF-004/VLF-004.mp4, cover.png   # VLF-004 final render + cover
    └── VLF-005/VLF-005.mp4, cover.png   # VLF-005 final render + cover
```

---

## 3. Remaining Launch Tasks

All 5 reels are fully produced and publish-ready — production tasks (AI stills, screen-capture, B-roll, CapCut editing, voiceover) are **done and no longer needed**, since every piece was built natively in Remotion with Higgsfield hero shots and music/SFX, no voiceover. What's left is founder-side setup, called out in [`content/launch/README.md`](../content/launch/README.md) §4:

1. **Decide and set up social profiles/handles** on Instagram, TikTok, YouTube, LinkedIn — bio link pointing to `valfintech.com/calculator`, UTM-tagged per the convention in [`content/FILE_STRUCTURE_AND_CONVENTIONS.md`](../content/FILE_STRUCTURE_AND_CONVENTIONS.md) §2.
2. **Confirm the public contact email** shown in bios/profiles — the repo recently switched the displayed contact email to a temporary Gmail address (commit `201dcbe`); verify this is the intended address before it goes into public bios.
3. **Stand up the Google Sheets Content Dashboard** (~15 min, [`SHEETS_SETUP_GUIDE.md`](../content/launch/google-sheets/SHEETS_SETUP_GUIDE.md)) and the **Google Drive folder hierarchy** (~20 min, [`DRIVE_SETUP_GUIDE.md`](../content/launch/google-drive/DRIVE_SETUP_GUIDE.md)).
4. **Confirm the Calculator and contact form are reachable** from link clicks (both are live; Twilio SMS verification pending does NOT block content).

Founder time required to start publishing: just the setup above (~35–45 min) — every video and posting package is ready to download and post as-is.

---

## 4. Publishing Sequence

From [`content/launch/README.md`](../content/launch/README.md) §5, post natively to IG + TikTok + YouTube Shorts each time (LinkedIn gets text+video adaptations of VLF-001/003):

| Day | Slot | Piece | Funnel stage | Notes |
|---|---|---|---|---|
| 1 | Tue 7:15 AM | **VLF-001 — They Just Call Back Faster** | Consideration | **Pin as account anchor** — the brand thesis in one sentence |
| 3 | Thu 8:00 PM | **VLF-002 — The 7:42 PM Call** | Awareness | Posted at the hour it describes |
| 5 | Sat 9:30 AM | **VLF-005 — The Vacation Test** | Consideration | Weekend resonance |
| 8 | Tue 12:15 PM | **VLF-003 — The 30 Seconds After Someone Calls** | Consideration | Lunch explainer |
| 10 | Thu 7:30 AM | **VLF-004 — See Your Number** | Conversion | Calculator-driving closer, after awareness is built |

Run the [`CONTENT_APPROVAL_CHECKLIST.md`](../content/checklists/CONTENT_APPROVAL_CHECKLIST.md) before each post. Log every post in the Content Dashboard (Content Pipeline tab → Performance Dashboard tab once live).

---

## 5. Current Stack Assumptions

Deliberately reuses tools the business already runs on (no new paid tools for launch):

| Layer | Tool | Status |
|---|---|---|
| Content database / tracker | Google Sheets (6-tab Content Dashboard) | Setup guide ready, not yet stood up |
| Asset storage | Google Drive (`Valfin Content Engine` folder) | Folder hierarchy designed, not yet built |
| Production / editing | Remotion (`motion-engine/`) + Higgsfield object shots | Done — all 5 reels rendered |
| Voiceover | None — music + UI sound design only | Final, no further decision needed |
| Conversion destination | `valfintech.com/calculator` (Lead Leak Calculator) | Live |
| Secondary destination | `valfintech.com` → "Talk to us" / `/company#contact` | Live |
| Analytics | Vercel Analytics | Live on the site |
| Orchestration (future) | n8n + Claude (existing credentials) | Plan only — `AUTOMATION_BLUEPRINT.md`, Phase A+ |

---

## 6. Future Upgrade Recommendations

In priority order, per [`content/launch/README.md`](../content/launch/README.md) §8 and [`content/GROWTH_PLAYBOOK_AND_NEXT_STEPS.md`](../content/GROWTH_PLAYBOOK_AND_NEXT_STEPS.md):

1. **ElevenLabs (~$11–22/mo)** — highest-leverage single upgrade; removes the voiceover bottleneck. Per-piece voice recommendations already written into each launch piece. Add **after** the launch 5 validate the content, not before.
2. **Buffer (free–low tier)** — schedule once, publish to IG/TikTok/YouTube/LinkedIn automatically; protects posting consistency.
3. **CapCut Pro or a stock-image subscription** — optional, only if asset quality becomes the limiting factor.
4. **Automation Phase A→B** (per `AUTOMATION_BLUEPRINT.md`) — Claude drafts scripts/captions/derivatives, n8n adds light orchestration (C01–C03, C05, C07) reusing existing Sheets/Gmail credentials. No new paid tools.
5. **Automation Phase C** — OpenAI Images + ElevenLabs once the loop is proven to drive Calculator visits.
6. **Automation Phase D (optional)** — HeyGen/Veo only if talent-on-camera capacity becomes the actual bottleneck. Explicitly deferred — "cost without return" right now.
7. **Automation Phase E** — weekly digest where Claude re-prioritizes the idea backlog by real performance data.
8. **Proof-driven content unlock** — the moment the roofing case study lands (~60–90 days after client #1 goes live), plan a content sprint around real, honestly-shown numbers (coordinate via `docs/CASE_STUDY_DATA_PLAN.md`).

---

## 7. Known Blockers

**None are hard blockers for starting the launch sequence.** The items below are worth tracking because they affect timing or polish:

- **Twilio toll-free/A2P verification is still pending** (per the Operating Manual's open-items list). This does **not** block content — the Calculator and contact form (not SMS) are the content destinations for now. It does matter for client deployments and should not be confused with a content blocker.
- **No published case study yet** (roofing measurement in progress, 60–90 days from client #1 go-live). The proof standard (§7 of the brand guidelines) means launch content must stay in "honest, pre-proof" mode — founding-partner framing, hypothetical examples, the Calculator's own math. This is by design, not a gap to close before launching.
- **Contact email shown publicly is a recently-changed temporary Gmail address** (commit `201dcbe`, 2026-06-13) — flagged in `content/launch/README.md` §4 as something to confirm before it appears in social bios.
- **No social profiles/handles exist yet** — every downstream step (UTM bio link, scheduling, posting) depends on this being decided first.

---

## 8. Recommended Next Actions

In order, for the founder:

1. **Review [`docs/CONTENT_BRAND_GUIDELINES.md`](CONTENT_BRAND_GUIDELINES.md)** — confirm it sounds like Valfin before anything gets published.
2. **Decide and create social handles** (IG, TikTok, YouTube, LinkedIn) with calculator bio link, UTM-tagged. Resolve the contact-email question (item 3 in §7) at the same time.
3. **Stand up the Google Sheets Content Dashboard and Drive folder hierarchy** (~35 min combined) — instrument before publishing so post #1 is measurable from day one.
4. **Download the 5 finished reels** from `motion-engine/out/` (VLF-001 through VLF-005, each with a cover image), post VLF-001 first and pin it, then post the remaining 4 per the publishing sequence in §4 — each posting package (caption, hashtags, pinned comment, CTA, alt text) is ready to copy-paste as-is.
5. **Publish on the 10-day sequence**, logging each post in the Content Pipeline tab, and engage for 60–90 minutes after each post — route any real lead into the sales pipeline per the Operating Manual.
6. **After 3–4 weeks, read the Content Insights tab** and let real Calculator-visit data — not intuition — decide what to make next, then layer in ElevenLabs and Buffer per §6.
7. **Do not open new content fronts (blog, email list, automation phases) until the launch 5 are live and measured** — per Operating Manual §15, builder mode stays paused outside of real signal.

---

*This status reflects the repository state on `feature/content-launch-v1` as of 2026-06-13. Update after the launch 5 are produced, after the first publish, and after the first 3–4 weeks of performance data.*
