"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { PROFILE } from "@/lib/projects";
import { cn } from "@/lib/utils";

const LINKS: { href: string; label: string }[] = [
  // The wordmark on the left has always linked home, which is the convention
  // and which people who know the convention use. It is not discoverable if you
  // do not, and on a one-page site it never had to be: there was nowhere to go
  // back to. Now there is, so home is a labelled destination like the rest.
  { href: "/", label: "Home" },
  { href: "/work", label: "Work" },
  { href: "/papers", label: "Papers" },
  { href: "/stack", label: "Stack" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" }
];

/**
 * These were fragment links into one long page, resolved by an
 * IntersectionObserver that watched five sections and underlined whichever was
 * most visible. Each section is its own route now, so the active link is simply
 * the current path and there is nothing to observe. The observer, the smooth
 * scroll handler and the scroll-position guessing all went with it.
 *
 * `trailingSlash: true` in next.config means usePathname returns "/work/", so
 * compare on a normalised copy rather than the raw value.
 */
const normalise = (p: string) => (p !== "/" && p.endsWith("/") ? p.slice(0, -1) : p);

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const current = normalise(pathname || "/");

  // Shadow / blur backdrop kicks in after a bit of scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // A route change should never leave the panel covering the page it opened.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-rule bg-background/70 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <nav
        className="mx-auto flex h-14 w-full max-w-shell items-center justify-between px-6 sm:px-10"
        aria-label="Primary"
      >
        <Link
          href="/"
          className="group inline-flex items-center gap-2 rounded-full px-2 py-1 font-mono text-sm font-semibold tracking-tight text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
        >
          <span className="relative inline-flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan/40" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan" />
          </span>
          {PROFILE.name.toLowerCase()}
          <span className="text-cyan">_</span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => {
            const active = current === l.href;
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative rounded-full px-3 py-1.5 text-sm text-text-secondary transition hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan",
                    active && "text-ink"
                  )}
                >
                  {l.label}
                  {active && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-3 -bottom-px h-px bg-gradient-to-r from-transparent via-cyan to-transparent"
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-rule bg-surface text-ink transition hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan md:hidden"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </nav>

      {/* Mobile panel */}
      {open && (
        <div
          id="mobile-nav"
          className="md:hidden"
          onClick={() => setOpen(false)}
        >
          <div
            className="border-t border-rule bg-background/95 backdrop-blur-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <ul className="mx-auto flex w-full max-w-shell flex-col gap-1 px-6 py-4 sm:px-10">
              {LINKS.map((l) => {
                const active = current === l.href;
                return (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "block rounded-lg px-3 py-3 text-base text-text-secondary transition hover:bg-surface hover:text-ink",
                        active && "text-ink"
                      )}
                    >
                      {l.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </header>
  );
}
