# Supabase Setup — Roofing Finder Agent

This is a **new, separate Supabase project** — do not reuse any project tied to a client deployment.

## 1. Create the project

1. Go to [supabase.com](https://supabase.com) → New Project
2. Name: `valfin-roofing-finder` (or similar)
3. Region: pick one close to where n8n runs (e.g. `us-east-1`)
4. Save the generated database password somewhere safe (not needed for the API-based workflows
   below, but useful for direct SQL access later)

## 2. Run the schema

1. Open the project's **SQL Editor**
2. Paste the full contents of [`../supabase/schema.sql`](../supabase/schema.sql)
3. Run it — this creates all 6 core tables (`roofing_companies`, `company_contacts`,
   `social_profiles`, `company_reviews`, `company_web_content`, `discovery_logs`) **and** the
   `upsert_roofing_company(...)` SQL function used by WF-00's `upsertCompanyByPlaceId` operation
   via the REST API's `/rest/v1/rpc/upsert_roofing_company` endpoint
4. Verify under **Table Editor** that all 6 tables exist with the expected columns, and under
   **Database → Functions** that `upsert_roofing_company` exists

## 3. Get API credentials for n8n

1. Go to **Project Settings → API**
2. Copy:
   - **Project URL** (e.g. `https://xxxxx.supabase.co`)
   - **`service_role` key** (NOT the `anon` key — the adapter workflow needs write access and
     this project has no client-facing app, so RLS can stay default/off for now)

## 4. Add the credential in n8n

WF-00 now talks to Supabase entirely over its REST API (PostgREST) via HTTP Request nodes — no
direct Postgres connection, no IPv6/SSL/pooler concerns.

1. In n8n: **Credentials → New → Supabase API**
2. Fill in:
   - **Host**: your Project URL (e.g. `https://xxxxx.supabase.co`)
   - **Service Role Secret**: the `service_role` key from step 3
3. Name the credential `Supabase - Roofing Finder REST`
4. Save — n8n will test the connection against the project's REST API

## 5. Row Level Security note

By default, new Supabase tables have RLS **disabled**, so the `service_role` key (used
server-side only, never exposed) has full access. Since this database has no public-facing
client, leave RLS off for Phase 1. If a future phase adds a UI that talks to Supabase directly
from a browser, RLS policies will need to be added at that point — not a Phase 1 concern.

## 6. Point WF-00 at the project URL

WF-00 has a single "Supabase Config" node (right after "Adapter Input") with one field,
`supabaseUrl`, currently set to the placeholder `https://YOUR-PROJECT-REF.supabase.co`. Open WF-00
in n8n, edit that node, and replace the placeholder with your actual Project URL (no trailing
slash). This is the **only** place the URL needs to be set — every HTTP Request node downstream
builds its endpoint from this value.

## 7. Attach the credential to WF-00's HTTP Request nodes

The 7 HTTP Request nodes in WF-00 (`Upsert Company By Place ID`, `Update Company Enrichment`,
`Insert Reviews`, `Insert Social Profiles`, `Insert Web Content`, `Insert Contacts`,
`Write Discovery Log`) were created with "Supabase API" as their predefined credential type but
need the actual credential selected. Open each node and confirm/select the
`Supabase - Roofing Finder REST` credential created in step 4.

## 8. What to hand back

Once steps 1-4 are done, provide:
- Supabase Project URL
- `service_role` key (or just confirm the n8n credential `Supabase - Roofing Finder REST` is
  created)

so WF-00 can be pointed at the live project (steps 6-7) and the smoke test can run.

## 9. Smoke test

See `ARCHITECTURE.md` Section 10 for the pilot-readiness audit findings and the exact 5-company
smoke test procedure (WF-02 already has a temporary `Limit to 5` node wired in for this).
