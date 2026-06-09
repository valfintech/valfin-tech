# Valfin Website — Launch Deployment Plan & Execution Checklist (v1)

**Status — updated Jun 9 2026 (LIVE):** Site is live at `https://valfintech.com`. Domain connected via Vercel + Cloudflare. SSL active.

**✅ Complete — site is live:**
- Root `.gitignore` — covers `.env*`, `.claude/`, `.DS_Store`, binary docs, build artifacts
- `.DS_Store` and `.claude/` untracked from version control
- Contact form (`/api/contact`) wired to n8n webhook with 8s timeout + Resend failsafe + Vercel-log fallback
- Internal lead capture system (n8n `OIakSYLK2iMWsB32`) built, active, end-to-end verified
- Google Sheet `1eCzFh9jrzlqFGu9BoXLAsZ7a76tN7oTApm_bVG2n-zg` — tab `Leads`, 14 headers, formatting applied
- Security headers: HSTS, X-Frame-Options, CSP, nosniff, Referrer-Policy on all routes
- Vercel Analytics (`@vercel/analytics/react`) in root layout — auto-activates on Vercel
- `vercel.json` — permanent 301 redirect: `www.valfintech.com` → `valfintech.com` (canonical apex)
- Canonical URL updated throughout codebase: `https://valfintech.com`
- Production build clean: 26/26 pages, 0 errors, 3.4s compile
- Domain connected, Cloudflare DNS configured, SSL active

**⏳ Still requires Kejsi:**
1. **Vercel env vars** — confirm `N8N_VALFIN_LEADS_WEBHOOK_URL=https://valfin.app.n8n.cloud/webhook/valfin-leads` is set in Vercel dashboard (Settings → Environment Variables) — required for production lead capture to work
2. **n8n Gmail node** — open workflow `OIakSYLK2iMWsB32` → click "Send Lead Email Alert" node → Connect Google account (OAuth, 1 click) → re-enable the node
3. **Twilio** — add `+18575261499` as Verified Caller ID in Twilio console (immediate SMS testing); upgrade from trial + submit toll-free verification (production SMS)
4. **Resend** (optional failsafe) — verify `valfintech.com` domain in Resend → add `RESEND_API_KEY` to Vercel env vars

**What remains in this document:** Sections below are now partially historical. Sections 4–6 (domain/DNS/SSL) are complete. Section 7 (lead capture) is wired and working. Section 10 (toll-free verification) is still pending.

This document assumes the codebase stays exactly as it is structurally — **no redesign, no architecture rebuild, no major visual changes.** Every item here is operational/launch-mechanics, not product work.

---

## How to read this document

Each of the ten requested areas below is a **plan + checklist**, not a narrative. Where I found something that needs your decision or your account access (which is most of this — deployment requires credentials I don't have and shouldn't ask you to hand over), it's marked **[YOUR ACTION]**. Where I could verify something directly from the codebase, it's marked **[VERIFIED]** with what I found.

---

## 1. GitHub repository review

**[VERIFIED]**
- Repo: `origin → https://github.com/valfintech/valfin-tech.git`, branch `main`
- Recent commit history shows active, descriptive, incremental work — no force-pushes or history rewrites visible
- `.gitignore` correctly excludes `node_modules`, `.next`, `.env*`-style local artifacts are *not* explicitly listed — see action item below
- Working tree currently has uncommitted changes from this session's refinement pass (pricing copy, content humanization edits, the new Revenue Recovery System doc, etc.)

**Checklist:**
- [ ] **[YOUR ACTION]** Review and commit the working-tree changes from this refinement pass (or ask me to draft the commit — I won't commit without being asked)
- [ ] **[YOUR ACTION]** Add an explicit `.env*` exclusion line to `.gitignore` (currently relies on no `.env` files existing yet — see Section 3; better to be explicit before any secrets are introduced)
- [ ] **[YOUR ACTION]** Confirm who has push access to `main` and whether you want branch protection (required reviews, no direct pushes) turned on before this becomes a production-deployed branch
- [ ] **[YOUR ACTION]** Decide whether `main` deploys directly to production or whether you want a `production`/`release` branch as a buffer — this affects how your hosting provider's auto-deploy gets configured in Section 4/5

---

## 2. Production build verification

**[VERIFIED — passes cleanly, just re-run as part of this review]**
```
npm run build
```
Result: ✓ Compiled successfully · ✓ Type-checking passed · ✓ All 26 routes generated (static + SSG + the two edge API routes) · zero errors, one expected informational warning (`Using edge runtime on a page currently disables static generation` — this is correct, expected behavior for `/api/contact` and `/api/calculator`, not a defect).

Route output confirms all marketing pages are statically generated (`○`/`●`), which is exactly what you want for a marketing site — fast, cacheable, cheap to host.

**Checklist:**
- [x] **[VERIFIED]** `npm run build` completes with zero errors
- [x] **[VERIFIED]** `npx tsc --noEmit` passes clean
- [x] **[VERIFIED]** `npx next lint` passes clean
- [ ] **[YOUR ACTION]** Run the build once more immediately before the actual deploy (as a final pre-flight, in case dependencies shift between now and then)
- [ ] **[YOUR ACTION]** Confirm your hosting provider's Node.js version matches what this project was built/tested against (check `package.json` engines field if you add one, or your provider's default — Next.js 15.5 wants a reasonably current Node LTS)

---

## 3. Environment variable review

**[VERIFIED]**
- **No `.env` files exist in the repo** (checked `.env`, `.env.local`, `.env.production`, `.env.example` — none present)
- **No `process.env` references found anywhere in `src/`** — the codebase currently has zero runtime dependency on environment variables
- This means: **the site will build and run identically in any environment with no configuration required.** That's a genuinely good launch property — there's nothing to misconfigure.

**What this also means (a forward-looking note, not a blocker):** the contact form and calculator API routes are currently self-contained stubs (see Section 7) — the moment you wire them to the n8n pipeline/CRM, that integration will need credentials (webhook URLs, API keys), and *that's* when environment variables enter the picture for the first time.

**Checklist:**
- [x] **[VERIFIED]** Zero environment variables required for the current build to run
- [ ] **[YOUR ACTION]** When you wire the contact form to the n8n pipeline (Section 7 / V1.1 roadmap item), set up `.env.local` for local dev and your hosting provider's environment-variable dashboard for production — never commit secrets to the repo
- [ ] **[YOUR ACTION]** At that time, add `.env*.local` to `.gitignore` explicitly (currently unnecessary, but worth doing proactively per Section 1)

---

## 4. Domain connection plan

**[VERIFIED]** The site is already coded to expect `https://valfintech.com` — this is hardcoded as the canonical URL in `src/lib/site-config.ts` and propagates correctly into metadata, Open Graph tags, the sitemap, and `robots.txt`. **No code changes are needed to support the domain** — this is purely a hosting + DNS exercise.

**Plan (sequenced):**
1. **[YOUR ACTION]** Choose a hosting provider for the Next.js app. Given the codebase (Next.js 15, App Router, edge-runtime API routes, static-first output), the lowest-friction options are **Vercel** (first-party Next.js support, zero-config) or **Cloudflare Pages** (since Section 5 indicates you're already planning to use Cloudflare for DNS — keeping both in one ecosystem simplifies management). This is a real decision with tradeoffs (see callout below) — make it before proceeding.
2. **[YOUR ACTION]** Connect the GitHub repo to that provider; configure the production branch (per your Section 1 decision)
3. **[YOUR ACTION]** Deploy once to the provider's default subdomain (e.g., `valfin-tech.vercel.app` or `*.pages.dev`) and **smoke-test it there first**, before touching DNS — this isolates "did the deploy work" from "did the domain connect work" as two separate, independently-debuggable steps
4. **[YOUR ACTION]** Add the custom domain (`valfintech.com`, plus a redirect from the bare `valfintech.com` → `valfintech.com`, or vice versa — pick one canonical form and redirect the other, to avoid duplicate-content SEO issues) in the provider's dashboard
5. Proceed to Section 5 (DNS) to point the domain at the provider

> **Callout — provider choice affects Section 5:** If you choose Vercel, Cloudflare becomes "DNS-only" (you manage records in Cloudflare, but Vercel handles SSL/CDN). If you choose Cloudflare Pages, Cloudflare handles everything end-to-end (DNS + SSL + CDN + hosting in one place — generally the simplest single-vendor setup). Neither is wrong; Cloudflare Pages is marginally simpler operationally *if* you're already standardizing on Cloudflare for DNS, which Section 5 suggests you are.

**Checklist:**
- [ ] **[YOUR ACTION]** Choose hosting provider (Vercel vs. Cloudflare Pages vs. other)
- [ ] **[YOUR ACTION]** Connect repo, configure production branch
- [ ] **[YOUR ACTION]** Deploy to provider's default subdomain and smoke-test there
- [ ] **[YOUR ACTION]** Add custom domain in provider dashboard; decide canonical `www` vs. bare-domain form and configure the redirect
- [x] **[VERIFIED]** No code changes required — `siteConfig.url` already matches the intended production domain

---

## 5. Cloudflare DNS configuration plan

**[YOUR ACTION — all of this requires your Cloudflare account access]**

General plan (the exact records depend on your Section 4 provider choice — your provider's domain-setup page will give you the *exact* values to enter; this is the sequence and the things to watch for):

1. Confirm the domain `valfintech.com` is already in your Cloudflare account (added as a "zone") and that Cloudflare is the authoritative nameserver at your domain registrar — if it isn't yet, that's the first step, and it can take time to propagate (sometimes up to 24–48 hours), so do this *first* if it isn't done, well before your target launch date
2. Add the DNS record(s) your hosting provider's dashboard tells you to add — typically:
   - A **CNAME** record for `www` pointing to your provider's hostname (e.g., `cname.vercel-dns.com` or your Cloudflare Pages project hostname)
   - Either an **A record** or Cloudflare-specific **CNAME flattening** for the bare/apex domain (`valfintech.com`) — Cloudflare supports CNAME flattening at the apex, which is genuinely useful here and something many DNS providers can't do
3. **Set the Cloudflare proxy status deliberately, not by default.** Cloudflare DNS records can be "proxied" (orange cloud — traffic routes through Cloudflare's CDN/security layer) or "DNS only" (grey cloud — traffic goes straight to your host). If you choose Cloudflare Pages as your host, proxied is correct and automatic. If you choose an external host like Vercel, check that provider's specific guidance — some require "DNS only" for their SSL provisioning to work correctly, and proxying too early can cause SSL handshake failures (this is the single most common Cloudflare+external-host launch-day issue, and it's avoidable by reading your provider's Cloudflare-specific docs *before* flipping the proxy toggle)
4. Leave existing MX/email-related DNS records untouched unless you know exactly why you're changing them — a domain connection project is a common moment where someone accidentally breaks email deliverability by overwriting MX records. **Audit what's currently in the zone before adding anything**, and don't delete anything you don't recognize without confirming what it's for first

**Checklist:**
- [ ] **[YOUR ACTION]** Confirm `valfintech.com` zone exists in Cloudflare and Cloudflare is authoritative
- [ ] **[YOUR ACTION]** Audit existing DNS records (especially MX/email) before making changes — screenshot or export the current zone as a rollback reference
- [ ] **[YOUR ACTION]** Add the exact record(s) your hosting provider specifies for the custom domain
- [ ] **[YOUR ACTION]** Set proxy status (orange vs. grey cloud) per your hosting provider's specific Cloudflare guidance — do not assume; check
- [ ] **[YOUR ACTION]** Verify DNS propagation (e.g., via `dig valfintech.com` or a propagation-checker site) before moving to SSL verification

---

## 6. SSL verification plan

**[YOUR ACTION — depends on Section 4/5 outcomes, but the plan is straightforward]**

Modern hosting providers (Vercel, Cloudflare Pages) provision and renew SSL certificates automatically once DNS is correctly pointed — there is normally no manual certificate work required. The plan is verification, not configuration:

1. After DNS propagates and the provider issues a certificate (usually minutes, occasionally up to a few hours), load `https://valfintech.com` directly and confirm:
   - The browser shows a valid, trusted padlock (no warnings)
   - There is no mixed-content warning (everything loads over HTTPS — this should be automatic since the codebase has no hardcoded `http://` asset references, but worth a direct visual check)
2. Confirm `https://valfintech.com` and `https://valfintech.com` both **redirect** to `https://valfintech.com` (HTTPS should be enforced, not just available) — most providers do this by default, but verify rather than assume
3. Run the site through an external SSL checker (e.g., SSL Labs' SSL Test) once live — takes a couple of minutes and gives you independent confirmation plus a security grade, which is also a nice thing to have on record before you start sending toll-free-verification or prospect traffic to the domain

**Checklist:**
- [ ] **[YOUR ACTION]** Confirm valid HTTPS certificate loads with no browser warnings on both `www` and apex domain
- [ ] **[YOUR ACTION]** Confirm HTTP → HTTPS redirect is active and forced
- [ ] **[YOUR ACTION]** Run an external SSL check (e.g., SSL Labs) and keep the result for your records
- [x] **[VERIFIED]** No mixed-content risk in the codebase — no hardcoded non-HTTPS asset URLs found

---

## 7. Contact form verification plan

**[VERIFIED — and this is the most important finding in this entire deployment plan. Read this section carefully.]**

I traced the "Talk to us" contact form (`src/components/company/contact-form.tsx`) all the way through to its API route (`src/app/api/contact/route.ts`), and here is exactly what happens today when a prospect submits it:

1. The form correctly validates input client-side and POSTs to `/api/contact`
2. The API route correctly validates the payload server-side (name, email format, message required)
3. **The route then returns a success response without forwarding the inquiry anywhere.** The code contains an explicit, honest comment marking this:
   > `// NOTE: forward to the n8n lead pipeline / CRM here once that handoff is wired up — see /docs and /workflows in the project root.`

**In plain terms: today, if a prospect fills out the contact form, they see "Got it — thank you," and the message is then discarded. Nobody receives it.** The same is true of the calculator's server-side scoring route (`/api/calculator`) — it computes the estimate and returns it to the browser, but nothing about that submission is captured or forwarded anywhere either.

This is not a bug in the sense of broken code — the code does exactly what its comments say it does, honestly and by design, as a placeholder seam for a future integration. But **it is a launch blocker in the sense that matters most: a real prospect could submit a real inquiry on launch day, receive a confident "we'll be in touch," and then simply never hear back — through no fault of theirs and with no visibility into the failure on your end.** Given that "initial prospect conversations" is explicitly one of the three things you asked me to assess launch-readiness for, this is the one finding from this entire session that I'd call a genuine **must-fix-before-launch** item — not a nice-to-have, not a V1.1 item.

**Plan:**
1. **[YOUR ACTION / possible follow-up task]** Wire `/api/contact` (and ideally `/api/calculator`, so completed-calculator sessions are also captured as warm leads) to actually deliver submissions somewhere a human will see them. The two lowest-effort options, in rough order of speed-to-implement:
   - **Fastest:** forward the validated payload via a simple email-send (e.g., Resend, Postmark, or even a transactional email API) to `hello@valfintech.com` — gets you "a human sees every submission" with the least new infrastructure
   - **More aligned with the existing plan:** wire it into the n8n lead pipeline described in `/docs` and `/workflows` at the project root, which is what the code comments already point toward and what the rest of your operational tooling expects — more setup work, but it's the integration that was clearly always intended, and it gets every inquiry into the same CRM/pipeline as the rest of your lead flow from day one
2. Either path requires environment variables (an API key, a webhook URL) — see Section 3
3. Once wired, **submit a real test inquiry through the live form** (with a throwaway name/email you control) and confirm it actually arrives where it's supposed to, before sending any real traffic to the site

**Checklist:**
- [ ] **[MUST-FIX BEFORE LAUNCH]** Wire `/api/contact` to actually deliver submissions to a human or the CRM (currently a no-op stub)
- [ ] **[Strongly recommended, same effort window]** Wire `/api/calculator` similarly, so completed calculator sessions become captured leads, not just on-screen estimates
- [ ] **[YOUR ACTION]** Send a real end-to-end test submission through the live form post-deploy and confirm receipt before driving any prospect traffic to the site
- [ ] **[YOUR ACTION]** Decide which integration path (transactional email vs. n8n pipeline) fits your timeline — I can implement either once you've decided; this is squarely in scope as an "execution" item, not a redesign

---

## 8. Analytics recommendations

**[VERIFIED]** No analytics integration exists in the codebase today — no Google Analytics, Plausible, PostHog, Vercel Analytics, or any other tracking script.

**Recommendation (kept deliberately minimal, in keeping with "no architecture rebuild"):**

For a pre-launch v1 marketing site whose main job is to support early prospect conversations, you don't need a heavyweight analytics stack — you need to know three things: *who's visiting, what they're doing on the calculator (your primary conversion mechanism), and whether the contact form is being used.* Two lightweight options fit that brief without adding meaningful complexity:

- **Plausible or Fathom** — privacy-respecting, lightweight (a single small script tag), no cookie-consent-banner requirement in most jurisdictions because they don't use cookies/fingerprinting. A good match for a brand that's positioning itself as calm and trustworthy to business owners — "we don't track you to sell ads" is a small but real trust signal that's consistent with the brand voice already established
- **Vercel Analytics** — if you choose Vercel as your host (Section 4), this is a one-line addition with zero extra script weight, and ties neatly into your deploy pipeline

Either way, the two events worth tracking deliberately from day one (beyond basic pageviews) are:
1. **Calculator completions** — does someone reach the result panel? (This is your strongest buying-intent signal on the entire site.)
2. **Contact form submissions** — both attempted and successful, so you can tell the difference between "nobody's filling it out" and "people are filling it out and something's broken" (which, per Section 7, is currently happening invisibly)

**Checklist:**
- [ ] **[YOUR ACTION]** Choose an analytics provider (Plausible/Fathom recommended for brand-fit; Vercel Analytics if hosting there)
- [ ] **[Follow-up implementation task — small, scoped]** Add the chosen script to `layout.tsx` and instrument the two key events above (calculator-completion, contact-form-submit) — straightforward, does not touch design or architecture
- [ ] **[YOUR ACTION]** Decide whether you need a cookie-consent banner (likely **no** if you choose a cookieless analytics provider — one less thing to build and one less thing visitors have to click through)

---

## 9. Post-launch monitoring checklist

A simple, practical "first two weeks" checklist — not a permanent ops dashboard, just the things worth deliberately checking while the site is new and you're learning how real traffic behaves:

**Day 1 (launch day):**
- [ ] Load the live domain from a phone on cellular data (not just office wifi) — confirms DNS/SSL/CDN are all actually working from the outside world
- [ ] Submit one real test inquiry through the contact form and confirm it arrives (Section 7)
- [ ] Run through the calculator end-to-end on the live domain
- [ ] Spot-check 3–4 pages on mobile on a real phone (not just devtools emulation)
- [ ] Confirm `https://valfintech.com/sitemap.xml` and `/robots.txt` both load and reference the correct production domain

**First week:**
- [ ] Check analytics daily for any obvious anomaly (zero traffic when you expect some = something's broken; a spike of 1-second-duration visits = possibly a crawler or a broken redirect loop)
- [ ] Watch for any contact-form submissions arriving — and respond to every single one fast (this is, not coincidentally, exactly the standard the site promises *your prospects* it holds *its clients* to — living up to it on your own front door matters)
- [ ] Check Google Search Console (submit the sitemap there once the domain is live) for any crawl errors
- [ ] Re-run the SSL check (Section 6) once more after a week, just to confirm certificate auto-renewal is correctly configured (most providers handle this silently, but it costs nothing to confirm once)

**First month:**
- [ ] Review calculator-completion and contact-form-submission counts — this is your earliest real signal about whether the site's conversion mechanism is resonating, and should directly inform what V1.1 prioritizes (Section "Roadmap" below)
- [ ] Review any prospect-conversation feedback about first impressions of the site (this is the evidence the Brand Identity Review recommended gathering before making any visual-direction decisions — start collecting it deliberately, not incidentally)

---

## 10. Toll-free verification alignment checklist

**[VERIFIED — context from existing project docs]** Your own `PROJECT_STATUS.md` and `ROADMAP.md` already note that Twilio toll-free verification (carrier error 30032) is a known, **explicitly non-blocking** external item — you previously confirmed (2026-06-07) that this should not block development, and that remains the right call. This section is about making sure the *website* and the *verification submission* tell the same story — not about the Twilio account mechanics themselves, which are outside this document's scope.

**Alignment checklist (these are the things a verification reviewer cross-checks against your live website):**
- [ ] **[YOUR ACTION]** Confirm the business description you submit in the Twilio verification form matches the language in the new **Revenue Recovery System v1 doc** (`/docs/REVENUE_RECOVERY_SYSTEM_V1.md`, Section 6 — "How to talk about this system"). Reviewers check for consistency between what a number is verified *for* and what the associated website actually describes the business as doing
- [ ] **[YOUR ACTION]** Make sure the live website is actually live (not just "in development") at the domain referenced in the verification submission — verification reviewers do visit the URL you provide
- [ ] **[VERIFIED]** The site's messaging is consistent with a legitimate, opted-in business-communications use case (answering inbound inquiries, scheduled follow-up to people who've already engaged) — nothing on the site describes cold outbound marketing or purchased-list messaging, which is exactly the profile that gets toll-free numbers flagged or rejected
- [ ] **[YOUR ACTION]** Have the Privacy Policy / Terms (if Twilio's form requires linking to one) ready and reachable from the live domain — check whether the current site has these pages; if not, this is a small, fast addition worth making before submitting verification (a missing privacy policy is one of the most common reasons toll-free submissions get sent back for revision)
- [ ] **[YOUR ACTION]** Submit verification once the domain is live and the above are aligned — not before, since reviewers will check the live site

---

# What's complete, what's V2, and what should wait for real customer feedback

This is the honest accounting the user asked for — organized by *why* something belongs where it does, not just *that* it does.

## What is complete (ready for v1 launch as-is)
- Site architecture, navigation, content layer, and all marketing pages
- Lead Leak Calculator — the primary conversion mechanism — fully functional and verified end-to-end
- SEO foundation: metadata, sitemap, robots.txt, structured data, Open Graph
- Copy voice and tone across the entire site (confirmed via this session's humanized-copy review — no changes needed)
- Pricing page clarity framing (added this session)
- Mobile/tablet responsiveness (QA'd this session — one real bug found and fixed)
- Production build, type-check, and lint — all clean
- Revenue Recovery System v1 documentation — gives prospect-conversation language a single source of truth

## What remains for Version 2 (deliberately *not* v1 scope — see roadmap below for sequencing)
- Any visual-identity evolution (palette, accent color, hero-diagram metaphor) — per the Brand Identity Review, this is real but should be evidence-driven, not pre-launch guesswork
- Published, fully-verified case studies beyond the in-progress roofing flagship
- Expansion of the proven channel set (additional messaging platforms) as standard rather than per-business configuration
- A formally-documented onboarding SLA derived from real install data

## What should explicitly wait until real customer feedback exists
- **Any visual-direction change** — the Brand Identity Review's core recommendation: gather real first-impression feedback from actual prospects before spending effort on a palette/identity shift that might not even be the thing that needs fixing
- **Analytics-driven prioritization of which page/section to improve next** — you don't have traffic data yet; don't guess at what to optimize before you can measure what's actually happening
- **Pricing-tier refinement beyond the clarity framing added this session** — real conversations will surface real objections and real "where do I fit" confusion in ways a pre-launch audit can't predict
- **Expansion beyond the proven roofing flagship into deeper industry-specific content** — the current industry pages are well-written and proven-by-analogy; whether they need to go deeper should be informed by which industries actually convert, not by which ones look underbuilt today

---

# Prioritized Roadmap

## Version 1 — Launch
*Goal: get the site live, supporting real operations, with nothing that silently fails.*
- Execute Sections 1–6 of this deployment plan (repo hygiene → domain → DNS → SSL)
- **Fix the contact-form/calculator capture gap (Section 7) — this is the one item in this entire plan I'd block launch on.** Everything else here is sequencing and account-access work; this is the one piece of *code* that needs to change before real prospects start using the site for its intended purpose
- Stand up minimal analytics (Section 8) — even a one-line script before launch is far more valuable than adding it after a week of unmeasured traffic
- Submit toll-free verification once the domain is live and aligned (Section 10)
- Run the Day 1 monitoring checklist (Section 9)

## Version 1.1 — Early Improvements
*Goal: act on the first real signals without re-opening any structural questions.*
- Wire the calculator's server-side route into the same capture pipeline as the contact form, if not already done as part of V1 (turns every completed calculator session into a captured warm lead, not just an on-screen number)
- Instrument and review the two key analytics events (calculator completions, form submissions) and act on whatever the first few weeks show — e.g., if completions are high but submissions are low, that's a strong, specific signal about where the friction actually is
- Address the minor universal touch-target sizing note from the mobile QA pass (36–48px → closer to 44px) — small, low-risk, broadly beneficial polish
- Add a Privacy Policy / Terms page if not already in place before toll-free submission (Section 10) — likely needed regardless, and better to have live from day one than bolted on later
- Begin deliberately collecting first-impression feedback from real prospect conversations — the raw material the V2 brand decision will run on

## Version 2 — Brand Evolution
*Goal: resolve the visual-identity question the Brand Identity Review raised — with evidence, not guesswork.*
- Synthesize the first real batch of prospect first-impression feedback (gathered per V1.1) against the Brand Identity Review's findings
- Make a deliberate, evidence-informed decision among the alternatives the Review presented (calibrated accent shift vs. base-mode change vs. visual-metaphor refresh) — and *then*, and only then, scope the design-system work that decision implies
- This is the version where "redesign" conversations become appropriate to have — not before

## Version 3 — Proof Assets & Case Studies
*Goal: replace "measurement in progress" with real, verified proof — the thing the entire site's trust architecture is quietly waiting on.*
- Publish the roofing flagship's fully-verified results once its measurement period closes (per the existing methodology already documented on `/results/roofing-flagship`)
- Add a second and third verified case study from different industries, each held to the same before-and-after, business's-own-records standard
- Expand the Results page from "here's our methodology" to "here's our track record" — the single biggest trust-perception upgrade available to the site, and one that costs nothing in design or positioning risk because the standard for it was already set honestly in v1

---

## One-paragraph summary, if you only read one section

The site is structurally ready to launch. The deployment mechanics (domain, DNS, SSL, hosting) are all standard, well-understood account-access work with no code changes required — your call on timing and provider. **The one piece of actual code that needs to change before launch is the contact form / calculator capture pipeline (Section 7): right now, a real prospect's inquiry would vanish silently after a confident "we'll be in touch."** Fix that one seam, stand up minimal analytics, and the rest of this plan is execution, not engineering — exactly the "practical launch plan" you asked for.
