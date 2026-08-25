import { CASE_STUDIES } from "@/lib/case-studies";

/**
 * The structured memo under the deep dive.
 *
 * Same eight sections for every project, rendered from lib/case-studies.ts, so
 * a reader who has read one knows where to look in the next. The MDX above this
 * is where a project gets to be different; this is where they are comparable.
 *
 * It renders nothing at all for a project without a memo rather than printing
 * empty headings, which is how BS Real Estate ends up with a deep dive that is
 * prose and a diagram and no fake research section.
 */

function Section({
  id,
  title,
  note,
  children
}: {
  id: string;
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="border-t border-rule pt-8">
      <h3 className="display text-[1.4rem] leading-tight">{title}</h3>
      {note && <p className="mt-1 text-sm text-text-faint">{note}</p>}
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="measure space-y-3">
      {items.map((item, i) => (
        <li key={i} className="relative pl-4 text-[0.9375rem] leading-relaxed text-text-secondary">
          <span aria-hidden="true" className="absolute left-0 top-[0.72em] h-px w-2 bg-text-faint" />
          {item}
        </li>
      ))}
    </ul>
  );
}

export function EngineeringMemo({ slug }: { slug: string }) {
  const study = CASE_STUDIES[slug];
  if (!study) return null;

  return (
    <div className="mt-20 space-y-12">
      <div className="border-t border-ink pt-6">
        <p className="label">The full memo</p>
        <p className="measure mt-3 text-[0.9375rem] leading-relaxed text-text-secondary">
          The same eight sections for every project: what the problem was, what I read before
          writing code, what I could not do, the decisions, everything that broke, what I did not
          know, what shipped, and what I would still change. Written to be comparable across
          projects rather than flattering to any one of them.
        </p>
      </div>

      <Section id="problem" title="The problem">
        <p className="measure text-[0.9375rem] leading-relaxed text-text-secondary">{study.problem}</p>
      </Section>

      <Section id="research" title="What I read first" note="Before writing any of the model.">
        <Bullets items={study.research} />
      </Section>

      <Section id="constraints" title="What I could not do">
        <Bullets items={study.constraints} />
      </Section>

      <Section id="decisions" title="Every decision, with the reason">
        <div className="border-t border-rule">
          {study.decisions.map((decision, i) => (
            <div key={i} className="border-b border-rule py-5">
              <p className="text-[1.0625rem] font-medium leading-snug text-ink">{decision.call}</p>
              <p className="measure mt-2 text-[0.9375rem] leading-relaxed text-text-secondary">
                {decision.reason}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {study.pivots.length > 0 && (
        <Section id="pivots" title="Everything else that broke" note="The one written up above is not the only one.">
          <Bullets items={study.pivots} />
        </Section>
      )}

      {study.weaknesses.length > 0 && (
        <Section id="weaknesses" title="What I did not know">
          <Bullets items={study.weaknesses} />
        </Section>
      )}

      <Section id="outcome" title="What shipped">
        <Bullets items={study.outcome} />
      </Section>

      <Section id="regret" title="What I would still change">
        <p className="measure text-[0.9375rem] leading-relaxed text-text-secondary">{study.regret}</p>
      </Section>

      <Section id="takeaway" title="What it taught me">
        <p className="measure text-[1.0625rem] leading-relaxed text-ink">{study.takeaway}</p>
      </Section>
    </div>
  );
}
