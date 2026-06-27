import { Suspense } from "react";
import Link from "next/link";
import { Github, Linkedin, BookOpen } from "lucide-react";
import { PROFILE } from "@/lib/projects";
import { StandaloneController } from "./StandaloneController";

const MEDIUM = "https://medium.com/@abdouliebalisa904";

// Flash-free guard: on a direct/shared load of `?standalone=true`, set the
// attribute before paint so the chrome never appears (same idea as a theme
// no-FOUC script). Client-side <Link> navigations are handled by the
// controller below, since this inline script only runs on a full page load.
const GUARD = `(function(){try{if(new URLSearchParams(location.search).get('standalone')==='true'){document.documentElement.setAttribute('data-standalone','true');}}catch(e){}})();`;

/** Drop into any case-study page to enable share/standalone mode. */
export function StandaloneMode() {
  return (
    <>
      {/* eslint-disable-next-line react/no-danger */}
      <script dangerouslySetInnerHTML={{ __html: GUARD }} />
      <Suspense fallback={null}>
        <StandaloneController />
      </Suspense>
    </>
  );
}

/** Minimal credit + social footer, shown only in standalone mode (CSS-gated). */
export function StandaloneFooter() {
  const link =
    "inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-text-secondary transition hover:text-cyan";
  return (
    <footer className="cs-standalone-footer mx-auto max-w-6xl px-6 pb-20">
      <div className="border-t border-white/10 pt-8 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-text-secondary">
          Built by{" "}
          <Link href="/" className="text-white transition hover:text-cyan">
            {PROFILE.fullName}
          </Link>
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <a href={PROFILE.linkedin} target="_blank" rel="noreferrer noopener" className={link}>
            <Linkedin className="h-3.5 w-3.5" aria-hidden="true" /> LinkedIn
          </a>
          <a href={PROFILE.github} target="_blank" rel="noreferrer noopener" className={link}>
            <Github className="h-3.5 w-3.5" aria-hidden="true" /> GitHub
          </a>
          <a href={MEDIUM} target="_blank" rel="noreferrer noopener" className={link}>
            <BookOpen className="h-3.5 w-3.5" aria-hidden="true" /> Medium
          </a>
        </div>
      </div>
    </footer>
  );
}
