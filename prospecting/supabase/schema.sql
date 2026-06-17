-- Massachusetts Roofing Finder Agent — Phase 1 schema
-- Run this in the Supabase SQL editor for a new project.
-- See docs/ARCHITECTURE.md for design rationale.

create extension if not exists "uuid-ossp";

-- ============================================================
-- Core table: one row per roofing company
-- ============================================================
create table roofing_companies (
  id uuid primary key default uuid_generate_v4(),

  -- Company information
  company_name text not null,
  website_url text,
  phone text,
  email text,
  address text,
  city text,
  state text default 'MA',
  zip_code text,
  num_locations integer,
  years_in_business integer,

  -- Google Business information
  google_place_id text unique,
  google_rating numeric(2,1),
  google_review_count integer,

  -- Relationship pipeline (manual progression, NOT a score)
  pipeline_stage text not null default 'discovered'
    constraint pipeline_stage_check check (pipeline_stage in (
      'discovered', 'researched', 'email_sent', 'replied',
      'meeting_booked', 'client', 'do_not_contact'
    )),

  notes text,

  discovered_at timestamptz default now(),
  last_enriched_at timestamptz,
  updated_at timestamptz default now()
);

create index idx_roofing_companies_city on roofing_companies (city);
create index idx_roofing_companies_phone on roofing_companies (phone);
create index idx_roofing_companies_pipeline_stage on roofing_companies (pipeline_stage);

-- ============================================================
-- Decision-maker / contact names found during enrichment
-- ============================================================
create table company_contacts (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid not null references roofing_companies(id) on delete cascade,
  name text,
  role text,                          -- e.g. Owner, Office Manager
  email text,
  phone text,
  source text,                        -- e.g. website-about-page, google-profile
  notes text,
  created_at timestamptz default now()
);

create index idx_company_contacts_company_id on company_contacts (company_id);

-- ============================================================
-- Social profile links
-- ============================================================
create table social_profiles (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid not null references roofing_companies(id) on delete cascade,
  platform text not null
    constraint social_profiles_platform_check check (platform in (
      'instagram', 'facebook', 'linkedin', 'youtube'
    )),
  url text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (company_id, platform)
);

-- ============================================================
-- Representative Google review snippets
-- ============================================================
create table company_reviews (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid not null references roofing_companies(id) on delete cascade,
  rating integer,
  review_text text,
  author_name text,
  review_time timestamptz,
  source text default 'google_places',
  created_at timestamptz default now()
);

create index idx_company_reviews_company_id on company_reviews (company_id);

-- ============================================================
-- Raw HTML + extracted text per fetched website page
-- ============================================================
create table company_web_content (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid not null references roofing_companies(id) on delete cascade,
  page_url text not null,
  raw_html text,
  extracted_text text,
  fetched_at timestamptz default now()
);

create index idx_company_web_content_company_id on company_web_content (company_id);

-- ============================================================
-- Discovery / enrichment audit log (append-only)
-- ============================================================
create table discovery_logs (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid references roofing_companies(id) on delete set null,
  run_id text,                        -- groups rows from one orchestrator run
  source text not null,               -- google_places | website_enrichment | manual
  query_used text,
  action text not null
    constraint discovery_logs_action_check check (action in (
      'created', 'updated', 'duplicate_skipped', 'enrichment', 'error'
    )),
  details jsonb,
  created_at timestamptz default now()
);

create index idx_discovery_logs_run_id on discovery_logs (run_id);
create index idx_discovery_logs_company_id on discovery_logs (company_id);

-- ============================================================
-- Future-phase tables (NOT created yet — documented for reference)
-- All would reference roofing_companies(id) as company_id, following
-- the same pattern as the tables above. No restructuring required.
--
--   business_research_summaries (Phase 2+)
--   outreach_history             (Phase 3+)
--   meeting_history               (Phase 3+)
--   crm_notes                      (Phase 3+)
-- ============================================================

-- ============================================================
-- Upsert-by-place-id RPC (used by WF-00 Supabase Adapter via
-- the PostgREST REST API — POST /rest/v1/rpc/upsert_roofing_company)
--
-- Mirrors the previous direct-Postgres
-- "INSERT ... ON CONFLICT ... RETURNING id, (xmax = 0) AS inserted"
-- query in a single round trip, since PostgREST's built-in upsert
-- does not expose an insert-vs-update flag.
-- ============================================================
create or replace function upsert_roofing_company(
  p_company_name text,
  p_website_url text,
  p_phone text,
  p_address text,
  p_city text,
  p_zip_code text,
  p_google_place_id text,
  p_google_rating numeric,
  p_google_review_count integer
) returns table(id uuid, inserted boolean)
language plpgsql as $$
begin
  return query
  insert into roofing_companies
    (company_name, website_url, phone, address, city, zip_code,
     google_place_id, google_rating, google_review_count)
  values
    (p_company_name, p_website_url, p_phone, p_address, p_city, p_zip_code,
     p_google_place_id, p_google_rating, p_google_review_count)
  on conflict (google_place_id) do update set
    company_name = excluded.company_name,
    website_url = excluded.website_url,
    phone = excluded.phone,
    address = excluded.address,
    city = excluded.city,
    zip_code = excluded.zip_code,
    google_rating = excluded.google_rating,
    google_review_count = excluded.google_review_count,
    updated_at = now()
  returning roofing_companies.id, (xmax = 0);
end;
$$;
