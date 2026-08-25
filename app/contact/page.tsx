import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { PROFILE } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Contact",
  description: `Email ${PROFILE.email}, or call ${PROFILE.phone}. Based in ${PROFILE.location}, working remotely.`
};

const CHANNELS: { label: string; value: string; href: string; note: string; external?: boolean }[] = [
  {
    label: "Email",
    value: PROFILE.email,
    href: `mailto:${PROFILE.email}`,
    note: "The one I check. Say what the problem is and I will tell you honestly whether I can help."
  },
  {
    label: "Phone",
    value: PROFILE.phone,
    href: `tel:${PROFILE.phone.replace(/\s+/g, "")}`,
    note: "The Gambia is on GMT all year, so it is the same clock as London in winter and an hour behind in summer."
  },
  {
    label: "GitHub",
    value: `github.com/${PROFILE.githubHandle}`,
    href: PROFILE.github,
    note: "Public repositories only. Several of the projects on this site are private and say so.",
    external: true
  },
  {
    label: "LinkedIn",
    value: `linkedin.com/in/${PROFILE.linkedinHandle}`,
    href: PROFILE.linkedin,
    note: "Slower, but it works.",
    external: true
  }
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Get in touch"
        lede="This page exists so the rest of the site does not have to ask. There is no form here and nothing to fill in. Email is best, the phone works, and both go to me."
      />

      <section className="mx-auto w-full max-w-shell px-6 py-14 sm:px-10">
        <div className="border-t border-rule">
          {CHANNELS.map((channel) => (
            <div key={channel.label} className="grid gap-3 border-b border-rule py-7 md:grid-cols-12 md:gap-6">
              <p className="label md:col-span-3 md:pt-1.5">{channel.label}</p>
              <div className="md:col-span-9">
                <a
                  href={channel.href}
                  className="inline-flex items-baseline gap-1.5 text-[1.25rem] text-ink transition-colors hover:text-accent"
                >
                  {channel.value}
                  {channel.external && <ArrowUpRight className="h-4 w-4 self-center" aria-hidden="true" />}
                </a>
                <p className="measure mt-2 text-[0.9375rem] leading-relaxed text-text-secondary">
                  {channel.note}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-shell px-6 pb-20 sm:px-10">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <h2 className="display text-[1.6rem] leading-tight">What I am looking for</h2>
          </div>
          <div className="measure md:col-span-8 space-y-5 text-[1.0625rem] leading-relaxed text-text-secondary">
            <p>
              Work on retrieval and forecasting systems, and on the validation around them. That is
              where the projects on this site are, and it is where I am most useful to someone
              quickly. I am also open to research collaboration on anything involving inference from
              incomplete data, which is the thread running through the three papers I am working on.
            </p>
            <p>
              I am finishing a BSc, so full-time work starts after that. Contract and part-time
              engagements are fine now. I have delivered two of those already, one in three weeks
              and one end to end for a property firm in The Gambia, and both are on the{" "}
              <a href="/about" className="link-underline text-ink">
                about page
              </a>{" "}
              with what they involved.
            </p>
          </div>
        </div>

        <div className="mt-12 border-t border-rule pt-8">
          <p className="label">Also here</p>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <a href="/Abdoulie-Balisa-Portfolio.pdf" className="link-underline text-ink">
              Portfolio as a PDF
            </a>
            <a href="/cv/Abdoulie-Balisa-CV.pdf" className="link-underline text-text-secondary">
              CV
            </a>
            <span className="text-text-faint">{PROFILE.location}</span>
          </div>
        </div>
      </section>
    </>
  );
}
