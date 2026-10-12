import fs from "node:fs";
const p = "lib/case-studies.ts";
let t = fs.readFileSync(p, "utf8");
const before = t.length;

const edits = [
  // ─── CREDIT RISK ───
  [
    "Read Naeem Siddiqi's 'Credit Risk Scorecards: Developing and Implementing Intelligent Credit Scoring' end-to-end. The WoE/IV chapter alone is the methodology bible. Read it twice.",
    "Naeem Siddiqi's 'Credit Risk Scorecards' is the methodology reference. The WoE/IV chapter is the core of the pipeline."
  ],
  [
    "Studied the Basel II framework (BCBS Pillar 1) for credit risk. Specifically the Internal Ratings-Based Approach: PD (probability of default), LGD (loss given default), EAD (exposure at default). My scorecard implements PD; the rest are placeholders for the next iteration.",
    "The Basel II framework (BCBS Pillar 1) sets the target. The Internal Ratings-Based Approach has three components: PD (probability of default), LGD (loss given default), EAD (exposure at default). The scorecard implements PD; the rest are placeholders for the next iteration."
  ],
  [
    "Read regulatory technical standards from BCBS, EBA, and the Federal Reserve on model validation. The validation gauntlet (Gini, KS, PSI, ROC) is non-negotiable for a regulated model. Implemented all four.",
    "Regulatory technical standards from BCBS, EBA and the Federal Reserve set the validation requirements. The gauntlet (Gini, KS, PSI, ROC) is non-negotiable for a regulated model. All four are implemented."
  ],
  [
    "Studied Population Stability Index methodology (Karakoulas 2004). PSI compares score distributions between training and out-of-time samples. PSI < 0.1 = no shift, 0.1-0.25 = moderate, > 0.25 = significant shift. Industry threshold for 'don't deploy this model' is 0.25.",
    "Population Stability Index methodology (Karakoulas 2004) sets the drift check. PSI compares score distributions between training and out-of-time samples. Below 0.1 is no shift, 0.1 to 0.25 is moderate, above 0.25 is significant. The industry threshold for 'do not deploy' is 0.25."
  ],
  [
    "Read about West African microfinance dynamics, group lending (joint liability), seasonal income (agricultural cycles), gender roles in finance (women's repayment rates often higher than men's). Calibrated the synthetic data generator to reflect these patterns instead of cloning German Credit defaults.",
    "West African microfinance dynamics set the generator: group lending (joint liability), seasonal income (agricultural cycles), gender roles in finance (women's repayment rates often higher than men's). The synthetic generator reflects those patterns rather than cloning German Credit defaults."
  ],

  // ─── LIFE INSURANCE ───
  [
    "Read the original Gompertz (1825) paper and Makeham's (1860) extension. Pure Gompertz models exponential mortality increase with age; Makeham adds a constant background hazard. For Sub-Saharan Africa where the constant hazard is materially higher (malaria, road traffic, infectious disease), the Makeham term is essential. The original papers, rather than the textbook summaries, were where the intuition came from.",
    "Gompertz (1825) and Makeham (1860) are the basis. Pure Gompertz models exponential mortality increase with age; Makeham adds a constant background hazard. For Sub-Saharan Africa, where the constant hazard is materially higher (malaria, road traffic, infectious disease), the Makeham term is essential."
  ],
  [
    "Studied Cox (1972) Proportional Hazards literature. The C-index (concordance) is the survival-analysis equivalent of AUC. Industry-standard 'good' is > 0.7, 'excellent' is > 0.8.",
    "Cox (1972) Proportional Hazards is the survival-analysis standard. The C-index (concordance) is the equivalent of AUC. Industry-standard 'good' is above 0.7, 'excellent' above 0.8."
  ],
  [
    "Read Klein & Moeschberger's 'Survival Analysis: Techniques for Censored and Truncated Data' for censoring and truncation handling. Most insurance data has both: right-censoring when a policy term ends, left-truncation for delayed entry.",
    "Klein & Moeschberger's 'Survival Analysis' is the reference for censoring and truncation handling. Most insurance data has both: right-censoring when a policy term ends, left-truncation for delayed entry."
  ],
  [
    "Studied Monte Carlo variance-reduction techniques (control variates, antithetic variables) for stable VaR estimates at 5,000 scenarios.",
    "Monte Carlo variance-reduction techniques (control variates, antithetic variables) stabilise VaR at 5,000 scenarios."
  ],
  [
    "Read Sub-Saharan Africa health stats from World Bank and WHO, life expectancy distributions, mortality ratios by age band, leading causes of death. Calibrated the synthetic profile distributions against these sources.",
    "Sub-Saharan Africa health stats from the World Bank and WHO set the profile calibration: life expectancy distributions, mortality ratios by age band, leading causes of death."
  ],
  [
    "Read COVID-era mortality data across regions to calibrate the pandemic stress scenario. Sub-Saharan Africa's reported pandemic mortality was lower than other regions, with higher uncertainty bands.",
    "COVID-era mortality data set the pandemic stress calibration. Sub-Saharan Africa's reported pandemic mortality was lower than other regions, with higher uncertainty bands."
  ],

  // ─── HIREIQ ───
  [
    "Read structured-interview research (Schmidt & Hunter 1998 meta-analysis, more recent McDaniel reviews). Structured interviews predict job performance ~2x better than unstructured ones. Key levers: rubric-based scoring, anchored rating scales, multiple interviewers (or in our case, multiple criteria within one AI run).",
    "Structured-interview research (Schmidt & Hunter 1998 meta-analysis, more recent McDaniel reviews) is the basis. Structured interviews predict job performance about 2x better than unstructured ones. Key levers: rubric-based scoring, anchored rating scales, multiple criteria per run."
  ],
  [
    "Studied how Workday, Greenhouse, Lever structure their candidate pipelines. ATS systems are built around the static form because that's what 1990s HR software was. The conversation is conspicuously absent.",
    "Workday, Greenhouse and Lever structure their candidate pipelines around the static form, which is what 1990s HR software was. The conversation is absent from all three."
  ],
  [
    "Read Gemini Flash 2.0's release notes and benchmarks before picking it. Sub-second responses, 10x cheaper than GPT-4. For a high-volume conversational interviewer, latency and cost matter more than peak reasoning ability, Flash trades a bit of reasoning for the volume math working.",
    "Gemini Flash 2.0 was the choice for latency and cost: sub-second responses, 10x cheaper than GPT-4. For a high-volume conversational interviewer, latency and cost matter more than peak reasoning ability."
  ],
  [
    "Studied legal hiring constraints (EEOC US, GDPR EU, employment law generally), specifically what the AI can ASK and what the report can SAY. Avoided protected-category questions, kept assessments role-relevant.",
    "Legal hiring constraints (EEOC US, GDPR EU, employment law) set the boundaries on what the AI can ask and what the report can say. Protected-category questions are avoided; assessments are role-relevant."
  ],
  [
    "Read WeasyPrint's docs and CSS-print specs. PDF generation from HTML is a well-trodden path but small mistakes (missing print stylesheet, browser-quirk fonts) ruin the output.",
    "WeasyPrint and CSS-print specs are the PDF path. PDF generation from HTML is well-trodden, but small mistakes (missing print stylesheet, browser-quirk fonts) ruin the output."
  ],
  [
    "Scoring rubric design is a research field I had not entered. First scoring prompt produced inconsistent results because I was asking the model to score on multiple dimensions simultaneously without clear weight. Studied multi-criteria decision-analysis literature, rewrote scoring as per-criterion 1-5 with explicit anchors, and aggregated.",
    "Scoring rubric design is its own field. The first scoring prompt produced inconsistent results because it asked the model to score on multiple dimensions simultaneously without clear weight. The multi-criteria decision-analysis literature is the reference. Scoring was rewritten as per-criterion 1-5 with explicit anchors, then aggregated."
  ],

  // ─── GAMBIA LEGAL AID (doubled text bug) ───
  [
    "\"Curly-quote vs straight-quote behaviour differs across browsers and PDFs. The model would generate the curly version of \\\"section 14\\\" when the source text had the straight version, and the substring validator initially missed this and let hallucinations through.\"section 14\\\" when the source text had the straight version, and my substring validator initially missed this and let hallucinations through.\",",
    "\"Curly-quote vs straight-quote behaviour differs across browsers and PDFs. The model would generate the curly version of \\\"section 14\\\" when the source text had the straight version, and the substring validator initially missed this and let hallucinations through.\","
  ],

  // ─── FORGE ───
  [
    "Studied behavioural-economics literature on commitment devices: Dean Karlan's stickK, Beeminder's monetary penalties, Forest's tree-killing. The apps that work make failure expensive in a way you actually feel.",
    "The behavioural-economics literature on commitment devices (Karlan's stickK, Beeminder's monetary penalties, Forest's tree-killing) is the reference. The apps that work make failure expensive in a way the user actually feels."
  ],
  [
    "Read interrogation methodology, not literally, but the structure: how a good cross-examination works (Reid technique critique, NIJ structured interviewing). What makes it hard to fake is asking for SPECIFICS the liar doesn't have. 'What did you build?' is gameable. 'What was the bug, what did you try first, why didn't it work?' isn't.",
    "The structure of a good cross-examination (Reid technique critique, NIJ structured interviewing) is the model for the interrogator. What makes it hard to fake is asking for SPECIFICS the liar doesn't have. 'What did you build?' is gameable. 'What was the bug, what did you try first, why didn't it work?' isn't."
  ],
  [
    "Studied Apple Screen Time and Android's Focus Mode. Both have the same flaw: they're disabled from inside themselves. If you can disable the constraint when willpower is low, the constraint does nothing. Settings are behind a PIN.",
    "Apple's Screen Time and Android's Focus Mode share the same flaw: they can be disabled from inside themselves. If the constraint can be turned off when willpower is low, it does nothing. Settings live behind a PIN."
  ],
  [
    "Read about OpenRouter's routing model. Quality on a daily 200-token interrogation is fine across many models. Locking to one provider costs more without a quality benefit.",
    "OpenRouter's routing model is the fit. Quality on a daily 200-token interrogation is fine across many models. Locking to one provider costs more without a quality benefit."
  ],
  [
    "Studied accountability-pod patterns from Nat Eliason and Tim Ferriss.",
    "Accountability-pod patterns from Nat Eliason and Tim Ferriss are the reference."
  ]
];

let hit = 0;
const miss = [];
for (const [from, to] of edits) {
  if (t.indexOf(from) !== -1) { t = t.replace(from, to); hit++; }
  else miss.push(from.slice(0, 60));
}
fs.writeFileSync(p, t);
console.log("Replaced " + hit + " of " + edits.length);
if (miss.length) console.log("Missed:\n  " + miss.join("\n  "));
