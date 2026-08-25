import Link from "next/link";
import { PROFILE } from "@/lib/projects";
import { NAV, FOOTER_LINKS } from "@/lib/nav";
import { INFRA } from "@/lib/infra";

/**
 * The footer carries the infrastructure links, which is where they belong. A
 * page about a droplet is not a headline, it is a thing you go looking for
 * after the work has convinced you to.
 */
export function SiteFooter() {
  const target = process.env.NEXT_PUBLIC_BUILD_TARGET ?? "server";

  const runningOn =
    target === "export"
      ? "This copy is the static export on GitHub Pages, the free fallback."
      : INFRA.state === "live"
        ? `Running as a container on a ${INFRA.host.memoryGb} GB ${INFRA.host.provider} droplet, deployed by Coolify on push.`
        : "Built to run as a container on a DigitalOcean droplet under Coolify. The droplet is not paid for yet, so this copy is on a free host.";

  return (
    <footer className="border-t border-rule">
      <div className="mx-auto w-full max-w-shell px-6 py-14 sm:px-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="display text-lg">{PROFILE.fullName}</p>
            <p className="mt-2 text-sm text-text-secondary">{PROFILE.title}</p>
            <p className="mt-1 text-sm text-text-secondary">{PROFILE.location}</p>
          </div>

          <nav aria-label="Footer" className="text-sm">
            <p className="label">Pages</p>
            <ul className="mt-3 space-y-2">
              {NAV.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-text-secondary transition-colors hover:text-ink">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Behind the site" className="text-sm">
            <p className="label">Behind the site</p>
            <ul className="mt-3 space-y-2">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-text-secondary transition-colors hover:text-ink">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="text-sm">
            <p className="label">Reach me</p>
            <ul className="mt-3 space-y-2">
              <li>
                <a href={`mailto:${PROFILE.email}`} className="link-underline text-text-secondary hover:text-ink">
                  {PROFILE.email}
                </a>
              </li>
              <li>
                <a href={PROFILE.github} className="link-underline text-text-secondary hover:text-ink">
                  github.com/{PROFILE.githubHandle}
                </a>
              </li>
              <li>
                <a href={PROFILE.linkedin} className="link-underline text-text-secondary hover:text-ink">
                  linkedin.com/in/{PROFILE.linkedinHandle}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-rule pt-6 text-xs text-text-faint md:flex-row md:items-center md:justify-between">
          <p className="font-mono">
            © {new Date().getFullYear()} {PROFILE.fullName}
          </p>
          <p className="max-w-prose">{runningOn}</p>
        </div>
      </div>
    </footer>
  );
}
