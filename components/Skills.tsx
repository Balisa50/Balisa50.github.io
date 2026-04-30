"use client";

import { motion } from "framer-motion";

const STACK: { label: string; items: string[] }[] = [
  {
    label: "AI / ML",
    items: [
      "LangChain", "HuggingFace", "PyTorch", "TensorFlow", "scikit-learn",
      "Anthropic SDK", "OpenAI SDK", "Groq", "Pinecone", "ChromaDB"
    ]
  },
  {
    label: "Data Science & Stats",
    items: ["Pandas", "NumPy", "scikit-learn", "R", "MATLAB", "SQL", "Prophet"]
  },
  {
    label: "Engineering",
    items: ["Python", "TypeScript", "Next.js", "React", "FastAPI", "Flask", "Docker", "Streamlit", "Supabase"]
  }
];

export function Skills() {
  return (
    <section
      id="skills"
      className="relative mx-auto w-full max-w-7xl scroll-mt-20 px-6 py-16 md:py-20"
      aria-labelledby="skills-heading"
    >
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col gap-8"
      >
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-cyan">
          ~/stack
        </span>
        <h2 id="skills-heading" className="sr-only">
          Stack
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {STACK.map((group, gi) => (
            <motion.div
              key={group.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.4, delay: gi * 0.08 }}
              className="flex flex-col gap-3"
            >
              <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-white/60">
                {group.label}
              </h3>
              <ul className="flex flex-wrap gap-2">
                {group.items.map((t) => (
                  <li
                    key={t}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-text-secondary transition hover:border-cyan/40 hover:text-white"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
