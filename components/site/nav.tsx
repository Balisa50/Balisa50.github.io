"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { PROFILE } from "@/lib/projects";
import { NAV, isActive } from "@/lib/nav";
import { cn } from "@/lib/utils";

/**
 * The bar has to work over two different grounds: the dark hero at the top of
 * the home page, and the light page everywhere else. Rather than render two
 * bars it flips on one condition, which also means the transition when you
 * scroll the home page is a single class change.
 *
 * The old version scrolled to anchors and highlighted the active link with an
 * IntersectionObserver. Both are gone. These are real routes now, so the active
 * state is just the pathname, and the back button works.
 */
export function SiteNav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const overHero = pathname === "/" && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        overHero
          ? "border-b border-transparent bg-transparent"
          : "border-b border-rule bg-background/85 backdrop-blur-xl"
      )}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-14 w-full max-w-shell items-center justify-between px-6 sm:px-10"
      >
        <Link
          href="/"
          className={cn(
            "inline-flex items-center gap-2 font-mono text-sm font-semibold tracking-tight transition-colors",
            overHero ? "text-white" : "text-ink"
          )}
        >
          <span
            aria-hidden="true"
            className={cn("inline-block h-1.5 w-1.5 rounded-full", overHero ? "bg-white" : "bg-accent")}
          />
          {PROFILE.name.toLowerCase()}
        </Link>

        <ul className="hidden items-center gap-7 md:flex">
          {NAV.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "border-b pb-0.5 text-sm transition-colors",
                    overHero
                      ? active
                        ? "border-white text-white"
                        : "border-transparent text-white/65 hover:text-white"
                      : active
                        ? "border-ink text-ink"
                        : "border-transparent text-text-secondary hover:text-ink"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          aria-expanded={open}
          aria-controls="site-drawer"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-md border transition-colors md:hidden",
            overHero ? "border-white/25 text-white" : "border-rule text-ink"
          )}
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </nav>

      {open && (
        <div id="site-drawer" className="border-t border-rule bg-background md:hidden">
          <ul className="mx-auto w-full max-w-shell px-6 py-3 sm:px-10">
            {NAV.map((link) => (
              <li key={link.href} className="border-b border-rule last:border-b-0">
                <Link href={link.href} className="block py-3.5">
                  <span className="text-base text-ink">{link.label}</span>
                  {link.hint && (
                    <span className="mt-0.5 block text-sm text-text-secondary">{link.hint}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
