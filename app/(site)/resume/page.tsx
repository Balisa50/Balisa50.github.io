import type { Metadata } from "next";
import Link from "next/link";
import { Github, Linkedin, ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Background",
  description:
    "Statistics undergraduate, three working papers, and eleven shipped data science and machine learning projects."
};

const PAPERS = [
  {
    year: "2026",
    title: "Site-invariant representations for cough-audio screening: removing the confound does not recover disease signal",
    summary: "Adversarial domain-invariance removed recording site from cough representations in eight of nine held-out countries (p = 0.012), but a null model using country prevalence alone beat the classifier (0.741 against 0.489). Reported as a negative result."
  },
  {
    year: "2026",
    title: "Do prediction intervals for satellite-based poverty estimates survive a national border? A pre-registered evaluation in West Africa",
    summary: "Twelve DHS surveys, 6,706 clusters, 155,796 households, with The Gambia withheld from every stage and evaluated once. Conformal coverage transfers on average, but disperses 2.8 to 4.7 times more than sampling permits for an individual country."
  },
  {
    year: "2026",
    title: "Reconstructed mortality series understate forecast uncertainty: evidence from The Gambia and thirty countries",
    summary: "Median innovation standard deviation is 2.95 where civil registration is complete and 1.02 where it is not (Mann-Whitney p < 0.0001), which accounts for prediction intervals three to five years wide against the United Nations' twenty."
  }
];

const SKILLS = [
  { group: "Programming", items: "Python, R, SQL, TypeScript, MATLAB" },
  { group: "Statistics & Modeling", items: "Statistical inference, hypothesis testing, regression, Bayesian inference (PyMC, MCMC), survival analysis, time-series forecasting, conformal prediction, Monte Carlo simulation, stochastic processes" },
  { group: "Machine Learning", items: "scikit-learn, PyTorch, deep learning, classification, clustering, dimensionality reduction, generative models, domain adaptation, feature engineering, model validation" },
  { group: "Data Analysis", items: "pandas, NumPy, SciPy, ETL pipelines, data cleaning, exploratory data analysis, data visualization, A/B testing" },
  { group: "NLP & AI", items: "Sentence embeddings, semantic search, retrieval-augmented generation (RAG), large language models, prompt design" },
  { group: "Visualization & BI", items: "Matplotlib, Seaborn, Plotly, Power BI, Tableau" },
  { group: "Tools & Deployment", items: "Git, Jupyter, FastAPI, Docker, PostgreSQL, Next.js, Streamlit, LaTeX" }
];

const EXPERIENCE = [
  {
    role: "Data Science & Machine Learning Developer",
    period: "2024 - Present",
    org: "Independent",
    place: "Remote",
    bullets: [
      "Built and deployed a portfolio of end-to-end data science and machine learning projects, each open-sourced and running in production.",
      "Work spans Bayesian forecasting, generative models for tabular data, credit scoring, survival analysis and domain adaptation.",
      "Found and corrected errors in my own published results, including a projection re-based after the 2024 census and a model whose apparent accuracy came from the train-test split."
    ]
  },
  {
    role: "Data Automation Assistant",
    period: "Mar - Jun 2024",
    org: "Lujo Heights Real Estate",
    place: "Remote, Nigeria",
    bullets: [
      "Built a lead-classification system from CRM engagement data that tagged prospects as hot, warm or cold, replacing manual sorting by the sales team.",
      "Wrote Python ETL workflows and a dashboard for tracking sales conversion."
    ]
  },
  {
    role: "Peer Tutor, Data Science and AI",
    period: "2024",
    org: "TechUp Africa",
    place: "Remote",
    bullets: [
      "Taught Python, statistics and machine learning to student groups, reviewed their code and supported them through project work."
    ]
  },
  {
    role: "Freelance Web Developer",
    period: "2026",
    org: "BS Real Estate",
    place: "The Gambia",
    bullets: [
      "Delivered a client property website with a private admin dashboard for listing management (Next.js, Prisma, PostgreSQL), end to end."
    ]
  }
];

const PROJECTS = [
  {
    name: "The Gambia 2074",
    tech: "Python, PyMC, NumPy, pandas",
    bullets: [
      "Projected national population to 2074 for a country with no death registration, using Lee-Carter mortality in classical, Bayesian Poisson and coherent multi-country forms feeding a cohort-component model.",
      "Validated the engine against the United Nations projection to within 1 percent, and backtested the mortality forecast to a mean error of 0.65 years over 13 held-out years.",
      "Found that published UN figures sit about 13 percent above the 2024 census, and re-based the projection accordingly."
    ],
    link: "/research/gambia-2074",
    linkLabel: "Read the research"
  },
  {
    name: "NOVA",
    tech: "Python, PyTorch, FastAPI, Docker, Next.js",
    bullets: [
      "Implemented a Conditional Tabular GAN from the original paper in PyTorch, including mode-specific normalization, WGAN-GP and conditional training-by-sampling.",
      "Reported statistical similarity 0.94, correlation L1 0.05, train-on-synthetic test-on-real 0.92 and a distance-to-closest-record privacy ratio of 1.10.",
      "Added a rule-based generation mode for populations with no source dataset."
    ],
    link: "/case-studies/nova",
    linkLabel: "Case study"
  },
  {
    name: "Credit Risk Scorecard",
    tech: "Python, scikit-learn, pandas",
    bullets: [
      "Built a Basel II compliant scorecard with Weight of Evidence and Information Value feature selection, logistic regression and points conversion.",
      "Ran a full validation gauntlet (Gini, KS, ROC, PSI) on a time-based holdout after finding that a random split understated population drift.",
      "Added multi-scenario stress testing for drought, currency crisis and pandemic."
    ],
    link: "/case-studies/credit-risk-scorecard",
    linkLabel: "Case study"
  }
];

const ADDITIONAL =
  "Life Insurance Risk Model (Gompertz-Makeham mortality, Cox proportional hazards, Monte Carlo value at risk); AYAT (sentence embeddings, browser-side semantic search over 6,236 texts); Gambia Legal Aid (retrieval-augmented generation over statute with citation validation); DalasiPulse (Prophet and SARIMA ensemble).";

const CERTS = [
  "Associate Data Scientist, DataCamp (2024)",
  "Data Science Career Track, DataCamp (2024)",
  "AI Ethics, DataCamp (2024)",
  "Data Science Bootcamp, Axia Africa (2024)",
  "Software Engineering, PLP Academy (2025)",
  "AI Engineering, Udemy (2026)"
];

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mt-14 mb-5 border-b border-border pb-2 font-mono text-xs uppercase tracking-[0.2em] text-cyan">
      {children}
    </h2>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3 text-[15px] leading-relaxed text-text-secondary">
      <span
        className="mt-2 inline-block h-1 w-1 shrink-0 rounded-full bg-text-faint"
        aria-hidden="true"
      />
      <span>{children}</span>
    </li>
  );
}

export default function ResumePage() {
  return (
    <main className="mx-auto w-full max-w-shell px-6 sm:px-10 py-20 md:py-24">
      <header className="mb-16 flex flex-col items-start gap-4">
        <p className="label">Background</p>
        <h1 className="display text-[clamp(2.25rem,5vw,3.75rem)]">
          Abdoulie Balisa
        </h1>
        
        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-text-secondary">
          <li className="inline-flex items-center gap-2">
            <Github className="h-3.5 w-3.5" aria-hidden="true" />
            <a
              href="https://github.com/Balisa50"
              className="link-underline text-text"
              target="_blank"
              rel="noreferrer noopener"
            >
              github.com/Balisa50
            </a>
          </li>
          <li className="inline-flex items-center gap-2">
            <Linkedin className="h-3.5 w-3.5" aria-hidden="true" />
            <a
              href="https://linkedin.com/in/abalisa"
              className="link-underline text-text"
              target="_blank"
              rel="noreferrer noopener"
            >
              linkedin.com/in/abalisa
            </a>
          </li>
        </ul>
      </header>

      <SectionHeading>Summary</SectionHeading>
      <p className="measure text-[16px] leading-relaxed text-text-secondary">
        Statistics undergraduate at KNUST and Mastercard Foundation Scholar.
        Work in data science, machine learning and statistical modeling, mainly
        in Python, R and SQL. Projects run end to end, from data pipeline to
        working interface, with validation documented as carefully as results.
        Three working papers test whether a model, or the uncertainty it
        reports, holds up when moved to a country it was never fitted on.
      </p>

      <SectionHeading>Working papers</SectionHeading>
      <p className="mb-6 text-[14px] italic text-text-faint">
        Manuscripts, unrefereed and not submitted. Full texts at{" "}
        <Link href="/papers" className="link-underline text-text">
          /papers
        </Link>
        .
      </p>
      <ol className="space-y-6">
        {PAPERS.map((p) => (
          <li key={p.title} className="border-l-2 border-cyan/30 pl-5">
            <p className="font-mono text-[10px] uppercase tracking-wider text-text-faint">
              Balisa, A. &middot; {p.year}
            </p>
            <p className="mt-1 text-[15px] font-medium leading-snug text-ink">
              {p.title}
            </p>
            <p className="mt-2 measure text-[14px] leading-relaxed text-text-secondary">
              {p.summary}
            </p>
          </li>
        ))}
      </ol>

      <SectionHeading>Technical skills</SectionHeading>
      <dl className="space-y-3">
        {SKILLS.map((s) => (
          <div
            key={s.group}
            className="grid grid-cols-1 gap-1 sm:grid-cols-[180px_1fr] sm:gap-6"
          >
            <dt className="font-mono text-[11px] uppercase tracking-wider text-text-faint sm:pt-0.5">
              {s.group}
            </dt>
            <dd className="text-[15px] leading-relaxed text-text">
              {s.items}
            </dd>
          </div>
        ))}
      </dl>

      <SectionHeading>Experience</SectionHeading>
      <div className="space-y-8">
        {EXPERIENCE.map((e) => (
          <article key={e.role + e.org}>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h3 className="text-[16px] font-medium text-ink">{e.role}</h3>
              <span className="font-mono text-[11px] text-text-faint">
                {e.period}
              </span>
            </div>
            <p className="mt-0.5 text-[14px] italic text-text-secondary">
              {e.org} &middot; {e.place}
            </p>
            <ul className="mt-2 space-y-1.5 measure">
              {e.bullets.map((b, i) => (
                <Bullet key={i}>{b}</Bullet>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <SectionHeading>Selected projects</SectionHeading>
      <div className="space-y-8">
        {PROJECTS.map((p) => (
          <article key={p.name}>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h3 className="text-[16px] font-medium text-ink">{p.name}</h3>
              <span className="font-mono text-[11px] text-text-faint">
                {p.tech}
              </span>
            </div>
            <ul className="mt-2 space-y-1.5 measure">
              {p.bullets.map((b, i) => (
                <Bullet key={i}>{b}</Bullet>
              ))}
            </ul>
            <Link
              href={p.link}
              className="mt-2 inline-flex items-center gap-1.5 text-[13px] text-text-secondary transition-colors hover:text-accent"
            >
              {p.linkLabel}
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </article>
        ))}
      </div>

      <p className="mt-6 measure text-[15px] leading-relaxed text-text-secondary">
        <span className="font-medium text-ink">Also shipped:</span>{" "}
        {ADDITIONAL}{" "}
        <Link href="/work" className="link-underline text-text">
          Full write-ups on the work page
        </Link>
        .
      </p>

      <SectionHeading>Education</SectionHeading>
      <div>
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="text-[16px] font-medium text-ink">BSc Statistics</h3>
          <span className="font-mono text-[11px] text-text-faint">
            2024 - Present
          </span>
        </div>
        <p className="mt-0.5 text-[14px] italic text-text-secondary">
          Kwame Nkrumah University of Science and Technology (KNUST) &middot;
          Kumasi, Ghana
        </p>
        <ul className="mt-2 space-y-1.5 measure">
          <Bullet>Mastercard Foundation Scholar</Bullet>
          <Bullet>
            Coursework: Probability Theory, Statistical Inference, Regression
            Analysis, Stochastic Processes, Linear Algebra, Machine Learning, R
            Programming
          </Bullet>
        </ul>
      </div>

      <SectionHeading>Certifications</SectionHeading>
      <ul className="space-y-2">
        {CERTS.map((c) => (
          <li key={c} className="text-[15px] text-text-secondary">
            {c}
          </li>
        ))}
      </ul>

      <SectionHeading>Leadership</SectionHeading>
      <div className="space-y-8">
        <article>
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h3 className="text-[16px] font-medium text-ink">
              Project Lead &amp; Technical Lead, Final Year Project
            </h3>
            <span className="font-mono text-[11px] text-text-faint">
              2026 - 2027
            </span>
          </div>
          <p className="mt-0.5 text-[14px] italic text-text-secondary">
            KNUST &middot; Kumasi, Ghana
          </p>
          <ul className="mt-2 space-y-1.5 measure">
            <Bullet>
              Leading a 4-person team building the Assumption Audit Engine, a
              statistical decision system that enforces assumption checks
              before a test is trusted, proves the consequences of violations
              through Monte Carlo simulation, and recommends the correct
              alternative when assumptions fail.
            </Bullet>
            <Bullet>
              Responsible for problem definition and scope, and for the rule
              engine that maps each supported statistical test (t-test,
              ANOVA, regression, chi-square) to its required assumptions, its
              diagnostics, and its fallback.
            </Bullet>
            <Bullet>
              Defined the scope, split the six-module build across the team,
              and selected the stack (R for diagnostics, Python for the Monte
              Carlo simulation, Streamlit for the interface).
            </Bullet>
          </ul>
        </article>

        <article>
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h3 className="text-[16px] font-medium text-ink">
              Vice President, previously Organising Secretary
            </h3>
            <span className="font-mono text-[11px] text-text-faint">
              2025 - Present
            </span>
          </div>
          <p className="mt-0.5 text-[14px] italic text-text-secondary">
            GAMTECH, Gambian Students Association at KNUST &middot; Kumasi, Ghana
          </p>
          <p className="mt-2 measure text-[15px] leading-relaxed text-text-secondary">
            Lead the executive committee, assigning portfolios and holding
            the team to its delivery dates, and plan the year&apos;s events
            including orientation for newly arrived Gambian students.
            Previously Organising Secretary, managing meetings and official
            correspondence.
          </p>
        </article>
      </div>

    </main>
  );
}
