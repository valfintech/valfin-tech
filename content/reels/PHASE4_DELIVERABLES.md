# Phase 4 — Business Assets & Hero Reels

**Status:** Complete. 8 Google Business Profile images + 3 hero reels produced, validated, and ready to use.

**Execution principle applied throughout:** Higgsfield for cinematic visual environments. Remotion for all deterministic business information — numbers, labels, SMS conversations, pricing, calendars, counters. No AI-generated humans in any asset.

---

## Part 1 — Google Business Profile Images

All images: 1376×768 (16:9), generated via `nano_banana_2`, no humans, dark premium aesthetic.

**Asset location:** `motion-engine/out/google-business/`

### Recommended posting order

| Order | File | Concept | Why it's this position |
|---|---|---|---|
| 1 | `GB-05-system-at-night.png` | System working while closed | Tells the exact Valfin story in readable text — "Missed Call 10:58 PM → Automated SMS 10:59 PM → Appointment Confirmed 11:00 PM" — first impression should answer "what do they do?" |
| 2 | `GB-06-response-speed.png` | Instant auto-reply vs missed opportunity | Visually dramatizes the speed advantage — "INSTANT AUTO-REPLY / 23 SECONDS" vs "MISSED OPPORTUNITY" — makes the benefit obvious in one image |
| 3 | `GB-01-missed-call-to-appointment.png` | Missed call → booked appointment | Confirms the pipeline — a phone with a red missed call connected by a glowing arc to a green calendar slot |
| 4 | `GB-08-before-after.png` | Chaos vs organized operations | Before/after transformation — chaotic system failures on the left, clean resolved checkmarks on the right, with a glowing divider |
| 5 | `GB-04-calendar-filled.png` | Calendar filled with opportunities | Aspirational — a fully booked premium calendar, every slot glowing |
| 6 | `GB-07-growth-metrics.png` | Business growth indicators | "BOOKINGS COUNT RISING / RESPONSE TIME FALLING / REVENUE GROWTH GROWING" — communicates outcome clearly |
| 7 | `GB-02-inquiry-pipeline.png` | Inquiry-to-appointment pipeline | Abstract 3D pipeline visualization showing the full lead journey |
| 8 | `GB-03-revenue-recovered.png` | Revenue recovered | Ascending revenue dashboard — note: Higgsfield hallucinated "MERCURY x RAMP" branding in the corner and some crypto symbols floating around the financial chart. Usable (the visual communicates growth clearly), but consider whether to regenerate with a cleaner prompt if needed |

### Rationale

The order prioritizes clarity over aesthetics. A business owner scanning Valfin's Google profile will see: (1) exactly what the system does at night, (2) how fast it responds, (3) the missed call → appointment pipeline, (4) the transformation it enables, (5–8) supporting evidence. By position 3 they should already understand the core value proposition.

---

## Part 2 — Hero Reels

All reels: 1080×1920 (9:16), built entirely in Remotion (`motion-engine/src/compositions/REEL0*/`), registered as `REEL-01` / `REEL-02` / `REEL-03`. No Higgsfield video — pure deterministic Remotion compositions. No AI-generated humans.

**Asset location:** `motion-engine/out/reels/`

---

### REEL-01 — "What Happens After a Missed Call"

- **Final MP4:** [`motion-engine/out/reels/REEL-01-missed-call/final.mp4`](../../motion-engine/out/reels/REEL-01-missed-call/final.mp4)
- **Cover image:** [`motion-engine/out/reels/REEL-01-missed-call/cover.png`](../../motion-engine/out/reels/REEL-01-missed-call/cover.png)
- **Duration:** 15.0s
- **Composition source:** `src/compositions/REEL01/index.tsx`
- **Higgsfield:** None — pure Remotion
- **Credits spent:** 1 music (sonilo_music) + 1 SFX (mirelo_text_to_audio)
- **Audio validation:** AAC stereo, 48kHz. Mean −15.5 dB / max −0.8 dB. Decode clean.

**Creative decisions:** Four scenes with crossfade transitions. Scene 1: "Missed call / Tom H. — 7:42 PM / MISSED" notification card drops in with a red glow — the pattern interrupt. Scene 2: "23 seconds later" label, then Valfin's outgoing SMS ("Hi Tom — sorry we missed you. Still need a hand?"), typing indicator, Tom's reply ("Yes please. Is Thursday 2pm available?") — shows the conversation, not just the concept. Scene 3: Appointment card materializes — "Tom H. / Thursday, March 20 — 2:00 PM / $485 confirmed" — clean, premium, aspiration beat. Scene 4: "$485" revenue counter ticks up with "Opportunity Recovered" label, VALFIN wordmark settles in. Every number is deterministic and readable.

**Posting package:**

> **Caption:**
> A missed call doesn't have to mean a missed job. Valfin sends the follow-up automatically — within seconds.

> **CTA:**
> See how it works → Link in bio.

> **Hashtags:**
> #ContractorMarketing #ServiceBusiness #MissedCall #AutomationForBusiness #HomeServices #BusinessGrowth #Valfin #RevenueRecovery #SmallBusinessTips #FollowUp

> **Pinned comment:**
> Every missed call is a missed booking. Valfin handles the follow-up so you don't have to — automatically, within seconds, 24/7. 60-Day Proof Period: we prove it works or you don't pay. Link in bio.

---

### REEL-02 — "The Growth Package"

- **Final MP4:** [`motion-engine/out/reels/REEL-02-growth-package/final.mp4`](../../motion-engine/out/reels/REEL-02-growth-package/final.mp4)
- **Cover image:** [`motion-engine/out/reels/REEL-02-growth-package/cover.png`](../../motion-engine/out/reels/REEL-02-growth-package/cover.png)
- **Duration:** 18.0s
- **Composition source:** `src/compositions/REEL02/index.tsx`
- **Higgsfield:** None — pure Remotion
- **Credits spent:** 1 music (sonilo_music) + 1 SFX (mirelo_text_to_audio)
- **Audio validation:** AAC stereo, 48kHz. Mean −15.9 dB / max −2.7 dB. Decode clean.

**Creative decisions:** Cinematic package reveal structure. Opens with a hero headline ("The Growth Package" / "Valfin") fading in. Four features reveal sequentially — each as a clean card with an accent icon: "Missed Call Recovery", "Auto Follow-Up SMS", "Appointment Booking", "Revenue Tracking" — cumulative, so all 4 are visible simultaneously before the transition. Features fade, price card scales in: "$497 /mo / Growth Package / Includes everything. Cancel anytime." — large, honest, no hype. 60-Day Proof Period badge follows: "We prove this works. Or you don't pay." VALFIN wordmark closes. Nothing in this reel is aspirational or vague — it states what the product is, what's included, and what it costs.

**Posting package:**

> **Caption:**
> One system. Every follow-up, booking, and revenue opportunity — handled. $497/month.

> **CTA:**
> Start your 60-Day Proof Period → Link in bio.

> **Hashtags:**
> #GrowthPackage #BusinessAutomation #ContractorBusiness #ServiceBusinessOwner #Valfin #RevenueGrowth #SmallBusiness #SystemsForBusiness #AppointmentBooking #BusinessSystems

> **Pinned comment:**
> $497/month includes: missed call recovery, auto follow-up SMS, appointment booking, and revenue tracking — everything set up and running. 60-Day Proof Period: if it doesn't work, you don't pay. Link in bio.

---

### REEL-03 — "The First 60 Days"

- **Final MP4:** [`motion-engine/out/reels/REEL-03-first-60-days/final.mp4`](../../motion-engine/out/reels/REEL-03-first-60-days/final.mp4)
- **Cover image:** [`motion-engine/out/reels/REEL-03-first-60-days/cover.png`](../../motion-engine/out/reels/REEL-03-first-60-days/cover.png)
- **Duration:** 18.0s
- **Composition source:** `src/compositions/REEL03/index.tsx`
- **Higgsfield:** None — pure Remotion
- **Credits spent:** 1 music (sonilo_music) + 1 SFX (mirelo_text_to_audio)
- **Audio validation:** AAC stereo, 48kHz. Mean −13.7 dB / max −0.5 dB. Decode clean.

**Creative decisions:** Timeline narrative across 4 day-milestones, each with a large "DAY XX" badge (156px, sansFont 800) and a specific detail beat below. A thin progress bar at the bottom fills from 0→60 across the full reel, giving visual momentum. Day 01: "Systems active" — green activation indicator with phone/calendar/check icons. Day 07: Lead counter ticks 0→12 in accent blue ("12 / LEADS CAPTURED"). Day 30: Three deterministic appointment cards appear sequentially — Marcus B. $320 / Sarah W. $485 / Jake T. $260. Day 60: Revenue counter climbs to $5,199 in green ("REVENUE IN MOTION"). Proof banner: "60-Day Proof Period Delivered. We proved it works." closes before the VALFIN wordmark. The music builds from calm to triumphant across the 18 seconds, matching the momentum of the day progression.

**Posting package:**

> **Caption:**
> Day 1: system live. Day 60: revenue moving. We prove this works — or you don't pay.

> **CTA:**
> Start your proof period → Link in bio.

> **Hashtags:**
> #60DayChallenge #BusinessProof #ContractorSuccess #HomeServiceBusiness #Valfin #RevenueGrowth #SmallBusinessAutomation #ProofOfWork #BusinessResults #ServiceBusiness

> **Pinned comment:**
> Our 60-Day Proof Period: Day 1 your system is live. By Day 7 you're capturing leads you were missing. By Day 30 appointments are booking automatically. By Day 60 revenue is in motion. If it doesn't happen, you don't pay. Link in bio.

---

## Phase 4 summary

| Asset type | Count | Higgsfield | Remotion | Credits spent |
|---|---|---|---|---|
| Google Business images | 8 | Yes (nano_banana_2) | No | ~8 image credits |
| Hero reel music | 3 | No | No | 3 (sonilo_music) |
| Hero reel SFX | 3 | No | No | 3 (mirelo_text_to_audio) |
| Hero reel compositions | 3 | No | Yes (pure Remotion) | 0 |
| **Total** | **17 assets** | | | **~14 credits** |

All assets validated. All hero reels: AAC stereo 48kHz, decode clean, no clipping.
