export interface NavLink {
  href: string;
  label: string;
  /** Shown in the drawer only. The desktop bar stays as short as it can. */
  hint?: string;
}

/**
 * Six routes and no dropdowns. The single-page version of this site put
 * everything behind an anchor, which meant a link to a project was a link to a
 * scroll position, and the browser back button did nothing useful.
 */
export const NAV: NavLink[] = [
  { href: "/work", label: "Work", hint: "Eleven projects, filterable" },
  { href: "/stack", label: "Stack", hint: "What I use and where it runs" },
  { href: "/moat", label: "Moat", hint: "What is actually hard to copy" },
  { href: "/balisa-agent", label: "Agent", hint: "An offline voice assistant" },
  { href: "/about", label: "About", hint: "Why any of this exists" },
  { href: "/contact", label: "Contact", hint: "Email and phone" }
];

/** Linked from the footer rather than the bar. Infrastructure is not a headline. */
export const FOOTER_LINKS: NavLink[] = [
  { href: "/infra", label: "Infrastructure" },
  { href: "/notes/vercel-to-vps", label: "From Vercel to VPS" },
  { href: "/research/gambia-2074", label: "Gambia 2074" }
];

export function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
