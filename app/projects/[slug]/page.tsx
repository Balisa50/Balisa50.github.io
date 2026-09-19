import { Hero } from "@/components/Hero";
import { Metrics } from "@/components/Metrics";
import { SelectedWork } from "@/components/SelectedWork";
import { LegacyHashRedirect } from "@/components/LegacyHashRedirect";

// The intro, then three projects. The full index lives at /work.
export default function HomePage() {
  return (
    <>
      <LegacyHashRedirect />
      <Hero />
      <Metrics />
      <SelectedWork />
    </>
  );
}