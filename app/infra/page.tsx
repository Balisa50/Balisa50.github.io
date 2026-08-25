import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/site/page-header";
import { LiveMetrics } from "@/components/live-metrics";
import { INFRA, RESERVED_MB, MONTHLY_USD } from "@/lib/infra";
import { getMetrics } from "@/lib/metrics";

export const metadata: Metadata = {
  title: "Infrastructure",
  description:
    "The droplet this site is built to run on: the specs, the containers, the deploy path from git push to swapped container, and what it costs a student per month."
};

export const revalidate = 3600;

/**
 * Reads a file out of the repo and prints it verbatim.
 *
 * The compose file on this page is the compose file in the repository, not a
 * copy of it written for the page. A code sample that is transcribed is a code
 * sample that goes stale, and on a page whose entire claim is "this is really
 * how it is deployed", a stale sample is the one thing that would sink it.
 */
function repoFile(relative: string): string {
  try {
    return fs.readFileSync(path.join(process.cwd(), relative), "utf8").trimEnd();
  } catch {
    return `# ${relative} is not readable in this build.`;
  }
}

export default async function InfraPage() {
  const metrics = await getMetrics();
  const compose = repoFile("deploy/docker-compose.prod.yml");
  const provisioning = INFRA.state === "provisioning";

  const specs: [string, string][] = [
    ["Provider", INFRA.host.provider],
    ["Plan", INFRA.host.plan],
    ["Region", INFRA.host.region],
    ["OS", INFRA.host.os],
    ["vCPU", String(INFRA.host.vcpu)],
    ["Memory", `${INFRA.host.memoryGb} GB`],
    ["Disk", `${INFRA.host.diskGb} GB SSD`],
    ["Transfer", `${INFRA.host.transferTb} TB / month`],
    ["Cost", `$${INFRA.host.monthlyUsd} / month`]
  ];

  return (
    <>
      <PageHeader
        eyebrow="Infrastructure"
        title="One droplet, five containers"
        lede="Most portfolios stop at the deploy button. This is the layer underneath: the machine, what runs on it, how code gets there, and the monthly bill. It is here because knowing what is on your server is a different skill from knowing how to push to a platform, and I would rather show it than claim it."
      />

      {provisioning && (
        <section className="border-b border-rule bg-surface">
          <div className="mx-auto w-full max-w-shell px-6 py-7 sm:px-10">
            <p className="label">Read this first</p>
            <p className="measure mt-3 text-[0.9375rem] leading-relaxed text-text-secondary">
              {INFRA.stateNote}
            </p>
          </div>
        </section>
      )}

      <section className="mx-auto w-full max-w-shell px-6 py-14 sm:px-10">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <h2 className="display text-[1.6rem] leading-tight">The machine</h2>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary">{INFRA.host.note}</p>
          </div>
          <div className="md:col-span-8">
            <dl className="border-t border-rule">
              {specs.map(([term, value]) => (
                <div
                  key={term}
                  className="flex items-baseline justify-between gap-6 border-b border-rule py-3"
                >
                  <dt className="label">{term}</dt>
                  <dd className="numeral text-[0.9375rem] text-ink">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-shell px-6 py-8 sm:px-10">
        <h2 className="label">What runs on it</h2>
        <p className="measure mt-3 text-[0.9375rem] leading-relaxed text-text-secondary">
          Five containers, asking for {(RESERVED_MB / 1024).toFixed(1)} GB between them on a{" "}
          {INFRA.host.memoryGb} GB box. That is deliberately tight, and it is why the portfolio image
          is built from the Next.js standalone output rather than shipping node_modules.
        </p>

        <div className="mt-6 border-t border-rule">
          {INFRA.services.map((service) => (
            <div key={service.name} className="grid gap-3 border-b border-rule py-5 md:grid-cols-12 md:gap-6">
              <div className="md:col-span-3">
                <p className="font-mono text-[0.9375rem] text-ink">{service.name}</p>
                <p className="mt-1 font-mono text-[0.6875rem] text-text-faint">{service.image}</p>
              </div>
              <p className="md:col-span-7 text-[0.9375rem] leading-relaxed text-text-secondary">
                {service.purpose}
              </p>
              <p className="numeral md:col-span-2 text-sm text-text-faint md:text-right">
                :{service.port} · {service.memoryMb} MB
              </p>
            </div>
          ))}
        </div>

        <h3 className="label mt-10">deploy/docker-compose.prod.yml</h3>
        <p className="mt-2 text-sm text-text-secondary">
          Printed straight from the repository at build time, so this page cannot drift from the
          file it is describing.
        </p>
        <pre className="mt-4 overflow-x-auto rounded bg-ink p-5 font-mono text-[0.75rem] leading-relaxed text-background">
          <code>{compose}</code>
        </pre>
      </section>

      <section className="mx-auto w-full max-w-shell px-6 py-8 sm:px-10">
        <h2 className="label">Git push to running container</h2>
        <ol className="mt-6 border-t border-rule">
          {INFRA.pipeline.map((step, i) => (
            <li key={step.step} className="grid gap-2 border-b border-rule py-5 md:grid-cols-12 md:gap-6">
              <div className="md:col-span-3 flex items-baseline gap-3">
                <span className="numeral text-xs text-text-faint">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-mono text-[0.9375rem] text-ink">{step.step}</span>
              </div>
              <p className="md:col-span-9 text-[0.9375rem] leading-relaxed text-text-secondary">
                {step.detail}
              </p>
            </li>
          ))}
        </ol>
        <Link href="/infra/deploy" className="link-underline mt-6 inline-block text-sm text-ink">
          The full guide: deploy this to a VPS with Coolify in five minutes
        </Link>
      </section>

      <section className="mx-auto w-full max-w-shell px-6 py-8 sm:px-10">
        <h2 className="label">Monitoring</h2>
        <p className="measure mt-3 text-[0.9375rem] leading-relaxed text-text-secondary">
          {INFRA.monitoring.note}
        </p>
        <div className="mt-8">
          <LiveMetrics metrics={metrics} results={metrics.results} title="Every deployed project" />
        </div>
      </section>

      <section className="mx-auto w-full max-w-shell px-6 py-8 sm:px-10">
        <h2 className="label">What it costs</h2>
        <dl className="mt-6 border-t border-rule">
          {INFRA.costs.map((cost) => (
            <div key={cost.item} className="grid gap-2 border-b border-rule py-4 md:grid-cols-12 md:gap-6">
              <dt className="md:col-span-4 text-[0.9375rem] text-ink">{cost.item}</dt>
              <dd className="md:col-span-6 text-sm leading-relaxed text-text-secondary">{cost.note}</dd>
              <dd className="numeral md:col-span-2 text-[0.9375rem] text-ink md:text-right">
                ${cost.monthlyUsd}
              </dd>
            </div>
          ))}
          <div className="flex items-baseline justify-between gap-6 border-b border-ink py-4">
            <dt className="text-[0.9375rem] font-medium text-ink">Total, per month</dt>
            <dd className="numeral text-[1.25rem] text-ink">${MONTHLY_USD}</dd>
          </div>
        </dl>
        <p className="measure mt-5 text-[0.9375rem] leading-relaxed text-text-secondary">
          On a student budget that is a real number, not a rounding error, and it is the reason this
          repository still builds a free static copy. Every tool in the list above is open source.
          The only line that costs money is the machine.
        </p>
      </section>

      <section className="mx-auto w-full max-w-shell px-6 pb-20 sm:px-10">
        <h2 className="label">If the droplet goes away</h2>
        <p className="measure mt-3 text-[0.9375rem] leading-relaxed text-text-secondary">
          {INFRA.fallback.summary}
        </p>
        <div className="mt-6 border-t border-rule">
          {INFRA.fallback.targets.map((target) => (
            <div key={target.name} className="grid gap-2 border-b border-rule py-5 md:grid-cols-12 md:gap-6">
              <p className="md:col-span-3 text-[0.9375rem] text-ink">{target.name}</p>
              <p className="md:col-span-7 text-[0.9375rem] leading-relaxed text-text-secondary">
                {target.how}
              </p>
              <p className="numeral md:col-span-2 text-sm text-text-faint md:text-right">
                ${target.cost} / month
              </p>
            </div>
          ))}
        </div>
        <Link href="/notes/vercel-to-vps" className="link-underline mt-8 inline-block text-sm text-ink">
          Why move at all, when Vercel is free and faster
        </Link>
      </section>
    </>
  );
}
