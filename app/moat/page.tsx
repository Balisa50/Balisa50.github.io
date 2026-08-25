import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/site/page-header";

export const metadata: Metadata = {
  title: "Moat",
  description:
    "What is actually hard to copy about this work, stated with the parts that are not. Three claims: proximity to data nobody else is modelling, execution inside real constraints, and a public record of being wrong on purpose."
};

/**
 * The one page on this site that makes a claim about me rather than about a
 * project, which is why every claim on it is tied to something a reader can go
 * and check. The failure mode of a page like this is a list of adjectives.
 */
const MOATS: {
  n: string;
  title: string;
  claim: string;
  body: string[];
  proof: { label: string; href: string }[];
  limit: string;
}[] = [
  {
    n: "01",
    title: "Data",
    claim: "Proximity to questions nobody is answering, in a place the field does not look.",
    body: [
      "I do not own a proprietary dataset. What I have is closer to the ground: I know which Gambian data exists, which of it is trustworthy, and where the published numbers come from. That sounds small until you try to build any of this from outside.",
      "The Gambia has no working death registration, so it is absent from the Human Mortality Database and its population figures come almost entirely from the UN, finalised before the country's first digital census in 2024. Finding that the UN's 2023 base sits about 13 percent above the census count is not a modelling result. It is the result of taking a local source seriously enough to check it against the global one.",
      "The same pattern repeats. The Central Bank publishes twenty-five years of daily exchange rates through an endpoint with no documentation, which I found by opening the network tab on their own website. Microfinance in West Africa runs on group lending and seasonal agricultural income, which is why a scorecard trained on a European credit dataset learns the wrong structure. None of that is in a paper. It is in knowing the place."
    ],
    proof: [
      { label: "The Gambia 2074, rebuilt on the census", href: "/work/gambia-population-projection" },
      { label: "Dalasi Pulse, and the endpoint in the network tab", href: "/work/dalasi-pulse" }
    ],
    limit:
      "This is the thinnest of the three. Local knowledge is not exclusive, it is just currently unattended. Anyone willing to do the reading could have it, and if the region becomes interesting to better-funded people, they will."
  },
  {
    n: "02",
    title: "Execution",
    claim: "Eleven projects online, built inside constraints that were not chosen for effect.",
    body: [
      "No GPU. Eight gigabytes of memory. Free tiers with sixty-second function limits and one scheduled job a day. A laptop that ran out of disk in the middle of a Bayesian fit and had to finish the job on a lean pip install instead of the multi-gigabyte toolchain the tutorial assumed.",
      "Those numbers show up as architecture rather than as excuses. AYAT embeds its entire corpus once on my machine and ships the result as a static file, so the browser does the search and there is no inference bill and no cold start. NOVA fits in 367 megabytes because the default Torch wheel bundles CUDA that a CPU box will never touch. VANTAGE covers six regions on a plan that allows one scheduled job, by having each region fire the next one.",
      "The output of that is unglamorous and checkable: things that are still running, at no cost, months after they were built."
    ],
    proof: [
      { label: "AYAT, 6,236 verses and no inference server", href: "/work/ayat" },
      { label: "VANTAGE, six regions on one cron", href: "/work/vantage" },
      { label: "What this site itself runs on", href: "/infra" }
    ],
    limit:
      "Constraint engineering is a habit, not a credential, and it stops being a differentiator the moment someone hands me a budget. It also has a real cost: several of these would be better products with money behind them, and saying otherwise would be romantic nonsense."
  },
  {
    n: "03",
    title: "Trust",
    claim: "A public record of publishing the number that makes me look worse.",
    body: [
      "The credit scorecard reports a Gini of 0.27 against an industry threshold of 0.4, next to the reason it is capped there. I could have engineered features until it cleared the bar, and it would have meant only that I had fitted my own synthetic generator more tightly.",
      "NOVA's first privacy metric scored 0.99 and I nearly published it as a catastrophic failure. It was measuring distinguishability, not privacy, and a model that had simply memorised its training data would have scored perfectly on it. I threw the metric out for one that gives a less impressive number and means something. AYAT's central feature died to an eigenvalue check after I had already described it publicly. FORGE shipped a leaderboard and camera proctoring, and both came back out because they produced the wrong behaviour.",
      "This is the one that is genuinely expensive to fake, because faking it requires inventing failures that are specific, technical and unflattering, and then living with them being permanently attached to your name."
    ],
    proof: [
      { label: "The metric I threw out twice", href: "/work/nova" },
      { label: "Reporting 0.27 against a 0.4 threshold", href: "/work/credit-risk-scorecard" },
      { label: "Two thirds of a feature that did not survive measurement", href: "/work/ayat" }
    ],
    limit:
      "Honesty is only a moat while it is scarce, and it is worth nothing on its own. A record of admitting mistakes with no working systems attached is just a confessional."
  }
];

export default function MoatPage() {
  return (
    <>
      <PageHeader
        eyebrow="Moat"
        title="What is actually hard to copy"
        lede="Everyone building in public can point at deployed projects. This page is the narrower question: which parts of this would be difficult for someone else to reproduce, and which parts would not. I have tried to be accurate about both, because a page like this is worthless if it only argues one way."
      />

      <section className="mx-auto w-full max-w-shell px-6 pt-12 sm:px-10">
        <p className="measure text-[1.0625rem] leading-relaxed text-text-secondary">
          A caveat first. I am suspicious of this framing. Moat is a word for businesses with
          customers, and applying it to one person's portfolio usually produces a page of adjectives
          nobody can check. So every claim below is attached to a specific project you can open, and
          each one ends with where it stops being true.
        </p>
      </section>

      {MOATS.map((moat) => (
        <section key={moat.n} className="mx-auto w-full max-w-shell px-6 py-14 sm:px-10">
          <div className="grid gap-10 border-t border-ink pt-8 md:grid-cols-12">
            <div className="md:col-span-4">
              <p className="numeral text-sm text-text-faint">{moat.n}</p>
              <h2 className="display mt-2 text-[1.75rem] leading-tight">{moat.title}</h2>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink">{moat.claim}</p>
            </div>

            <div className="md:col-span-8">
              <div className="measure space-y-5 text-[1.0625rem] leading-relaxed text-text-secondary">
                {moat.body.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-7 border-t border-rule pt-5">
                <p className="label">Check it</p>
                <ul className="mt-3 space-y-2">
                  {moat.proof.map((proof) => (
                    <li key={proof.href}>
                      <Link href={proof.href} className="link-underline text-[0.9375rem] text-ink">
                        {proof.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 border-l-2 border-accent pl-5">
                <p className="label">Where it stops</p>
                <p className="measure mt-2 text-[0.9375rem] leading-relaxed text-text-secondary">
                  {moat.limit}
                </p>
              </div>
            </div>
          </div>
        </section>
      ))}

      <section className="border-t border-rule">
        <div className="mx-auto grid w-full max-w-shell gap-8 px-6 py-16 sm:px-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <h2 className="display text-[1.6rem] leading-tight">The one that is not a moat</h2>
          </div>
          <div className="measure md:col-span-8 space-y-5 text-[0.9375rem] leading-relaxed text-text-secondary">
            <p>
              Running my own server is not a moat. It is a weekend and twelve dollars a month, and
              anybody can do it. I moved off the platform for reasons that are worth writing down,
              but none of them are that it is hard.
            </p>
            <p>
              What the move is actually worth is that it closed a gap between using infrastructure
              and understanding it. That is a difference in what I can be asked about, not a
              difference in what I own.
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2 pt-1 text-sm">
              <Link href="/notes/vercel-to-vps" className="link-underline text-ink">
                From Vercel to VPS, with the counter-argument
              </Link>
              <Link href="/work" className="link-underline text-text-secondary">
                All eleven projects
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
