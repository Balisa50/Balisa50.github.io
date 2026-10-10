import fs from "node:fs";
const p = "lib/case-studies.ts";
let t = fs.readFileSync(p, "utf8");

// Remove the gambia-political-risk case study entirely
const removePattern = /  "gambia-political-risk": \{[\s\S]*?\n  \},\n/g;
const beforeLen = t.length;
t = t.replace(removePattern, "");
console.log(`Removed political-risk entry: ${beforeLen - t.length} chars`);

const edits = [
  // VANTAGE
  [
    "I also wanted it to read like editorial, the register of Ben Thompson or The Economist, not a Twitter bot summarising headlines.",
    "I also wanted it to read like editorial, in the register of Ben Thompson or The Economist."
  ],
  [
    "short paragraphs (2-3 sentences), end with a falsifiable prediction. The output reads sharp because the prompt is sharp.",
    "short paragraphs (2-3 sentences), end with a falsifiable prediction."
  ],
  [
    "Use Haiku for the pipeline, not Sonnet.\nSonnet was overkill. Article synthesis is high-volume, low-stakes-per-token (you can re-generate tomorrow if today's is mediocre).",
    "Use Haiku for the pipeline, not Sonnet.\nArticle synthesis is high-volume and low-stakes-per-token (you can re-generate tomorrow if today's is mediocre)."
  ],
  [
    "Half the iterations were: add capability, blow timeout, remove capability.",
    "Half the iterations were add capability, blow timeout, remove capability."
  ],
  [
    "Learning to budget across the chain (under 10s per article, leave headroom for cold start) was a forcing function.",
    "Learning to budget across the chain (under 10s per article, leave headroom for cold start) took a while."
  ],
  [
    "Semantic similarity would be more useful than topical buckets. Same trick I used in AYAT would work here.",
    "Semantic similarity would be more useful than topical buckets. The same approach from AYAT would work here."
  ],

  // GAMBIA LEGAL AID
  [
    "Standard RAG guards against hallucination by retrieving good context. Mine goes further. After retrieval I build a per-Act allowlist mapping section number to section title.",
    "Standard RAG guards against hallucination by retrieving good context. This pipeline adds a per-Act allowlist mapping section number to section title."
  ],
  [
    "Instead I generate the full answer, validate it, THEN stream it word-by-word for the typewriter effect. Slightly slower start (the user waits ~3s for first token instead of ~1s), but every word that appears is already validated. Trust over speed (commit dc4ae3f).",
    "Instead I generate the full answer, validate it, then stream it word-by-word for the typewriter effect. Slightly slower start (the user waits ~3s for first token instead of ~1s), but every word that appears has already been validated (commit dc4ae3f)."
  ],
  [
    "These phrases are noise. They're what useless lawyer-bots say to dodge accountability. The user is here BECAUSE they don't have a lawyer. Banned them at the prompt level AND at the post-processing level. If the model slipped them in, the post-processor stripped them. The system has to act AS the lawyer or it fails the brief (commits 5f68053, 61a93b1).",
    "The user is here because they do not have a lawyer, so 'consult a lawyer' is not useful advice. Banned at the prompt level and at the post-processing level. If the model slips them in, the post-processor strips them (commits 5f68053, 61a93b1)."
  ],
  [
    "Built the citation-anchor + verbatim-quote check as the gate. Pass rate dropped sharply. Trust went up.",
    "Built the citation-anchor and verbatim-quote check as the gate. Pass rate dropped sharply."
  ],
  [
    "The metric I optimise is fabricated citations per million queries, and hard fail is the only way to drive it to zero (commit 5d5a1e4).",
    "The metric I optimise is fabricated citations per million queries, and hard fail is the way to drive it to zero (commit 5d5a1e4)."
  ],
  [
    "Hallucination prevention is a stack: better retrieval, allowlists, verbatim validation, banned phrases, hard-fail on retry. Each layer catches what the previous one missed.",
    "Hallucination prevention is a stack: better retrieval, allowlists, verbatim validation, banned phrases, hard-fail on retry."
  ],

  // LIFE INSURANCE
  [
    "Aspirational target: Cox PH C-index above 0.75 (industry good).",
    "Target: Cox PH C-index above 0.75 (industry good)."
  ],
  [
    "Adding the interaction term (age × risk_class) jumped C-index to 0.77. A 25-year-old smoker has a different relative risk than a 65-year-old smoker. Cox PH's proportional-hazards assumption is violated when interactions matter, and the low C-index is what surfaced it.",
    "Adding the interaction term (age × risk_class) jumped C-index to 0.77. Cox PH's proportional-hazards assumption is violated when interactions matter, and the low C-index is what surfaced it."
  ],
  [
    "Rewrote in NumPy with vectorised sampling. 8 seconds, same results, 30x faster.",
    "Rewrote in NumPy with vectorised sampling. Same results, 30x faster, 8 seconds per run."
  ],
  [
    "Age-band-specific shock multipliers (more honest than uniform multipliers)",
    "Age-band-specific shock multipliers"
  ],
  [
    "Diagnosing it via Schoenfeld residuals took me longer than it should have. Now I check residuals as part of every fit.",
    "Schoenfeld residuals are what surface a violation. I check them as part of every fit."
  ],
  [
    "The textbook explains Gompertz-Makeham. Writing the gradient descent yourself shows why the second term matters in the data you actually have. When the assumptions are violated, the model tells you with a low C-index.",
    "The textbook explains Gompertz-Makeham. Writing the gradient descent yourself shows why the second term matters in the data you actually have."
  ],
];

let replaced = 0;
const missed = [];
for (const [from, to] of edits) {
  if (t.includes(from)) { t = t.replace(from, to); replaced++; }
  else missed.push(from.slice(0, 70));
}

fs.writeFileSync(p, t);
console.log(`Replaced ${replaced} of ${edits.length}`);
if (missed.length) console.log("Missed:\n  " + missed.join("\n  "));
