# Pilot Town List — ~25 Company Target

## Selection rationale

The pilot intentionally avoids Boston-core and the largest statewide players (national franchises
like big-box roofing chains tend to dominate "roofing company near Boston" results and are poor
candidates for personalized outreach — generic contact forms, marketing teams, no single
decision-maker). Instead, towns were chosen across MA regions with:

- A meaningful population base (enough local demand to support independent roofing companies)
- A mix of city/suburban character likely to surface owner-operated or small-team businesses
- Geographic spread, so the pilot dataset isn't all from one region

Each town's Google Places text search ("roofing company in `<town>`, MA") typically returns
10-20 results; after dedup (many companies serve multiple nearby towns and will appear in more
than one search), 8 towns should comfortably yield ~25 unique companies.

## Pilot towns (run in this order)

1. Worcester
2. Brockton
3. Lowell
4. Springfield
5. New Bedford
6. Framingham
7. Plymouth
8. Quincy

## Process

- Run WF-02 (Discovery) for towns 1-8 in order via the Orchestrator
- After each town, WF-03 (Dedupe/Upsert) prevents re-adding companies already discovered from a
  prior town
- Stop once `roofing_companies` reaches ~25 rows with `pipeline_stage = 'discovered'` — it's fine
  to not run all 8 towns if 25 is reached earlier, or to add a 9th/10th town if fewer than 25
  unique companies are found
- After the pilot, review data quality (Section 8 of `ARCHITECTURE.md`) before deciding the next
  batch of towns for statewide expansion

## Statewide expansion (future reference, not part of pilot)

When expanding beyond the pilot, additional towns can be drawn from MA's full list of 351
cities/towns, prioritized by population and grouped by region (Merrimack Valley, North Shore,
MetroWest, South Shore, Cape Cod, Central MA, Pioneer Valley, Berkshires) to keep coverage even.
Not needed until the pilot review is complete.
