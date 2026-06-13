# Valfin Content Dashboard — Google Sheets Setup Guide
**The implementation guide for the 6-tab Content Dashboard. ~15 minutes to set up.**

> Built to run a solo founder today and a small team later. Pre-populated with the 5 launch pieces so it's useful the moment you import it.

---

## 1. Build it in 15 minutes

1. Create a new Google Sheet named **`Valfin Content Dashboard`** inside the `Valfin Content Engine` Drive folder.
2. Create 6 tabs, named exactly: `Content Pipeline` · `Performance Dashboard` · `Content Insights` · `Hook Library` · `CTA Library` · `Experiment Tracker`.
3. For each tab: **File → Import → Upload** the matching CSV → **Replace current sheet** (import into the correct tab).
   - `01_content_pipeline.csv` → Content Pipeline
   - `02_performance_dashboard.csv` → Performance Dashboard
   - `03_content_insights.csv` → Content Insights
   - `04_hook_library.csv` → Hook Library
   - `05_cta_library.csv` → CTA Library
   - `06_experiment_tracker.csv` → Experiment Tracker
4. Freeze the header row on each tab (View → Freeze → 1 row).
5. Add the KPI formulas in §3 to the Performance Dashboard.
6. Add data-validation dropdowns in §4 (optional but recommended).

That's it. The launch campaign is already loaded.

---

## 2. What each tab is for

| Tab | Purpose | You touch it… |
|---|---|---|
| **Content Pipeline** | The production tracker — every piece from idea to published. Single source of truth for "what's in flight." | Daily, as pieces move stages |
| **Performance Dashboard** | One row per published post per platform. Raw numbers + auto-calculated KPIs. | Weekly, logging results |
| **Content Insights** | Rollup of what's working by pillar / hook type / format / platform / time. Decisions live here. | Weekly, during review |
| **Hook Library** | Every hook you've written, its type, and how it performed. Reusable asset bank. | When writing + after results |
| **CTA Library** | Every CTA, its funnel stage, and click performance. | When writing + after results |
| **Experiment Tracker** | Structured A/B tests so you learn deliberately, not by vibes. | When you run a test |

---

## 3. KPI Formulas (paste into Performance Dashboard)

Assuming row 2 is the first data row. Fill down the column.

| Column | Formula (row 2) | Meaning |
|---|---|---|
| **Save_Rate_pct** | `=IF(E2=0,"",ROUND(H2/E2*100,2))` | Saves ÷ Views × 100. The truest "this was useful/true" signal. |
| **Engagement_Rate_pct** | `=IF(E2=0,"",ROUND((F2+G2+H2+I2)/E2*100,2))` | (Likes+Comments+Saves+Shares) ÷ Views × 100. |
| **Calc_Visit_Rate (per 1k views)** | `=IF(E2=0,"",ROUND(L2/E2*1000,2))` | Calculator visits per 1,000 views — the business-impact metric. Add as a new column if you want it. |
| **Link_Click_Rate_pct** | `=IF(E2=0,"",ROUND(K2/E2*100,2))` | Link clicks ÷ Views. |

> Column letters follow the CSV's exact order: A=Post_ID, B=Content_ID, C=Platform, D=Publish_Date, **E=Views, F=Likes, G=Comments, H=Saves, I=Shares**, J=Follows_From_Post, **K=Link_Clicks, L=Calc_Visits, M=Contact_Submits**, N=Avg_Watch_Time_s, O=Retention_3s, P=Save_Rate, Q=Engagement_Rate. Verify against your imported headers before filling down.

**The one KPI that matters most:** `Calc_Visits` and `Contact_Submits`. Views and likes are vanity; Calculator visits and contact submissions are revenue signal. Rank everything by those.

**Rollup formulas for Content Insights** (examples — adjust ranges):
- Avg save rate for a pillar: `=ROUND(AVERAGEIF('Performance Dashboard'!$B:$B, <Content_IDs in that pillar>, 'Performance Dashboard'!$P:$P),2)` — simplest path is to add a `Pillar` helper column to Performance Dashboard via `VLOOKUP` against Content Pipeline, then `AVERAGEIF` on it.
- Total Calculator visits for a segment: `=SUMIF(...)` on the same helper column.

---

## 4. Recommended Dropdowns (Data → Data validation)

- **Content Pipeline → Status:** `Idea, Approved, Scripting, Assets, Producing, Video Approved, Repurposing, Scheduled, Published, Measured, Held (claim review), Archived`
- **Pillar:** `P1, P2, P3, P4, P5`
- **Funnel_Stage:** `Awareness, Consideration, Conversion`
- **Production_Difficulty:** `Low, Medium, High`
- **Hook Library / CTA Library → Status:** `Untested, Testing, Winner-candidate, Winner, Retire`
- **Experiment Tracker → Confidence:** `Low, Med, High`

---

## 5. Data Definitions (so a future teammate logs consistently)

| Field | Definition |
|---|---|
| **Content_ID** | `VLF-###` — the canonical ID for a piece of content. One per concept, shared across platforms. |
| **Post_ID** | `POST-YYYYMMDD-platform-NN` — one per published post per platform. |
| **Pillar** | P1 Leak · P2 Fix · P3 Proof/Promise · P4 Operator's Edge · P5 Founder. |
| **Funnel_Stage** | Awareness (follow) / Consideration (Calculator) / Conversion (message us). |
| **Save** | A user bookmarks the post. The strongest organic-reach + usefulness signal. |
| **Calc_Visits** | Sessions on `valfintech.com/calculator` attributable to this post (via UTM). Pull from Vercel Analytics. |
| **Contact_Submits** | Contact-form submissions attributable to this post/campaign. |
| **Retention_3s_pct** | % of viewers still watching at 3 seconds — measures hook strength. |
| **Status (Pipeline)** | Where the piece is in the 10-stage operating system. |

---

## 6. The Weekly Workflow (solo founder)

1. **Mon:** Open Content Pipeline. Confirm this week's scheduled pieces. Move any finished pieces to `Published`.
2. **As you publish:** add the `Post_ID` rows to Performance Dashboard (they're pre-seeded for the launch 5).
3. **Fri:** Log the week's numbers into Performance Dashboard. KPIs auto-calculate.
4. **Fri (15 min):** Update Content Insights — which pillar/hook/format drove the most **saves and Calculator visits**? Write one takeaway + one action.
5. **Update libraries:** mark winning hooks/CTAs `Winner-candidate`; retire duds.
6. **If running a test:** log it in Experiment Tracker; call the winner only when you have enough volume (don't over-read 200 views).

---

## 7. Built to Scale to a Team

- **Content_ID / Post_ID conventions** mean two people never collide on naming.
- **Status field** lets a future editor/scheduler see exactly what's theirs without a meeting.
- **Approved_By column** preserves the founder's approval gate even when others produce.
- **Libraries** turn one person's instincts into shared, reusable institutional knowledge — a new hire writes on-brand from day one by pulling from Hook/CTA libraries.
- **Experiment Tracker** keeps decision-making evidence-based as volume grows.

When you're ready to automate (later), this exact sheet becomes the database the n8n workflows in [`AUTOMATION_BLUEPRINT.md`](../../systems/AUTOMATION_BLUEPRINT.md) read and write — no restructuring needed.

---

## 8. Optional polish (do later, not now)

- Conditional formatting on Save_Rate (green > 1.5%, red < 0.5%) for at-a-glance scanning.
- A small chart on Content Insights: Calculator visits by pillar.
- A "This Week" filter view on Content Pipeline.

Don't let polish delay shipping. Import the CSVs, add the four KPI formulas, and start logging. That's enough.
