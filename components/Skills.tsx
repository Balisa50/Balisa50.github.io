"use client";

import { motion } from "framer-motion";

/**
 * Stack, rebuilt around what the projects on this page actually demonstrate.
 *
 * The previous list claimed LangChain, Pinecone, ChromaDB and TensorFlow. None
 * of them appear in any project here, and they are the first four things an
 * interviewer probes when a CV says "AI engineer", so they were the riskiest
 * possible entries: a single follow-up question turns the whole list into a
 * liability. They are removed rather than kept as aspiration.
 *
 * What replaced them is stronger anyway, because it is specific and provable.
 * "Retrieval over pgvector with a citation validator" is a harder thing to have
 * built than "LangChain", and it is on this site with the code to back it.
 */
const STACK: { label: string; note: string; items: string[] }[] = [
  {
    label: "AI engineering",
    note: "What I actually build with",
    items: [
      "LLM orchestration",
      "RAG / retrieval",
      "pgvector",
      "sentence-transformers",
      "Prompt specification",
      "Tool calling",
      "Model fallback chains",
      "Output validation",
      "NVIDIA NIM",
      "Groq"
    ]
  },
  {
    label: "Machine learning & statistics",
    note: "Modelling, mostly Python",
    items: [
      "PyTorch",
      "CTGAN",
      "scikit-learn",
      "PyMC / MCMC",
      "Lee-Carter",
      "lifelines",
      "HDBSCAN",
      "UMAP",
      "Pandas",
      "NumPy",
      "R",
      "SQL"
    ]
  },
  {
    label: "Systems & delivery",
    note: "Getting it in front of people",
    items: [
      "Python",
      "TypeScript",
      "Next.js",
      "FastAPI",
      "PostgreSQL",
      "Prisma",
      "Supabase",
      "Chrome MV3",
      "Vercel",
      "Docker"
    ]
  }
];

export function Skills() {
  return (
    <section
      id="skills"
      className="relative mx-auto w-full max-w-shell px-6 sm:px-10 scroll-mt-20 border-t border-border py-16"
      aria-labelledby="skills-heading"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-8"
      >
        <h2
          id="skills-heading"
          className="text-sm font-semibold uppercase tracking-[0.16em] text-text-secondary"
        >
          Stack
        </h2>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
          {STACK.map((group) => (
            <div key={group.label} className="flex flex-col gap-3">
              <h3 className="text-base font-semibold text-text">
                {group.label}
              </h3>
              <p className="text-sm text-text-secondary">{group.note}</p>
              <ul className="mt-1 flex flex-wrap gap-x-3 gap-y-1.5">
                {group.items.map((t) => (
                  <li key={t} className="text-sm text-text-secondary">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
