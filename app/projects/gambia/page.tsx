/**
 * The Gambia: 65 Years in Numbers
 *
 * Long-form case study built from the gambia-health-dashboard repo.
 * Every figure is rendered from the static export under public/projects/gambia/
 * so it ships with the GitHub Pages build. The page is intentionally
 * self-contained: a visitor learns more about The Gambia from this page
 * alone than from most country profiles online.
 */

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
 title: "The Gambia: 65 Years in Numbers, Abdoulie Balisa",
 description:
 "65 years of Gambian development indicators from the World Bank, cleaned, charted, and read for what they actually say. Health, education, economy, demographics, and what the data demands we fix.",
};

const FIG = "/projects/gambia";

const HEADLINE_STATS: Array<{ label: string; from: string; to: string; delta: string; up: boolean }> = [
 { label: "Life expectancy at birth", from: "34.6 yrs (1960)", to: "66.1 yrs (2024)", delta: "+91%", up: true },
 { label: "Infant mortality / 1,000", from: "157 (1960)", to: "33 (2024)", delta: "−79%", up: true },
 { label: "Maternal mortality / 100k", from: "1,454 (1985)", to: "354 (2023)", delta: "−76%", up: true },
 { label: "Fertility (births/woman)", from: "6.3 (1960)", to: "3.9 (2024)", delta: "−37%", up: true },
 { label: "Primary enrolment (gross)", from: "21% (1971)", to: "100% (2025)", delta: "+369%", up: true },
 { label: "Secondary enrolment (gross)",from: "7% (1971)", to: "107% (2021)", delta: "+1,434%", up: true },
 { label: "GDP per capita (current $)", from: "$94 (1966)", to: "$871 (2024)", delta: "+823%", up: true },
 { label: "GDP per capita (PPP $)", from: "$1,409 (1990)", to: "$3,476 (2024)", delta: "+147%", up: true },
 { label: "Inflation (latest year)", from: "-", to: "11.6% (2024)", delta: "volatile", up: false },
 { label: "Remittances received", from: "$0.3M (1978)", to: "$529M (2024)", delta: "+153,160%",up: true },
 { label: "Population", from: "398,060 (1960)", to: "2,759,988 (2025)", delta: "+593%", up: true },
 { label: "Urban share of population", from: "9% (1960)", to: "64% (2025)", delta: "+609%", up: true },
];

const FINDINGS: Array<{ n: number; title: string; body: string }> = [
 {
 n: 1,
 title: "Life expectancy nearly doubled, and infant mortality drove it.",
 body:
 "A Gambian baby born in 1960 could expect to live 35 years. A baby born in 2024 can expect 66. The single strongest correlate of that gain is the collapse in infant deaths (Pearson r = −0.997, almost a perfect mirror). Saving the babies is the entire story; everything else is downstream.",
 },
 {
 n: 2,
 title: "Maternal mortality is the unfinished revolution.",
 body:
 "We dropped from 1,454 maternal deaths per 100,000 live births in 1985 to 354 in 2023, a 76% reduction, real progress. But 354 is still 35 times the OECD average of about 10. A Gambian woman is still dying of pregnancy-related causes at a rate that ought to embarrass any minister of health. This is the next great public-health goal.",
 },
 {
 n: 3,
 title: "School enrolment is solved on paper. Learning is not.",
 body:
 "In 1971, fewer than 1 in 5 Gambian primary-age children were enrolled. Today the gross enrolment ratio sits at 100%, secondary at 107%. The doors are open; the body count is there. What we cannot tell from this dataset is what those students are learning. The most-recent four data points on adult literacy are statistically embarrassing, that data gap is itself a finding.",
 },
 {
 n: 4,
 title: "The economy grew nearly 10x, but volatility eats most of it.",
 body:
 "GDP per capita climbed from $94 in 1966 to $871 in 2024 in current US dollars, roughly doubling in PPP terms since 1990. But inflation in 2024 was 11.6%, and we have seen six episodes above 15% since 1980. Two episodes of negative GDP growth, the most recent in the early 2010s. Real household budgets gain less than the headline numbers suggest.",
 },
 {
 n: 5,
 title: "The diaspora is the second-largest sector of the economy.",
 body:
 "Remittances received climbed from a rounding error in 1978 to $529 million in 2024, roughly 22% of GDP. Gambians abroad are now the country's biggest non-government source of foreign currency. Any policy that lowers the cost of sending money home moves the largest economic lever the country has.",
 },
 {
 n: 6,
 title: "We urbanised faster than almost any other indicator improved.",
 body:
 "9% urban in 1960. 64% urban in 2025. That is one of the fastest urbanisation rates in West Africa. Urbanisation has the highest correlation with rising life expectancy (r = +0.996). Cities are good for human life, but only if we build them on purpose. Most of ours have grown without a plan.",
 },
];

const RECOMMENDATIONS: Array<{ to: string; ask: string }> = [
 {
 to: "Ministry of Health",
 ask: "Treat maternal mortality as the headline number. A standing task force with year-on-year reduction targets, public dashboards updated quarterly. 354 per 100,000 is the next national fight.",
 },
 {
 to: "Ministry of Basic and Secondary Education",
 ask: "Standardised learning-outcome assessments at grades 3, 6, and 9, published annually. Enrolment is solved; learning is the unfinished frontier.",
 },
 {
 to: "Gambia Bureau of Statistics",
 ask: "Sponsor an adult-literacy survey at least once every three years. The current 4-point series is the worst-tracked indicator on this page.",
 },
 {
 to: "Central Bank of The Gambia",
 ask: "Anchor inflation expectations. 11.6% is a regressive tax on every household holding dalasis.",
 },
 {
 to: "Ministry of Diaspora Affairs",
 ask: "Negotiate down cross-border remittance fees. A 1 percentage-point reduction is roughly $5M/year going to families instead of fintech intermediaries.",
 },
 {
 to: "Urban planners",
 ask: "Build for the 64%, not the 36%. National policy is still written as if we were mostly rural. We are not.",
 },
];

function StatCard({ label, from, to, delta, up }: { label: string; from: string; to: string; delta: string; up: boolean }) {
 return (
 <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
 <p className="text-[11px] uppercase tracking-wider text-white/50">{label}</p>
 <div className="mt-2 flex items-baseline justify-between gap-2">
 <span className="text-xs text-white/40">{from}</span>
 <span className="text-xs text-white/40">→</span>
 <span className="text-base font-semibold text-white">{to}</span>
 </div>
 <p className={`mt-2 text-xs font-mono ${up ? "text-emerald-400" : "text-amber-400"}`}>{delta}</p>
 </div>
 );
}

function Figure({ src, alt, caption }: { src: string; alt: string; caption: string }) {
 return (
 <figure className="my-10">
 <div className="overflow-hidden rounded-xl border border-white/10 bg-white">
 <Image
 src={src}
 alt={alt}
 width={1400}
 height={780}
 className="w-full h-auto"
 unoptimized
 />
 </div>
 <figcaption className="mt-3 text-sm italic text-white/55 text-center">{caption}</figcaption>
 </figure>
 );
}

export default function GambiaCaseStudy() {
 return (
 <main className="min-h-screen bg-background text-white">
 {/* Top nav */}
 <div className="border-b border-white/5">
 <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
 <Link href="/" className="text-sm text-white/60 hover:text-white">
 ← Back to portfolio
 </Link>
 <div className="flex items-center gap-4 text-sm text-white/60">
 <a
 href="https://github.com/Balisa50/gambia-health-dashboard"
 target="_blank"
 rel="noreferrer noopener"
 className="hover:text-white"
 >
 Source on GitHub
 </a>
 </div>
 </div>
 </div>

 <article className="max-w-3xl mx-auto px-6 py-16">
 {/* Hero */}
 <header className="mb-12">
 <p className="text-xs uppercase tracking-[0.25em] text-emerald-400/80 mb-4">
 Data Story · The Gambia · 1960-2025
 </p>
 <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
 The Gambia: 65 Years in Numbers
 </h1>
 <p className="mt-6 text-lg text-white/70 leading-relaxed">
 Pulled directly from the World Bank Open Data API. 19 indicators across 66 years.
 No politics, no spin, just the numbers every Gambian should know about their own country,
 and what the data is begging us to fix.
 </p>
 <p className="mt-6 text-sm text-white/45">
 By <span className="text-white">Abdoulie Balisa</span> · BSc Statistics, KNUST · Built with Python (pandas, matplotlib, seaborn) and the World Bank <code className="text-emerald-400/90">wbdata</code> client
 </p>
 </header>

 {/* The headline */}
 <section className="mb-14">
 <h2 className="text-2xl font-bold mb-4">The Headline</h2>
 <p className="text-white/75 text-lg leading-relaxed">
 <strong className="text-white">Life expectancy almost doubled.</strong> Infant mortality fell nearly 80%.
 Schools that barely existed in 1971 now enrol every child.{" "}
 <strong className="text-white">But maternal mortality is still alarming, inflation is still eating wages,
 and 64% of us now live in towns we built in a hurry.</strong>
 </p>

 <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
 {HEADLINE_STATS.map((s) => (
 <StatCard key={s.label} {...s} />
 ))}
 </div>

 <Figure
 src={`${FIG}/05_health_headline.png`}
 alt="Life expectancy and infant mortality, side by side"
 caption="The two charts that explain almost everything: life expectancy nearly doubled, infant mortality fell ~85%."
 />
 </section>

 {/* What the data says */}
 <section className="mb-14">
 <h2 className="text-2xl font-bold mb-6">What the Data Says</h2>

 <h3 className="text-xl font-semibold mt-10">1. We are living much longer.</h3>
 <p className="mt-4 text-white/75 leading-relaxed">
 In 1960 a Gambian baby could expect to live to 35. Today, 66. That is a 31-year gain in two generations.
 The line is steady, with a small dip in the early 1990s (HIV/AIDS arrival, drought years).
 The sharpest correlate of life expectancy is infant mortality, they move as mirror images
 (Pearson r = <span className="font-mono text-emerald-400">−0.997</span>).
 Save the babies, and the country lives longer.
 </p>
 <Figure
 src={`${FIG}/01_life_expectancy.png`}
 alt="Gambian life expectancy 1960 to 2024"
 caption="Life expectancy at birth, The Gambia (1960 to today). Steady upward arc with a small early-1990s dip."
 />

 <h3 className="text-xl font-semibold mt-10">2. Infant mortality fell from a tragedy to a manageable problem.</h3>
 <p className="mt-4 text-white/75 leading-relaxed">
 157 babies per 1,000 dying before their first birthday in 1960. Today, 33. We have not reached the
 global average yet, Sub-Saharan Africa overall sits around 50, the world around 27, but the
 trajectory is right and steady.
 </p>
 <Figure
 src={`${FIG}/02_infant_mortality.png`}
 alt="Infant mortality rate 1960 to 2024"
 caption="Infant deaths per 1,000 live births. From 157 to 33."
 />

 <h3 className="text-xl font-semibold mt-10">3. Maternal mortality is the unfinished revolution.</h3>
 <p className="mt-4 text-white/75 leading-relaxed">
 We dropped from <strong>1,454</strong> maternal deaths per 100,000 live births in 1985 to{" "}
 <strong>354</strong> in 2023. That is a 76% reduction, real progress.{" "}
 <strong>But 354 is still 35 times higher than the OECD average (about 10).</strong>{" "}
 A Gambian woman is still dying of pregnancy-related causes at a rate no developed country tolerates.
 This is the most important uncompleted health goal in the country. Every other indicator on this
 page has done better.
 </p>
 <Figure
 src={`${FIG}/03_maternal_mortality.png`}
 alt="Maternal mortality rate 1985 to 2023"
 caption="Deaths per 100,000 live births. Down from 1,454 to 354, but still 35× the OECD average."
 />

 <h3 className="text-xl font-semibold mt-10">4. Schools went from a privilege to a default.</h3>
 <p className="mt-4 text-white/75 leading-relaxed">
 In 1971 fewer than 1 in 5 Gambian primary-age children were enrolled. Today the gross enrolment ratio
 sits at 100%. Secondary moved from 7% to 107%, the single biggest social investment of the
 post-independence era. What the chart cannot tell us is what those students are{" "}
 <em>learning</em>. Gross enrolment is a doorway count, not a results count.
 </p>
 <Figure
 src={`${FIG}/07_school_enrolment.png`}
 alt="Primary and secondary enrolment over time"
 caption="Gross enrolment ratios for primary (green) and secondary (orange). Both above 100% means students attending older or younger than the standard age."
 />

 <h3 className="text-xl font-semibold mt-10">5. Vaccinations are good, not great, and recently slipping.</h3>
 <p className="mt-4 text-white/75 leading-relaxed">
 Measles immunization moved from 69% in 1980 to a peak above 90% in the 2000s, then drifted back to
 83% in 2024. Below 90% means measles outbreaks are mathematically possible. The post-COVID slip is
 real and visible.
 </p>
 <Figure
 src={`${FIG}/06_immunization.png`}
 alt="Measles immunization coverage"
 caption="Children 12-23 months vaccinated against measles. Peaked at ~95%, currently at 83%."
 />

 <h3 className="text-xl font-semibold mt-10">6. We are richer, but inflation eats most of it.</h3>
 <p className="mt-4 text-white/75 leading-relaxed">
 GDP per capita grew from $94 in 1966 to $871 in 2024 in current US dollars, almost{" "}
 <strong>9 times</strong> larger nominally. In PPP terms (what the money actually buys), per capita
 income roughly doubled since 1990. But inflation in 2024 was <strong>11.6%</strong>. Six episodes
 of inflation above 15% since 1980. Two episodes of negative GDP growth. The economy grew, but it
 grew nervously, with sharp shocks every decade.
 </p>
 <Figure
 src={`${FIG}/08_gdp_per_capita.png`}
 alt="GDP per capita over time"
 caption="GDP per capita: current US$ (solid black) and PPP-adjusted (dashed gold)."
 />
 <Figure
 src={`${FIG}/09_macro_volatility.png`}
 alt="Inflation and GDP growth volatility"
 caption="Annual inflation (red) versus GDP growth (blue). Volatile by any standard."
 />

 <h3 className="text-xl font-semibold mt-10">7. The diaspora is now the second-largest sector.</h3>
 <p className="mt-4 text-white/75 leading-relaxed">
 Remittances received climbed from a rounding error in 1978 to <strong>$529 million</strong> in 2024,
 roughly equivalent to <strong>22% of GDP</strong>. Gambians abroad are the country's biggest
 non-government source of foreign currency. Any policy that lowers remittance fees moves the
 largest economic lever the country has.
 </p>
 <Figure
 src={`${FIG}/10_remittances.png`}
 alt="Personal remittances received"
 caption="Personal remittances received in US$ millions. From less than $1M in 1978 to $529M in 2024."
 />

 <h3 className="text-xl font-semibold mt-10">8. We urbanised faster than almost any other indicator improved.</h3>
 <p className="mt-4 text-white/75 leading-relaxed">
 In 1960, 91% of Gambians lived in villages. Today only 36% do. A 64% urban majority in 65 years is
 one of the fastest urbanisation rates in West Africa. This is why housing, sanitation, traffic, and
 youth employment matter more every year. The country we built our institutions for was rural.
 The country we live in is urban.
 </p>
 <Figure
 src={`${FIG}/11_population_urban.png`}
 alt="Population growth and urbanisation"
 caption="Total population (blue, left axis) and urban share (orange dashed, right axis)."
 />

 <h3 className="text-xl font-semibold mt-10">9. The indicators move together, mostly.</h3>
 <p className="mt-4 text-white/75 leading-relaxed">
 The correlation matrix shows what every Gambian intuitively knows: the things that improve, improve
 together. Health, school enrolment, urbanisation, GDP per capita all rise in step. The exceptions
 are economic shocks (inflation, GDP growth volatility) which march to their own clock.
 </p>
 <Figure
 src={`${FIG}/12_correlation.png`}
 alt="Correlation matrix of indicators"
 caption="Pearson correlation between every pair. Red = strong positive, blue = strong negative."
 />
 <Figure
 src={`${FIG}/13_decade_averages.png`}
 alt="Decade averages: life expectancy, infant mortality, GDP per capita"
 caption="The same three headline numbers averaged by decade. The long arc, condensed."
 />
 </section>

 {/* Findings */}
 <section className="mb-14">
 <h2 className="text-2xl font-bold mb-6">Findings, In Plain Words</h2>
 <ol className="space-y-6">
 {FINDINGS.map((f) => (
 <li key={f.n} className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
 <div className="flex gap-4">
 <span className="flex-none w-8 h-8 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-sm font-bold text-emerald-400">
 {f.n}
 </span>
 <div>
 <h3 className="text-lg font-semibold leading-snug">{f.title}</h3>
 <p className="mt-2 text-white/70 leading-relaxed">{f.body}</p>
 </div>
 </div>
 </li>
 ))}
 </ol>
 </section>

 {/* Recommendations */}
 <section className="mb-14">
 <h2 className="text-2xl font-bold mb-6">Recommendations, Specific Enough To Act On</h2>
 <p className="text-white/65 mb-6">
 These come from where the data points, not from anyone's opinion.
 </p>
 <div className="space-y-4">
 {RECOMMENDATIONS.map((r) => (
 <div key={r.to} className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
 <p className="text-xs uppercase tracking-wider text-emerald-400/80 mb-2">For the {r.to}</p>
 <p className="text-white/80 leading-relaxed">{r.ask}</p>
 </div>
 ))}
 </div>
 </section>

 {/* Footer / source */}
 <section className="mb-14 border-t border-white/10 pt-8">
 <h2 className="text-2xl font-bold mb-4">Source &amp; Reproducibility</h2>
 <p className="text-white/70 leading-relaxed">
 All data is from the World Bank Open Data portal, accessed via the{" "}
 <code className="text-emerald-400/90">wbdata</code> Python client. Country code{" "}
 <code className="text-white">GMB</code>. The pull script, cleaning script, plotting script,
 and the Jupyter notebook are all in{" "}
 <a
 href="https://github.com/Balisa50/gambia-health-dashboard"
 target="_blank"
 rel="noreferrer noopener"
 className="text-emerald-400 hover:underline"
 >
 the repo
 </a>
 . Anyone can rerun the analysis end-to-end in three commands.
 </p>
 <p className="mt-6 text-sm text-white/45">
 Last data pull: 2025. Built and written by{" "}
 <a
 href="https://github.com/Balisa50"
 target="_blank"
 rel="noreferrer noopener"
 className="text-white hover:underline"
 >
 Abdoulie Balisa
 </a>
 .
 </p>
 </section>
 </article>
 </main>
 );
}
