# Discovery Call Scorecard
_Created 2026-06-10 — fill this in immediately after every discovery call, using the completed `DISCOVERY_CALL_NOTES_TEMPLATE.md` for that call. Its purpose is to turn individual calls into a feedback loop: after 3–5 calls, the patterns across scorecards tell you whether your messaging, pricing, and qualification criteria are working — or need to change._

> **Why this exists:** a single call tells you almost nothing — every prospect is different. But 3–5 calls, scored the same way every time, start to show patterns: the same objection, the same point where interest drops, the same tier feeling "too expensive" or "too cheap." That's the signal this scorecard is built to surface. See the workbook's "After your first 3–5 calls" section for what to do with these patterns.

---

## Call Reference

- **Business name:**
- **Date:**
- **Linked notes file:** (filename of the `DISCOVERY_CALL_NOTES_TEMPLATE.md` copy for this call)

---

## 1. Fit Score

Rate each 1–5 (1 = poor fit, 5 = excellent fit):

| Dimension | Score (1-5) | Notes |
|---|---|---|
| Lead volume (enough monthly leads for the calculator story to be compelling — roughly 10+/month) | | |
| Pain visibility (did they recognize/admit the missed-lead problem without much convincing?) | | |
| Budget signal (did pricing structure land as reasonable for their business size?) | | |
| Decision-making speed (single decision-maker on the call vs. multi-step approval) | | |
| Industry/use-case fit (service business with phone/form-based lead intake — roofing-adjacent or similar) | | |

**Total fit score (out of 25):** ______

**Rule of thumb:** 18+ = strong-fit prospect, prioritize follow-up. 12-17 = workable but may need a smaller scope (Foundation tier) or longer nurture. Below 12 = likely not a fit for V1 — note why, it may reveal an ICP boundary worth adding to `CLIENT_ACQUISITION_PLAYBOOK.md`.

---

## 2. Messaging Effectiveness

- **Did the calculator number land as intended (surprise/concern, not dismissal)?** Y / N / Mixed
- **Did the founding-partner framing land as a positive (vs. a red flag about being "unproven")?** Y / N / Mixed
- **Which part of the pitch generated the most engagement/questions?**


- **Which part of the pitch generated the least reaction (silence, no follow-up questions)?**


---

## 3. Pricing Validation

- **Tier discussed:** Foundation / Growth / Built for you
- **Reaction to pricing structure (one-time setup + monthly):** too high / about right / surprisingly low / no clear reaction
- **Did the conversation reveal they were mentally expecting a different model** (e.g., pure subscription, free trial, per-lead pricing)? If so, what?


---

## 4. Recurring Pain Points

List anything this prospect said about their business problems — even if not directly related to lead capture. Over multiple calls, repeated items here may point to future "Built for you" add-ons or messaging angles.

-
-
-

---

## 5. Objections Encountered

List every objection raised, whether or not it's already in the workbook's table:

| Objection (in their words) | Already in workbook's table? (Y/N) | How it was handled | Worked? (Y/N/Unsure) |
|---|---|---|---|
| | | | |
| | | | |

---

## 6. Outcome & Next Step

- **Outcome:** A / B / C / D / E (per workbook Step 4) / Other
- **Confidence this becomes a paying client:** Low / Medium / High
- **Next step + date:**

---

## After 3–5 calls — pattern review

Once you have 3–5 completed scorecards, review them together and answer:

1. **Is the average fit score trending where expected?** If most prospects score below 12, the sourcing channel or ICP definition in `CLIENT_ACQUISITION_PLAYBOOK.md` may need adjustment.
2. **Did any single objection appear in 2+ scorecards?** If so, add it (with a working response) to the "Common objections" table in `DISCOVERY_CALL_WORKBOOK.md`.
3. **Did the calculator's assumptions (30% lost-lead rate, 35% recoverable conversion) consistently feel "too high" or "too low" to prospects?** Note this — it's signal for whoever maintains `website/src/lib/calculator.ts`, but don't change those numbers without discussing; they're a deliberate, documented assumption.
4. **Did pricing for the Growth tier consistently land as expected, too high, or barely register?** This is signal for `PRICING_PACKAGING.md` — but treat 1 data point as noise, 3+ as signal.
5. **Did a recurring pain point (Section 4) show up across multiple calls that the current pitch doesn't address?** This may be worth a note for future "Built for you" menu items — but per the current scope, do not build new offerings on the basis of a single round of calls.
