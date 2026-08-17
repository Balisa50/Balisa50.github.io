import { PROJECTS } from "@/lib/projects";

/**
 * Honest counts only, derived from the project list rather than typed in.
 *
 * The "100% open source" stat that used to sit here was simply untrue: five of
 * the twelve linked repositories are private, including the research project
 * whose own description claims anyone can reproduce it. A portfolio claim that
 * a reader can falsify in one click costs more than the stat was ever worth,
 * so it is gone rather than restated.
 *
 * The roll-up counters and tilt-cards went with it. A number that animates is
 * not more credible than one that is simply printed.
 */
export function Metrics() {
  const shipped = PROJECTS.filter((p) => p.status === "live").length;
  const inDev = PROJECTS.filter((p) => p.status !== "live").length;

  const items: { value: string; label: string }[] = [
    { value: String(shipped), label: "Shipped" },
    { value: String(inDev), label: "In development" },
    { value: "2024", label: "Shipping since" }
  ];

  return (
    <section
      aria-label="Summary"
      className="mx-auto w-full max-w-shell px-6 sm:px-10 border-y border-border py-6"
    >
      <ul className="flex flex-wrap gap-x-12 gap-y-4">
        {items.map((it) => (
          <li key={it.label} className="flex items-baseline gap-2">
            <span className="font-mono text-lg font-semibold tabular-nums text-text">
              {it.value}
            </span>
            <span className="text-sm text-text-secondary">{it.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
