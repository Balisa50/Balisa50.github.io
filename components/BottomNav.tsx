"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Layers, FileText, Calendar, Send } from "lucide-react";

/**
 * Mobile-only bottom nav.
 *
 * iOS convention: five tabs, icons above short labels, the active tab picked
 * out by colour rather than a pill or underline. Matches the same breakpoint
 * as the top nav (md), so on tablets and up the top nav takes over and this
 * disappears.
 *
 * Sits above the safe-area inset on phones with home indicators. Uses
 * env(safe-area-inset-bottom) so it does not collide with the iOS gesture bar.
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
      className="fixed inset-x-0 bottom-0 z-40 md:hidden border-t border-border bg-background/85 backdrop-blur-xl"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto grid max-w-md grid-cols-5">
        {LINKS.map(({ href, label, Icon }) => {
          const active = current === normalise(href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-mono uppercase tracking-wider transition-colors ${
                  active ? "text-ink" : "text-text-faint hover:text-text-secondary"
                }`}
              >
                <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                <span>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
