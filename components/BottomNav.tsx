"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Layers, FileText, Calendar, Send } from "lucide-react";

/**
 * iOS-style floating tab bar. Mobile only.
 *
 * The shape is what makes this feel native. A full-width bar welded to the
 * bottom edge is Android. iOS puts a rounded, frosted container with a gap
 * on every side, so the page scrolls behind it and the container looks like
 * a control that happens to be at the bottom rather than a fixture of the
 * screen.
 *
 * The container is one rounded pill. No border. One soft shadow. Backdrop
 * blur so what is behind it stays faintly visible.
 */
const LINKS = [
  { href: "/", label: "Home", Icon: Home },
  { href: "/work", label: "Work", Icon: Layers },
  { href: "/papers", label: "Papers", Icon: FileText },
  { href: "/build-log", label: "Log", Icon: Calendar },
  { href: "/contact", label: "Contact", Icon: Send },
] as const;

const normalise = (p: string) => (p !== "/" && p.endsWith("/") ? p.slice(0, -1) : p);

export function BottomNav() {
  const pathname = usePathname();
  const current = normalise(pathname || "/");

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 z-40 md:hidden pointer-events-none"
      style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 14px)" }}
    >
      <div className="mx-auto max-w-[340px] px-4 pointer-events-auto">
        <ul
          className="grid grid-cols-5 gap-1 rounded-[26px] px-2 py-2"
          style={{
            background: "color-mix(in oklab, var(--bg) 82%, transparent)",
            backdropFilter: "saturate(180%) blur(24px)",
            WebkitBackdropFilter: "saturate(180%) blur(24px)",
            boxShadow:
              "0 10px 30px -12px rgba(0, 0, 0, 0.18), 0 2px 6px -2px rgba(0, 0, 0, 0.06)",
          }}
        >
          {LINKS.map(({ href, label, Icon }) => {
            const active = current === normalise(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`flex flex-col items-center justify-center gap-0.5 rounded-2xl py-2 transition-colors ${
                    active ? "text-ink" : "text-text-faint"
                  }`}
                >
                  <Icon
                    className="h-[22px] w-[22px]"
                    strokeWidth={active ? 2.2 : 1.8}
                    aria-hidden="true"
                  />
                  <span className="text-[10px] font-medium tracking-tight">
                    {label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
