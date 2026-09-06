import { Hero } from "@/components/Hero";
import { Metrics } from "@/components/Metrics";
import { LegacyHashRedirect } from "@/components/LegacyHashRedirect";

/**
 * The intro.
 *
 * Everything that used to stack below this now has its own route. What is left
 * is the introduction and the numbers under it: who I am, what I work on, and
 * enough signal to decide whether to click through. The work itself is one tap
 * away at /work rather than a scroll away, which is the whole point of the
 * split.
 */
export default function HomePage() {
  return (
    <>
      <LegacyHashRedirect />
      <Hero />
      <Metrics />
    </>
  );
}
