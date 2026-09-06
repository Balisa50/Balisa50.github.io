import { LegacyRouteRedirect } from "@/components/LegacyRouteRedirect";

/**
 * /stack was a route for one day, on 6 September 2026, before the stack was
 * folded into /about. It is kept as a redirect rather than deleted because the
 * URL was published and briefly shareable, and a 404 is a worse answer than the
 * page the content moved to.
 *
 * Deliberately absent from the sitemap and from the nav.
 */
export const metadata = { robots: { index: false, follow: true } };

export default function StackPage() {
  return <LegacyRouteRedirect to="/about" />;
}
