/**
 * Long-form research article for "The Gambia 2074".
 * The readable companion to the code repo and the engineering case study:
 * the actual findings, written for a journalist / planner / examiner, with
 * the charts inline. Flat layout, no cards — everything sits on the page.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Github, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "The Gambia in 2074 — an independent population projection | Abdoulie Balisa",
  description:
    "Built on the 2024 Census and the UN's own methodology, an independent projection puts The Gambia at 4.66 million by 2074 (95% CI 4.35–4.98M) — about 13% below the prevailing UN figure. The findings, the charts, and what they mean.",
};

const FIG = "/research/gambia-2074";
const REPO = "https://github.com/Balisa50/gambia-population-projection";

function Fig({ src, alt, caption }: { src: string; alt: string; caption: string }) {
  return (
    <figure className="my-9">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`${FIG}/${src}`} alt={alt} className="w-full rounded-lg" loading="lazy" />
      <figcaption className="mt-3 text-sm leading-relaxed text-text-secondary">{caption}</figcaption>
    </figure>
  );
}

function H({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <header className="mb-5 mt-14">
      <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-cyan/85">{n}</p>
      <h2 className="mt-1.5 text-2xl font-semibold tracking-tight text-white md:text-3xl">{children}</h2>
    </header>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="mt-4 text-pretty text-[15px] leading-relaxed text-text-secondary md:text-base">{children}</p>;
}

export default function GambiaResearchArticle() {
  return (
    <main className="relative min-h-screen bg-background text-text-primary">
      <Link
        href="/#projects"
        className="fixed left-6 top-5 z-30 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-text-secondary transition hover:text-white"
      >
        <ArrowLeft className="h-3 w-3" />
        Back to work
      </Link>

      <article className="mx-auto max-w-3xl px-6 pb-28 pt-24 md:pt-28">
        {/* Header */}
        <header className="border-b border-white/10 pb-10">
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-cyan/85">~/research/gambia-2074</p>
          <h1 className="mt-4 text-balance text-[clamp(2.25rem,6vw,4rem)] font-semibold leading-[1.05] tracking-tight">
            The Gambia in 2074
          </h1>
          <p className="mt-4 text-pretty text-lg italic text-text-secondary">
            An independent population projection, built on the new 2024 census and the
            methodology the UN itself uses — and why it lands about 13% below the official figure.
          </p>
          <p className="mt-5 font-mono text-xs uppercase tracking-wider text-text-secondary">
            Abdoulie Balisa · June 2026 · ~12-min read
          </p>
        </header>

        {/* Key numbers — flat, no card */}
        <dl className="grid grid-cols-2 gap-y-7 border-b border-white/10 py-9 md:grid-cols-4 md:gap-0 md:divide-x md:divide-white/10">
          {[
            { v: "4.66M", l: "projected by 2074 (95% CI 4.35–4.98M)" },
            { v: "−13%", l: "below the prevailing UN figure" },
            { v: "77 → 49", l: "dependency ratio falls (the dividend)" },
            { v: "<1%", l: "engine error vs the UN's own projection" },
          ].map((s, i) => (
            <div key={s.l} className={i === 0 ? "md:pr-7" : "md:px-7 md:last:pr-0"}>
              <dt className="font-mono text-2xl font-semibold tabular-nums text-white md:text-3xl">{s.v}</dt>
              <dd className="mt-1 text-[11px] uppercase tracking-wider text-text-secondary">{s.l}</dd>
            </div>
          ))}
        </dl>

        <P>
          Almost every long-range decision a government makes — how many classrooms and teachers to
          fund, how large the future workforce and pension bill will be, how many clinics to staff —
          rests on a single quiet input: a population projection. For The Gambia, those numbers have
          only ever come from one place, the United Nations. And the UN&apos;s current projection was
          finalised <em>before</em> the country counted itself for the first time in a decade. This is
          an independent, fully reproducible second opinion, built from public data, that takes the
          new census seriously.
        </P>

        <H n="01">The question</H>
        <P>
          The Gambia has no complete civil-registration system. Deaths go largely unrecorded, so there
          is no national time series of who dies at what age — and the country is absent from the Human
          Mortality Database, the standard input for this kind of work. The honest response is not to
          paper over that with a confident single number, but to make it the question: how do you build
          a credible projection under data scarcity, and how much does the answer depend on the method
          and on which census you trust?
        </P>

        <H n="02">The data, and a 13% surprise</H>
        <P>
          Mortality in The Gambia has improved dramatically. Life expectancy rose from about 31 years in
          1950 to 66 by 2023; infant mortality fell by more than four-fifths. The chart below shows the
          full age-by-year mortality surface — every cell is the death rate at one age in one year,
          getting steadily lighter (lower) as the decades pass.
        </P>
        <Fig
          src="eda_mortality_surface.png"
          alt="Heatmap of log-mortality by age and year, and age schedules for selected years"
          caption="Mortality in The Gambia, 1950–2023. Left: the death-rate surface lightening over time. Right: the age pattern of mortality flattening and dropping across the decades."
        />
        <P>
          The surprise came from the population totals. The UN&apos;s World Population Prospects puts
          The Gambia at about 2.73 million in 2023; the 2024 census counted roughly 2.42 million — and
          the UN figure exceeds <em>every</em> historical Gambian census. The UN isn&apos;t careless;
          its 2024 numbers simply predate the new census. But the gap is real, about 13%, and it
          propagates into every future year unless you re-base on the census. That re-basing is the
          single most consequential choice in this project.
        </P>

        <H n="03">Three ways to forecast death</H>
        <P>
          To forecast mortality I used the Lee–Carter model — the workhorse behind the UN&apos;s own
          projections — in three increasingly careful forms: the classical version, a fully Bayesian
          version (which carries its uncertainty honestly through Markov-chain Monte Carlo), and the
          Li–Lee &quot;coherent&quot; version, which forecasts The Gambia alongside seven West-African
          neighbours so it can&apos;t drift to implausible values. All three agree that life expectancy
          reaches roughly 75 years by 2074.
        </P>
        <Fig
          src="bayes_lc_vs_wpp_e0.png"
          alt="Life expectancy forecast: Bayesian Lee-Carter versus the UN's projection with intervals"
          caption="Life expectancy to 2074. My Bayesian forecast (red) sits close to the UN's median (blue) but with a much tighter band — a genuine methodological finding: the UN's wide interval reflects structural uncertainty that simple extrapolation doesn't capture."
        />

        <H n="04">Does the engine actually work?</H>
        <P>
          A projection engine is only worth trusting if it can reproduce a known answer. So before using
          my own inputs, I fed the engine the UN&apos;s own mortality, fertility and migration and
          checked whether it reconstructed the UN&apos;s published projection. It did — to within 1% all
          the way to 2074. Separately, I trained the mortality model only on data up to 2010 and asked it
          to predict 2011–2023: it was accurate to within about two-thirds of a year, and reality landed
          inside its 95% interval every single year.
        </P>
        <Fig
          src="projection_overview.png"
          alt="Total population (engine vs UN), population pyramids 2023 vs 2074, and dependency ratios"
          caption="Validation and structure. Left: the engine (red) tracks the UN (dashed) to within 1%. Middle: the age pyramid shifts from a wide young base toward a more balanced shape. Right: the dependency ratio falls then ticks up."
        />

        <H n="05">The projection</H>
        <P>
          Re-based on the 2024 census and driven by the mortality model&apos;s full uncertainty,
          the projection runs a thousand simulated futures. The Gambia&apos;s population reaches
          <strong className="text-white"> 3.74 million by 2050 and 4.66 million by 2074</strong>, with a
          95% credible interval of 4.35–4.98 million. Because it starts from the census rather than the
          UN&apos;s higher 2023 estimate, it runs about 0.7 million below the UN&apos;s own trajectory —
          a difference worth roughly the population of a mid-sized region.
        </P>
        <Fig
          src="independent_projection.png"
          alt="Independent population projection of The Gambia to 2074 with credible intervals, and pyramids"
          caption="The headline. Left: the census-based projection (red, with 80% and 95% credible bands) sits persistently below the UN's medium line (blue). Right: the 2024 vs 2074 age structure."
        />

        <H n="06">The dividend — and the ageing behind it</H>
        <P>
          The most important story isn&apos;t the headcount, it&apos;s the shape. The total dependency
          ratio — children and elderly per 100 working-age adults — falls from 77 today to about 49 by
          the 2070s. That is the &quot;demographic dividend&quot;: the window that powered the rise of
          East Asia, when a large, growing working-age population can lift incomes — <em>if</em> those
          workers find productive jobs. At the same time, the old-age dependency ratio roughly triples.
          The Gambia will need pension and elderly-health capacity it barely has today, and the time to
          build it is during the dividend window, not after.
        </P>

        <H n="07">How sure are we, and what&apos;s missing</H>
        <P>
          Every number here carries an explicit range rather than false precision. The main remaining
          uncertainties are migration (volatile, and modelled as a central scenario) and the detailed
          single-age structure of the new census, which will sharpen the base when released. Two honest
          gaps remain in validation: comparing the model against empirical life tables from The
          Gambia&apos;s long-running Farafenni and Basse demographic-surveillance sites, and against an
          independent global reconstruction (IHME&apos;s Global Burden of Disease). Both need manual data
          extraction and are flagged openly rather than fudged.
        </P>

        <H n="08">The bottom line</H>
        <P>
          On open data, using the UN&apos;s own methodology, an independent projection puts The Gambia at
          about 4.7 million people by 2074 — materially below the figure currently in circulation, once
          the new census is taken into account — while entering a demographic-dividend window that is
          also the prelude to ageing. The most important result fell out of simply taking the 2024 census
          seriously and validating every step before trusting it. National plans calibrated to the older
          UN numbers should be revisited.
        </P>

        {/* Footer links */}
        <nav className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-8 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-8">
          <a href={REPO} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.2em] text-text-secondary transition hover:text-white">
            <Github className="h-3.5 w-3.5" /> Code &amp; data
          </a>
          <a href={`${REPO}/blob/main/reports/research-report.md`} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.2em] text-text-secondary transition hover:text-white">
            <FileText className="h-3.5 w-3.5" /> Full technical report
          </a>
          <Link href="/projects/gambia-population-projection" className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.2em] text-text-secondary transition hover:text-white">
            <FileText className="h-3.5 w-3.5" /> How I built it (case study)
          </Link>
        </nav>
      </article>
    </main>
  );
}
