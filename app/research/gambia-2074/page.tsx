/**
 * Long-form research article for "The Gambia 2074".
 * The readable companion to the code and the engineering case study: the actual
 * findings, written plainly for a journalist, planner or examiner, with the
 * charts inline. Wide editorial layout (sticky contents rail + main column),
 * flat, no cards.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Github, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "The Gambia in 2074: an independent population projection | Abdoulie Balisa",
  description:
    "Built on the 2024 census and the UN's own methods, an independent projection puts The Gambia at 4.66 million by 2074 (4.35 to 4.98 million), about 13% below the official figure. The findings, the charts, and what they mean.",
};

const FIG = "/research/gambia-2074";
const REPO = "https://github.com/Balisa50/gambia-population-projection";

const SECTIONS = [
  ["why", "Why this matters"],
  ["data", "The numbers we actually have"],
  ["surprise", "A 13% surprise"],
  ["mortality", "How Gambians stopped dying young"],
  ["models", "Three ways to guess the future"],
  ["engine", "Checking the machine"],
  ["result", "What the projection says"],
  ["dividend", "The dividend, and the ageing"],
  ["limits", "What I'm not sure about"],
  ["bottom", "The bottom line"],
] as const;

function Fig({ src, alt, caption }: { src: string; alt: string; caption: string }) {
  return (
    <figure className="my-10">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`${FIG}/${src}`} alt={alt} className="w-full" loading="lazy" />
      <figcaption className="mt-3 max-w-[78ch] text-sm leading-relaxed text-text-secondary">{caption}</figcaption>
    </figure>
  );
}

function H({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="mt-16 scroll-mt-24 text-2xl font-semibold tracking-tight text-ink md:text-[1.75rem]">
      {children}
    </h2>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="mt-4 max-w-[78ch] text-[17px] leading-[1.75] text-text-secondary md:text-[18.5px]">{children}</p>;
}

export default function GambiaResearchArticle() {
  return (
    <main className="relative min-h-screen bg-background text-text-primary">
      <Link
        href="/#projects"
        className="fixed left-6 top-5 z-30 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-text-secondary transition hover:text-ink"
      >
        <ArrowLeft className="h-3 w-3" />
        Back to work
      </Link>

      <div className="mx-auto max-w-[1280px] px-6 pb-28 pt-24 md:pt-28">
        {/* Header, full width */}
        <header className="border-b border-rule pb-10">
          <p className="font-mono text-xs uppercase tracking-[0.32em] text-cyan/85">~/research/gambia-2074</p>
          <h1 className="mt-4 max-w-[18ch] text-balance text-[clamp(2.5rem,7vw,5rem)] font-semibold leading-[1.02] tracking-tight">
            The Gambia in 2074
          </h1>
          <p className="mt-5 max-w-[60ch] text-pretty text-lg italic leading-relaxed text-text-secondary md:text-xl">
            I rebuilt the country&apos;s population forecast from scratch, on the new census,
            using the same methods the UN does. It comes out about 13% lower than the official
            number. Here is how, and why it should change the way the country plans.
          </p>
          <p className="mt-6 font-mono text-xs uppercase tracking-wider text-text-secondary">
            Abdoulie Balisa · June 2026 · 12-minute read
          </p>
        </header>

        {/* Key numbers, full-width strip */}
        <dl className="grid grid-cols-2 gap-y-7 border-b border-rule py-9 md:grid-cols-4 md:gap-0 md:divide-x md:divide-white/10">
          {[
            { v: "4.66M", l: "people by 2074 (range 4.35 to 4.98M)" },
            { v: "13%", l: "lower than the UN's current figure" },
            { v: "77 to 49", l: "the dependency ratio falls" },
            { v: "1%", l: "how close my engine got to the UN's" },
          ].map((s, i) => (
            <div key={s.l} className={i === 0 ? "md:pr-7" : "md:px-7 md:last:pr-0"}>
              <dt className="font-mono text-3xl font-semibold tabular-nums text-ink md:text-4xl">{s.v}</dt>
              <dd className="mt-1.5 text-[11px] uppercase leading-snug tracking-wider text-text-secondary">{s.l}</dd>
            </div>
          ))}
        </dl>

        {/* Body: sticky contents rail + main column */}
        <div className="mt-4 lg:grid lg:grid-cols-[190px_minmax(0,78ch)] lg:justify-center lg:gap-16">
          <nav aria-label="Contents" className="hidden lg:block">
            <div className="sticky top-24">
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-text-secondary">Contents</p>
              <ol className="mt-4 space-y-2.5">
                {SECTIONS.map(([id, label], i) => (
                  <li key={id}>
                    <a href={`#${id}`} className="block text-[13px] leading-snug text-text-secondary transition hover:text-cyan">
                      <span className="font-mono text-text-faint">{String(i + 1).padStart(2, "0")}</span> {label}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </nav>

          <article className="min-w-0">
            <H id="why">Why this matters</H>
            <P>
              Almost every big decision a government makes leans on one quiet number: how many people
              there will be, and of what ages. It decides how many classrooms and teachers the country
              needs, how big the future workforce and the pension bill will be, how many clinics to
              build and where. Get the number wrong and you under-build schools for a generation, or
              you plan a pension system for a population that never arrives.
            </P>
            <P>
              For The Gambia, that number has only ever come from one place, the United Nations. And the
              UN&apos;s current projection was finished before the country counted itself for the first
              time in over a decade. So I did something simple. I took the new 2024 census, used the same
              modelling the UN uses, and worked out the future population myself, in the open, so anyone
              can check it. This is that second opinion.
            </P>

            <H id="data">The numbers we actually have</H>
            <P>
              Here is the hard part. The Gambia does not have a working system for registering deaths.
              Most people who die are never recorded, so there is no national record of who dies at what
              age, year after year. That record is exactly what you need to forecast mortality, and it is
              the reason The Gambia does not appear in the Human Mortality Database, the dataset
              researchers normally reach for.
            </P>
            <P>
              What we do have is a patchwork. The UN publishes reconstructed estimates that fill the gaps.
              Two long-running research sites, at Farafenni and Basse, have tracked births and deaths in
              their districts since 1981 and 2007. National surveys measure child deaths fairly well and
              adult deaths roughly. And every decade or so, a census counts everyone. The honest way to
              work here is not to hide that thinness behind a single confident figure. It is to build the
              forecast carefully, say out loud how uncertain each piece is, and carry that uncertainty all
              the way through to the answer.
            </P>

            <H id="surprise">A 13% surprise</H>
            <P>
              The first real finding fell out before I forecast anything. The UN puts The Gambia at about
              2.73 million people in 2023. The 2024 census counted roughly 2.42 million. That is a gap of
              around 300,000 people, about 13%, and it runs the same way in every past census too. The UN
              has consistently sat above the count on the ground.
            </P>
            <P>
              This is not the UN being careless. Their 2024 estimates were locked in before the census
              results came out, and they deliberately adjust counts upward for people they think get
              missed. But the gap is real, and it matters, because if you start a 50-year projection from
              a number that is already too high, every future year inherits the error. Re-basing the whole
              thing on the census is the single most important decision in this project.
            </P>

            <H id="mortality">How Gambians stopped dying young</H>
            <P>
              The good news first. Life in The Gambia has gotten dramatically longer. A baby born in 1950
              could expect to live about 31 years. By 2023 that was 66. Infant mortality fell by more than
              four-fifths over the same stretch. The chart below shows the whole picture at once. Every
              point is the death rate at one age in one year, and the surface steadily lightens, meaning
              fewer deaths, as the decades pass.
            </P>
            <Fig
              src="eda_mortality_surface.png"
              alt="Heatmap of mortality by age and year, with age curves for selected years"
              caption="Mortality in The Gambia from 1950 to 2023. On the left, the death-rate surface gets lighter over time. On the right, the age pattern of death drops decade by decade, with the familiar spike in infancy easing the most."
            />

            <H id="models">Three ways to guess the future</H>
            <P>
              To project mortality forward I used the Lee-Carter model. It is the workhorse behind the
              UN&apos;s own forecasts, and the idea is intuitive: find the overall trend in how fast death
              rates are falling, then carry it forward. I built it three ways, each more careful than the
              last, partly to be thorough and partly to see how much the choice of method actually changes
              the answer.
            </P>
            <P>
              The plain version fits the trend directly. The Bayesian version does the same thing but
              keeps honest track of everything it is unsure about, using a method called Markov-chain Monte
              Carlo, so the final forecast comes with a proper range rather than a single line. The third,
              coherent version forecasts The Gambia alongside seven West-African neighbours at once, so the
              country cannot quietly drift off to a life expectancy its region has never seen. All three
              landed in the same place: life expectancy reaching about 75 years by 2074.
            </P>
            <P>
              They disagreed about one thing, and the disagreement is itself worth reporting. My forecasts
              all produced a fairly tight range around that 75-year figure. The UN&apos;s forecast is much
              wider. The reason is that the UN&apos;s method builds in a kind of structural doubt about how
              fast mortality can keep improving over half a century, doubt that simple trend-extrapolation,
              even a careful Bayesian one, does not capture. In plain terms: my models may be a little too
              confident about the long run, and the UN&apos;s wide band is doing real work.
            </P>
            <Fig
              src="bayes_lc_vs_wpp_e0.png"
              alt="Life expectancy forecast comparing the Bayesian model with the UN, with uncertainty bands"
              caption="Life expectancy to 2074. My Bayesian forecast (red) tracks close to the UN's middle estimate (blue) but with a much narrower band. The UN's wide band reflects long-run uncertainty that trend models tend to understate."
            />

            <H id="engine">Checking the machine</H>
            <P>
              A forecast engine is only worth trusting if it can reproduce an answer we already know. So
              before I fed it my own inputs, I fed it the UN&apos;s, and asked whether it could rebuild the
              UN&apos;s published projection. It did, staying within 1% all the way to 2074. That tells me
              the population accounting, the part that ages people forward, adds births and subtracts
              deaths, is sound.
            </P>
            <P>
              I also tested the mortality model the way you would test any forecast: I trained it only on
              data up to 2010 and asked it to predict 2011 to 2023, years it had never seen. It was off by
              about two-thirds of a year on average, and the truth landed inside its range every single
              year. That is a reassuring track record for something now being asked to look fifty years
              ahead.
            </P>
            <Fig
              src="projection_overview.png"
              alt="Total population versus the UN, population pyramids for 2023 and 2074, and dependency ratios"
              caption="Three views. Left, my engine (red) sitting on top of the UN's line (dashed) during the validation test. Middle, the age pyramid shifting from a wide young base toward a fuller adult shape. Right, the dependency ratio falling then slowly rising."
            />

            <H id="result">What the projection says</H>
            <P>
              With the engine trusted and the base re-set to the census, I ran the projection a thousand
              times over, each run drawing a slightly different mortality and fertility future, so the
              spread of results becomes a real measure of uncertainty. The population reaches about 3.74
              million by 2050 and 4.66 million by 2074, with a 95% range of 4.35 to 4.98 million.
            </P>
            <P>
              Because it starts from the census rather than the UN&apos;s higher 2023 figure, it runs about
              0.7 million below the UN&apos;s own line all the way out. That difference, the size of a
              decent-sized region, is not a modelling quirk. It is what happens when you take the new count
              seriously.
            </P>
            <Fig
              src="independent_projection.png"
              alt="The Gambia's projected population to 2074 with credible bands, and the 2024 versus 2074 pyramid"
              caption="The headline. On the left, my census-based projection (gold, with its 80% and 95% bands) sits steadily below the UN's line (blue) right through to 2074. On the right, how the age structure changes between 2024 and 2074."
            />

            <H id="dividend">The dividend, and the ageing</H>
            <P>
              The most important part of this is not the headcount, it is the shape. Today, for every 100
              working-age Gambians there are about 77 dependents, mostly children. By the 2070s that drops
              to around 49. Economists call the gap that opens up the demographic dividend. It is the same
              window that lifted South Korea and much of East Asia, when a large, growing working-age
              population can pull a country up fast. The catch is that it only pays off if those workers
              find real jobs and real schooling. The window opens on its own. The dividend does not.
            </P>
            <P>
              At the same time, a quieter shift is coming. The number of Gambians over 65 grows more than
              sevenfold, from about 73,000 today to roughly 550,000, and their share of the population rises
              from 3% to about 12%. Measured against the working-age population, old-age dependency roughly
              triples, from 5 to 18 per 100. The Gambia is young today and will stay young for decades, but it will need
              pensions and elderly healthcare it has barely begun to build, and the cheapest time to start
              building them is during the dividend years, while the working population is large and the
              elderly one is still small.
            </P>

            <H id="limits">What I&apos;m not sure about</H>
            <P>
              I would rather be honest than impressive. Every number here comes with a range, not false
              precision. The biggest open questions are migration, which is volatile for The Gambia and
              which I handled as a single central scenario, and the fine detail of the new census, which
              will sharpen the starting point once it is fully published. Two checks are still on my list:
              comparing the model against the actual life tables from the Farafenni and Basse research
              sites, and against an independent global reconstruction. Both need data I have to dig out by
              hand, so I have flagged them openly rather than quietly skipped them.
            </P>

            <H id="bottom">The bottom line</H>
            <P>
              Working in the open, on public data, with the methods the UN itself trusts, an independent
              projection puts The Gambia at about 4.7 million people by 2074. That is meaningfully below the
              figure in circulation today, once the new census is taken into account, and the country is
              heading into a window of falling dependency that is also the run-up to an ageing society. The
              most important result was not clever. It came from taking the 2024 census seriously and
              checking every step before believing it. Any plan still anchored to the older UN numbers is
              worth a second look.
            </P>

            <nav className="mt-16 flex flex-col gap-4 border-t border-rule pt-8 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-8">
              <a href={REPO} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.2em] text-text-secondary transition hover:text-ink">
                <Github className="h-3.5 w-3.5" /> Code and data
              </a>
              <a href={`${REPO}/blob/main/reports/research-report.md`} target="_blank" rel="noreferrer noopener" className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.2em] text-text-secondary transition hover:text-ink">
                <FileText className="h-3.5 w-3.5" /> Full technical report
              </a>
              <Link href="/projects/gambia-population-projection" className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.2em] text-text-secondary transition hover:text-ink">
                <FileText className="h-3.5 w-3.5" /> How I built it
              </Link>
            </nav>
          </article>
        </div>
      </div>
    </main>
  );
}
