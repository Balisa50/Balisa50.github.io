/**
 * One failure per project, written the way an incident report is written.
 *
 * The four fields are fixed on purpose. A post-mortem that is only a story
 * lets you skip the part where you say what you actually did wrong; symptom,
 * cause, fix and lesson force the cause to be named. `cost` is optional and is
 * there for the ones where the honest answer is "three weeks", because how long
 * it hid is usually the most interesting number in the whole thing.
 */
export function PostMortem({
  title,
  symptom,
  cause,
  fix,
  lesson,
  cost,
  children
}: {
  title: string;
  symptom: string;
  cause: string;
  fix: string;
  lesson: string;
  cost?: string;
  children?: React.ReactNode;
}) {
  const rows: [string, string][] = [
    ["Symptom", symptom],
    ["Cause", cause],
    ["Fix", fix],
    ...(cost ? ([["Cost", cost]] as [string, string][]) : []),
    ["Lesson", lesson]
  ];

  return (
    <div className="not-prose mt-6 border-t border-ink pt-6">
      <p className="label">Post-mortem</p>
      <h3 className="display mt-2 text-[1.5rem] leading-tight">{title}</h3>

      <dl className="mt-5">
        {rows.map(([term, value]) => (
          <div key={term} className="grid gap-1 border-b border-rule py-3.5 last:border-b-0 sm:grid-cols-12 sm:gap-6">
            <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.11em] text-text-faint sm:col-span-2 sm:pt-1">
              {term}
            </dt>
            <dd className="text-[0.9375rem] leading-relaxed text-text sm:col-span-10">{value}</dd>
          </div>
        ))}
      </dl>

      {children && (
        <div className="measure mt-5 text-[0.9375rem] leading-relaxed text-text-secondary [&>p+p]:mt-3">
          {children}
        </div>
      )}
    </div>
  );
}
