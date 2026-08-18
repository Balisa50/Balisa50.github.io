import Image from "next/image";
import { ArrowDown, Github, Linkedin, Mail } from "lucide-react";
import { PROFILE } from "@/lib/projects";

/**
 * Opening fold.
 *
 * Built on a 12-column grid with the text held to columns 1-7, so the name, the
 * paragraph and every section heading below share one left edge. That single
 * alignment is most of what separates a page that looks composed from one that
 * looks assembled, and it was the thing missing before: each block set its own
 * max-width and nothing lined up.
 *
 * Sized to hand over to the work quickly. A full-viewport header would push the
 * first project below the fold, and the projects are the argument.
 */
export function Hero() {
  return (
    <header
      className="mx-auto w-full max-w-shell px-6 pb-20 pt-28 sm:px-10 sm:pt-36"
      aria-label="Introduction"
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="label hero-item flex items-center gap-2">
            <span
              className="inline-block h-1.5 w-1.5 rounded-full bg-status-live"
              aria-hidden="true"
            />
            Available for new work · {PROFILE.location}
          </p>

          <h1
            className="display hero-item mt-7 text-[clamp(2.75rem,6.5vw,4.75rem)]"
            style={{ animationDelay: "0.06s" }}
          >
            {PROFILE.fullName}
          </h1>

          <p
            className="hero-item mt-5 text-lg leading-relaxed text-text-secondary"
            style={{ animationDelay: "0.12s" }}
          >
            {PROFILE.title}
          </p>

          <p
            className="hero-item measure mt-8 text-[1.0625rem] leading-[1.7] text-text"
            style={{ animationDelay: "0.18s" }}
          >
            I mostly work on retrieval and forecasting systems, and on the
            checks around them. A lot of what I have learned came from getting
            those checks wrong first: answers that cited sections which did not
            exist, and validation splits that flattered the model.
          </p>

          <nav
            className="hero-item mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm"
            style={{ animationDelay: "0.24s" }}
            aria-label="Primary"
          >
            <a
              href="#projects"
              className="group inline-flex min-h-11 items-center gap-2 font-medium text-ink link-underline"
            >
              See the work
              <ArrowDown
                className="h-4 w-4 transition-transform group-hover:translate-y-0.5"
                aria-hidden="true"
              />
            </a>
            <a
              href={PROFILE.github}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex min-h-11 items-center gap-2 text-text-secondary transition-colors hover:text-ink"
            >
              <Github className="h-4 w-4" aria-hidden="true" />
              GitHub
            </a>
            <a
              href={PROFILE.linkedin}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex min-h-11 items-center gap-2 text-text-secondary transition-colors hover:text-ink"
              aria-label="LinkedIn profile"
            >
              <Linkedin className="h-4 w-4" aria-hidden="true" />
              LinkedIn
            </a>
            <a
              href={`mailto:${PROFILE.email}`}
              className="inline-flex min-h-11 items-center gap-2 text-text-secondary transition-colors hover:text-ink"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              Email
            </a>
          </nav>
        </div>

        {/*
          Portrait, right of the name.

          No frame, no border, no corners. The photograph's own backdrop was a
          cool grey-blue (#E7EBF1) against a warm page, so any container just
          drew attention to the mismatch. Instead the image itself was prepared:
          the outer pixels trimmed (the phone export left dark artefact lines
          down the edges), the backdrop repainted to the page colour on a
          smoothstep ramp, and the edges feathered to transparency with a longer
          dissolve at the bottom so the crop through his shirt is not a line.
          It is a PNG with alpha, so it sits on the page rather than on top of it.

          Hidden below lg, where there is no second column and it would only
          push the intro down the screen.
        */}
        <div className="hidden lg:col-span-4 lg:col-start-9 lg:block">
          <Image
            src="/portrait.png"
            alt="Abdoulie Balisa"
            width={528}
            height={662}
            priority
            sizes="(min-width: 1024px) 30vw, 0px"
            className="hero-item h-auto w-full"
            style={{ animationDelay: "0.1s" }}
          />
        </div>
      </div>
    </header>
  );
}
