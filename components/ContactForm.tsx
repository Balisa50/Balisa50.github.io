"use client";

import { useState } from "react";
import { Loader2, Send, Check, AlertCircle, Linkedin } from "lucide-react";
import { PROFILE } from "@/lib/projects";
import { WEB3FORMS_KEY, CONTACT_CONFIGURED } from "@/lib/contact";

/**
 * The only way to reach me from this site.
 *
 * The section used to print an email address, a phone number and a copy-to-
 * clipboard button. All three are trivially harvested from a static page, and
 * a personal phone number on a public site is not recoverable once it is out.
 * A form puts a human in front of the address: I see who is asking and what
 * for, and I answer the ones worth answering.
 *
 * There is no server here, so it posts to Web3Forms, which is free and needs
 * no card. The access key is public by design: it names a destination inbox
 * and cannot read anything, so it does not expose the address it forwards to.
 *
 * If the key is not configured the form is replaced by the LinkedIn route
 * rather than disappearing. Removing the address and then shipping a form that
 * does nothing would leave no way to make contact at all.
 */

const ENDPOINT = "https://api.web3forms.com/submit";

type State = "idle" | "sending" | "sent" | "error";

const PURPOSES = [
  "A role or contract",
  "A request for your CV",
  "A question about a project",
  "Something else"
] as const;

function LinkedInFallback() {
  return (
    <div className="relative mt-8 max-w-xl border-l-2 border-accent pl-5">
      <p className="text-[15px] leading-relaxed text-text-secondary">
        The quickest way to reach me is LinkedIn. Message me there and I will come back to you.
      </p>
      <a
        href={PROFILE.linkedin}
        target="_blank"
        rel="noreferrer noopener"
        className="mt-3 inline-flex min-h-[44px] items-center gap-2 text-sm text-ink transition hover:text-accent"
      >
        <Linkedin className="h-4 w-4" aria-hidden="true" />
        linkedin.com/in/{PROFILE.linkedinHandle}
      </a>
    </div>
  );
}

export function ContactForm() {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState<string>("");

  if (!CONTACT_CONFIGURED) return <LinkedInFallback />;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    // Honeypot. A person never fills this in because it is off-screen; a bot
    // fills every field it finds. Cheaper and less hostile than a captcha.
    if (data.get("botcheck")) return;

    setState("sending");
    setError("");

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `${data.get("purpose")} — ${data.get("name")}`,
          from_name: "balisa50.github.io",
          name: data.get("name"),
          email: data.get("email"),
          purpose: data.get("purpose"),
          organisation: data.get("organisation"),
          message: data.get("message")
        })
      });

      const body = await res.json().catch(() => ({}));
      if (!res.ok || body?.success === false) {
        throw new Error(typeof body?.message === "string" ? body.message : "Send failed");
      }

      setState("sent");
      form.reset();
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Send failed");
    }
  }

  const field =
    "w-full rounded-md border border-rule bg-background px-3.5 py-2.5 text-[15px] text-text " +
    "placeholder:text-text-faint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan";

  return (
    <form onSubmit={onSubmit} className="relative mt-8 max-w-xl">
      {/* Off-screen rather than display:none. Some bots skip hidden inputs but
          will still fill one that is merely positioned away. */}
      <input
        type="checkbox"
        name="botcheck"
        className="absolute left-[-9999px]"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className="block text-sm text-text-secondary">
            Your name
          </label>
          <input
            id="cf-name"
            name="name"
            type="text"
            required
            maxLength={100}
            autoComplete="name"
            className={`mt-1.5 ${field}`}
          />
        </div>
        <div>
          <label htmlFor="cf-email" className="block text-sm text-text-secondary">
            Your email
          </label>
          <input
            id="cf-email"
            name="email"
            type="email"
            required
            maxLength={200}
            autoComplete="email"
            className={`mt-1.5 ${field}`}
          />
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-org" className="block text-sm text-text-secondary">
            Company or university
          </label>
          <input
            id="cf-org"
            name="organisation"
            type="text"
            maxLength={120}
            autoComplete="organization"
            className={`mt-1.5 ${field}`}
          />
        </div>
        <div>
          <label htmlFor="cf-purpose" className="block text-sm text-text-secondary">
            What do you need?
          </label>
          <select id="cf-purpose" name="purpose" required defaultValue={PURPOSES[0]} className={`mt-1.5 ${field}`}>
            {PURPOSES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="cf-message" className="block text-sm text-text-secondary">
          A little context
        </label>
        <textarea
          id="cf-message"
          name="message"
          required
          rows={5}
          maxLength={4000}
          className={`mt-1.5 resize-y ${field}`}
        />
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={state === "sending"}
          className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-cyan px-6 py-3 text-sm font-medium text-background transition hover:shadow-glow-cyan-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-60"
        >
          {state === "sending" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Sending
            </>
          ) : (
            <>
              <Send className="h-4 w-4" aria-hidden="true" />
              Send
            </>
          )}
        </button>

        {/* aria-live so the outcome is announced rather than only shown. The
            success text deliberately names no address. */}
        <p aria-live="polite" className="text-sm">
          {state === "sent" && (
            <span className="inline-flex items-center gap-1.5 text-status-live">
              <Check className="h-4 w-4" aria-hidden="true" />
              Sent. I read these and reply to the ones I can help with.
            </span>
          )}
          {state === "error" && (
            <span className="inline-flex items-center gap-1.5 text-status-progress">
              <AlertCircle className="h-4 w-4" aria-hidden="true" />
              {error || "Something went wrong"}. LinkedIn works too.
            </span>
          )}
        </p>
      </div>
    </form>
  );
}
