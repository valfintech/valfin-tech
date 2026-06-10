# Stripe Setup Guide
_Created 2026-06-10 — step-by-step setup for the Stripe Payment Links described in `PAYMENT_PROCESS.md`. This is a one-time account setup (Sections 1-2) plus a per-client routine (Sections 3-4) you'll repeat for each new client._

> **No existing Stripe integration exists in this repo or in Valfin's accounts as of this writing** — this is a from-scratch setup.

---

## 1. Create the Stripe account (one-time)

1. Go to [stripe.com](https://stripe.com) and create an account using the Valfin Tech business email
2. Complete the business profile:
   - Business name: use whatever your registered business name is (sole proprietorship is fine to start — Stripe supports this)
   - Industry: "Software" or "Business Services"
   - Website: `https://valfintech.com`
3. Add a bank account for payouts (Settings → Payouts → Bank accounts)
4. **Leave the account in test mode while you complete Sections 2-4 below** — Stripe gives every account a Test mode/Live mode toggle (top-right of the dashboard). Build and test everything in Test mode first, then flip to Live mode once you've sent yourself a test payment and confirmed it works.

---

## 2. One-time account configuration

### 2a — Enable automatic receipts
Settings → Customer emails → turn on "Successful payments" (sends an automatic receipt to the client after every payment — this is most of what most small-business clients need for their records).

### 2b — Enable Smart Retries + failure emails (for recurring subscriptions)
Settings → Subscriptions and emails:
- "Smart Retries" should be **on by default** — confirm it's enabled. This handles failed recurring payments automatically (see `PAYMENT_PROCESS.md` §4).
- Turn on "Failed payments" and "Successful retries" customer emails.

### 2c — Branding
Settings → Branding:
- Upload the Valfin logo
- Set brand color to match the website (navy/blue palette)
- This branding appears on the Payment Link checkout page and receipts — it's the only "design work" needed for a professional-looking checkout.

---

## 3. Per-client setup — Setup Fee Payment Link (one-time charge)

Do this **after the client signs the service agreement** (Phase 0 of `ONBOARDING_SOP.md`), using the exact setup-fee number from their signed proposal.

1. Go to **Payment Links** (left sidebar) → **+ New**
2. **Add a product:**
   - Name: `[Client Business Name] — Setup & Onboarding`
   - Description: `One-time setup fee — system configuration and carrier verification` (adjust wording to match the proposal language)
   - Price: the one-time setup fee from their proposal
   - Pricing model: **One time**
3. Under "After payment", set the confirmation page to show a message, e.g.:
   > "Thanks! Your setup fee has been received. We'll be in touch within 1 business day to kick off onboarding."
4. Click **Create link** — Stripe gives you a unique URL (e.g., `https://buy.stripe.com/xxxxx`)
5. **Send this link directly to the client** (email or text) the same day the agreement is signed — see `CLIENT_ACCEPTANCE_FLOW.md` for the exact message template
6. **Wait for payment confirmation** (Stripe will show the payment in the Dashboard → Payments, and email you a notification) before starting any configuration work — this is the Phase 0 hard gate

---

## 4. Per-client setup — Recurring Platform Fee Payment Link (subscription)

Do this **at go-live**, during the kickoff call (Phase 5 of `ONBOARDING_SOP.md`), using the monthly platform fee from their signed proposal.

1. Go to **Payment Links** → **+ New**
2. **Add a product:**
   - Name: `[Client Business Name] — Monthly Platform Fee`
   - Description: `Recurring monthly subscription — Revenue Recovery System` (adjust per their tier name from `PRICING_PACKAGING.md`)
   - Price: the monthly platform fee from their proposal
   - Pricing model: **Recurring** → Monthly
3. Under "After payment", set the confirmation message, e.g.:
   > "You're all set! Your monthly subscription is active — welcome aboard."
4. Click **Create link**
5. **Share your screen on the kickoff call** and walk the client through completing this checkout together — this is the moment described in `PAYMENT_PROCESS.md` §3 where billing setup becomes part of the kickoff celebration, not a separate chore
6. The first charge occurs immediately on completion; Stripe will then bill automatically on that same date each month going forward — no further action needed

> **Tip:** create both Payment Links (setup fee + recurring fee) at the same time, right after the proposal is signed — so both links are ready to send/use whenever each stage is reached, without scrambling.

---

## 5. Ongoing monitoring (minimal)

- **Dashboard → Payments**: glance here when a setup-fee link is sent, to confirm payment before starting configuration
- **Dashboard → Subscriptions**: shows all active recurring subscriptions at a glance — useful for a monthly "is everyone current" check
- **Email notifications**: Stripe emails you automatically for successful payments, failed payments, and retry outcomes — no dashboard polling required day-to-day

---

## 6. Switching from Test mode to Live mode

Once you've:
- Created one test Payment Link of each type (one-time + recurring)
- Sent yourself a test payment using Stripe's test card number (`4242 4242 4242 4242`, any future expiry, any CVC)
- Confirmed the receipt email and confirmation page both look correct

...flip the toggle in the top-right of the Stripe Dashboard from **Test mode** to **Live mode**. Note: Payment Links created in Test mode do not carry over — you'll need to **recreate your first real client's links in Live mode** following Sections 3-4 above. After that, every subsequent client's links are created directly in Live mode.

---

## 7. Why Stripe Payment Links (and not alternatives)

- **vs. Stripe Invoicing**: Payment Links are simpler to set up per-client (no customer records to manage) and the checkout experience is just as professional. Revisit Invoicing only if a client specifically needs Stripe-hosted invoice numbers for their accounting.
- **vs. a custom checkout page**: would require website development work for no meaningful benefit at this volume — Stripe's hosted checkout is PCI-compliant, mobile-friendly, and brandable out of the box.
- **vs. PayPal/Square/other processors**: Stripe's subscription handling (Smart Retries, automatic dunning emails) is more mature for recurring SaaS-style billing, which is exactly this business model. Stripe is also the most common processor referenced in `docx`/automation tooling generally, reducing future integration friction if usage-based billing or a client portal is ever needed.

This is the recommended default for a solo founder acquiring the first few clients. No materially better option was identified.
