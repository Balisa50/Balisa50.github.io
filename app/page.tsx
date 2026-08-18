import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Metrics } from "@/components/Metrics";
import { Skills } from "@/components/Skills";
import { About } from "@/components/About";
import { Experience } from "@/components/Experience";
import { Education } from "@/components/Education";
import { Certifications } from "@/components/Certifications";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { ProjectsGrid } from "@/components/ProjectsGrid";
import { SectionReveal } from "@/components/SectionReveal";

// ProjectsGrid used to be a dynamic() import behind a fixed 40vh placeholder.
// It was lazy for a reason that no longer exists: the "many motion nodes" went
// with the framer-motion entrances, and the stars fetch with the GitHub card.
// The placeholder was actively harmful, because it is the tallest block on the
// page and anchor links resolved against its 40vh stand-in, then the real grid
// loaded and pushed every section below it down. Clicking "Contact" landed you
// somewhere else. It is the main content of a statically exported page, so it
// ships with the page.

export default function HomePage() {
  return (
    <>
      <Nav />
      <main id="main" className="relative flex flex-col">
        <Hero />
        <Metrics />
        <SectionReveal>
          <ProjectsGrid />
        </SectionReveal>
        <SectionReveal>
          <Skills />
        </SectionReveal>
        <SectionReveal>
          <About />
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
        <SectionReveal>
          <Contact />
        </SectionReveal>
        <Footer />
      </main>
    </>
  );
}
