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
}

export const PROJECTS: Project[] = [
  {
    slug: "gambia-population-projection",
    title: "The Gambia 2074",
    tagline: "An independent population forecast for The Gambia, out to 2074",
    description:
      "A research project I took on myself. The Gambia has no working death-registration system, so its future population is mostly guesswork, and the only real numbers come from the UN. Those were locked in before the country ran its first digital census in 2024, so I built my own projection to check them. It uses the Lee-Carter mortality model, the same one the UN relies on, in three versions that get steadily more careful. First the plain version, then a Bayesian one fitted with PyMC, then a coherent one that ties The Gambia to its West-African neighbours so the forecast stays sensible. All three feed a cohort-component model that I tested against the UN's own projection first, and matched to within 1 percent. My answer comes out around 4.66 million people by 2074, somewhere between 4.35 and 4.98 million. That sits about 0.7 million under the UN, because the new census shows they have been overcounting by roughly 13 percent. The work also catches the demographic dividend opening up for the country, where the total dependency ratio drops from 77 to 49 even as old-age dependency triples, from 5 to 18 per 100 working-age adults. All of it is open, and anyone can reproduce it from public data.",
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
    slug: "wingman",
    title: "Wingman",
    tagline: "An AI texting coach that reads the chat you're in and replies like a human, in your voice",
    description:
      "Screenshot a conversation, or let the browser extension read it straight off WhatsApp Web, Instagram, X, LinkedIn, Messenger, Telegram or Discord, and Wingman reads the situation itself then hands you three tonally distinct, sendable replies: playful, direct, and one genuinely sincere. The core artifact is the system prompt, engineered like a spec: an explicit kill-list of AI fingerprints the model must hunt out of its own drafts, a register map spanning flirting, grief, conflict, professional and family conversation, orientation pinning so it never answers your own message as the other person's, and a hard self-check. Named chats remember the person and the whole thread, every reply you send teaches it your texting voice, and a per-chat context (dating, work, boss, making up) drives tone and length, all in localStorage with no account. One server route holds the free NVIDIA key for both the web app and the Manifest V3 extension, whose ten per-site DOM adapters sit in front of a generic fallback for anything else.",
    tech: ["Next.js 16", "TypeScript", "NVIDIA NIM", "Chrome Extension (MV3)", "Vision OCR"],
    demo: "https://trywingman.vercel.app",
    status: "live",
    metric: "Reads 10 sites live · 3 real tones · sounds human, not AI",
    accent: "cyan",
    fallbackStars: 0,
    featured: true
  },
  {
    slug: "nova",
    title: "NOVA",
    tagline: "A synthetic-data engine for finance, from domain rules or from real data",
    description:
      "Financial institutions in West Africa hold the data that could power local AI and cannot share it; for the populations that matter most, rural borrowers and the informal economy, it often does not exist at all. NOVA answers both. In Create mode you define columns, distributions, and domain rules, rural schools score lower, a new account making a large international transfer is likely fraud, and it generates realistic data from nothing, with seven financial-domain presets or your own, behind a whitelist evaluator so user-supplied rules cannot inject code. In Copy mode a Conditional Tabular GAN I implemented from scratch in PyTorch, no SDV, learns a real dataset and generates statistically identical, privacy-safe rows. Every batch is validated four ways and the numbers are reported honestly: statistical similarity 0.94, correlation L1 0.05, train-on-synthetic-test-on-real 0.92, and distance-to-closest-record privacy 1.10 with only 1.1 percent near-duplicates. Served by a FastAPI backend on Hugging Face Spaces behind a Next.js studio on Vercel.",
    tech: ["Python", "PyTorch", "CTGAN", "FastAPI", "Next.js 16", "scikit-learn"],
    github: "https://github.com/Balisa50/nova",
    githubRepo: "Balisa50/nova",
    demo: "https://nova-fin.vercel.app",
    status: "live",
    metric: "4 metrics pass · TSTR 0.92 · 7 domains, zero-data generation",
    accent: "pink",
    fallbackStars: 0,
    featured: true
  },
  {
    slug: "forge",
    title: "FORGE",
    tagline: "Mentor-driven learning platform with proof-of-work verification",
    description:
      "A structured platform that pairs every self-taught learner 1:1 with a real human mentor and runs them through one of 13 hand-curated career roadmaps (Data Science, AI Engineering, Cybersecurity, Full-Stack and more), 12 to 43 weeks each with around 5 mastery checks a week and 385 verified video resources. The proof-of-work engine checks your progress against your real GitHub commits and deployed projects before a week counts, no self-reporting. Mentors release each week, control the pace, and sign off only when you've truly learned it; finishers earn a cryptographically signed, employer-verifiable certificate. Includes a custom Actuarial Exam P & FM mastery engine that auto-generates tiered, non-repeating SOA-style questions with interactive diagrams.",
    tech: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "NextAuth v5", "KaTeX"],
    github: "https://github.com/Balisa50/forge",
    githubRepo: "Balisa50/forge",
    demo: "https://forge-ab.vercel.app",
    status: "in-progress",
    progress: 90,
    metric: "13 roadmaps · 385 video resources · 1:1 mentors · proof-of-work",
    accent: "cyan",
    fallbackStars: 0,
    featured: true
  },
  {
    slug: "hireiq",
    title: "HireIQ",
    tagline: "AI-powered hiring platform",
    description:
      "Replaces static job application forms with intelligent AI conversational interviews. Every candidate is interviewed by an AI agent (NVIDIA-hosted open models) that follows up on weak answers; your hiring team sees ranked, scored reports and only talks to people worth their time. Full pipeline: job posting, AI question generation, adaptive follow-up, candidate scoring, PDF reports.",
    tech: ["Python", "FastAPI", "NVIDIA NIM", "Next.js 14", "Supabase", "WeasyPrint"],
    github: "https://github.com/Balisa50/hireiq",
    githubRepo: "Balisa50/hireiq",
    demo: "https://hireiq-ab.vercel.app",
    status: "in-progress",
    progress: 95,
    launchLabel: "95%, shipping soon",
    metric: "AI interviews · ranked scoring · PDF reports",
    accent: "violet",
    fallbackStars: 0,
    featured: true
  },
  {
    slug: "ayat",
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
    fallbackStars: 0,
    featured: true
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
    slug: "bs-real-estate",
    title: "BS Real Estate",
    tagline: "Website and admin CMS for a Gambian property firm",
    description:
      "A real estate site I built for a client in The Gambia, with a private admin dashboard the team uses to manage their own listings without needing a developer. Next.js 16 and Prisma 7, a blue and gold brand, admin-only login, and real data throughout rather than placeholder content. I handled it end to end, from the design to the listings dashboard to deployment.",
    tech: ["Next.js 16", "Prisma 7", "TypeScript", "Tailwind"],
    github: "https://github.com/Balisa50/bs-real-estate",
    githubRepo: "Balisa50/bs-real-estate",
    demo: "https://bs-real-estate-fawn.vercel.app/",
    status: "live",
    metric: "Client site with a self-serve admin CMS",
    accent: "cyan",
    fallbackStars: 0
  },
  {
    slug: "coldpilot",
    title: "ColdPilot",
    tagline: "Autonomous cold-outreach agent",
    description:
      "Two-mode AI agent: Hunter finds B2B leads and sends personalised outreach; Seeker applies to jobs on your behalf. Full pipeline, contact discovery via Hunter.io, Tavily company research, LLM-written emails, SMTP send with open/click tracking, RFC 2822 email threading, bounce-rate auto-pause, and automated follow-ups. Three autonomy levels: Copilot (approve each email), Supervised (watch live via SSE), Full Auto.",
    tech: ["Python", "FastAPI", "NVIDIA NIM", "Hunter.io", "Tavily", "NVIDIA NIM", "APScheduler", "Next.js 16"],
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
    metric: "Gini 0.29 · KS 0.23 · PSI 0.008",
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
