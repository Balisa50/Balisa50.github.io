/**
 * Canonical project list. Single source of truth for the grid, status API,
 * and roadmap easter egg.
 */
export type ProjectStatus = "live" | "in-progress" | "planning";

export interface Project {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  tech: string[];
  github?: string;
  githubRepo?: string; // owner/repo for API calls
  /**
   * The repository exists but is not public, so `github` must not render as a
   * link. Verified against the GitHub API on 2026-08-13: five of the twelve
   * linked repos were private, so a reader clicking through got a 404 on work
   * that does exist. Saying "private" is honest; a dead link reads as a
   * project that was never really built.
   */
  codePrivate?: boolean;
  demo?: string;
  articleUrl?: string; // Read Article link (e.g. Medium post)
  status: ProjectStatus;
  progress?: number;
  launchLabel?: string;
  metric?: string;
  accent: "cyan" | "pink" | "violet";
  fallbackStars: number;
  /** Lead entries get the full case-study row treatment in the editorial layout. */
  featured?: boolean;
  /**
   * A real output from the project: a chart, a report, a screen. These already
   * existed for the print portfolio and were sitting unused on the site, which
   * is why the homepage read as a wall of text. A figure earns its place by
   * showing a result, so projects without one simply run text-only rather than
   * getting a decorative stand-in.
   */
  figure?: { src: string; alt: string };
}

export const PROJECTS: Project[] = [
  {
    slug: "gambia-population-projection",
    figure: { src: "/figures/gambia-2074-projection.png", alt: "This projection reaches 4.66 million by 2074, about 0.7 million under the UN medium variant, with both anchored on the 2024 census." },
    title: "The Gambia 2074",
    tagline: "An independent population forecast for The Gambia, out to 2074",
    description:
      "The Gambia has no working death-registration system, so its population figures come almost entirely from the UN, and those were set before the first digital census in 2024. Mortality is fitted with Lee-Carter in three forms: the standard SVD fit, a Bayesian one in PyMC, and a coherent one that pools The Gambia with its West African neighbours. Each feeds a cohort-component model. Run first on the UN's own inputs, that model reproduces their published figures to within 1 percent, which is what makes the independent run worth reading. Re-based on the census it gives 4.66 million by 2074, with a 95 percent interval of 4.35 to 4.98 million. That is about 0.7 million below the UN, whose base sits roughly 13 percent above the census count. Over the same period total dependency falls from 77 to 49 per 100 working-age adults while old-age dependency rises from 5 to 18. Every input is public.",
    tech: ["Python", "PyMC", "MCMC", "NumPy", "Pandas", "Matplotlib"],
    github: "https://github.com/Balisa50/gambia-population-projection",
    githubRepo: "Balisa50/gambia-population-projection",
    codePrivate: true,
    articleUrl: "https://balisa50.github.io/research/gambia-2074",
    status: "live",
    metric: "~4.66M by 2074 (4.35 to 4.98M), within 1% of the UN",
    accent: "violet",
    fallbackStars: 0,
    featured: true
  },
  {
    slug: "nova",
    figure: { src: "/figures/nova-quality.png", alt: "The four steps from describing your columns to downloading the CSV, and the four checks every batch has to pass." },
    title: "NOVA",
    tagline: "A synthetic-data engine for finance, from domain rules or from real data",
    description:
      "Banks in West Africa hold customer data they are not allowed to share, and for rural borrowers and the informal economy much of it was never collected in the first place. NOVA generates stand-in data two ways. In Create mode you set the columns, distributions and rules, such as a new account making a large international transfer being likely fraud, and it builds records from nothing, using seven financial presets or your own. Rules run through a whitelist evaluator, so what a user types cannot execute. In Copy mode a Conditional Tabular GAN, written from scratch in PyTorch rather than pulled from SDV, learns an existing dataset and produces rows that match its structure without copying anyone. Each batch is checked four ways: statistical similarity 0.94, correlation L1 0.05, train-on-synthetic-test-on-real 0.92, and distance-to-closest-record 1.10, with 1.1 percent near-duplicates. FastAPI backend on Hugging Face Spaces, Next.js front end on Vercel.",
    tech: ["Python", "PyTorch", "CTGAN", "FastAPI", "Next.js 16", "scikit-learn"],
    github: "https://github.com/Balisa50/nova",
    githubRepo: "Balisa50/nova",
    demo: "https://nova-fin.vercel.app",
    status: "live",
    metric: "TSTR 0.92 · 4 checks pass · 7 domains, no source data needed",
    accent: "pink",
    fallbackStars: 0,
    featured: true
  },
  {
    slug: "gambia-legal-aid",
    figure: { src: "/figures/legal-aid.png", alt: "Ask in plain English and the answer names the Act and section it came from." },
    title: "Gambia Legal Aid",
    tagline: "RAG chatbot for Gambian law",
    description:
      "A question-answering system over 13 Gambian Acts of Parliament. Every answer names the section it came from. A validator checks each citation against the retrieved text before the answer ships: invented section numbers are stripped, quotation marks are only allowed around text that appears verbatim in the statute, and a claim attached to the wrong section is caught by comparing it against that section title. When the legislation store is unreachable it refuses outright rather than answering from the model's memory, and the provider chain falls through to a second model so a retired model id degrades the answer instead of ending the conversation.",
    tech: ["Python", "RAG", "Vector search", "FastAPI", "Next.js"],
    github: "https://github.com/Balisa50/gamba-legal-aid",
    githubRepo: "Balisa50/gamba-legal-aid",
    codePrivate: true,
    demo: "https://gambia-legal-aid-ab.vercel.app/",
    status: "live",
    metric: "Cites the section, or refuses. 13 Acts, validated before it answers",
    accent: "cyan",
    fallbackStars: 0,
    featured: true
  },
  {
    slug: "credit-risk-scorecard",
    figure: { src: "/figures/credit-discrimination.png", alt: "The scorecard dashboard: portfolio summary with Gini and KS reported on the test book, above the Information Value table that drives feature selection." },
    title: "Credit Risk Scorecard",
    tagline: "Basel II scorecard for West African microfinance",
    description:
      "Full credit scoring pipeline: WoE/IV feature selection, logistic regression with Basel II points conversion, Gini/KS/PSI validation, and multi-scenario stress testing. Built on 12,000 synthetic West African microfinance loans.",
    tech: ["Python", "scikit-learn", "Pandas", "Next.js", "Recharts"],
    github: "https://github.com/Balisa50/credit-risk-scorecard",
    githubRepo: "Balisa50/credit-risk-scorecard",
    demo: "https://credit-risk-ab.vercel.app/",
    status: "live",
    metric: "Gini 0.27 · KS 0.21 on a later-vintage holdout · PSI 0.002 while defaults rose a third",
    accent: "pink",
    fallbackStars: 0,
    featured: true
  },
  {
    slug: "forge",
    figure: { src: "/figures/forge.png", alt: "The FORGE landing page: commit to a schedule, then prove the work with real commits and a deployed URL." },
    title: "FORGE",
    tagline: "Mentor-driven learning platform with proof-of-work verification",
    description:
      "A learning platform where each learner works through one of 13 career roadmaps with a mentor: data science, AI engineering, cybersecurity, full-stack and others, 12 to 43 weeks each, with about five mastery checks a week and 385 video resources. A week only counts once the engine has matched it against the learner's actual GitHub commits and deployed URLs, so nothing is self-reported. Mentors release each week and sign it off, and finishers get a signed certificate an employer can check. It also carries an Actuarial Exam P and FM engine that generates tiered, non-repeating SOA-style questions with interactive diagrams.",
    tech: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "NextAuth v5", "KaTeX"],
    github: "https://github.com/Balisa50/forge",
    githubRepo: "Balisa50/forge",
    demo: "https://forge-ab.vercel.app",
    status: "in-progress",
    progress: 90,
    metric: "13 roadmaps · 385 video resources · 1:1 mentors · proof-of-work",
    accent: "cyan",
    fallbackStars: 0
  },
  {
    slug: "hireiq",
    figure: { src: "/figures/hireiq.png", alt: "The hiring dashboard with ranked, scored candidates." },
    title: "HireIQ",
    tagline: "A conversation in place of an application form",
    description:
      "Candidates answer in a conversation rather than a form. Each interview is run by a model on NVIDIA-hosted open weights that asks a follow-up when an answer is thin, and the hiring team gets a ranked, scored report per candidate. It covers the whole path: posting the role, generating the questions, adapting the follow-ups, scoring, and a PDF report at the end.",
    tech: ["Python", "FastAPI", "NVIDIA NIM", "Next.js 14", "Supabase", "WeasyPrint"],
    github: "https://github.com/Balisa50/hireiq",
    githubRepo: "Balisa50/hireiq",
    demo: "https://hireiq-ab.vercel.app",
    status: "in-progress",
    progress: 95,
    launchLabel: "95%, shipping soon",
    metric: "Conversational interviews · ranked scoring · PDF reports",
    accent: "violet",
    fallbackStars: 0
  },
  {
    slug: "ayat",
    figure: { src: "/figures/ayat-cloud.png", alt: "6,236 texts embedded and positioned by semantic similarity, coloured by revelation period." },
    title: "AYAT",
    tagline: "A Qur'an that rearranges itself around your question",
    description:
      "All 6,236 verses embedded with sentence-transformers, projected to 3D with UMAP and rendered as a live particle galaxy in Three.js. Ask a question and the corpus physically reorganises: the query is embedded in the browser, verses converge on an axis of meaning measured from the results themselves, and the rest opens outward. Ask something it has nothing for and it says so instead of returning a plausible list. No inference server, so it costs nothing to run.",
    tech: ["Python", "sentence-transformers", "UMAP", "HDBSCAN", "transformers.js", "Next.js 16", "Three.js", "LLM API"],
    github: "https://github.com/Balisa50/ayat",
    githubRepo: "Balisa50/ayat",
    demo: "https://ayat-ab.vercel.app/",
    status: "live",
    metric: "6,236 verses reprojected in 22ms, fully client-side",
    accent: "violet",
    fallbackStars: 0
  },
  {
    slug: "vantage",
    figure: { src: "/figures/vantage.png", alt: "The daily technology brief the pipeline produces unattended." },
    title: "VANTAGE",
    tagline: "A technology brief that assembles itself",
    description:
      "Collects technology stories from six regions, writes each one up and scores it, then publishes with nobody in the loop. Covers startups, policy, big tech, markets and infrastructure. The score exists so you can skim the feed instead of reading all of it.",
    tech: ["Next.js", "TypeScript", "AI synthesis", "Vercel"],
    github: "https://github.com/Balisa50/vantage",
    githubRepo: "Balisa50/vantage",
    demo: "https://vantage-ab.vercel.app/",
    status: "live",
    metric: "Runs unattended · every story scored",
    accent: "cyan",
    fallbackStars: 0
  },
  {
    slug: "dalasi-pulse",
    figure: { src: "/figures/dalasi-forecast.png", alt: "Dalasi exchange-rate forecast with the confidence band around it." },
    title: "Dalasi Pulse",
    tagline: "FX and remittance forecasting for The Gambia",
    description:
      "Forecasts the Dalasi against major currencies and models remittance flows. Pipelines pull live rates from the Central Bank of The Gambia JSON API plus World Bank macro data into a Next.js dashboard.",
    tech: ["Python", "Pandas", "Next.js", "CBG API", "World Bank data"],
    github: "https://github.com/Balisa50/dalasi-pulse",
    githubRepo: "Balisa50/dalasi-pulse",
    codePrivate: true,
    demo: "https://dalasi-ab.vercel.app/",
    status: "live",
    metric: "Live Dalasi forecast",
    accent: "pink",
    fallbackStars: 0
  },
  {
    slug: "bs-real-estate",
    title: "BS Real Estate",
    tagline: "Website and admin CMS for a Gambian property firm",
    description:
      "A property site for a client in The Gambia, with a private dashboard the team uses to manage their own listings without calling a developer. Next.js 16 and Prisma 7, a blue and gold brand, admin-only login, and their real listings throughout rather than placeholder content.",
    tech: ["Next.js 16", "Prisma 7", "TypeScript", "Tailwind"],
    github: "https://github.com/Balisa50/bs-real-estate",
    githubRepo: "Balisa50/bs-real-estate",
    codePrivate: true,
    demo: "https://bs-real-estate-fawn.vercel.app/",
    status: "live",
    metric: "Client site with a self-serve admin CMS",
    accent: "cyan",
    fallbackStars: 0
  },
  {
    slug: "life-insurance-risk",
    figure: { src: "/figures/life-var.png", alt: "Monte Carlo claims distribution over 5,000 scenarios with the 95 and 99 percent value-at-risk points." },
    title: "Life Insurance Risk Model",
    tagline: "Actuarial risk model for Sub-Saharan Africa",
    description:
      "Gompertz-Makeham mortality model, Kaplan-Meier survival analysis, Cox PH (concordance 0.77), actuarial premium pricing, and Monte Carlo VaR simulation with pandemic stress testing across 5,000 scenarios.",
    tech: ["Python", "lifelines", "NumPy", "Next.js", "Recharts"],
    github: "https://github.com/Balisa50/life-insurance-risk",
    githubRepo: "Balisa50/life-insurance-risk",
    demo: "https://life-insurance-ab.vercel.app/",
    status: "live",
    metric: "Cox PH C-index 0.77 · 5k Monte Carlo sims",
    accent: "violet",
    fallbackStars: 0
  }
];

export const PROFILE = {
  name: "Balisa",
  fullName: "Abdoulie Balisa",
  title: "AI Systems Developer · Data Science Student · Aspiring Actuary",
  // The email is back, deliberately. It was removed once because a static page
  // hands an address to any scraper that asks, and that is still true. The
  // trade was worse: with no form key configured the contact section pointed at
  // LinkedIn and nothing else, so the only way to reach me was through an
  // account not everyone has. A public address I can filter beats a wall.
  //
  // The PHONE NUMBER stays absent. That one cannot be taken back once indexed.
  email: "abdouliebalisa904@gmail.com",
  github: "https://github.com/Balisa50",
  githubHandle: "Balisa50",
  linkedin: "https://www.linkedin.com/in/abalisa",
  linkedinHandle: "abalisa",
  location: "Fajikunda, The Gambia",
  tagline: "Retrieval and forecasting systems, and the checks around them."
} as const;

/* ----------------------------------------------------------------- */
/*  Skills - grouped for the skills section                          */
/* ----------------------------------------------------------------- */

export interface SkillGroup {
  title: string;
  items: string[];
}

export const SKILLS: SkillGroup[] = [
  {
    title: "AI & LLMs",
    items: [
      "Agentic systems",
      "LLM integration",
      "Prompt engineering",
      "Fine-tuning",
      "RAG pipelines",
      "ML engineering"
    ]
  },
  {
    title: "AI Software Engineering",
    items: [
      "Python + FastAPI",
      "TypeScript + Next.js",
      "Tailwind, React",
      "Prisma, Postgres, SQLite",
      "Playwright, SSE, Docker"
    ]
  },
  {
    title: "Data Science",
    items: [
      "Pandas, NumPy, scikit-learn",
      "Feature engineering",
      "Time-series & forecasting",
      "Plotly, Matplotlib",
      "SQL, ETL"
    ]
  },
  {
    title: "Statistics & Actuarial",
    items: [
      "Probability & inference",
      "Regression analysis",
      "Statistical modelling in R",
      "Actuarial science (learning)",
      "Survival + risk modelling (learning)"
    ]
  }
];

/* ----------------------------------------------------------------- */
/*  Certifications - add entries below (name, issuer, date, url)     */
/* ----------------------------------------------------------------- */

export interface Certificate {
  name: string;
  issuer: string;
  date?: string;
  credentialUrl?: string;
  category: "ai" | "data" | "software" | "other";
}

export const CERTIFICATES: Certificate[] = [
  {
    name: "Software Engineering",
    issuer: "PLP Academy",
    date: "2026",
    credentialUrl: "/certs/SOFTWARE ENGINEER - PLP ACADEMY.pdf",
    category: "software"
  },
  {
    name: "AI Engineering",
    issuer: "Udemy",
    date: "2026",
    credentialUrl: "/certs/UDEMY -AI ENGINEERING.jpg",
    category: "ai"
  },
  {
    name: "Prompt Engineering",
    issuer: "DataCamp",
    date: "2024",
    credentialUrl: "/certs/Prompt Engineering-Datacamp.pdf",
    category: "ai"
  },
  {
    name: "Data Science Bootcamp",
    issuer: "Axia Africa",
    date: "2024",
    credentialUrl: "/certs/DATA SCIENCE - AXIA AFRICA.pdf",
    category: "data"
  },
  {
    name: "Associate Data Scientist",
    issuer: "DataCamp",
    date: "2024",
    category: "data"
  },
  {
    name: "Data Science Career Track",
    issuer: "DataCamp",
    date: "2024",
    category: "data"
  },
  {
    name: "AI Ethics",
    issuer: "DataCamp",
    date: "2024",
    category: "ai"
  },
  {
    name: "Frontend Engineering Bootcamp",
    issuer: "Techy Jaunt",
    date: "2023",
    category: "software"
  },
  {
    name: "Peer Tutor Certification",
    issuer: "TechUp Africa",
    date: "2024",
    category: "other"
  }
];

/* ----------------------------------------------------------------- */
/*  Experience                                                       */
/* ----------------------------------------------------------------- */

export interface Experience {
  company: string;
  role: string;
  period: string;
  location?: string;
  bullets: string[];
}

export const EXPERIENCE: Experience[] = [
  {
    company: "Independent",
    role: "AI Systems Developer · Data Science Student",
    period: "2024 - present",
    location: "Remote",
    bullets: [
      "Building production AI products end to end: ingestion, modelling, orchestration, and the UIs on top.",
      "Shipped VANTAGE, Gambia Legal Aid, Dalasi Pulse, FORGE, ColdPilot, and AYAT. Six production products built end to end, spanning AI agents, forecasting, and RAG systems.",
      "Open-sourcing tooling around RAG, agentic pipelines, and forecasting on the Dalasi."
    ]
  },
  {
    company: "BS Real Estate",
    role: "Freelance Web Developer",
    period: "Jun 2026 · contract",
    location: "The Gambia",
    bullets: [
      "Built a real estate website with a private admin dashboard for a property firm in The Gambia, so the team manages their own listings without touching code.",
      "Next.js 16 and Prisma 7, a blue and gold brand, admin-only login, and real data throughout, no placeholder content.",
      "Delivered the whole thing end to end: the design, the listings dashboard, and the deployment."
    ]
  },
  {
    company: "TechUp Africa",
    role: "Peer Tutor",
    period: "2024",
    location: "Remote",
    bullets: [
      "Mentored learners through the data science curriculum: Python, pandas, statistics, and project reviews.",
      "Ran code-review sessions and helped unblock learners on ML fundamentals."
    ]
  },
  {
    company: "Lujo Heights Real Estate",
    role: "AI Automation Developer",
    period: "Mar 2024 · 3-week contract",
    location: "Remote · Nigeria",
    bullets: [
      "Short-term engagement to automate their manual lead pipeline, built a Python script that pulled CRM data and tagged prospects as Hot, Warm, or Cold based on engagement signals.",
      "Wired up n8n workflows to route leads automatically so the sales team stopped doing it by hand.",
      "Left them with a working system and a brief doc, done in three weeks, no ongoing dependency."
    ]
  },
];

/* ----------------------------------------------------------------- */
/*  Education                                                        */
/* ----------------------------------------------------------------- */

export interface Education {
  institution: string;
  degree: string;
  field: string;
  period: string;
  location: string;
  coursework?: string[];
}

export const EDUCATION: Education[] = [
  {
    institution: "Kwame Nkrumah University of Science and Technology (KNUST)",
    degree: "BSc",
    field: "Statistics",
    period: "2022 - present",
    location: "Kumasi, Ghana",
    coursework: [
      "Probability Theory",
      "Statistical Inference",
      "Regression Analysis",
      "Linear Algebra",
      "Stochastic Processes",
      "R programming"
    ]
  }
];
