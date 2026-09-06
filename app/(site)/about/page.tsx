import type { Metadata } from "next";
import { About } from "@/components/About";
import { Experience } from "@/components/Experience";
import { Education } from "@/components/Education";
import { Certifications } from "@/components/Certifications";
import { SectionReveal } from "@/components/SectionReveal";

export const metadata: Metadata = {
  title: "About",
  description:
    "Data science student in The Gambia, reading toward actuarial exams. Background, experience, education and certifications."
};

/**
 * About carries the three sections that were not in the nav.
 *
 * Experience, education and certifications answer the same question the bio
 * does, so they read as one page rather than three orphans. This is the only
 * route with more than one section, which is why SectionReveal survives here
 * and nowhere else: on a single-section page the reveal has nothing to reveal.
 */
export default function AboutPage() {
  return (
    <>
      <About />
      <SectionReveal>
        <Experience />
      </SectionReveal>
      <SectionReveal>
        <Education />
      </SectionReveal>
      <SectionReveal>
        <Certifications />
      </SectionReveal>
    </>
  );
}
