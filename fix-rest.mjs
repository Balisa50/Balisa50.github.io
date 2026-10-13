import { readFileSync, writeFileSync } from "node:fs";
const p = "/data/data/com.termux/files/home/portfolio/lib/case-studies.ts";
let s = readFileSync(p, "utf8");

const pairs = [
  [
    "What survived that measurement is better than what I designed.",
    "What survived that measurement is different from what I designed."
  ],
  [
    "Cost-engineered for a public-good product.",
    "Priced for a public-good product."
  ],
  [
    "FORGE optimises for honesty over retention. The leaderboard and camera proctoring both shipped and were removed when they produced the wrong incentive. Removing software is harder than adding it.",
    "The leaderboard and camera proctoring both shipped and were later removed when they produced the wrong incentive."
  ],
  [
    "Now runs on NVIDIA's free OpenAI-compatible endpoint (mistral-medium-3.5-128b for both the one-shot scoring and the live interview stream), after pivoting off Gemini for rate limits and then off Groq; the `groq_*` names in config are legacy",
    "Runs on NVIDIA's free OpenAI-compatible endpoint (mistral-medium-3.5-128b), after pivoting off Gemini for rate limits and then off Groq"
  ]
];

for (const [from, to] of pairs) {
  const n = s.split(from).length - 1;
  s = s.split(from).join(to);
  console.log(`Replaced ${n} of 1`);
}

writeFileSync(p, s);
