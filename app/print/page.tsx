import { Fragment } from "react";
import type { Metadata } from "next";
import {
  PROFILE,
  PROJECTS,
  EXPERIENCE,
  EDUCATION,
  CERTIFICATES
} from "@/lib/projects";
import { CASE_STUDIES } from "@/lib/case-studies";
import { PRINT_ENTRIES, ALSO_BUILT, NOT_INCLUDED, READING } from "@/lib/print-data";
import { PRINT_CSS } from "./print-css";

/**
 * The print portfolio, rendered from the same data as the site and printed to
 * PDF with headless Chrome (see pdf/build.sh).
 *
 * Two constraints shaped this page.
 *
 * One: it must survive an applicant tracking system. The previous PDF used
 * CSS letter-spacing on its section headings, and a text extractor pulled them
 * out as "WHATISETOUTTODO" and "S E L E C T E D W O R K", so a parser saw
 * either one nonsense token or a run of single letters. Every heading here is
 * ordinary text with word-spacing left alone; the small-caps look comes from
 * font-size and weight instead. Nothing that carries meaning is baked into an
 * image, the figures all have real captions, and the reading order is a single
 * column so extraction follows the order a human reads.
 *
 * Two: nothing here restates content that lives in projects.ts or
 * case-studies.ts. The old PDF was authored separately and drifted, to the
 * point of linking a repository that had since gone private.
 */
export const metadata: Metadata = {
  title: `${PROFILE.fullName} · Selected work`,
  robots: { index: false, follow: false }
};

const bySlug = (slug: string) => PROJECTS.find((p) => p.slug === slug);

/** Kept out of the PDF entirely when a repo is private, same rule as the site. */
function repoLine(slug: string): string | null {
  const p = bySlug(slug);
  if (!p?.github || p.codePrivate) return null;
  return p.github.replace(/^https?:\/\//, "");
}

function Rule() {
  return <div className="rule" />;
}

export default function PrintPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: PRINT_CSS }} />
      <div className="doc">
        {/* ── Cover ─────────────────────────────────────────────────────── */}
        <section className="page cover">
          <div className="running">
            <span className="kicker">Selected work</span>
            <span className="kicker">2024 – 2026</span>
          </div>
          <Rule />
          <h1 className="cover-name">{PROFILE.fullName}</h1>
          <p className="cover-line">
            Statistics undergraduate. I build models and the software they run
            in, mostly around problems in The Gambia where the data is thin.
          </p>
          <p className="cover-sub">
            {PRINT_ENTRIES.length} projects, written up with what I decided and
            why, what I got wrong along the way, and what I would do differently
            now.
          </p>

          <ul className="cover-list">
            {PRINT_ENTRIES.map((e) => (
              <li key={e.slug}>
                <span className="cover-list-title">{bySlug(e.slug)?.title}</span>
                <span className="cover-list-kicker">{e.kicker}</span>
              </li>
            ))}
          </ul>

          <div className="cover-contact">
            <Field label="Contact" value="balisa50.github.io/#contact" />
            <Field label="Location" value={PROFILE.location} />
            <Field label="GitHub" value="github.com/Balisa50" />
            <Field label="LinkedIn" value="linkedin.com/in/abalisa" />
            <Field label="Portfolio" value="balisa50.github.io" />
          </div>
        </section>

        {/* ── Contents ──────────────────────────────────────────────────── */}
        <section className="page">
          <Running left="Contents" right="August 2026" />
          <h2 className="h-page">What is in here</h2>
          <p className="lede">
            Four projects get two pages each because there is enough in them to
            be worth reading. Three get a page. Two are listed at the end.
          </p>
          <ol className="toc">
            {PRINT_ENTRIES.map((e, i) => (
              <li key={e.slug}>
                <span className="toc-no">{String(i + 1).padStart(2, "0")}</span>
                <span className="toc-title">{bySlug(e.slug)?.title}</span>
                <span className="toc-kicker">{e.kicker}</span>
              </li>
            ))}
            <li>
              <span className="toc-no">·</span>
              <span className="toc-title">Also built</span>
              <span className="toc-kicker">HireIQ and VANTAGE, in short</span>
            </li>
            <li>
              <span className="toc-no">·</span>
              <span className="toc-title">Experience</span>
              <span className="toc-kicker">Roles and contracts</span>
            </li>
            <li>
              <span className="toc-no">·</span>
              <span className="toc-title">Education and tools</span>
              <span className="toc-kicker">Background</span>
            </li>
          </ol>

          <h3 className="h-sub">How each entry is laid out</h3>
          <p className="body">
            <strong>First page.</strong> What I set out to do, and the two or
            three decisions that shaped the work, each with the reasoning behind
            it.
          </p>
          <p className="body">
            <strong>Second page.</strong> The numbers, the charts they came
            from, what went wrong on the way, and what I would change if I
            picked it up again.
          </p>
        </section>

        {/* ── Approach ──────────────────────────────────────────────────── */}
        <section className="page">
          <Running left="Approach" right="How I work" />
          <h2 className="h-page">How I tend to work</h2>
          <p className="lede">
            Habits I picked up mostly by getting things wrong first. The page
            after this lists what I read while working on these projects.
          </p>
          {HABITS.map((h) => (
            <div key={h.title} className="habit">
              <h3 className="h-item">{h.title}</h3>
              <p className="body">{h.body}</p>
            </div>
          ))}
        </section>

        {/* ── Reading ───────────────────────────────────────────────────── */}
        <section className="page">
          <Running left="Approach" right="Reading" />
          <h2 className="h-page">What I read along the way</h2>
          <p className="lede">
            Working through the original papers took longer than following a
            tutorial, and it is what let me explain the choices in these
            projects rather than just the results.
          </p>
          {READING.map((group) => (
            <div key={group.theme} className="reading-group">
              <h3 className="h-group">{group.theme}</h3>
              <ul className="reading">
                {group.items.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {/* ── Projects ──────────────────────────────────────────────────── */}
        {PRINT_ENTRIES.map((entry, idx) => {
          const project = bySlug(entry.slug);
          const study = CASE_STUDIES[entry.slug];
          if (!project || !study) return null;
          const no = String(idx + 1).padStart(2, "0");
          const repo = repoLine(entry.slug);

          return (
            <Fragment key={entry.slug}>
              <section className="page">
                <Running left={`${no} · ${entry.kicker}`} right="Case study" />
                <h2 className="h-project">{project.title}</h2>
                <p className="standfirst">{entry.standfirst}</p>

                <Figure figure={entry.figures[0]} />

                <h3 className="h-section">What I set out to do</h3>
                <p className="body">{study.problem}</p>

                <h3 className="h-section">How I approached it</h3>
                {study.decisions.slice(0, 2).map((d, i) => (
                  <div key={i} className="decision">
                    <h4 className="h-item">{d.call}</h4>
                    <p className="body">{d.reason}</p>
                  </div>
                ))}

                {!entry.spread && (
                  <>
                    <StatStrip stats={entry.stats} />
                    <h3 className="h-section">What came out of it</h3>
                    <ul className="bullets">
                      {study.outcome.slice(0, 2).map((o, i) => (
                        <li key={i}>{o}</li>
                      ))}
                    </ul>
                    <h3 className="h-section">What I would do differently</h3>
                    <p className="body">{study.regret}</p>
                    <Colophon project={project} repo={repo} />
                  </>
                )}
              </section>

              {entry.spread && (
                <section className="page">
                  <Running left={`${no} · ${project.title}`} right="Continued" />
                  <StatStrip stats={entry.stats} />

                  {entry.figures.slice(1).map((f) => (
                    <Figure key={f.src} figure={f} />
                  ))}

                  <h3 className="h-section">What came out of it</h3>
                  <ul className="bullets">
                    {study.outcome.slice(0, 3).map((o, i) => (
                      <li key={i}>{o}</li>
                    ))}
                  </ul>

                  {study.pivots.length > 0 && (
                    <>
                      <h3 className="h-section">What went wrong</h3>
                      <ul className="bullets">
                        {study.pivots.slice(0, 2).map((p, i) => (
                          <li key={i}>{p}</li>
                        ))}
                      </ul>
                    </>
                  )}

                  <h3 className="h-section">What I would do differently</h3>
                  <p className="body">{study.regret}</p>

                  <Colophon project={project} repo={repo} />
                </section>
              )}
            </Fragment>
          );
        })}

        {/* ── Also built ────────────────────────────────────────────────── */}
        <section className="page">
          <Running left="Also built" right="Listed" />
          <h2 className="h-page">Two more, in short</h2>
          <p className="lede">
            Both are live. I have left them short here because the projects
            above show the modelling work better.
          </p>

          {ALSO_BUILT.map((a) => {
            const p = bySlug(a.slug);
            if (!p) return null;
            const repo = repoLine(a.slug);
            return (
              <div key={a.slug} className="also">
                <img src={a.figure} alt="" className="also-shot" />
                <div>
                  <h3 className="h-item">{p.title}</h3>
                  <p className="kicker-inline">{a.kicker}</p>
                  <p className="body">{p.tagline}</p>
                  <p className="meta">
                    {p.tech.join(" · ")}
                    {repo ? ` | ${repo}` : ""}
                    {p.demo ? ` | ${p.demo.replace(/^https?:\/\//, "")}` : ""}
                  </p>
                </div>
              </div>
            );
          })}

          <h3 className="h-section">Not included here</h3>
          <p className="body">{NOT_INCLUDED}</p>
        </section>

        {/* ── Experience ────────────────────────────────────────────────── */}
        <section className="page">
          <Running left="Experience" right="2024 – 2026" />
          <h2 className="h-page">Experience</h2>
          {EXPERIENCE.map((e) => (
            <div key={`${e.company}-${e.role}`} className="role">
              <h3 className="h-item">{e.role}</h3>
              <p className="meta">
                {e.company} · {e.period} · {e.location}
              </p>
              <ul className="bullets">
                {e.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {/* ── Education ─────────────────────────────────────────────────── */}
        <section className="page">
          <Running left="Background" right="Education" />
          <h2 className="h-page">Education and tools</h2>
          {EDUCATION.map((ed) => (
            <div key={ed.institution} className="role">
              <h3 className="h-item">
                {ed.degree} {ed.field}
              </h3>
              <p className="meta">
                {ed.institution} · {ed.period} · {ed.location}
              </p>
              {ed.coursework?.length ? (
                <p className="body">Coursework: {ed.coursework.join(", ")}.</p>
              ) : null}
            </div>
          ))}

          <h3 className="h-section">Certification</h3>
          <ul className="certs">
            {CERTIFICATES.map((c) => (
              <li key={c.name}>
                <span>{c.name}</span>
                <span className="meta">
                  {c.issuer} · {c.date}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Contact ───────────────────────────────────────────────────── */}
        <section className="page">
          <Running left="Thank you for reading" right="Contact" />
          <h2 className="h-page">
            Happy to talk through any of this in more detail.
          </h2>
          <p className="body">
            The code is public where the project allows it, and the longer
            write-ups on my site include the decisions I later reversed. If you
            want to test how well I know this work, the most useful thing to ask
            about is the parts that went wrong.
          </p>
          <Rule />
          <div className="cover-contact">
            <Field label="Contact" value="balisa50.github.io/#contact" />
            <Field label="Location" value={PROFILE.location} />
            <Field label="GitHub" value="github.com/Balisa50" />
            <Field label="LinkedIn" value="linkedin.com/in/abalisa" />
            <Field label="Portfolio" value="balisa50.github.io" />
          </div>
        </section>
      </div>
    </>
  );
}

/* ── Small pieces ─────────────────────────────────────────────────────── */

function Running({ left, right }: { left: string; right: string }) {
  return (
    <>
      <div className="running">
        <span className="kicker">{left}</span>
        <span className="kicker">{right}</span>
      </div>
      <Rule />
    </>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="field">
      <span className="field-label">{label}</span>
      <span className="field-value">{value}</span>
    </div>
  );
}

function Figure({ figure }: { figure: { src: string; caption: string } }) {
  return (
    <figure className="fig">
      {/* Plain img: this page is printed by Chrome from a static export, so the
          Next image pipeline would only add indirection. alt is empty because
          the caption below is the real text and repeating it would make a
          screen reader and a parser both read it twice. */}
      <img src={figure.src} alt="" />
      <figcaption>{figure.caption}</figcaption>
    </figure>
  );
}

function StatStrip({ stats }: { stats: { value: string; label: string }[] }) {
  return (
    <ul className="stats">
      {stats.map((s) => (
        <li key={s.label}>
          <span className="stat-value">{s.value}</span>
          <span className="stat-label">{s.label}</span>
        </li>
      ))}
    </ul>
  );
}

function Colophon({
  project,
  repo
}: {
  project: { tech: string[]; demo?: string };
  repo: string | null;
}) {
  return (
    <div className="colophon">
      <p className="meta">
        {[
          `Built with ${project.tech.join(" · ")}`,
          repo,
          project.demo?.replace(/^https?:\/\//, "")
        ]
          .filter(Boolean)
          .join("  |  ")}
      </p>
    </div>
  );
}

const HABITS: { title: string; body: string }[] = [
  {
    title: "I check against a known answer before trusting my own.",
    body:
      "The cohort-component engine had to reproduce the UN's published projection before I let it near my own inputs, and the life table had to reproduce a published life expectancy first. If a pipeline cannot recover a number someone else already computed, I do not have much reason to believe the numbers it produces on its own."
  },
  {
    title: "I try to pick the metric that is informative rather than the one that looks good.",
    body:
      "A KS p-value collapses at large samples, so I moved to effect size. A real-versus-synthetic detector measures how distinguishable data is, not whether it leaks, so I moved to distance-to-closest-record. A random split hid population drift, so I re-split on time and reported the worse number."
  },
  {
    title: "I implement the method once before reaching for the library.",
    body:
      "CTGAN came from the paper rather than from a package, Weight of Evidence from the scorecard literature, and Gompertz-Makeham from maximum likelihood rather than a standard table. It is slower the first time. It is also the only reason I can explain any of it afterwards."
  },
  {
    title: "I read the domain before choosing the method.",
    body:
      "The CTGAN paper gives you a network. It does not tell you that microfinance default sits between 20 and 30 percent, or that group lending changes it. For the legal work I read the Acts end to end first, because I could not check grounding against text I had not read."
  },
  {
    title: "I try to make the system able to say it does not know.",
    body:
      "The legal assistant says it could not find an answer instead of inventing a citation, and the search tool says the text does not address a question instead of returning its nearest match. This has been the hardest part to get right in both."
  },
  {
    title: "I report the number even when it is not flattering.",
    body:
      "The credit scorecard comes in under the industry threshold on discrimination, and the privacy check flags 1.1 percent of rows. Both are in the write-ups, with the reason."
  }
];
