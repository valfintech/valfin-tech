# Valfin Content Engine — Google Drive Setup Guide
**The exact folder hierarchy for the operating hub, plus the README files to drop into each folder.**
**Hub:** `Valfin Content Engine` → https://drive.google.com/drive/folders/192QPU7csmP3Wwm8h8ugtNjcUeCiaNATq

> ~20 minutes to build. After this, every asset has an obvious home and a future teammate can navigate it without asking.

---

## 1. The Folder Hierarchy (build this inside `Valfin Content Engine`)

```
Valfin Content Engine/
├── 00_START_HERE/
│   ├── README — Valfin Content Engine.gdoc      (paste 00_README in §3)
│   ├── Valfin Content Dashboard.gsheet           (the 6-tab tracker)
│   └── Brand quick-reference.gdoc                (paste the cheat-sheet in §3)
│
├── 01_Scripts_and_Packages/
│   ├── Launch Campaign/                           (the 5 priority pieces)
│   │   ├── LAUNCH-01_They-Just-Call-Back-Faster.gdoc
│   │   ├── LAUNCH-02_The-742PM-Call.gdoc
│   │   ├── LAUNCH-03_30-Seconds-After-Call.gdoc
│   │   ├── LAUNCH-04_See-Your-Number.gdoc
│   │   └── LAUNCH-05_The-Vacation-Test.gdoc
│   └── Backlog/                                   (future pieces from the 100-idea DB)
│
├── 02_Assets/
│   ├── AI_Stills/
│   │   ├── VLF-001/  VLF-002/  VLF-003/  VLF-004/  VLF-005/
│   ├── B-roll/
│   │   ├── VLF-001/ ... VLF-005/
│   ├── Voiceover/
│   │   ├── VLF-001/ ... VLF-005/
│   └── Music_and_SFX/
│
├── 03_Masters/                                    (final 9:16 exports, ready to post)
│   ├── VLF-001_master_v1.mp4 ...
│
├── 04_Covers_and_Thumbnails/
│   ├── VLF-001_cover.png ...
│
├── 05_Derivatives/                                (carousels, blogs, email drafts)
│   ├── Carousels/
│   ├── Blogs/
│   └── Email/
│
├── 06_Published_Archive/                          (what went live + final captions)
│   └── 2026-06/
│
└── 07_Reference/                                  (brand guidelines, strategy copies)
    ├── CONTENT_BRAND_GUIDELINES.gdoc
    ├── 90_DAY_CONTENT_STRATEGY.gdoc
    └── Approval & Publishing Checklists.gdoc
```

**Naming conventions (match the repo):**
- Assets: `VLF-00X_assettype_descriptor_vN.ext` → e.g. `VLF-002_still_dusk-phone_v2.png`, `VLF-002_vo_master_v1.mp3`, `VLF-002_master_v3.mp4`
- Never overwrite — increment `vN`.
- One subfolder per `VLF-00X` inside each asset type.

---

## 2. Build steps

1. Open the hub link. Create the 8 top-level folders above (00–07).
2. Inside `02_Assets`, create the four subfolders, and inside each, the five `VLF-00X` folders. (Tip: make one set, then duplicate.)
3. Drop the **Content Dashboard** sheet into `00_START_HERE` (built from [`SHEETS_SETUP_GUIDE.md`](../google-sheets/SHEETS_SETUP_GUIDE.md)).
4. Copy the 5 launch piece docs from the repo (`content/launch/pieces/`) into `01_Scripts_and_Packages/Launch Campaign/` as Google Docs.
5. Copy the brand guidelines + strategy + checklists into `07_Reference/`.
6. Paste the README and cheat-sheet text (§3) into the `00_START_HERE` docs.
7. Set sharing: keep private to the founder for now; "Anyone with link = Viewer" only if you bring on a contractor.

---

## 3. Files to create (copy-paste content below)

### `00_README — Valfin Content Engine.gdoc`
```
VALFIN CONTENT ENGINE — START HERE

This Drive is the operating hub for all Valfin content.

THE FLOW:
1. Pick/approve a piece → it's tracked in the Content Dashboard (00_START_HERE).
2. Script lives in 01_Scripts_and_Packages.
3. Generate assets (AI stills in ChatGPT Pro, B-roll on your phone, VO) → 02_Assets/VLF-00X.
4. Edit in CapCut → export the final to 03_Masters.
5. Make the cover → 04_Covers_and_Thumbnails.
6. Post. Move the caption + link record to 06_Published_Archive. Log numbers in the Dashboard.
7. Repurpose (carousel/blog/email) → 05_Derivatives.

RULES (full version in 07_Reference):
- Outcomes, not AI. Never say AI Employee / chatbot / software.
- Show real numbers or clearly label examples. Never invent a stat.
- One CTA per piece. ~8th-grade reading level. No exclamation points.
- Never overwrite an asset — increment the version (v1, v2...).

CURRENT PRIORITY: ship the 5 Launch Campaign pieces. Order + timing are in the Content Dashboard.
```

### `Brand quick-reference.gdoc` (the one-page cheat-sheet)
```
VALFIN VOICE — ONE PAGE

SAY: stop losing leads · call back faster · respond in seconds · never miss a call ·
book more jobs · save time · run like a bigger company · in your voice · done for you.

NEVER SAY: AI Employee · chatbot/bot · software/SaaS/app/tool/platform · results may vary ·
revolutionary/game-changing/10x/unlock/supercharge · any made-up stat · "more leads" promise ·
published prices · exclamation points.

EVERY PIECE: pain/outcome first → AI secondary or absent → one CTA matched to funnel stage.
PROOF RULE: every number is verified-real OR clearly labeled "example/in progress."
THE LINE: "Your competitors aren't better than you. They just call back faster."
THE REFRAME: "This was never a marketing problem."
```

---

## 4. How the Drive and the repo relate

- **The repo** (`content/`) holds the canonical text source of truth (scripts, templates, guidelines), version-controlled in git.
- **The Drive** is the *working hub* for binary assets (images, video, audio) and for day-to-day operation — the stuff git intentionally ignores.
- Copy text docs from repo → Drive when you start producing. If you edit a script meaningfully in Drive, reflect the final version back into the repo so git stays the source of truth.

---

## 5. Minimum to start TODAY

You don't need the whole tree before you ship. The smallest viable setup:
1. `00_START_HERE` with the Content Dashboard.
2. `02_Assets/VLF-001` (for your first piece's stills/B-roll/VO).
3. `03_Masters` (for the final export).

Build the rest as you go. Don't let folder-making delay your first post.
