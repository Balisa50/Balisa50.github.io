import type { Metadata } from "next";
import { About } from "@/components/About";
import { Skills } from "@/components/Skills";
import { Experience } from "@/components/Experience";
import { Education } from "@/components/Education";
import { Certifications } from "@/components/Certifications";
import { SectionReveal } from "@/components/SectionReveal";

export const metadata: Metadata = {
  title: "About",
  description:
    "Data science student in The Gambia, reading toward actuarial exams. Background, the stack I build with, experience, education and certifications."
};

/**
 * Everything that answers "who is this and what can they do".
 *
 * The stack had its own route for a day. Three columns of tool names is a
 * paragraph, not a page: it read fine as a band inside a longer document and
 * looked empty with a nav above it and a footer under it. It sits after the bio
 * because "what I build with" is the same question the bio is answering, and
 * before the record, which is the evidence for it.
 *
 * The bio itself is not wrapped: it is at the top of the page, so a reveal on
 * scroll would be a fade-in on something already in view.
 */
export default function AboutPage() {
  return (
    <>
      <About />
      <SectionReveal>
        <Skills />
      </SectionReveal>
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
