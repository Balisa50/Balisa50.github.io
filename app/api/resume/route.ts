import { NextResponse } from "next/server";
import { PROFILE, PROJECTS } from "@/lib/projects";

export const dynamic = "force-static";
export const revalidate = 86400;

export async function GET() {
  const resume = {
    schema: "https://jsonresume.org/schema/",
    meta: {
      version: "1.0.0",
      lastModified: new Date().toISOString(),
      canonical: "https://balisa.dev/api/resume"
    },
    basics: {
      name: PROFILE.fullName,
      label: PROFILE.title,
      email: PROFILE.email,
      url: "https://balisa.dev",
      summary:
        "ML/AI engineer and data scientist. Self-taught, shipping real products end-to-end: RAG, agentic pipelines, forecasting models, and polished Next.js front-ends. Comfortable across Python, TypeScript, and the infra that glues them.",
      location: { city: "Fajikunda", countryCode: "GM", region: "Remote" },
      profiles: [
        {
          network: "GitHub",
          username: PROFILE.githubHandle,
          url: PROFILE.github
        },
        {
          network: "LinkedIn",
          username: PROFILE.linkedinHandle,
          url: PROFILE.linkedin
        }
      ]
    },
    skills: [
      {
        name: "Machine Learning",
        keywords: ["PyTorch", "TensorFlow", "HuggingFace", "scikit-learn", "fine-tuning", "RAG"]
      },
      {
        name: "Backend",
        keywords: ["Python", "FastAPI", "Node.js", "PostgreSQL", "Redis", "Prisma"]
      },
      {
        name: "Frontend",
        keywords: ["TypeScript", "React", "Next.js 15", "Tailwind", "Three.js"]
      },
      {
        name: "Infra",
        keywords: ["Vercel", "Docker", "GitHub Actions", "WebAssembly"]
      }
    ],
    projects: PROJECTS.map((p) => ({
      name: p.title,
      description: p.description,
      highlights: [p.tagline, p.metric].filter(Boolean),
      keywords: p.tech,
      url: p.demo ?? p.github,
      repository: p.github,
      status:
        p.status === "live"
          ? "shipped"
          : p.status === "in-progress"
          ? `in-progress (${p.progress ?? 0}%)`
          : "planning"
    })),
    work: [
      {
        name: "Independent",
        position: "ML/AI Engineer & Data Scientist",
        startDate: "2024-01",
        summary:
          "Building production AI products end-to-end: ingestion, modelling, orchestration, and the UIs on top.",
        highlights: [
          "Shipped VANTAGE, a global tech intelligence feed with AI synthesis and signal scoring",
          "Shipped Gambia Legal Aid, a RAG chatbot on Gambian law with a hallucination-guard pipeline",
          "Shipped Dalasi Pulse, FX and remittance forecasting on CBG and World Bank data (Python + Next.js)",
          "Shipped FORGE (accountability OS), ColdPilot (cold-outreach agent), and AYAT (Qur'anic verse galaxy)"
        ]
      }
    ],
    education: [
      {
        institution: "Kwame Nkrumah University of Science and Technology (KNUST)",
        area: "Statistics",
        studyType: "BSc",
        location: "Ghana",
        courses: [
          "Probability Theory",
          "Statistical Inference",
          "Regression Analysis",
          "Machine Learning",
          "Linear Algebra"
        ]
      }
    ],
    languages: [{ language: "English", fluency: "Native" }]
  };

  return NextResponse.json(resume, {
    headers: {
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
      "Access-Control-Allow-Origin": "*"
    }
  });
}
