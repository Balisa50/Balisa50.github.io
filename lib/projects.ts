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
  codePrivate?: boolean;
  demo?: string;
  articleUrl?: string;
  status: ProjectStatus;
  progress?: number;
  launchLabel?: string;
  metric?: string;
  accent: "cyan" | "pink" | "violet";
  fallbackStars: number;
  featured?: boolean;
  figure?: { src: string; alt: string };
}

export const PROJECTS: Project[] = [
  {
    slug: "gambia-population-projection",
    figure: { src: "/figures/gambia-2074-projection.png", alt: "This projection reaches 4.66 million by 2074, about 0.7 million under the UN medium variant, with both anchored on the 2024 census." },
    title: "The Gambia 2074",
    tagline: "An independent population forecast for The Gambia, out to 2074",
    description:
      "The Gambia has no death-registration system, so its population figures come almost entirely from the UN, and those were set before the first digital census in 2024. This is an independent, census-based projection out to 2074. It reaches 4.66 million, about 0.7 million below the UN, with a 95 percent interval of 4.35 to 4.98 million. Run first on the UN's own inputs, the same model reproduces their published figures to within 1 percent, which is what makes the independent run worth reading. Mortality is fitted three ways (SVD Lee-Carter, a Bayesian version in PyMC, and a coherent one that pools The Gambia with its West African neighbours), each feeding a cohort-component model. Over the same period the dependency ratio falls from 77 to 49 while old-age dependency triples. Every input is public.",
    tech: ["Python", "PyMC", "MCMC", "NumPy", "Pandas", "Matplotlib"],
    github: "https://github.com/Balisa50/gambia-population-projection",
    githubRepo: "Balisa50/gambia-population-projection",
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
      "Banks in West Africa hold customer data they cannot share, and for rural borrowers and the informal economy the data was never collected in the first place. NOVA generates stand-in data two ways: from a description of the columns and their rules, or from a real dataset via a Conditional Tabular GAN written from scratch in PyTorch. Every batch passes four checks: statistical similarity 0.94, correlation L1 0.05, train-on-synthetic-test-on-real 0.92, and distance-to-closest-record 1.10 with 1.1 percent near-duplicates. The rule engine runs through a whitelist evaluator so user input cannot execute. FastAPI backend on Hugging Face Spaces, Next.js studio on Vercel.",
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
      "Lawyers in The Gambia are expensive, the statutes are scattered across PDFs most people never find, and a hallucinated answer in a legal question does real harm. This is a retrieval-augmented question-answering system over 13 Gambian Acts of Parliament. Every answer names the section it came from, and a validator checks each citation against the retrieved text before the answer ships: invented section numbers are stripped, quotation marks are only allowed around text that appears verbatim in the statute, and a claim attached to the wrong section is caught against that section's title. When the legislation store is unreachable it refuses outright rather than answering from the model's memory.",
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
      "Microfinance loan officers in West Africa make lending decisions on intuition, because the analytical infrastructure that would give them a second opinion is not there. This is a full Basel II scorecard pipeline built from scratch on 12,000 synthetic West African loans: WoE/IV feature selection, logistic regression with points conversion, and the validation gauntlet a regulator would want to see. Gini 0.27 and KS 0.21 on a later-vintage holdout sit below production thresholds, and the ceiling is set by the synthetic generator rather than the fitting: no feature clears Strong information value, so the scorecard cannot separate better than its inputs allow. Across vintages PSI stayed at 0.002 while realised defaults rose from 12.3 to 15.9 percent, because the deterioration came from a macro shock no feature measures.",
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
      "A learning platform where a week only counts once it has been proven. Each learner works through one of 13 career roadmaps with a mentor, 12 to 43 weeks long, but the engine matches the week against the learner's actual GitHub commits and deployed URLs before it registers. Nothing is self-reported. Mentors release and sign off each week, and finishers get a signed certificate an employer can check. It also carries an Actuarial Exam P and FM engine that generates tiered, non-repeating SOA-style questions with interactive diagrams.",
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
      "Application forms can't ask a follow-up when an answer is thin, so hiring teams sort through polished CVs and miss the candidates who can actually do the work. HireIQ runs a conversation instead. A model on NVIDIA-hosted open weights adapts the next question to the previous answer, and the hiring team gets a ranked, scored report per candidate. The full path is covered: posting the role, generating the questions, adapting the follow-ups, scoring, and a PDF report at the end.",
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
      "Every Qur'an app treats the book as a list of 6,236 numbered cells to scroll through, and misses the way it cross-references itself. AYAT embeds all 6,236 verses with sentence-transformers, projects them to 3D with UMAP, and renders them as a live particle galaxy in Three.js. Ask a question and the corpus physically reorganises around it, converging on an axis of meaning measured from the results themselves. Ask something it has nothing for and it says so instead of returning a plausible list. No inference server, so it runs at no cost.",
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
      "Tech news runs in the hundreds of thousands of articles a day, most of it noise. VANTAGE collects stories from six regions, writes each one up in an editorial voice, scores it by signal strength, and publishes with nobody in the loop. Startup, policy, big tech, markets and infrastructure. The score exists so the feed can be skimmed rather than read in full. Runs unattended on a single daily cron.",
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
      "Remittances are about 20 percent of The Gambia's GDP, but ordinary families have no way of knowing what the Dalasi will do next month. Dalasi Pulse forecasts the currency against major pairs and models remittance corridors, pulling live rates from the Central Bank of The Gambia JSON API alongside World Bank macro data. Six-month forecasts carry confidence intervals, and a plain-language paragraph translates the chart for anyone who does not read one.",
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
      "A property site for a Gambian client, built so their team manages their own listings without calling a developer. Private admin dashboard, admin-only login, and their real listings throughout rather than placeholder content. Next.js 16 and Prisma 7, a blue and gold brand.",
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
      "Gompertz-Makeham mortality model, Kaplan-Meier survival analysis, Cox PH (concordance 0.77), actuarial premium pricing, and Monte Carlo VaR simulation with pandemic stress testing across 5,000 scenarios. Standard actuarial models calibrated on US and UK data under-represent the constant background hazard from accidents and infectious disease that matters in Sub-Saharan Africa, so the Makeham term carries real weight here rather than being a footnote.",
    tech: ["Python", "lifelines", "NumPy", "Next.js", "Recharts"],
    github: "https://github.com/Balisa50/life-insurance-risk",
    githubRepo: "Balisa50/life-insurance-risk",
    demo: "https://life-insurance-ab.vercel.app/",
    status: "live",
    metric: "Cox PH C-index 0.77 · 5k Monte Carlo sims",
    accent: "violet",
    fallbackStars: 0,
    featured: true
  }
];


export const PROFILE = {
  name: "Balisa",
  fullName: "Abdoulie Balisa",
  title: "Statistical AI Engineer. I build forecasting, risk, and retrieval systems for African data.",
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
/*  Certifications                                                   */
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
  }
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
