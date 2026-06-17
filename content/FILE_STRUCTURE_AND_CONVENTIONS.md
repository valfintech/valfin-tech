# Valfin Tech — Content File Structure & Conventions (Phase 7)
**Version 1.0 | Created 2026-06-13**

> The organizational standard for the content department. Designed so a new team member (or AI) can find anything, name anything correctly, and operate the system without asking. Mirrors the discipline of the product repo's structure.

---

## 1. Folder Structure

```
content/
├── README.md                          # Department overview + map
├── FILE_STRUCTURE_AND_CONVENTIONS.md  # This file
├── strategy/
│   └── 90_DAY_CONTENT_STRATEGY.md     # Pillars, themes, cadence, funnel
├── ideas/
│   ├── CONTENT_IDEA_DATABASE.md       # 100 ideas (human-readable)
│   └── content_ideas.csv              # 100 ideas (machine-readable)
├── production/
│   ├── README.md                      # The 15 selected ideas + package format
│   └── packages/
│       └── PKG-0XX_slug.md            # One complete production package each
├── systems/
│   ├── REPURPOSING_SYSTEM.md          # 1 video → 7+ assets
│   ├── CONTENT_OPERATING_SYSTEM.md    # The 10-stage pipeline + automation tiers
│   └── AUTOMATION_BLUEPRINT.md        # Future-state architecture + rollout
├── templates/
│   ├── VIDEO_SCRIPT_TEMPLATE.md
│   ├── LINKEDIN_POST_TEMPLATE.md
│   ├── CAROUSEL_TEMPLATE.md
│   ├── BLOG_ARTICLE_TEMPLATE.md
│   ├── EMAIL_NEWSLETTER_TEMPLATE.md
│   └── CAPTION_HASHTAG_BANK.md
└── checklists/
    ├── CONTENT_APPROVAL_CHECKLIST.md
    └── PUBLISHING_CHECKLIST.md
```

**Asset storage (binary media) lives in Google Drive, not git** (consistent with the repo's `.gitignore` for binary files). Mirror the folder names in Drive:
```
Valfin Content (Drive)/
├── 01_Scripts/
├── 02_Assets/
│   ├── images/
│   ├── video-broll/
│   └── audio-vo/
├── 03_Masters/              # final 9:16 videos
├── 04_Derivatives/          # carousels, blog drafts, email drafts
└── 05_Published-Archive/
```

---

## 2. Naming Conventions

**Production packages:** `PKG-0XX_short-slug.md`
- Zero-padded number, kebab-case slug. Example: `PKG-001_they-just-call-back-faster.md`

**Source idea reference:** always cite the idea number from the database (e.g., "Idea #74").

**Asset files (in Drive):** `PKG-0XX_assettype_descriptor_vN.ext`
- Examples: `PKG-003_image_dusk-phone_v2.png` · `PKG-003_vo_master_v1.mp3` · `PKG-003_master_v3.mp4`
- `vN` = version. Never overwrite; increment.

**Published posts (tracker IDs):** `POST-YYYYMMDD-platform-NN`
- Example: `POST-20260620-ig-01`. Platforms: `ig`, `tt`, `yt`, `li`.

**Carousels/blogs/emails (derivatives):** `PKG-0XX_carousel.md` · `PKG-0XX_blog.md` · `PKG-0XX_email.md`

**UTM convention (for all bio/links):**
- `utm_source` = platform (`instagram`, `tiktok`, `youtube`, `linkedin`)
- `utm_medium` = `social`
- `utm_campaign` = the pillar or theme (`leak`, `fix`, `proof`, `operator`, `founder`)
- `utm_content` = `PKG-0XX`
- Example: `valfintech.com/calculator?utm_source=instagram&utm_medium=social&utm_campaign=leak&utm_content=PKG-003`

---

## 3. Status Vocabulary (used in the tracker / Sheets)

A piece moves through exactly these statuses (mirrors the 10-stage pipeline):
`Idea → Approved → Scripting → Assets → Producing → Video Approved → Repurposing → Scheduled → Published → Measured`

Plus: `Held (claim review)` and `Archived (retired)`.

---

## 4. Versioning Rule

- **Never overwrite a master or asset.** Increment the `vN`.
- **Documents** (strategy, guidelines) carry a `Version X.Y` header and an update note at the bottom — same convention as the product docs.
- **The brand guidelines and strategy are living documents.** Update them after real performance data, never silently.

---

## 5. Where Things Live (quick reference)

| Need to… | Go to |
|---|---|
| Understand the rules | [`docs/CONTENT_BRAND_GUIDELINES.md`](../docs/CONTENT_BRAND_GUIDELINES.md) |
| Plan the quarter | [`strategy/90_DAY_CONTENT_STRATEGY.md`](strategy/90_DAY_CONTENT_STRATEGY.md) |
| Pick an idea | [`ideas/CONTENT_IDEA_DATABASE.md`](ideas/CONTENT_IDEA_DATABASE.md) |
| Produce a video | [`production/packages/`](production/packages/) |
| Turn 1 video into many | [`systems/REPURPOSING_SYSTEM.md`](systems/REPURPOSING_SYSTEM.md) |
| Run the whole pipeline | [`systems/CONTENT_OPERATING_SYSTEM.md`](systems/CONTENT_OPERATING_SYSTEM.md) |
| Plan automation | [`systems/AUTOMATION_BLUEPRINT.md`](systems/AUTOMATION_BLUEPRINT.md) |
| Draft something new | [`templates/`](templates/) |
| Approve / publish | [`checklists/`](checklists/) |

---

## 6. Standards for "Done"

A piece of content is **done** only when:
1. It passed the [approval checklist](checklists/CONTENT_APPROVAL_CHECKLIST.md).
2. It was published to its target platform(s) with UTM-tagged links.
3. Its derivatives were produced and logged.
4. Its tracker row exists with a `POST-` ID, ready for performance data.
5. Its assets are versioned and stored in Drive.

Anything less is "in progress," not done.
