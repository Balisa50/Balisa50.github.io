"use client";

import { useState } from "react";
import { Loader2, Send, Check, AlertCircle } from "lucide-react";
import { PROFILE } from "@/lib/projects";

/**
 * A contact form on a site with no server.
 *
 * This site is a static export on GitHub Pages. There is no route handler to
 * post to and no SMTP credential that could live anywhere safe, so the form
 * posts to Web3Forms, which is free, needs no card, and forwards submissions
 * to an inbox. The access key is public by design: it identifies the
 * destination inbox and cannot read anything.
 *
 * If the key is not configured the form does not render at all. A contact form
 * that silently drops messages is worse than no contact form, and the email
 * and phone next to it already work.
 */

const ENDPOINT = "https://api.web3forms.com/submit";
const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

type State = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState<string>("");

  if (!ACCESS_KEY) return null;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    // Honeypot. A real person never fills this in because it is not shown;
    // a bot fills every field it finds. Cheaper and less hostile than a captcha.
    if (data.get("botcheck")) return;

    setState("sending");
    setError("");

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          subject: `Portfolio message from ${data.get("name")}`,
          from_name: "balisa50.github.io",
          name: data.get("name"),
          email: data.get("email"),
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
      // Never a dead end: the mailto below still works, and the message says so.
      setState("error");
      setError(err instanceof Error ? err.message : "Send failed");
    }
  }

  const field =
    "w-full rounded-md border border-rule bg-background px-3.5 py-2.5 text-[15px] text-text " +
    "placeholder:text-text-faint focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan";

  return (
    <form onSubmit={onSubmit} className="relative mt-10 max-w-xl">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-text-secondary">
        Or send it from here
      </p>

      {/* Not display:none. Some bots skip hidden inputs; an off-screen field
          they will still fill. aria-hidden and tabIndex keep it away from
          anyone using a keyboard or a screen reader. */}
      <input
        type="checkbox"
        name="botcheck"
        className="absolute left-[-9999px]"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
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

      <div className="mt-4">
        <label htmlFor="cf-message" className="block text-sm text-text-secondary">
          What are you working on?
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
              Send message
            </>
          )}
        </button>

        {/* aria-live so the outcome is announced, not just shown. */}
        <p aria-live="polite" className="text-sm">
          {state === "sent" && (
            <span className="inline-flex items-center gap-1.5 text-status-live">
              <Check className="h-4 w-4" aria-hidden="true" />
              Sent. I reply from {PROFILE.email}.
            </span>
          )}
          {state === "error" && (
            <span className="inline-flex items-center gap-1.5 text-status-progress">
              <AlertCircle className="h-4 w-4" aria-hidden="true" />
              {error || "Something went wrong"}. Email me directly instead.
            </span>
          )}
        </p>
      </div>
    </form>
  );
}
