import { Github, Linkedin, MapPin } from "lucide-react";
import { PROFILE } from "@/lib/projects";
import { ContactForm } from "./ContactForm";

/**
 * Contact, without publishing anything worth harvesting.
 *
 * This section used to carry a mailto link, a phone number, and a button that
 * copied the address to the clipboard. On a static public page that is three
 * gifts to a scraper, and a personal number cannot be taken back once it has
 * been indexed. What is left is a form, and the two profiles that are already
 * public and are meant to be.
 *
 * No longer a client component: the copy-to-clipboard button was the only
 * thing here that needed state, and it went with the address.
 */
export function Contact() {
  return (
    <section
      id="contact"
      className="relative mx-auto w-full max-w-shell scroll-mt-20 px-6 py-20 sm:px-10 md:py-28"
      aria-labelledby="contact-heading"
    >
      <div className="relative overflow-hidden">
        {/* Decorative glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-pink/10 blur-3xl"
        />

        <span className="relative font-mono text-xs uppercase tracking-[0.2em] text-cyan">
          Contact
        </span>

        <h2
          id="contact-heading"
          className="relative mt-3 text-balance text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-tight tracking-tight"
        >
          Have a hard problem?{" "}
          <span className="bg-gradient-to-r from-cyan via-white to-cyan bg-clip-text text-transparent">
            Let&apos;s talk.
          </span>
        </h2>

        <p className="relative mt-4 max-w-xl text-text-secondary">
          Open to full-time roles and select contract work on ML-heavy products. Tell me what you
          are working on and I will come back to you. If you want the CV, ask here and I will send
          it across.
        </p>

        <ContactForm />

        <div className="relative mt-10 flex flex-wrap items-center gap-5 text-sm text-text-secondary">
          <a
            href={PROFILE.github}
            target="_blank"
            rel="noreferrer noopener"
            className="group inline-flex items-center gap-2 transition hover:text-ink focus-visible:text-ink focus-visible:outline-none"
          >
            <span className="energy-icon grid place-items-center">
              <Github className="h-4 w-4" aria-hidden="true" />
            </span>
            github.com/{PROFILE.githubHandle}
          </a>
          <a
            href={PROFILE.linkedin}
            target="_blank"
            rel="noreferrer noopener"
            className="group inline-flex items-center gap-2 transition hover:text-ink focus-visible:text-ink focus-visible:outline-none"
          >
            <span className="energy-icon grid place-items-center">
              <Linkedin className="h-4 w-4" aria-hidden="true" />
            </span>
            linkedin.com/in/{PROFILE.linkedinHandle}
          </a>
          <span className="inline-flex items-center gap-2">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            {PROFILE.location}
          </span>
        </div>
      </div>
    </section>
  );
}
