/**
 * Working papers.
 *
 * These are manuscripts, not publications. None has been submitted to a venue
 * and none is peer reviewed, and the UI says so on every entry rather than in a
 * footnote. Listing unrefereed work as though it were published is the fastest
 * way to lose the trust of the exact readers this section exists for.
 *
 * The PDFs in `public/papers/` are copies. Each one's canonical source is the
 * LaTeX or HTML in the project repository named below, so a paper that changes
 * there has to be re-copied here; they are not built from this site.
 */

export interface Paper {
  slug: string;
  title: string;
  /** What the paper actually establishes, in one sentence. No abstract prose. */
  finding: string;
  summary: string;
  year: number;
  /** Path under public/. */
  pdf: string;
  pages: number;
  repo?: string;
  /** The repository is private, so `repo` must not render as a link. */
  repoPrivate?: boolean;
  /** A long-form readable version on this site, where one exists. */
  articleUrl?: string;
  methods: string[];
  /** Shown as a small badge. Registered analyses and nulls both earn one. */
  badges?: string[];
}

/**
 * Ordered newest first. All three ask the same question of different data:
 * does a model, or the uncertainty it reports, survive being moved to a country
 * it was not fitted on.
 */
export const PAPERS: Paper[] = [
  {
    slug: "site-invariant-cough-screening",
    title:
      "Site-invariant representations for cough-audio screening: removing the confound does not recover disease signal",
    finding:
      "Adversarial training removes the recording site from cough representations, and disease accuracy does not improve, because predicting a country's base rate already beats listening to the cough.",
    summary:
      "Cough classifiers for respiratory disease report strong accuracy and fail at new clinics. Published work traces this to representations that organise by recording device rather than by disease, and notes that device-diverse training helps without isolating or auditing the mechanism. This implements the correction: randomised device simulation plus an adversarial site head with gradient reversal, audited by a probe trained on frozen features to recover the site, so invariance is measured rather than assumed. Across nine countries under leave-one-country-out, probe leakage falls from 0.018 to zero in eight of nine folds (p = 0.012), while disease AUC does not move (0.464 to 0.489, p = 0.359). A null model that discards the audio and predicts each country's base rate scores 0.741, above every fold measured. The mechanism works; this corpus has no cross-country signal for it to preserve.",
    year: 2026,
    pdf: "/papers/site-invariant-cough-screening.pdf",
    pages: 8,
    repo: "https://github.com/Balisa50/cough-tb-invariance",
    methods: ["PyTorch", "Domain adversarial training", "Gradient reversal", "Leave-one-country-out", "COUGHVID"],
    badges: ["Negative result", "Code available"]
  },
  {
    slug: "poverty-interval-transfer",
    title:
      "Do prediction intervals for satellite-based poverty estimates survive a national border? A pre-registered evaluation in West Africa",
    finding:
      "Conformal intervals for satellite wealth models transfer on average and not for any individual country, dispersing 2.8 to 4.7 times more than sampling permits, which makes the average the wrong summary.",
    summary:
      "Satellite models of household wealth are trained on survey clusters from one set of countries and applied to countries with no survey at all, so their reported accuracy is measured under conditions that do not match how they are used. Twelve West African DHS surveys (6,706 clusters, 155,796 households) with The Gambia withheld from every stage and evaluated once against a threshold registered in advance. Four hypotheses were stated before analysis and none was supported: accuracy fell about three per cent across a border rather than the predicted third, and a nominal 90 per cent interval covered 89.3 per cent of Gambian clusters. The result that matters is the dispersion. Coverage for an individual country ranges from 0.821 to 0.979 at nominal 90 per cent, and nothing observable in advance separates the cases. Intervals are least trustworthy where they are narrowest.",
    year: 2026,
    pdf: "/papers/poverty-interval-transfer.pdf",
    pages: 17,
    repo: "https://github.com/Balisa50/gambia-poverty-transfer",
    methods: ["Conformal prediction", "Spatial blocking", "Pre-registration", "DHS", "Geospatial covariates"],
    badges: ["Pre-registered", "Hypotheses not supported"]
  },
  {
    slug: "reconstructed-mortality-uncertainty",
    title:
      "Reconstructed mortality series understate forecast uncertainty: evidence from The Gambia and thirty countries",
    finding:
      "Mortality forecasts for countries without death registration report intervals three to five years wide against the UN's twenty, and the gap traces to reconstruction smoothing away the variation the model estimates its uncertainty from.",
    summary:
      "Lee-Carter in classical, Bayesian Poisson and coherent Li-Lee forms all place Gambian life expectancy in 2074 inside an interval far narrower than the United Nations reports. Three explanations are tested and the first two rejected: propagating disagreement between successive WPP revisions widens the interval by at most six per cent, and drift estimated on rolling windows varies no more than its own standard error. The absence of a long-run asymptote accounts for roughly fourteen per cent. The residual is multiplicative and independent of horizon, pointing at the innovation standard deviation. Across thirty countries the median is 2.95 where civil registration is complete and 1.02 where it is not; The Gambia sits at 1.02. A normalisation-invariant comparison gives a smaller separation, so the effect is bounded rather than pinned, and the country groups also differ in income and age structure.",
    year: 2026,
    pdf: "/papers/reconstructed-mortality-uncertainty.pdf",
    pages: 11,
    repo: "https://github.com/Balisa50/gambia-population-projection",
    repoPrivate: true,
    articleUrl: "/research/gambia-2074",
    methods: ["Lee-Carter", "PyMC", "Li-Lee coherent", "Mann-Whitney", "Cohort-component"],
    badges: ["Thirty-country comparison"]
  }
];
