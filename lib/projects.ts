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
  github: string;
  githubRepo: string; // owner/repo for API calls
  demo?: string;
  articleUrl?: string; // Read Article link (e.g. Medium post)
  status: ProjectStatus;
  progress?: number;
  launchLabel?: string;
  metric?: string;
  accent: "cyan" | "pink" | "violet";
  fallbackStars: number;
}

export const PROJECTS: Project[] = [
  {
    slug: "ayat",
    title: "AYAT",
    tagline: "6,236 Qur'anic verses as a semantic galaxy",
    description:
      "Every verse of the Qur'an embedded with sentence-transformers, projected to 3D with UMAP, clustered with HDBSCAN, and rendered as a live particle galaxy in Three.js. Colour-codes Meccan vs Medinan revelation, surfaces semantic neighbours, and pulls Claude-generated historical context for any ayah you click.",
    tech: ["Python", "sentence-transformers", "UMAP", "HDBSCAN", "Next.js 16", "Three.js", "Claude API"],
    github: "https://github.com/Balisa50/ayat",
    githubRepo: "Balisa50/ayat",
    demo: "https://ayat-ab.vercel.app/",
    status: "live",
    metric: "6,236 verses, live 3D semantic search",
    accent: "violet",
    fallbackStars: 0
  },
  {
    slug: "vantage",
    title: "VANTAGE",
    tagline: "Tech intelligence platform",
    description:
      "Real-time feed of global tech stories, synthesised and scored by AI. Covers startups, policy, big tech, markets, infrastructure and AI across six regions. Each article gets a signal score so you can skim what matters.",
    tech: ["Next.js", "TypeScript", "AI synthesis", "Vercel"],
    github: "https://github.com/Balisa50/vantage",
    githubRepo: "Balisa50/vantage",
    demo: "https://vantage-ab.vercel.app/",
    status: "live",
    metric: "Live news feed with AI scoring",
    accent: "cyan",
    fallbackStars: 0
  },
  {
    slug: "gambia-legal-aid",
    title: "Gambia Legal Aid",
    tagline: "RAG chatbot for Gambian law",
    description:
      "Retrieval-augmented chatbot answering legal questions grounded in Gambian statutes. Has a hallucination-guard pipeline that rejects answers without citation anchors in the retrieved context.",
    tech: ["Python", "RAG", "Vector search", "FastAPI", "Next.js"],
    github: "https://github.com/Balisa50/gamba-legal-aid",
    githubRepo: "Balisa50/gamba-legal-aid",
    demo: "https://gambia-legal-aid-ab.vercel.app/",
    status: "live",
    metric: "Hallucination-guarded answers",
    accent: "cyan",
    fallbackStars: 0
  },
  {
    slug: "dalasi-pulse",
    title: "Dalasi Pulse",
    tagline: "FX and remittance forecasting for The Gambia",
    description:
      "Forecasts the Dalasi against major currencies and models remittance flows. Pipelines pull live rates from the Central Bank of The Gambia JSON API plus World Bank macro data into a Next.js dashboard.",
    tech: ["Python", "Pandas", "Next.js", "CBG API", "World Bank data"],
    github: "https://github.com/Balisa50/dalasi-pulse",
    githubRepo: "Balisa50/dalasi-pulse",
    demo: "https://dalasi-ab.vercel.app/",
    status: "live",
    metric: "Live Dalasi forecast",
    accent: "pink",
    fallbackStars: 0
  },
  {
    slug: "forge",
    title: "FORGE",
    tagline: "Accountability OS for self-taught learners",
    description:
      "Daily lock-screen app that refuses to let you in until you have logged real progress. An AI interrogator grills you on what you built; only a convincing answer unlocks the machine. Streaks, PIN-locked settings, and consequence mechanisms make skipping painful.",
    tech: ["Next.js", "Prisma", "NextAuth", "OpenRouter", "TypeScript"],
    github: "https://github.com/Balisa50/forge",
    githubRepo: "Balisa50/forge",
    demo: "https://forge-ab.vercel.app",
    status: "live",
    metric: "AI interrogation · streak engine · anti-cheat",
    accent: "cyan",
    fallbackStars: 0
  },
  {
    slug: "hireiq",
    title: "HireIQ",
    tagline: "AI-powered hiring platform",
    description:
      "Replaces static job application forms with intelligent AI conversational interviews. Every candidate gets interviewed by Gemini; your hiring team sees ranked, scored reports and only talks to people worth their time. Full pipeline: job posting, AI question generation, adaptive follow-up, candidate scoring, PDF reports.",
    tech: ["Python", "FastAPI", "Gemini Flash 2.0", "Next.js 14", "Supabase", "WeasyPrint"],
    github: "https://github.com/Balisa50/hireiq",
    githubRepo: "Balisa50/hireiq",
    demo: "https://hireiq-ab.vercel.app",
    status: "in-progress",
    progress: 95,
    launchLabel: "95%, shipping soon",
    metric: "AI interviews · ranked scoring · PDF reports",
    accent: "violet",
    fallbackStars: 0
  },
  {
    slug: "coldpilot",
    title: "ColdPilot",
    tagline: "Autonomous cold-outreach agent",
    description:
      "Two-mode AI agent: Hunter finds B2B leads and sends personalised outreach; Seeker applies to jobs on your behalf. Full pipeline, contact discovery via Hunter.io, Tavily company research, Groq-written emails, SMTP send with open/click tracking, RFC 2822 email threading, bounce-rate auto-pause, and automated follow-ups. Three autonomy levels: Copilot (approve each email), Supervised (watch live via SSE), Full Auto.",
    tech: ["Python", "FastAPI", "Groq", "Hunter.io", "Tavily", "APScheduler", "SMTP", "Next.js 16"],
    github: "https://github.com/Balisa50/coldpilot",
    githubRepo: "Balisa50/coldpilot",
    demo: "https://coldpilot-ab.vercel.app",
    status: "in-progress",
    progress: 80,
    launchLabel: "80%, v2 coming",
    metric: "Hunter · Seeker · 3 autonomy levels",
    accent: "pink",
    fallbackStars: 0
  },
  {
    slug: "formly",
    title: "Formly",
    tagline: "AI agent that fills any web form for you",
    description:
      "Paste a URL, Formly opens the form in a headless browser, reads every field (including React Select dropdowns, ATS iframes like Workday and Greenhouse, file uploads, date pickers, and multi-page flows), matches your stored profile via Groq, asks only for what it can't infer, then fills and submits. Returns a screenshot and per-field audit trail.",
    tech: ["Python", "Playwright", "Groq", "FastAPI", "Docker", "Next.js 16"],
    github: "https://github.com/Balisa50/formly",
    githubRepo: "Balisa50/formly",
    status: "in-progress",
    progress: 70,
    launchLabel: "In development",
    metric: "ATS iframes · React Select · multi-page forms",
    accent: "violet",
    fallbackStars: 0
  },
  {
    slug: "credit-risk-scorecard",
    title: "Credit Risk Scorecard",
    tagline: "Basel II scorecard for West African microfinance",
    description:
      "Full credit scoring pipeline: WoE/IV feature selection, logistic regression with Basel II points conversion, Gini/KS/PSI validation, and multi-scenario stress testing. Built on 12,000 synthetic West African microfinance loans.",
    tech: ["Python", "scikit-learn", "Pandas", "Next.js", "Recharts"],
    github: "https://github.com/Balisa50/credit-risk-scorecard",
    githubRepo: "Balisa50/credit-risk-scorecard",
    demo: "https://credit-risk-ab.vercel.app/",
    status: "live",
    metric: "Gini 0.56 · KS 0.42",
    accent: "pink",
    fallbackStars: 0
  },
  {
    slug: "life-insurance-risk",
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
  },
  {
    slug: "global-restaurant-analytics",
    title: "Global Restaurant Analytics",
    tagline: "Customer satisfaction drivers in world food service",
    description:
      "Analysed 21 variables across a global restaurant dataset to identify key drivers of customer satisfaction. Built predictive models for restaurant performance forecasting and presented findings through comprehensive visualisations.",
    tech: ["Python", "Pandas", "Matplotlib", "Seaborn"],
    github: "https://github.com/Balisa50/global-restaurant-analytics",
    githubRepo: "Balisa50/global-restaurant-analytics",
    articleUrl: "https://medium.com/@abdouliebalisa904/what-restaurant-data-from-around-the-world-tells-us-about-food-service-and-customer-ratings-4eead0ce8a22",
    status: "live",
    metric: "21 variables · customer satisfaction drivers",
    accent: "cyan",
    fallbackStars: 0
  }
];

export const PROFILE = {
  name: "Balisa",
  fullName: "Abdoulie Balisa",
  title: "AI Systems Developer · Data Science Student · Aspiring Actuary",
  email: "[redacted, use the contact form]",
  phone: "[redacted, use the contact form]",
  github: "https://github.com/Balisa50",
  githubHandle: "Balisa50",
  linkedin: "https://www.linkedin.com/in/abalisa",
  linkedinHandle: "abalisa",
  location: "Fajikunda, The Gambia",
  tagline: "Building AI systems I actually ship, not slides."
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
      "Shipped VANTAGE, Gambia Legal Aid, Dalasi Pulse, FORGE, ColdPilot, and AYAT, six production AI products end to end.",
      "Open-sourcing tooling around RAG, agentic pipelines, and forecasting on the Dalasi."
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
