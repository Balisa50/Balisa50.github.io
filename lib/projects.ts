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
  status: ProjectStatus;
  progress?: number;
  launchLabel?: string;
  metric?: string;
  accent: "cyan" | "pink" | "violet";
  fallbackStars: number;
}

export const PROJECTS: Project[] = [
  {
    slug: "vantage",
    title: "VANTAGE",
    tagline: "Tech intelligence platform",
    description:
      "Real-time feed of global tech stories, synthesised and scored by AI. Covers startups, policy, big tech, markets, infrastructure and AI across six regions. Each article gets a signal score so you can skim what matters.",
    tech: ["Next.js", "TypeScript", "AI synthesis", "Vercel"],
    github: "https://github.com/Balisa50/vantage",
    githubRepo: "Balisa50/vantage",
    demo: "https://vantage-three-chi.vercel.app/",
    status: "live",
    metric: "Live news feed with AI scoring",
    accent: "cyan",
    fallbackStars: 0
  },
  {
    slug: "gambia-legal-aid",
    title: "Gamba Legal Aid",
    tagline: "RAG chatbot for Gambian law",
    description:
      "Retrieval-augmented chatbot answering legal questions grounded in Gambian statutes. Has a hallucination-guard pipeline that rejects answers without citation anchors in the retrieved context.",
    tech: ["Python", "RAG", "Vector search", "FastAPI", "Next.js"],
    github: "https://github.com/Balisa50/gamba-legal-aid",
    githubRepo: "Balisa50/gamba-legal-aid",
    demo: "https://gamba-legal-aid.vercel.app/",
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
    demo: "https://dalasi-pulse.vercel.app/",
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
    tech: ["Next.js", "Prisma", "NextAuth", "HuggingFace API", "TypeScript"],
    github: "https://github.com/Balisa50/forge",
    githubRepo: "Balisa50/forge",
    status: "in-progress",
    progress: 80,
    launchLabel: "Deploying soon",
    accent: "cyan",
    fallbackStars: 0
  },
  {
    slug: "coldpilot",
    title: "ColdPilot",
    tagline: "Autonomous cold-outreach agent",
    description:
      "Two-mode agent (Hunter for B2B, Seeker for job apps) that finds contacts, researches the target, writes personalised emails, sends, and follows up. Pipeline goes contact_finder, researcher, email_writer, sender, follow-up.",
    tech: ["Python", "FastAPI", "Groq", "Hunter.io", "SMTP", "SQLite"],
    github: "https://github.com/Balisa50/coldpilot",
    githubRepo: "Balisa50/coldpilot",
    status: "in-progress",
    progress: 60,
    launchLabel: "In progress",
    accent: "pink",
    fallbackStars: 0
  },
  {
    slug: "formly",
    title: "Formly",
    tagline: "AI form-filling agent",
    description:
      "Reads any web form (React Select dropdowns, file uploads, conditional fields) and fills it on your behalf. A Groq-backed LLM produces answers from your profile; Playwright drives the browser to submit.",
    tech: ["Python", "Playwright", "Groq", "FastAPI", "Docker"],
    github: "https://github.com/Balisa50/formly",
    githubRepo: "Balisa50/formly",
    status: "in-progress",
    progress: 50,
    launchLabel: "In active iteration",
    accent: "violet",
    fallbackStars: 0
  }
];

export const PROFILE = {
  name: "Balisa",
  fullName: "Abdoulie Balisa",
  title: "Data Scientist · AI Engineer · Aspiring Actuary",
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
    role: "ML / AI Engineer · Data Scientist",
    period: "2024 - present",
    location: "Remote",
    bullets: [
      "Building production AI products end to end: ingestion, modelling, orchestration, and the UIs on top.",
      "Shipped VANTAGE, Gamba Legal Aid, and Dalasi Pulse. FORGE, ColdPilot, and Formly in active development.",
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
    role: "Data Analyst",
    period: "Mar 2024 - Jun 2024",
    location: "The Gambia",
    bullets: [
      "Cleaned and analysed listing and client data to surface conversion and pricing insights.",
      "Built dashboards for the sales team to track pipeline and performance."
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
