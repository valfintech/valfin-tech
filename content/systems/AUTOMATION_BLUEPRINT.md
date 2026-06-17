# Valfin Tech — Content Automation Blueprint (Phase 6)
**Version 1.0 | Created 2026-06-13**
**Governed by:** [`docs/CONTENT_BRAND_GUIDELINES.md`](../../docs/CONTENT_BRAND_GUIDELINES.md)

> **Status: PLAN, not implementation.** Per the Operating Manual's discipline ("don't build speculatively; build on real signal"), this is an architecture and rollout plan. **Do not stand up paid integrations until the manual workflow has proven the content actually drives Calculator visits.** Walk before automating.

> **Why this fits Valfin:** The business already runs on exactly this stack — n8n, Google Sheets, Google Drive, and a single targeted Claude call. The content engine reuses the same muscles the team already knows, instead of introducing a foreign toolchain.

---

## 1. Design Principles

1. **Reuse the existing stack.** n8n + Google Sheets + Drive + Claude already power the product. The content engine should look familiar to anyone who knows the Revenue Recovery System.
2. **Automate production, never judgment.** Every automated path stops at a human approval gate before anything publishes (mirrors [`CONTENT_OPERATING_SYSTEM.md`](CONTENT_OPERATING_SYSTEM.md) §2).
3. **No AI-invented claims, ever.** The pipeline has a hard rule: no statistic or case-study result is generated or published without human verification (the proof standard).
4. **Start cheap, prove value, then scale spend.** Free/owned tools first (Sheets, Drive, Claude). Paid media tools (ElevenLabs, HeyGen, Veo) only after the content loop is proven.
5. **Single source of truth = Google Sheets.** Just like the CRM Adapter pattern, one sheet is the content database; everything reads/writes through it.

---

## 2. Target-State Architecture

```
                         ┌─────────────────────────────────────┐
                         │   CONTENT DATABASE (Google Sheets)   │
                         │   tabs: Ideas | Pipeline | Published  │
                         │         | Performance | Assets        │
                         └───────────────┬──────────────────────┘
                                         │ (single source of truth)
        ┌────────────────────────────────┼────────────────────────────────┐
        ▼                                ▼                                 ▼
┌───────────────┐              ┌──────────────────┐              ┌──────────────────┐
│  CLAUDE CODE  │              │       n8n         │              │  GOOGLE DRIVE    │
│  (authoring & │              │  (orchestration:  │              │  (asset storage: │
│   reasoning)  │              │  triggers, glue,  │              │  scripts, videos,│
│               │              │  approvals, posts)│              │  images, audio)  │
└───────┬───────┘              └─────────┬─────────┘              └────────┬─────────┘
        │                                │                                 │
        │  drafts scripts/captions/      │  routes between stages,         │  stores every
        │  carousels/blogs/emails        │  sends approval requests,       │  generated asset
        │  against brand guidelines      │  fires generation jobs,         │
        │                                │  schedules + publishes          │
        ▼                                ▼                                 ▼
   ┌─────────────────── MEDIA GENERATION (paid, later phases) ──────────────────┐
   │  OpenAI Images / Google Veo (visuals) · ElevenLabs (VO) · HeyGen (avatar)  │
   └────────────────────────────────────┬──────────────────────────────────────┘
                                         │
                                  ┌──────▼───────┐
                                  │ HUMAN APPROVAL│  ◄── hard gate, every time
                                  │   (founder)   │
                                  └──────┬───────┘
                                         ▼
                                  ┌──────────────┐
                                  │   BUFFER      │  → IG · TikTok · YouTube · LinkedIn
                                  │ (scheduling/  │
                                  │  publishing)  │
                                  └──────┬───────┘
                                         ▼
                                  Performance data → back to Sheets → Claude reads for optimization
```

---

## 3. The Content Database (Google Sheets schema)

Mirror the product's "one sheet, structured tabs" approach. Tabs:

- **Ideas** — `idea_id | category | pillar | funnel_stage | title | hook | objective | platform | cta | status` (seeded from [`content_ideas.csv`](../ideas/content_ideas.csv)).
- **Pipeline** — `idea_id | stage | owner | script_link | asset_folder | approval_status | scheduled_date`.
- **Published** — `post_id | idea_id | platform | url | publish_date | utm | derivative_type`.
- **Performance** — `post_id | views | saves | shares | calc_visits | contact_submits | retention_3s | notes`.
- **Assets** — `asset_id | idea_id | type(image/video/audio) | drive_link | tool | prompt`.

This is the spine. Every automation reads/writes here.

---

## 4. Tool-by-Tool Integration Plan

| Tool | Role | API / Method | Auth | Cost posture | Effort |
|---|---|---|---|---|---|
| **Claude Code / Claude API** | Author scripts, captions, carousels, blogs, emails; brand-guideline enforcement; performance pattern reads | Anthropic Messages API (Claude); Claude Code for repo-side generation | API key (already in use for Workflow 02) | Low; already paying | Low — reuse existing credential |
| **n8n** | Orchestration: stage transitions, approval routing, generation triggers, publish, performance ingest | Native nodes + HTTP Request nodes; webhooks | Existing n8n cloud instance | Already paid | Medium — new workflows |
| **Google Sheets** | Content database (single source of truth) | Google Sheets API (OAuth2) | Existing `googleSheetsOAuth2Api` | Free | Low |
| **Google Drive** | Asset storage (scripts, videos, images, audio) | Google Drive API (OAuth2) | Same Google account | Free tier likely sufficient early | Low |
| **OpenAI Image generation** | AI visuals / B-roll stand-ins | OpenAI Images API | OpenAI API key (new) | Pay-per-image | Medium |
| **Google Veo** | AI video clips (short generative B-roll) | Veo via Google AI API / Vertex | Google Cloud project + key (new) | Pay-per-generation (higher) | Medium-High |
| **ElevenLabs** | AI voiceover in a consistent brand voice | ElevenLabs TTS API | API key (new) | Subscription + usage | Medium |
| **HeyGen** | AI avatar/presenter video (for talent-to-camera at scale) | HeyGen API | API key (new) | Subscription + usage | Medium-High |
| **Buffer** | Multi-platform scheduling + publishing | Buffer API (or Publish API) | OAuth (new) | Affordable tier | Medium |

> **Credentials note:** follow the product's pattern — store keys in n8n credentials, never hardcode. New paid keys (OpenAI, Veo, ElevenLabs, HeyGen, Buffer) are added only at their rollout phase.

---

## 5. Reference n8n Workflows (to build, in order)

> Named to match the product's numbering style. **Do not build until the corresponding rollout phase.**

| WF | Name | Trigger | Does |
|---|---|---|---|
| **C01** | Idea Intake | Manual / form | Adds new ideas to the Ideas tab with pillar + funnel tags |
| **C02** | Script Drafter | Status = "Approved" | Calls Claude with the package format + brand guidelines → drafts full script → stores in Drive, links in Pipeline |
| **C03** | Repurpose Drafter | Status = "Video Approved" | Calls Claude → drafts carousel + blog + email + per-platform captions → Drive |
| **C04** | Asset Generator | Status = "Assets Requested" | Fires image/VO/avatar generation jobs → stores in Drive + Assets tab |
| **C05** | Approval Router | Any "needs approval" | Sends founder an email/SMS with a preview + approve/reject link (reuses the product's Gmail/Twilio pattern) |
| **C06** | Scheduler/Publisher | Status = "Scheduled" | Pushes to Buffer with UTM-tagged links and correct spacing |
| **C07** | Performance Ingest | Daily | Pulls platform + Vercel Analytics data → Performance tab |
| **C08** | Optimization Digest | Weekly | Claude reads Performance tab → ranks idea types/hooks by Calculator-visit lift → emails founder a prioritized idea list |

**Architectural echo:** C05 (Approval Router) is to content what "Every Lead Alert" (Workflow 04) is to the product — a single, reusable human-in-the-loop notification step. Keep it as one sub-workflow others call.

---

## 6. The Hard Guardrails (encoded, not optional)

The pipeline must enforce these in code, not just in policy:

1. **No publish without `approval_status = approved`** set by a human. C06 refuses to schedule otherwise.
2. **Claim firewall:** any draft containing a number/percentage/result is flagged by C02/C03 and held for explicit human verification against the proof standard. The default is "strip the unverifiable number," not "publish it."
3. **Banned-word filter:** C02/C03 run every draft against the §6 banned list ([`CONTENT_BRAND_GUIDELINES.md`](../../docs/CONTENT_BRAND_GUIDELINES.md)). A hit blocks the draft and regenerates.
4. **One-CTA check:** drafts with more than one CTA are rejected back to Claude.

---

## 7. Rollout Phases (effort + sequencing)

> Each phase is gated on the previous one proving value. Don't skip ahead.

### Phase A — Manual + Claude drafting (Week 1–2, ~free)
- Stand up the Google Sheets content database (Section 3).
- Use Claude (Claude Code / API) to draft scripts, captions, carousels, blogs, emails by hand-running prompts.
- Publish manually. Schedule manually or with a free Buffer tier.
- **Goal:** prove the content drives Calculator visits before spending on automation. **No new paid tools.**

### Phase B — Orchestration glue (Week 3–5, low cost)
- Build C01, C02, C03, C05, C07 in n8n (reuse Sheets/Gmail/Twilio credentials).
- Founder approval via C05; everything still human-approved.
- Add Buffer for scheduling (C06).
- **Goal:** remove manual drafting/routing toil. Still no media-generation spend.

### Phase C — Media generation (Week 6–9, first real spend)
- Add OpenAI Images for visuals (cheapest media win first).
- Add ElevenLabs for consistent VO.
- Build C04 to fire these jobs and store assets.
- **Goal:** cut production time per video sharply. Introduce spend only now, with the loop proven.

### Phase D — Avatar + generative video (Week 10+, highest cost, optional)
- Add HeyGen (avatar presenter) and/or Google Veo (generative B-roll) *only if* talent-to-camera capacity is the bottleneck.
- **Goal:** scale volume without scaling shoot time. This is the last and most optional layer — many strong pieces never need it.

### Phase E — Optimization loop (ongoing)
- Build C08 (weekly optimization digest).
- Claude continuously re-prioritizes ideas by what actually drives Calculator visits.
- **Goal:** the engine gets smarter every week with minimal founder time.

---

## 8. Estimated Effort & Cost Summary

| Phase | Build effort | New monthly cost | Risk |
|---|---|---|---|
| A — Manual + Claude | 1–2 days setup | ~$0 (existing Claude) | None — fully reversible |
| B — Orchestration | 3–5 days (n8n) | Low (Buffer tier) | Low |
| C — Media gen | 3–5 days | Moderate (image/VO usage) | Medium — watch usage |
| D — Avatar/video | 3–6 days | Higher (subscriptions + usage) | Medium-High — optional |
| E — Optimization | 1–2 days | Negligible | Low |

> **Recommendation:** Run Phase A for at least 2–4 weeks. If content isn't measurably sending qualified owners to the Calculator, fix the *content* (message, hook, targeting) before investing in *automation*. Automation amplifies whatever you point it at — point it at something that already works.

---

## 9. What This Blueprint Deliberately Does NOT Do

Consistent with the Operating Manual's "what we intentionally did not build" discipline:

- **No fully autonomous publishing.** A human always approves before anything goes live.
- **No AI-generated proof.** The claim firewall is permanent.
- **No premature paid stack.** Tools are added per phase, on proven need.
- **No sprawling toolchain.** If a free/owned tool does the job, we don't add a paid one.

Build this only when the manual content loop has earned it.
