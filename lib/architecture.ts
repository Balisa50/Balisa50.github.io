/**
 * One architecture diagram per case study, as Mermaid source.
 *
 * Kept out of lib/case-studies.ts on purpose. That file is prose and it is
 * already long; this is markup with its own syntax rules, and mixing them
 * makes both harder to edit. Joined by slug, same as everything else.
 *
 * Written as `flowchart LR` because these are all pipelines and left-to-right
 * is how a pipeline reads. The trade is width: on a phone the diagram is wider
 * than the column, so the wrapper scrolls sideways and says so, since this site
 * hides scrollbars everywhere.
 *
 * Labels are quoted throughout. An unquoted Mermaid label breaks on commas,
 * brackets and full stops, and the failure is a blank box rather than an error.
 */

export interface Architecture {
  /** What the reader should take from the picture. */
  caption: string;
  /** Mermaid source. */
  chart: string;
}

export const ARCHITECTURE: Record<string, Architecture> = {
  nova: {
    caption:
      "Two entry points, one validation gate. Copy mode learns a dataset you have; create mode builds records from rules when you have none. Neither reaches the API without passing the same four checks.",
    chart: `flowchart LR
  csv["CSV you upload"] --> ctgan["CTGAN, written from the paper"]
  rules["Columns, distributions, rules"] --> eval["Whitelist expression evaluator"]
  eval --> criteria["Criteria engine, 7 presets"]
  ctgan --> checks["Shape, correlation, TSTR, DCR"]
  criteria --> checks
  checks --> api["FastAPI, CPU-only torch"]
  api --> studio["Next.js studio"]`
  },

  "gambia-population-projection": {
    caption:
      "Three mortality models feed one projection engine, and the engine is checked against the UN's own published figures before it is trusted with the census base.",
    chart: `flowchart LR
  wpp["wpp2024 package, pinned SHA"] --> lt["Life tables"]
  census["2024 digital census"] --> lt
  hdss["Farafenni and Basse HDSS"] --> lt
  lt --> svd["Lee-Carter, classical SVD"]
  lt --> bayes["Bayesian Poisson, PyMC"]
  lt --> coherent["Coherent Li-Lee, 8 countries"]
  svd --> ccm["Cohort-component, 1,000 sims"]
  bayes --> ccm
  coherent --> ccm
  ccm -->|"within 1 percent"| validate["Rebuild WPP from its own inputs"]
  validate --> report["Report, policy brief, figures"]`
  },

  "gambia-legal-aid": {
    caption:
      "The validator sits after the model, not before it. Nothing reaches the screen that has not been checked against the retrieved statute text.",
    chart: `flowchart LR
  acts["13 Acts of Parliament"] --> chunk["Chunk and embed by section"]
  chunk --> vector[("Vector store")]
  vector --> retrieve["Top-k retrieval"]
  retrieve --> llm["LLM, with a fallback provider"]
  llm --> cite["Citation validator"]
  vector -.->|"store unreachable"| refuse["Refuse outright"]
  cite -->|"cited, or nothing"| ui["Next.js chat"]
  refuse --> ui`
  },

  ayat: {
    caption:
      "Everything expensive happens once, at build time. The browser holds the vectors, so a question costs nothing to serve and there is no inference server to keep alive.",
    chart: `flowchart LR
  verses["6,236 verses"] --> st["sentence-transformers"]
  st --> umap["UMAP to 3D, HDBSCAN"]
  umap --> bundle[("Coordinates and vectors")]
  bundle --> three["Three.js Points, one draw call"]
  bundle --> tjs["transformers.js query embedding"]
  tjs -->|"axis of meaning"| three
  tjs -.->|"only on request"| llm["LLM, or it says it has nothing"]`
  },

  vantage: {
    caption:
      "One scheduled run, six regions. Each regional collector fires the next on its way out, which is how six regions fit inside a plan that allows one job a day.",
    chart: `flowchart LR
  cron["Scheduled run, unattended"] --> regions["Six regional collectors"]
  regions -->|"skip anything seen"| synth["LLM synthesis per story"]
  synth --> score["Significance score"]
  score --> content[("Content store")]
  content --> feed["Next.js feed"]`
  },

  "credit-risk-scorecard": {
    caption:
      "A deliberately plain model with a heavy validation stage. The interesting part is on the right, where a stability metric and a stress test can disagree.",
    chart: `flowchart LR
  loans["12,000 microfinance loans"] --> woe["WoE binning, IV screen"]
  woe --> logit["Logistic regression"]
  logit --> points["Basel II points card"]
  points --> metrics["Gini, KS, PSI"]
  points --> stress["Multi-scenario stress"]
  metrics --> dash["Next.js dashboard"]
  stress --> dash`
  },

  "life-insurance-risk": {
    caption:
      "Three survival models feed one price, and the price feeds a tail simulation. The stress scenario is applied by age band rather than as one flat multiplier.",
    chart: `flowchart LR
  book["Policy and mortality data"] --> gm["Gompertz-Makeham"]
  book --> km["Kaplan-Meier"]
  book --> cox["Cox PH, C-index 0.77"]
  gm --> premium["Actuarial premium"]
  km --> premium
  cox --> premium
  premium --> mc["Monte Carlo VaR, 5,000 runs"]
  mc --> pandemic["Pandemic stress by age band"]
  pandemic --> dash["Next.js dashboard"]`
  },

  forge: {
    caption:
      "A week does not close on a claim. The proof-of-work engine matches it against real commits and a reachable deployment, and only then can a mentor sign it off.",
    chart: `flowchart LR
  commits["Learner GitHub commits"] --> pow["Proof-of-work engine"]
  url["Deployed URL"] --> pow
  pow --> db[("Prisma 7 on Postgres")]
  roadmaps["13 roadmaps, 12 to 43 weeks"] --> db
  exam["Exam P and FM generator"] --> db
  db --> mentor["Mentor release and sign-off"]
  mentor --> app["Next.js 16, NextAuth v5"]
  mentor --> cert["Signed certificate"]`
  },

  hireiq: {
    caption:
      "The loop back from the follow-up policy is the product. A thin answer sends the interview round again instead of moving to the next question.",
    chart: `flowchart LR
  chat["Candidate, in a conversation"] --> api["FastAPI"]
  api --> nim["NVIDIA NIM, open weights"]
  nim --> policy["Follow-up policy"]
  policy -->|"answer was thin, ask again"| api
  policy --> score["Rubric scoring and ranking"]
  score --> supabase[("Supabase Postgres")]
  supabase --> pdf["WeasyPrint report"]
  supabase --> dash["Recruiter dashboard"]`
  },

  "dalasi-pulse": {
    caption:
      "Nothing in the serving path calls an API. A scheduled job refits and commits the forecast, which rebuilds the site, and a visitor downloads files.",
    chart: `flowchart LR
  cbg["Central Bank of The Gambia"] --> etl["pandas ETL"]
  wb["World Bank indicators"] --> etl
  etl --> fx["FX forecast with intervals"]
  etl --> rem["Remittance flow model"]
  fx --> json[("Forecast JSON")]
  rem --> json
  json --> dash["Next.js dashboard"]`
  }
};

export function architectureFor(slug: string): Architecture | null {
  return ARCHITECTURE[slug] ?? null;
}
