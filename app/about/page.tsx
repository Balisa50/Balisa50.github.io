import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/site/page-header";
import { PROFILE, EXPERIENCE, EDUCATION, CERTIFICATES } from "@/lib/projects";

export const metadata: Metadata = {
  title: "About",
  description:
    "Why a statistics student in The Gambia keeps building forecasting and retrieval systems, what the constraints have taught me, and the record underneath."
};

/** Three things I actually work by, each with the project that proves it. */
const PRINCIPLES: { title: string; body: string; proof: { label: string; href: string } }[] = [
  {
    title: "Say how confident you are, and be willing to be less confident",
    body: "The first privacy metric I put on NOVA scored 0.99 and I nearly published it as a result. It was measuring the wrong thing, and a model that had memorised its training data would have scored the same. I threw the metric out and replaced it with distance-to-closest-record, which gives a worse-sounding number that means something. The same instinct is why the population projection reports a range of 4.35 to 4.98 million instead of a single figure, and why the legal chatbot refuses when it cannot find the section.",
    proof: { label: "NOVA, four checks and two discarded ones", href: "/work/nova" }
  },
  {
    title: "Check the machine against a known answer before you trust it with a new one",
    body: "A cohort-component projection has a hundred places to get an index quietly wrong, and the output looks plausible either way. So I fed the engine the UN's own inputs first and confirmed it reproduced their published numbers to within 1 percent. Only then did I swap in the 2024 census. The disagreement that came out of that run is worth reading precisely because the engine had already been shown to work.",
    proof: { label: "The Gambia 2074, validated before it was believed", href: "/work/gambia-population-projection" }
  },
  {
    title: "Constraints are the design, not an excuse",
    body: "No GPU, a laptop that ran out of disk in the middle of a Bayesian fit, and free tiers everywhere. AYAT embeds its whole corpus once at build time and runs the query embedding in your browser, so it has no inference bill and no cold start. NOVA ships a CPU-only Torch wheel and fits in 367 MB. Those are not compromises I settled for; they are the reason those two projects are still online at no cost while better-funded demos have gone dark.",
    proof: { label: "AYAT, 6,236 verses and no inference server", href: "/work/ayat" }
  }
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="Why I build any of this"
        lede="I am a statistics student in Fajikunda, The Gambia, finishing a BSc at KNUST in Ghana. Most of what I build starts from the same place: a question about my own country that nobody has published an answer to, and public data that is thin enough to make answering it genuinely hard."
      />

      <section className="mx-auto w-full max-w-shell px-6 py-14 sm:px-10">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <h2 className="display text-[1.6rem] leading-tight">The starting point</h2>
          </div>
          <div className="measure md:col-span-8">
            <div className="space-y-5 text-[1.0625rem] leading-relaxed text-text-secondary">
              <p>
                The Gambia has no working death-registration system. That single fact is why the
                country is absent from the Human Mortality Database, why its population figures come
                almost entirely from the UN, and why those figures were finalised before the first
                digital census in 2024. It also means that a student here who wants to forecast
                mortality cannot download a dataset and start. There is nothing to download.
              </p>
              <p>
                Banks hold loan books they are not allowed to share, and for rural borrowers and the
                informal economy much of the data was never collected at all. Thirteen Acts of
                Parliament govern daily life and are effectively unreadable to the people they
                govern. There is no public political-risk index, no local FX forecast, no scorecard
                calibrated on West African microfinance rather than German credit data.
              </p>
              <p>
                Every project on this site came out of one of those gaps. I am not building
                portfolio pieces and then looking for a use. The use came first, and the engineering
                is what it took to answer the question honestly with what was available.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-shell px-6 py-8 sm:px-10">
        <h2 className="label">How I work</h2>
        <div className="mt-6 border-t border-rule">
          {PRINCIPLES.map((principle) => (
            <div key={principle.title} className="grid gap-5 border-b border-rule py-8 md:grid-cols-12">
              <div className="md:col-span-4">
                <h3 className="text-[1.0625rem] font-medium leading-snug text-ink">{principle.title}</h3>
              </div>
              <div className="md:col-span-8">
                <p className="measure text-[0.9375rem] leading-relaxed text-text-secondary">
                  {principle.body}
                </p>
                <Link href={principle.proof.href} className="link-underline mt-4 inline-block text-sm text-ink">
                  {principle.proof.label}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-shell px-6 py-8 sm:px-10">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <h2 className="display text-[1.6rem] leading-tight">What I am doing now</h2>
          </div>
          <div className="measure md:col-span-8 space-y-5 text-[1.0625rem] leading-relaxed text-text-secondary">
            <p>
              Finishing the statistics degree, and working on three research papers that share one
              question: how do you make an inference when the data is broken? The first is the
              mortality projection that is already written up. The second asks whether satellite
              poverty mapping stays calibrated when you carry a model across a border. The third is
              epidemic forecasting under the same kind of reporting gaps.
            </p>
            <p>
              On the engineering side I am moving my own deployments off managed platforms and onto
              a droplet I administer, which is what the{" "}
              <Link href="/infra" className="link-underline text-ink">
                infrastructure page
              </Link>{" "}
              is about. It is the largest gap in what I can currently claim, so it is the one I am
              closing next.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-shell px-6 py-14 sm:px-10">
        <h2 className="label">Experience</h2>
        <div className="mt-6 border-t border-rule">
          {EXPERIENCE.map((job) => (
            <div key={`${job.company}-${job.period}`} className="grid gap-4 border-b border-rule py-7 md:grid-cols-12">
              <div className="md:col-span-4">
                <p className="text-[1.0625rem] text-ink">{job.company}</p>
                <p className="mt-1 text-sm text-text-secondary">{job.role}</p>
                <p className="numeral mt-1 text-xs text-text-faint">
                  {job.period}
                  {job.location ? ` · ${job.location}` : ""}
                </p>
              </div>
              <ul className="md:col-span-8 space-y-2.5">
                {job.bullets.map((bullet, i) => (
                  <li
                    key={i}
                    className="relative pl-4 text-[0.9375rem] leading-relaxed text-text-secondary"
                  >
                    <span aria-hidden="true" className="absolute left-0 top-[0.72em] h-px w-2 bg-text-faint" />
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-shell px-6 pb-14 sm:px-10">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="label">Education</h2>
            {EDUCATION.map((entry) => (
              <div key={entry.institution} className="mt-5 border-t border-rule pt-5">
                <p className="text-[1.0625rem] text-ink">
                  {entry.degree} {entry.field}
                </p>
                <p className="mt-1 text-sm text-text-secondary">{entry.institution}</p>
                <p className="numeral mt-1 text-xs text-text-faint">
                  {entry.period} · {entry.location}
                </p>
                {entry.coursework && (
                  <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-1">
                    {entry.coursework.map((course) => (
                      <li
                        key={course}
                        className="font-mono text-[0.6875rem] uppercase tracking-[0.09em] text-text-faint"
                      >
                        {course}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          <div>
            <h2 className="label">Certifications</h2>
            <ul className="mt-5 border-t border-rule">
              {CERTIFICATES.map((cert) => (
                <li
                  key={`${cert.name}-${cert.issuer}`}
                  className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-rule py-3"
                >
                  <span className="text-[0.9375rem] text-ink">
                    {cert.credentialUrl ? (
                      <a href={cert.credentialUrl} className="link-underline">
                        {cert.name}
                      </a>
                    ) : (
                      cert.name
                    )}
                  </span>
                  <span className="text-sm text-text-secondary">
                    {cert.issuer}
                    {cert.date ? ` · ${cert.date}` : ""}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-t border-rule">
        <div className="mx-auto w-full max-w-shell px-6 py-12 sm:px-10">
          <p className="measure text-[1.0625rem] leading-relaxed text-text-secondary">
            If any of this is useful to you, the fastest route is{" "}
            <Link href="/contact" className="link-underline text-ink">
              email
            </Link>
            . I read everything and I answer, including from {PROFILE.location}, where the working
            day may not overlap with yours.
          </p>
        </div>
      </section>
    </>
  );
}
