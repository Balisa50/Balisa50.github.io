/**
 * Print-only data for the PDF portfolio.
 *
 * Everything the PDF shares with the site (titles, taglines, the problem, the
 * decisions, what shipped, what broke, what I'd do differently, experience,
 * education, certificates) is read from `projects.ts` and `case-studies.ts` at
 * render time. This file holds only what the print document adds on top: the
 * figures, their captions, and the headline numbers.
 *
 * That split is the point. The original PDF was authored separately from the
 * site and the two drifted, so the PDF still linked a repository that had gone
 * private. Anything duplicated here would drift the same way, so nothing is.
 *
 * The project list is deliberately NOT the full site list. Client websites,
 * coursework and the commercial lead-response product are excluded, which is
 * the same curation the original document made explicit on its "Also built"
 * page.
 */

export interface PrintFigure {
  src: string;
  /** Real text, not baked into the image, so a parser and a screen reader both get it. */
  caption: string;
}

export interface PrintStat {
  value: string;
  label: string;
}

export interface PrintEntry {
  /** Matches a slug in PROJECTS and CASE_STUDIES. */
  slug: string;
  kicker: string;
  /** One or two sentences under the title. */
  standfirst: string;
  /** Two-page spread for the four that carry enough detail, one page for the rest. */
  spread: boolean;
  figures: PrintFigure[];
  stats: PrintStat[];
}

export const PRINT_ENTRIES: PrintEntry[] = [
  {
    slug: "gambia-population-projection",
    kicker: "Statistical modelling · Demography",
    standfirst:
      "A probabilistic population projection for a country with no death registration, built from open data and re-based on the 2024 census.",
    spread: true,
    figures: [
      {
        src: "/figures/gambia-2074-projection.png",
        caption:
          "Cohort-component projection to 2074: the population path, the age structure in 2023 against 2074, and the dependency ratios that follow from it."
      },
      {
        src: "/figures/gambia-2074-backtest.png",
        caption:
          "Backtest: fit to 2010, then predict 2011 to 2023. Mean error 0.65 years, with the observed value inside the 95 percent interval each year."
      },
      {
        src: "/figures/gambia-2074-methods.png",
        caption:
          "The three mortality methods against the UN. They agree on 2074 life expectancy to within about 0.8 years."
      }
    ],
    stats: [
      { value: "65.86", label: "Life table reproduces the published e₀ for 2023" },
      { value: "0.65 yr", label: "Mean backtest error over 13 years" },
      { value: "±1%", label: "Engine matches the UN projection before re-basing" },
      { value: "4.66M", label: "Projected 2074 population, 4.35 to 4.98M" }
    ]
  },
  {
    slug: "nova",
    kicker: "Generative modelling · Synthetic data",
    standfirst:
      "A synthetic financial data engine: a Conditional Tabular GAN implemented from the paper, plus a rule engine for populations no dataset covers.",
    spread: true,
    figures: [
      {
        src: "/figures/nova-modes.png",
        caption:
          "Both generation modes run against the same validation suite, so a rule-generated table and a GAN-generated one are judged the same way."
      },
      {
        src: "/figures/nova-create.png",
        caption:
          "Create mode: columns, distributions and domain rules generate data with no source dataset, behind a whitelist evaluator so user rules cannot inject code."
      },
      {
        src: "/figures/nova-quality.png",
        caption:
          "Quality report: column shapes, correlation distance, train-on-synthetic-test-on-real, and the privacy check, reported together."
      }
    ],
    stats: [
      { value: "0.94", label: "Statistical similarity, mean column shape" },
      { value: "0.05", label: "Correlation L1 distance" },
      { value: "0.92", label: "Train on synthetic, test on real" },
      { value: "0.89", label: "Real-vs-synthetic detection, 0.50 baseline: the metric that does not pass" }
    ]
  },
  {
    slug: "credit-risk-scorecard",
    kicker: "Credit risk · Regulated modelling",
    standfirst:
      "A Basel II scorecard for West African microfinance. Each point on the score traces back to a feature, so the reasons for a decision can be read off it.",
    spread: true,
    figures: [
      {
        src: "/figures/credit-iv.png",
        caption:
          "Information Value by feature. Selection happens here, before anything is fitted."
      },
      {
        src: "/figures/credit-discrimination.png",
        caption:
          "Gini, KS, ROC and PSI together. A model that passes one and fails another is worth looking at more closely."
      },
      {
        src: "/figures/credit-stress.png",
        caption:
          "Stress testing for drought, currency crisis and pandemic, reported band by band rather than as one portfolio number."
      }
    ],
    stats: [
      { value: "0.27", label: "Gini on a later-vintage holdout, under the 0.4 industry bar" },
      { value: "0.21", label: "KS statistic, under the 0.3 bar" },
      { value: "0.002", label: "PSI across vintages, while defaults rose a third" },
      { value: "12,000", label: "Loans in the calibrated generator" }
    ]
  },
  {
    slug: "life-insurance-risk",
    kicker: "Actuarial modelling · Simulation",
    standfirst:
      "Mortality, survival analysis, pricing and Monte Carlo value at risk for a Sub-Saharan African book, with each step written out rather than imported.",
    spread: true,
    figures: [
      {
        src: "/figures/life-km.png",
        caption:
          "Kaplan-Meier survival by smoker status and health score, with log-rank tests across risk groups."
      },
      {
        src: "/figures/life-cox.png",
        caption:
          "Cox proportional hazards coefficients feeding the premium calculation."
      },
      {
        src: "/figures/life-var.png",
        caption:
          "Monte Carlo claims distribution over 5,000 scenarios, with the 95 and 99 percent value-at-risk points."
      }
    ],
    stats: [
      { value: "0.78", label: "Cox PH concordance, held out (0.77 in-sample)" },
      { value: "5,000", label: "Monte Carlo scenarios per run" },
      { value: "8s", label: "Full vectorised simulation" },
      { value: "10,000", label: "Synthetic policies in the book" }
    ]
  },
  {
    slug: "ayat",
    kicker: "Machine learning · Semantic search",
    standfirst:
      "6,236 texts embedded, reduced and clustered, then made searchable in the browser with no inference server behind it.",
    spread: false,
    figures: [
      {
        src: "/figures/ayat-cloud.png",
        caption:
          "The full corpus as a point cloud, positioned by semantic similarity and coloured by revelation period rather than by cluster id."
      }
    ],
    stats: [
      { value: "6,236", label: "Texts embedded and clustered" },
      { value: "22 ms", label: "Full reprojection, client side" },
      { value: "0.06", label: "Silhouette of the 2 clusters, noise fell to 1.2%" }
    ]
  },
  {
    slug: "gambia-legal-aid",
    kicker: "Retrieval-augmented generation",
    standfirst:
      "A question-answering system over Gambian statute, built so that it refuses to answer rather than guess.",
    spread: false,
    figures: [
      {
        src: "/figures/legal-aid.png",
        caption:
          "Answers are drawn only from statute the system can quote back, with the section named so a reader can check it."
      }
    ],
    stats: [
      { value: "2 layers", label: "Citation allowlist and quote validation" },
      { value: "Refuses", label: "Rather than answer outside the corpus" },
      { value: "pgvector", label: "Retrieval without a managed vector store" }
    ]
  },
  {
    slug: "dalasi-pulse",
    kicker: "Time series · Forecasting",
    standfirst:
      "A public exchange-rate and remittance forecast for The Gambia, built on 25 years of central bank data and refreshed daily.",
    spread: false,
    figures: [
      {
        src: "/figures/dalasi-forecast.png",
        caption:
          "Ten years of history and a twelve-month forecast with an 80 percent interval, per currency."
      }
    ],
    stats: [
      { value: "25 yr", label: "Daily rate history ingested" },
      { value: "5", label: "Currencies forecast" },
      { value: "Daily", label: "Automated refresh and deploy" }
    ]
  }
];

/**
 * The reading list, as citations.
 *
 * `CASE_STUDIES[].research` holds prose explaining what each source changed,
 * which is right for the site but runs to two pages here. These are the same
 * sources in citation form, which is what the printed document wants and what
 * a reader can actually go and look up.
 */
export const READING: { theme: string; items: string[] }[] = [
  {
    theme: "Mortality and population",
    items: [
      "Lee, R. and Carter, L. (1992). Modeling and forecasting US mortality.",
      "Brouhns, N., Denuit, M. and Vermunt, J. (2002). A Poisson log-bilinear regression approach to the construction of projected lifetables.",
      "Li, N. and Lee, R. (2005). Coherent mortality forecasts for a group of populations.",
      "Raftery, A. et al. (2012). Bayesian probabilistic population projections for all countries. PNAS."
    ]
  },
  {
    theme: "Generative models and synthetic data",
    items: [
      "Xu, L. et al. (2019). Modeling tabular data using conditional GAN.",
      "Gulrajani, I. et al. (2017). Improved training of Wasserstein GANs.",
      "Jordon, J. et al. (2022). Synthetic data: what, why and how?",
      "Yoon, J. et al. (2019). Time-series generative adversarial networks."
    ]
  },
  {
    theme: "Credit risk and regulation",
    items: [
      "Siddiqi, N. Credit Risk Scorecards: Developing and Implementing Intelligent Credit Scoring.",
      "Basel Committee on Banking Supervision, Pillar 1 and the internal ratings-based approach.",
      "Karakoulas, G. (2004). Population Stability Index methodology."
    ]
  },
  {
    theme: "Representation and retrieval",
    items: [
      "McInnes, L. and Healy, J. (2018). UMAP: uniform manifold approximation and projection.",
      "Retrieval-augmented generation literature on validating an answer against its context before returning it."
    ]
  }
];

/** Listed briefly at the end rather than given a case study. */
export const ALSO_BUILT: { slug: string; kicker: string; figure: string }[] = [
  { slug: "hireiq", kicker: "Applied language models", figure: "/figures/hireiq.png" },
  { slug: "vantage", kicker: "Automated pipelines", figure: "/figures/vantage.png" }
];

export const NOT_INCLUDED =
  "A few other things are on GitHub rather than in this document: client websites, coursework repositories, and a lead-response product I am building as a business. I have kept this to the work that shows the modelling and engineering side, since that is what I would want to be asked about.";
