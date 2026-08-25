import monitorConfig from "@/data/monitors.json";
import snapshotFile from "@/data/metrics-snapshot.json";

/**
 * Where the numbers on the project pages come from.
 *
 * Two sources, and the difference is always shown to the reader:
 *
 *   live      measured when this page was rendered or last revalidated
 *   snapshot  the last measurement committed to the repo, with its date
 *
 * The static build has no server to measure anything, so it falls back to the
 * snapshot. That is a weaker claim than a live probe and it is labelled as one,
 * because an uptime figure nobody can date is not a metric, it is decoration.
 *
 * Uptime specifically is not computed here. A single request tells you a
 * service answered once; it tells you nothing about the last thirty days. Until
 * Uptime Kuma is running on the droplet and has history, this module reports
 * response time and reachability only, and the infra page says so.
 */

export interface Monitor {
  slug: string;
  label: string;
  url: string;
  note?: string;
}

export interface ProbeResult {
  slug: string;
  label: string;
  url: string;
  ok: boolean;
  /** HTTP status, or 0 when the request never completed. */
  status: number;
  ms: number;
  error?: string;
  note?: string;
}

export interface MetricsSnapshot {
  measuredAt: string;
  method: string;
  source: "live" | "snapshot";
  results: ProbeResult[];
}

export const MONITORS = monitorConfig.monitors as Monitor[];
const TIMEOUT_MS = monitorConfig.timeoutMs as number;

const COMMITTED: MetricsSnapshot = {
  ...(snapshotFile as Omit<MetricsSnapshot, "source">),
  source: "snapshot"
};

/**
 * A response that came out of the framework's data cache rather than off the
 * wire. Nothing on the public internet answers this fast from Ghana, and
 * printing a cache read as a response time would be exactly the kind of number
 * this site exists to avoid.
 */
const CACHE_READ_MS = 8;

async function probe(monitor: Monitor): Promise<ProbeResult> {
  const started = Date.now();
  try {
    const res = await fetch(monitor.url, {
      redirect: "follow",
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { "user-agent": "balisa-portfolio-probe" },
      // Matched to the `revalidate` on the pages that call this. `no-store`
      // would be the obvious choice and it is wrong here: it opts the whole
      // route out of static generation, which breaks the export target and
      // turns every page view on the droplet into eleven outbound requests.
      next: { revalidate: 3600 }
    });
    return {
      slug: monitor.slug,
      label: monitor.label,
      url: monitor.url,
      ok: res.ok,
      status: res.status,
      ms: Date.now() - started,
      note: monitor.note
    };
  } catch (err) {
    return {
      slug: monitor.slug,
      label: monitor.label,
      url: monitor.url,
      ok: false,
      status: 0,
      ms: Date.now() - started,
      error: err instanceof Error ? err.name : "error",
      note: monitor.note
    };
  }
}

/**
 * Measures everything. Called from server components and from the metrics route
 * handler, both of which are cached, so a page view does not cost eleven
 * outbound requests.
 */
export async function getMetrics(): Promise<MetricsSnapshot> {
  try {
    const results = await Promise.all(MONITORS.map(probe));
    results.sort((a, b) => a.label.localeCompare(b.label));

    // A build machine with no network returns eleven failures rather than
    // throwing. Publishing that as fact would be worse than publishing the
    // snapshot, so treat a total wipeout as a failed probe run.
    if (results.every((r) => !r.ok)) return COMMITTED;

    // If the page revalidated while the fetch cache entries were still warm,
    // these are cache reads and the timings are meaningless. Fall back rather
    // than print a two-millisecond round trip to Frankfurt.
    if (results.some((r) => r.ok && r.ms < CACHE_READ_MS)) return COMMITTED;

    return {
      measuredAt: new Date().toISOString(),
      method: snapshotFile.method,
      source: "live",
      results
    };
  } catch {
    return COMMITTED;
  }
}

export function resultsFor(metrics: MetricsSnapshot, slug: string): ProbeResult[] {
  return metrics.results.filter((r) => r.slug === slug);
}

export function formatMeasuredAt(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}
