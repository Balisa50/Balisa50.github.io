import dynamic from "next/dynamic";
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

// Lazy-load the heavier projects grid (stars fetch + many motion nodes).
const ProjectsGrid = dynamic(
  () => import("@/components/ProjectsGrid").then((m) => m.ProjectsGrid),
  { loading: () => <div className="h-[40vh]" aria-hidden="true" /> }
);

export default function HomePage() {
  return (
    <>
      <Nav />
      <main id="main" className="relative flex flex-col">
        <Hero />
        <Metrics />
        <ProjectsGrid />
        <Skills />
        <About />
        <Experience />
        <Education />
        <Certifications />
        <Contact />
        <Footer />
      </main>
    </>
  );
}
