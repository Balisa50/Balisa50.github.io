import { formatMeasuredAt, type MetricsSnapshot, type ProbeResult } from "@/lib/metrics";
import { StatusDot } from "@/components/ui/badge";

/**
 * What a probe can and cannot tell you, printed next to the number.
 *
 * A response time is a real measurement of one request. Uptime is not: it needs
 * a monitor with history, and until Uptime Kuma is running on the droplet there
 * is nothing here that can honestly report a percentage. So this component
 * reports what it measured and names what it did not, rather than inventing a
 * 99.9% that would be indistinguishable from every other portfolio.
 */

function tone(result: ProbeResult): "live" | "down" | "progress" {
  if (!result.ok) return "down";
  if (result.ms > 3000) return "progress";
  return "live";
}

function verdict(result: ProbeResult): string {
  if (result.ok) return `HTTP ${result.status}`;
  if (result.status > 0) return `HTTP ${result.status}`;
  return result.error === "TimeoutError" ? "timed out" : "no response";
}

export function LiveMetrics({
  metrics,
  results,
  title = "Live check"
}: {
  metrics: MetricsSnapshot;
  results: ProbeResult[];
  title?: string;
}) {
  if (results.length === 0) return null;

  return (
    <section className="not-prose border-t border-rule pt-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="label">{title}</h3>
        <p className="font-mono text-[0.6875rem] uppercase tracking-[0.09em] text-text-faint">
          {metrics.source === "live" ? "measured on render" : "last committed measurement"} ·{" "}
          {formatMeasuredAt(metrics.measuredAt)}
        </p>
      </div>

      <dl className="mt-4">
        {results.map((result) => (
          <div
            key={result.url}
            className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-rule py-3 last:border-b-0"
          >
            <dt className="flex items-center gap-2 text-sm text-ink">
              <StatusDot tone={tone(result)} />
              {result.label}
            </dt>
            <dd className="numeral text-sm text-text-secondary">
              {verdict(result)}
              <span className="mx-2 text-text-faint">·</span>
              {result.ms} ms
            </dd>
            {result.note && (
              <p className="w-full text-sm leading-relaxed text-text-faint">{result.note}</p>
            )}
          </div>
        ))}
      </dl>

      <p className="mt-3 max-w-prose text-sm leading-relaxed text-text-faint">
        One request each, redirects followed. That is reachability and latency, not uptime: a single
        response says nothing about the last thirty days, and nothing here is monitoring history yet.
        A 200 from a front end also does not prove the service behind it is healthy, which is exactly
        how HireIQ can answer this probe while its database is gone.
      </p>
    </section>
  );
}
