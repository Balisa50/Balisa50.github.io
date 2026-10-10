"use client";

import Link from "next/link";
import { PROFILE } from "@/lib/projects";

/**
 * Mobile-only wordmark. The top nav is desktop-only, but the site still
 * needs a way home on a phone, and the wordmark is the convention.
 * No links, no burger, no theme toggle: five tabs at the bottom handle
 * navigation, so this is purely the mark.
 */
export function MobileWordmark() {
  return (
    <div className="fixed left-6 top-5 z-40 md:hidden">
      <Link
        href="/"
        className="inline-flex items-center gap-2 font-mono text-sm font-semibold tracking-tight text-ink"
      >
        <span className="relative inline-flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan/40" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan" />
        </span>
        {PROFILE.name.toLowerCase()}
        <span className="text-cyan">_</span>
      </Link>
    </div>
  );
}
