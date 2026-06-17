# Massachusetts Roofing Finder Agent — Architecture & Implementation Plan

**Status:** Approved 2026-06-14, refinements incorporated. This is Phase 1 of Valfin Tech's internal
prospecting system — a relationship-intelligence database of MA roofing companies, built to support
high-quality, personalized outreach (Phase 2+), not mass-blast lead generation.

This is a separate sub-project from the client-facing Roofing CRM/automation system in `workflows/`
(that system runs *for* a roofing client; this one is *Valfin's own* prospecting tool).

---

## Refinements vs. original proposal (2026-06-14)

- **No lead scoring.** No hot/warm/cold, no numeric score. The database exists to give a future
  outreach rep enough context to have a real conversation — not to rank/prioritize automatically.
- **`pipeline_stage` added** to `roofing_companies` — a manually-progressed relationship status,
  not an automated score. Values: `discovered` → `researched` → `email_sent` → `replied` →
  `meeting_booked` → `client` → `do_not_contact`.
- **No website screenshots.** Raw HTML + extracted text is stored (see `company_web_content`);
  visual review, if ever needed, is manual.
- **Enrichment model standardized on Claude (Sonnet 4.6)** via the Anthropic API — not OpenAI.
  Matches the rest of Valfin's stack.
- **Review snippets captured.** A handful of representative Google review excerpts are stored per
  company (`company_reviews`) — useful color for outreach/meetings ("customers mention your
  response time a lot...").
- **Pilot scope: ~25 companies**, not statewide. Town selection (see `PILOT_CITY_LIST.md`)
  prioritizes towns likely to surface independent/small-to-mid roofing companies with a working
  website and visible contact info — i.e. realistic email-outreach candidates — rather than the
  largest statewide players. Statewide expansion happens after a data-quality review of the pilot.

---

## 1. System Architecture (text diagram)

```
                         ┌─────────────────────────────┐
                         │   n8n: ORCHESTRATOR           │
                         │  (Manual Trigger for pilot)   │
                         │  Iterates pilot town list      │
                         └──────────────┬───────────────┘
                                         │ batches of towns
                                         ▼
                         ┌─────────────────────────────┐
                         │ n8n: DISCOVERY WORKFLOW        │
                         │ Google Places Text Search       │
                         │ "roofing company in <town>, MA" │
                         │ + Place Details                 │
                         └──────────────┬───────────────┘
                                         │ raw place results
                                         ▼
                         ┌─────────────────────────────┐
                         │ n8n: DEDUPE & UPSERT           │
                         │ Match on google_place_id        │
                         │ (fallback: name+city+phone)     │
                         │ → insert OR update                │
                         │ → write discovery_logs row         │
                         │ → capture review snippets (top 3)  │
                         └──────────────┬───────────────┘
                                         │ company_id (new/updated, has website)
                                         ▼
                         ┌─────────────────────────────┐
                         │ n8n: ENRICHMENT WORKFLOW        │
                         │ Fetch website HTML               │
                         │ Extract: text, emails, social     │
                         │ links → store in                   │
                         │ company_web_content                 │
                         │ Claude Sonnet 4.6 → structured       │
                         │ extraction: owner names, years        │
                         │ in business, notes                     │
                         │ pipeline_stage → 'researched'           │
                         └──────────────┬───────────────┘
                                         │
                                         ▼
                         ┌─────────────────────────────┐
                         │      SUPABASE (Postgres)      │
                         │  roofing_companies              │
                         │  company_contacts                │
                         │  social_profiles                  │
                         │  company_reviews                    │
                         │  company_web_content                  │
                         │  discovery_logs                         │
                         │  (+ future-phase tables, FK-ready,        │
                         │   not built yet: business_research_        │
                         │   summaries, outreach_history,              │
                         │   meeting_history, crm_notes)                │
                         └─────────────────────────────┘
```

**External services:** Google Places API (Text Search + Place Details), Anthropic Claude API
(Sonnet 4.6, extraction), Supabase (Postgres + REST).

---

## 2. Supabase Schema Design

**Core tables (build now):**

- `roofing_companies` — one row per business, keyed by `google_place_id` (unique) for dedup.
  Includes `pipeline_stage`.
- `company_contacts` — 1:many, decision-maker names/roles found during enrichment
- `social_profiles` — 1:many, one row per platform per company
- `company_reviews` — 1:many, representative Google review snippets (text + rating)
- `company_web_content` — 1:many, raw HTML + extracted text per fetched page (homepage,
  about/contact)
- `discovery_logs` — append-only audit trail of every discovery/enrichment action

**Future-phase tables (documented, NOT built now — all hang off `roofing_companies.id`):**

- `business_research_summaries` (Phase 2+) — AI-generated research briefs per company
- `outreach_history` (Phase 3+) — emails/calls sent, status
- `meeting_history` (Phase 3+) — discovery calls, dates, outcomes
- `crm_notes` (Phase 3+) — freeform relationship notes

Because every future table just needs a `company_id uuid references roofing_companies(id)`, no
restructuring of the core tables will be needed later.

---

## 3. SQL Table Definitions

See [`supabase/schema.sql`](../supabase/schema.sql) for the runnable DDL. Summary:

| Table | Purpose | Key relationships |
|---|---|---|
| `roofing_companies` | Core record per business | `google_place_id` unique |
| `company_contacts` | Owner/decision-maker names | `company_id → roofing_companies.id` |
| `social_profiles` | Instagram/Facebook/LinkedIn/YouTube links | `company_id`, unique per `(company_id, platform)` |
| `company_reviews` | Representative review snippets | `company_id` |
| `company_web_content` | Raw HTML + extracted text per page | `company_id` |
| `discovery_logs` | Audit trail | `company_id` (nullable), `run_id` |

`roofing_companies.pipeline_stage` values (enforced via check constraint):
`discovered`, `researched`, `email_sent`, `replied`, `meeting_booked`, `client`, `do_not_contact`.
Default: `discovered`. The discovery step sets `discovered`; enrichment advances it to
`researched`. All later stages (`email_sent` onward) are set manually by whoever runs outreach —
no workflow in this phase writes them.

---

## 4. n8n Workflow Design

**Implementation note (2026-06-14):** all four workflows below are built and live in n8n
(Valfin Tech personal project). The originally-planned WF-03 (separate Dedupe & Upsert
sub-workflow) was folded into WF-00 as a single `upsertCompanyByPlaceId` SQL upsert
(`INSERT ... ON CONFLICT (google_place_id) DO UPDATE ... RETURNING id, (xmax = 0) AS inserted`),
which does the find-or-create and reports insert-vs-update in one round trip — simpler than a
separate get-then-branch sub-workflow. WF-02 calls this directly, so there are 4 workflows total
(WF-00, WF-01, WF-02, WF-04), not 5.

**WF-00: Supabase Adapter** — `00 - Roofing Finder - Supabase Adapter` (id `UupxyBHmNjsKTn7k`)
- All Supabase reads/writes isolated here (mirrors the `CRM Adapter` pattern in
  `workflows/01_crm_adapter_google_sheets.json`)
- **Implementation note (2026-06-14, REST refactor):** originally built against Postgres
  directly via the n8n Postgres node. Direct Postgres connectivity from n8n Cloud to Supabase's
  pooler hit unresolved authentication failures (after fixing IPv6/SSL/pooler-config issues), so
  WF-00 was refactored to talk to Supabase's REST API (PostgREST) over HTTPS via HTTP Request
  nodes instead — avoiding DB networking entirely, works on the free plan, no IPv4 add-on needed.
  The `operation`/`payload` contract and workflow ID are unchanged; WF-01/02/04 required no
  changes. A "Supabase Config" node (right after "Adapter Input") holds the Project URL as the
  single place to configure it.
- Operations: `upsertCompanyByPlaceId` (insert-or-update by `google_place_id` via the
  `upsert_roofing_company` Postgres function, exposed as `POST /rest/v1/rpc/upsert_roofing_company`
  — returns `id` + `inserted` flag), `updateCompanyEnrichment` (PATCH `roofing_companies`;
  years_in_business/email/notes are omitted from the request body when blank so PostgREST leaves
  existing values untouched, replicating the old `COALESCE`/`nullif` logic;
  `pipeline_stage→'researched'`), `insertReviews`, `insertSocialProfiles` (bulk POST with
  `Prefer: resolution=merge-duplicates` + `on_conflict=company_id,platform`), `insertWebContent`,
  `insertContacts` (bulk POST), `writeLog`
- Auth: single `Supabase API` n8n credential (`Supabase - Roofing Finder REST`, Project URL +
  `service_role` key) attached to every HTTP Request node — no direct DB credentials
- Swap point if storage backend ever changes

**WF-01: Orchestrator** — `01 - Roofing Finder - Orchestrator` (id `P7emR3nGccQI6pPK`)
- Manual Trigger → Code node generates a timestamp-based `run_id` and the 8 pilot towns
  (hardcoded, matching `data/pilot_towns.json` — n8n workflows can't read local repo files at
  runtime)
- Loops the towns one at a time (Split In Batches, batch size 1) → calls WF-02 per town

**WF-02: Discovery (per town)** — `02 - Roofing Finder - Discovery` (id `BJ3BVZSszacpTxne`)
- Google Places API (New) Text Search: `"roofing company in {{town}}, MA"`, with a field mask
  that returns place id, name, address (+ components for zip), phone, website, rating, review
  count, and up to ~5 reviews in the **same call** — no separate Place Details request needed
- Splits results into one item per place, maps fields, then per place:
  - `upsertCompanyByPlaceId` (insert or update, `pipeline_stage` defaults to `discovered`)
  - `insertReviews` with the review snippets from the search response (no-op if none)
  - If `website_url` present → calls WF-04 (Enrichment)
  - `writeLog` with action `created` or `updated` based on the upsert result
- **Temporary (2026-06-14, smoke test only):** a `Limit to 5 (SMOKE TEST - remove before full
  pilot)` node was inserted between `Split Places` and `Map Place Fields`, capping each WF-02 run
  to the first 5 places returned. This lets a single manual run of WF-02 (one town) serve as the
  5-company smoke test without touching WF-01's town list. **Must be removed (or set to a high
  number) before running WF-01 for the full pilot** — see Section 7, step 10.

**WF-04: Enrichment (per company)** — `04 - Roofing Finder - Enrichment` (id `njRONGEoChBp2msh`)
- HTTP Request → fetch homepage only (single page; `/about`/`/contact` crawling deferred —
  homepage text is sufficient input for the pilot's Claude extraction step)
- Code node strips HTML to plain text (~8k chars), regex-extracts an email address and
  instagram/facebook/linkedin/youtube links
- `insertWebContent` (raw HTML + extracted text), `insertSocialProfiles` (whatever was found)
- Claude Sonnet 4.6 (AI Agent + structured output parser) on the extracted text → named
  decision-makers + role, years in business, and a short relationship-intelligence note
- `insertContacts` for any names found, `updateCompanyEnrichment` (years_in_business, email,
  notes, `pipeline_stage→'researched'`), `writeLog` (action=`enrichment`)
- If the homepage fetch returns no usable text (unreachable, blocked, empty) → `writeLog`
  (action=`error`), no further steps — never fails the batch
- **Fix (2026-06-14, pilot readiness audit):** `Business Details Schema` (the structured output
  parser for `Extract Business Details`) was switched from an inferred (`fromJson`) schema to a
  manual JSON Schema where `yearsInBusiness`/`notes` explicitly allow `null` and no field is
  `required`. The inferred schema treated `yearsInBusiness: 15` as a required non-nullable
  number — but per Section 8, years-in-business is frequently absent, and the system prompt
  tells Claude to return `null`/empty in that case. The mismatch would have caused structured-
  output validation to fail (and the node to throw) for any company whose homepage doesn't state
  years in business — likely most of them. Downstream code (`Build Enrichment Patch` in WF-00,
  and the Code nodes in WF-04 that read `$json.output.*`) already treats missing/null/undefined
  fields as "no value" via `||`/truthiness checks, so no other changes were needed.

---

## 5. APIs / Services Required

| Service | Purpose | Notes |
|---|---|---|
| **Google Places API** (Text Search + Place Details) | Core discovery — name, address, phone, website, rating, review count, review snippets | Requires Google Cloud project + billing enabled |
| **Supabase project** (new) | Database, accessed via its REST API (PostgREST) — no direct Postgres connection | To be created — see `SUPABASE_SETUP.md` |
| **Anthropic API** (Claude Sonnet 4.6) | Extract owner names / years-in-business / notes from website text | Already available |
| **n8n** | Orchestration | Already in use |

---

## 6. Folder Structure

```
prospecting/
├── docs/
│   ├── ARCHITECTURE.md          (this file)
│   ├── SUPABASE_SETUP.md
│   └── PILOT_CITY_LIST.md
├── supabase/
│   └── schema.sql
└── data/
    └── pilot_towns.json
```

The 4 workflows (WF-00, WF-01, WF-02, WF-04) live in n8n (Valfin Tech personal project) — see
workflow IDs in Section 4. No local workflow JSON files; the pilot town list in
`data/pilot_towns.json` is for reference/documentation (WF-01's town list is hardcoded in its
Code node, matching this file).

---

## 7. Step-by-Step Implementation Plan

1. ✅ Finalize pilot town list (`PILOT_CITY_LIST.md` / `data/pilot_towns.json`)
2. ✅ Build `Supabase Adapter` sub-workflow (WF-00)
3. ✅ Build Enrichment workflow (WF-04) with Claude Sonnet extraction
4. ✅ Build Discovery workflow (WF-02), wired to WF-00 and WF-04
5. ✅ Build Orchestrator (WF-01)
6. ⬜ Create the Supabase project, run `schema.sql` (creates tables + the
   `upsert_roofing_company` RPC function), add the `Supabase - Roofing Finder REST` n8n
   Supabase API credential, and point WF-00's "Supabase Config" node at the project URL (see
   `SUPABASE_SETUP.md`)
7. ⬜ Add a `Google Places API` credential (HTTP Header Auth, header `X-Goog-Api-Key`) in n8n —
   requires a Google Cloud project with the Places API (New) enabled and billing configured
8. ⬜ Confirm the `Anthropic account` credential (already exists in n8n) has access to
   `claude-sonnet-4-6`
9. ⬜ Run the 5-company smoke test: execute WF-02 once for a single town (the temporary `Limit
   to 5` node caps it to 5 companies); spot-check data quality in Supabase (duplicates, missing
   fields, review snippets, enrichment notes) — see Section 10 for the exact procedure and
   success criteria
10. ⬜ Remove the temporary `Limit to 5 (SMOKE TEST - remove before full pilot)` node from WF-02
    (reconnect `Split Places` → `Map Place Fields` directly) once the smoke test passes
11. ⬜ Run WF-01 (Orchestrator) for the full pilot town list to reach ~25 companies
12. ⬜ Review pilot dataset for quality/usefulness — decide on statewide expansion criteria

---

## 8. Assumptions & Limitations

- Requires a Google Cloud project with Places API enabled and billing configured (not yet set up)
- Website scraping is static-HTML only (HTTP Request node) — JS-rendered sites (Squarespace/Wix)
  may yield incomplete text extraction; known gap, not solved in Phase 1
- LinkedIn/YouTube presence is rarely linked from small roofing company sites — expect low fill
  rates for these fields
- "Years in business" and "number of locations" are often not stated publicly — best-effort,
  many records will have these blank
- Owner/decision-maker names depend on what's published on an "About Us" page — partial coverage
  expected
- Review snippets are whatever Google Places API returns (max 5 per place, not user-selectable
  beyond that) — pilot will sample top 3 by relevance/recency as returned by the API
- Dedup relies primarily on `google_place_id`; a secondary fuzzy match (name+city+phone) is
  recommended for any records added manually or from non-Google sources later

---

## 9. Reliability & Maintainability Recommendations

- Every write goes through `discovery_logs` — full audit trail per `run_id`
- Unique constraint on `google_place_id` prevents duplicate inserts at the DB level
- Enrichment errors are logged and skipped, never fail the whole batch
- `pipeline_stage='discovered'` (not yet `researched`) is a cheap query for "still needs
  enrichment" on incremental runs
- Credentials (Google API key, Supabase `service_role` key, Anthropic key) stored in n8n
  credential store only — never hardcoded in workflow JSON. The Supabase Project URL (not a
  secret) lives in WF-00's single "Supabase Config" node.
- All Supabase access is over HTTPS via the REST API (PostgREST) — no direct Postgres connection,
  so no IPv6/SSL/connection-pooler dependencies from n8n Cloud

---

## 10. Pilot Readiness Audit (2026-06-14)

A full read-through of all 4 workflows, `schema.sql`, and both docs was done before the first
smoke test. Two issues were found and fixed in n8n directly (see Sections 4.WF-02 and 4.WF-04
above); everything else below is either confirmed-correct or a documented residual risk.

### Confirmed correct (no change needed)
- `upsert_roofing_company`'s parameter names/types match exactly what `Upsert Company By Place
  ID` sends, and `Format Upsert Result` correctly normalizes the RPC's array-or-object response
  to `{id, inserted}` either way.
- The Switch node's 8 outputs in WF-00 map 1:1 to the 8 downstream branches (7 operations +
  `Unknown Operation` fallback).
- `discovery_logs.action` values written by WF-02/WF-04 (`created`, `updated`, `enrichment`,
  `error`) are all valid against the table's check constraint.
- `social_profiles.platform` values written by WF-04 (`instagram`, `facebook`, `linkedin`,
  `youtube`) match the table's check constraint, and the `on_conflict=company_id,platform` upsert
  matches the table's unique constraint.
- Item-count propagation through the WF-00 Code nodes (`Build Review Rows`, `Build Social Profile
  Rows`, `Build Contact Rows`) always returns exactly 1 item even with empty arrays, so the WF-02
  `Insert Reviews → Has Website? → Run Enrichment/Write Discovery Log` chain and WF-04's
  sequential adapter calls never silently drop items.

### Residual risks (not fixed — documented, monitor during smoke test)
1. **Empty-array POSTs to PostgREST.** When a company has 0 reviews / 0 social profiles / 0
   contacts, WF-00 POSTs `[]` to `company_reviews` / `social_profiles` / `company_contacts`.
   Modern PostgREST treats this as "insert 0 rows" and returns success — but this is the single
   highest-value thing to check in the smoke test's `discovery_logs`/Supabase output, since at
   least one of the 5 smoke-test companies will almost certainly have an empty array somewhere.
   **If this fails:** add an IF node before each of the 3 affected HTTP Request nodes in WF-00
   (`rows is empty` → skip to a pass-through Set node; `rows non-empty` → proceed to the POST).
2. **No `onError: continueRegularOutput` on Execute Workflow nodes.** Per Section 9, "Enrichment
   errors are logged and skipped, never fail the whole batch" is only partially true: the
   `Website Content Available?` branch in WF-04 handles "no text extracted" gracefully, but a hard
   failure anywhere else (Claude/Anthropic API error, WF-00 HTTP error, network exception) has no
   error-output path and will abort the whole execution chain (WF-04 → WF-02 → WF-01). The n8n
   workflow-update API used for this audit has no operation that sets a node's `onError` property
   (only node `parameters`, not node-level settings), so this could not be fixed programmatically.
   For the 5-company **smoke test** this is an acceptable, human-supervised risk — if the run
   halts, the n8n execution log shows exactly which node and company failed, which is itself
   useful diagnostic signal. **Before the unsupervised 25-company pilot**, set "On Error: Continue
   (using error output)" via the n8n UI on: WF-01's `Run Discovery`, WF-02's `Run Enrichment`, and
   WF-04's `Extract Business Details` (3 nodes, ~1 min each — see Section 10's human-actions list
   in the Pilot Readiness Report).
3. **`company_reviews`/`company_contacts` have no uniqueness constraint.** Re-running discovery
   for the same town (or a company appearing in two towns' results) will insert duplicate review/
   contact rows — `roofing_companies` itself won't duplicate (unique on `google_place_id`). Not a
   smoke-test concern (single run); for the full pilot, avoid re-running WF-01/WF-02 against towns
   already processed without first clearing `company_reviews`/`company_contacts` for affected
   `company_id`s.
4. **`company_web_content.raw_html` is unbounded.** WF-04 stores the full fetched HTML with no
   size cap (only `extracted_text` is capped at 8k chars). For typical small-business homepages
   this is well within Postgres/PostgREST limits; only a concern if a pilot company's homepage is
   unusually large (multi-MB).
5. **Google Places `places.reviews` field mask.** Including `places.reviews` in Text Search (New)
   is valid but bills under the Places API "Pro"/Atmosphere SKU tier rather than the base Text
   Search SKU — a cost note for the Google Cloud billing setup in step 7, not a functional issue.
