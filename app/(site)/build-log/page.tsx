import type { Metadata } from "next";
import { readFileSync } from "node:fs";
import path from "node:path";
import { ContributionGrid, type ContributionsData } from "@/components/ContributionGrid";

export const metadata: Metadata = {
  title: "Build log",
  description:
    "Every commit to a public repository, over the last year."
};

function loadData(): ContributionsData {
  try {
    const p = path.join(process.cwd(), "public", "data", "contributions.json");
    return JSON.parse(readFileSync(p, "utf-8")) as ContributionsData;
  } catch {
    return { total: { lastYear: 0 }, contributions: [] };
  }
}

export default function BuildLogPage() {
  const data = loadData();
  return (
    <main className="mx-auto w-full max-w-shell px-6 sm:px-10 py-20 md:py-24">
      <header className="mb-16">
        <p className="label">Build log</p>
        <h1 className="display mt-3 text-[clamp(2.25rem,5vw,3.75rem)]">
          Days shipped
        </h1>
        <p className="measure mt-5 text-[16px] leading-relaxed text-text-secondary">
          Every commit to a public repository, over the last year.

        </p>
      </header>

      <div className="rounded-xl border border-border p-6 md:p-8">
        <ContributionGrid data={data} />
      </div>

      <section className="mt-16 max-w-[78ch] space-y-4 text-[15px] leading-relaxed text-text-secondary">
        <p>
          The graph is fetched daily by a GitHub Action and rebuilt with the site.


        </p>
        <p>
          Most of the work in these projects happens in small commits that
          never reach a case study.

        </p>
      </section>
    </main>
  );
}
