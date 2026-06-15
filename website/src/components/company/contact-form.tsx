"use client";

import { useId, useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Status = "idle" | "submitting" | "success" | "error";

/**
 * "Talk to us" contact form — the low-pressure path for visitors who'd
 * rather have a conversation than run the calculator first. POSTs to
 * /api/contact, which is the seam where this will eventually join the
 * n8n lead pipeline / CRM (see route comments).
 */
export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [smsConsent, setSmsConsent] = useState(false);

  const nameId = useId();
  const emailId = useId();
  const businessId = useId();
  const messageId = useId();
  const smsConsentId = useId();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!smsConsent) {
      setStatus("error");
      setError("Please check the box to agree to receive SMS messages before submitting.");
      return;
    }

    setStatus("submitting");
    setError(null);

    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      business: String(data.get("business") ?? ""),
      message: String(data.get("message") ?? ""),
      smsConsent: true,
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? "Something went wrong. Please try again.");
      }

      setStatus("success");
      form.reset();
      setSmsConsent(false);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-success/30 bg-success/[0.06] p-8 text-center sm:p-10">
        <CheckCircle2 className="mx-auto size-8 text-success" aria-hidden="true" />
        <h3 className="mt-4 text-xl font-semibold text-ink-50">Got it, thank you.</h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-300">
          We read every message ourselves. Expect to hear back from a real person, usually within one business
          day, often sooner.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-ink-700 bg-ink-900/50 p-8 sm:p-10" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor={nameId} className="text-ink-200">
            Your name
          </Label>
          <Input id={nameId} name="name" required autoComplete="name" placeholder="Jordan Smith" className="mt-2 h-11" />
        </div>
        <div>
          <Label htmlFor={emailId} className="text-ink-200">
            Email
          </Label>
          <Input
            id={emailId}
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="jordan@yourbusiness.com"
            className="mt-2 h-11"
          />
        </div>
      </div>

      <div className="mt-5">
        <Label htmlFor={businessId} className="text-ink-200">
          Business name <span className="text-ink-600">(optional)</span>
        </Label>
        <Input id={businessId} name="business" autoComplete="organization" placeholder="Smith Roofing Co." className="mt-2 h-11" />
      </div>

      <div className="mt-5">
        <Label htmlFor={messageId} className="text-ink-200">
          What&apos;s going on with your leads right now?
        </Label>
        <textarea
          id={messageId}
          name="message"
          required
          rows={5}
          placeholder="Tell us a bit about how leads come in today, and where you suspect things might be slipping through the cracks."
          className={cn(
            "mt-2 w-full rounded-lg border border-ink-700 bg-ink-950 px-3.5 py-3 text-base text-ink-50 outline-none transition-colors placeholder:text-ink-600 focus-visible:border-accent-500 focus-visible:ring-2 focus-visible:ring-accent-500/40"
          )}
        />
      </div>

      {error ? (
        <p role="alert" className="mt-4 text-sm text-error">
          {error}
        </p>
      ) : null}

      <div className="mt-5 flex items-start gap-3">
        <input
          id={smsConsentId}
          name="smsConsent"
          type="checkbox"
          required
          checked={smsConsent}
          onChange={(event) => setSmsConsent(event.target.checked)}
          className="mt-0.5 size-4 shrink-0 rounded border border-ink-700 bg-ink-950 accent-accent-500 outline-none focus-visible:ring-2 focus-visible:ring-accent-500/40"
        />
        <Label htmlFor={smsConsentId} className="text-xs leading-relaxed font-normal text-ink-600">
          I agree to receive SMS messages from Valfin Tech regarding my inquiry, appointments, service updates,
          and customer support communications. Message frequency varies. Message and data rates may apply. Reply
          STOP to opt out and HELP for help. Consent is not a condition of purchase.
        </Label>
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={status === "submitting"}
        className="mt-7 w-full bg-accent-500 text-white hover:-translate-y-0.5 hover:bg-accent-400 disabled:opacity-60 sm:w-auto"
      >
        {status === "submitting" ? "Sending..." : "Send it over"}
        <ArrowRight className="ml-1 size-4" />
      </Button>
      <p className="mt-4 text-xs text-ink-600">
        No spam, no automated drip campaigns, just a real reply from a real person at Valfin Tech.
      </p>
    </form>
  );
}
