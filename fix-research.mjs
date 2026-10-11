import fs from "node:fs";
const p = "lib/case-studies.ts";
let t = fs.readFileSync(p, "utf8");

const edits = [
  // ─── NOVA ───
  [
    "Read the CTGAN paper (Xu et al., 2019) before writing any of the model. Two ideas make tabular GANs work: mode-specific normalisation for multimodal continuous columns, and conditional training-by-sampling for imbalanced categoricals. Neither is obvious. I wanted to implement both from the paper rather than inherit them from a library.",
    "The CTGAN paper (Xu et al., 2019) is the basis for the model. Two ideas make tabular GANs work: mode-specific normalisation for multimodal continuous columns, and conditional training-by-sampling for imbalanced categoricals. Neither is obvious, and both are implemented from the paper rather than inherited from a library."
  ],
  [
    "Read the synthetic-data survey (Jordon et al., 2022) and the SDMetrics scoring conventions. That is what told me my first validation run was measuring the wrong thing. A KS p-value is meaningless at n=10,000. The field scores the KS statistic, the effect size, instead.",
    "The synthetic-data survey (Jordon et al., 2022) and the SDMetrics scoring conventions set the evaluation. They are why the first validation run was measuring the wrong thing. A KS p-value is meaningless at n=10,000. The field scores the KS statistic, the effect size, instead."
  ],
  [
    "Studied WGAN-GP (Gulrajani et al., 2017). Plain GAN training on tabular data is unstable. The gradient penalty is what keeps the critic honest. PacGAN packing is a cheap defence against mode collapse.",
    "WGAN-GP (Gulrajani et al., 2017) is the stabiliser. Plain GAN training on tabular data is unstable. The gradient penalty keeps the critic honest, and PacGAN packing is a cheap defence against mode collapse."
  ],
  [
    "Read TimeGAN (Yoon et al., 2019) for sequential data. I did not end up building time series; the transactions here are tabular. It is the right next step for real fraud data, and I wanted to understand the gap before claiming the domain.",
    "TimeGAN (Yoon et al., 2019) covers sequential data. This project is tabular, so it was not used. It is the right next step for real fraud data."
  ],
  [
    "Researched West African microfinance. Loan sizes run 50 to 2,000 USD. APRs sit at 8 to 30 percent. Default rates at 20 to 30 percent. Group-lending lowers that. Rural borrowers skew agricultural, urban borrowers skew trading. None of this is in the architecture papers, and without it the ground-truth data would be a fantasy.",
    "West African microfinance dynamics set the calibration. Loan sizes run 50 to 2,000 USD. APRs sit at 8 to 30 percent. Default rates at 20 to 30 percent. Group-lending lowers that. Rural borrowers skew agricultural, urban borrowers skew trading. None of this is in the architecture papers, and without it the ground-truth data would be a fantasy."
  ],

  // ─── GAMBIA 2074 ───
  [
    "Read Lee & Carter's 1992 original paper before writing any model. The single-index log-bilinear structure (log m(x,t) = a_x + b_x k_t) is the backbone of every mortality forecast the UN publishes. I implemented the classical SVD version first as a transparent baseline.",
    "Lee & Carter's 1992 paper is the basis for the model. The single-index log-bilinear structure (log m(x,t) = a_x + b_x k_t) is the backbone of every mortality forecast the UN publishes. The classical SVD version was the first implementation, as a transparent baseline."
  ],
  [
    "Read Brouhns, Denuit & Vermunt (2002) on the Poisson log-bilinear approach. The standard SVD assumes homoskedastic Gaussian errors on log-rates, which is wrong where death counts are small and noisy. Exactly The Gambia's case. Poisson-on-deaths is the principled fix and the basis for the Bayesian version.",
    "Brouhns, Denuit & Vermunt (2002) is the Poisson log-bilinear approach. The standard SVD assumes homoskedastic Gaussian errors on log-rates, which is wrong where death counts are small and noisy. Exactly The Gambia's case. Poisson-on-deaths is the principled fix and the basis for the Bayesian version."
  ],
  [
    "Read Li & Lee (2005) on coherent forecasting. A single small-population forecast can drift to implausible long-run mortality; the coherent extension forecasts a country jointly with a reference group so it can't diverge. That paper is the reason I fetched seven West-African neighbours, not just The Gambia.",
    "Li & Lee (2005) is the coherent forecasting method. A single small-population forecast can drift to implausible long-run mortality. The coherent extension forecasts a country jointly with a reference group so it cannot diverge, and it is why the model pools The Gambia with seven West-African neighbours."
  ],
  [
    "Read Raftery et al. (2012, PNAS), the Bayesian hierarchical method the UN actually adopted for WPP in 2015. I needed to understand it before benchmarking against WPP rather than just citing it.",
    "Raftery et al. (2012, PNAS) is the Bayesian hierarchical method the UN adopted for WPP in 2015. Understanding it was necessary before benchmarking against WPP rather than just citing it."
  ],
  [
    "Read Preston, Heuveline & Guillot's 'Demography' Ch. 6 for the cohort-component method: survivorship ratios from life tables, Leslie-matrix accounting, the open-age interval.",
    "Preston, Heuveline & Guillot's 'Demography' Ch. 6 is the reference for the cohort-component method: survivorship ratios from life tables, Leslie-matrix accounting, the open-age interval."
  ],
  [
    "Checked the Human Mortality Database (Gambia absent). Found the thing that made the project feasible: the Farafenni Health & Demographic Surveillance System has run since 1981, Basse since 2007. Rare multi-decade empirical mortality data for a sub-Saharan country.",
    "The Human Mortality Database does not list The Gambia. The thing that made the project feasible is the Farafenni Health & Demographic Surveillance System, running since 1981, and Basse since 2007. Rare multi-decade empirical mortality data for a sub-Saharan country."
  ],

  // ─── AYAT ───
  [
    "Read the original UMAP paper (McInnes, Healy 2018) before picking it over t-SNE. UMAP preserves global structure better, which is what I needed, themes have to land near each other across the whole corpus, not just locally.",
    "The UMAP paper (McInnes, Healy 2018) is the reason for picking it over t-SNE. UMAP preserves global structure better, which is what the visualisation needs: themes have to land near each other across the whole corpus, not just locally."
  ],
  [
    "Studied which sentence-transformer model to use. Tried `all-mpnet-base-v2` (768-dim, slower) and `all-MiniLM-L6-v2` (384-dim, faster). Compared cluster coherence on a 200-verse sample. MiniLM lost ~3% on coherence but ran 2.5x faster on CPU. Picked MiniLM because the corpus is fixed and the speed lets me iterate on clustering parameters at no cost.",
    "Two sentence-transformer candidates were tested: `all-mpnet-base-v2` (768-dim, slower) and `all-MiniLM-L6-v2` (384-dim, faster). MiniLM lost about 3% on cluster coherence over a 200-verse sample but ran 2.5x faster on CPU. MiniLM was picked because the corpus is fixed and the speed allows iterating on clustering parameters at no cost."
  ],
  [
    "Read existing Quran apps in detail before designing UX (Quran.com, Tarteel, Muslim Pro, Bayyinah). Identified what they all share: the verse list. Identified what none of them have: a spatial sense of the corpus.",
    "Existing Quran apps (Quran.com, Tarteel, Muslim Pro, Bayyinah) all share one thing: the verse list. None of them have a spatial sense of the corpus."
  ],
  [
    "Studied Three.js batching strategies. Naive Three.js creates one DrawCall per object, fine for 50 cubes, fatal for 6,236 verses on a phone. Read three example codebases, two using InstancedMesh and one using a Points cloud, and compared what each actually costs per particle before writing my own.",
    "Three.js batching was the constraint. Naive Three.js creates one DrawCall per object, fine for 50 cubes, fatal for 6,236 verses on a phone. Three example codebases were compared, two using InstancedMesh and one using a Points cloud, before writing this one."
  ],
  [
    "Read Aupetit and Espadoto's work on user-steerable projections (arXiv 2506.15479, June 2025) before designing the query-driven layout. Their approach zero-shot-classifies every item with an LLM, then re-runs UMAP. Reported throughput is 2.4-3.6 items/sec, which for 6,236 verses is roughly half an hour per question. That number is what pushed me to steer the projection geometrically from the query vector alone and spend exactly one model call afterwards, on labelling, instead of six thousand.",
    "Aupetit and Espadoto's work on user-steerable projections (arXiv 2506.15479, June 2025) is the reference for the query-driven layout. Their approach zero-shot-classifies every item with an LLM, then re-runs UMAP. Reported throughput is 2.4-3.6 items/sec, which for 6,236 verses is roughly half an hour per question. That number is why the projection is steered geometrically from the query vector alone, and why exactly one model call runs afterwards, on labelling, instead of six thousand."
  ],
  [
    "Read about the Meccan vs Medinan classification. Surahs were revealed in two distinct phases (Meccan: 13 years, cosmic, urgent, short; Medinan: 10 years, legislative, communal, long). Realised this was free metadata I could use for color, a layer of meaning that a religious reader would already recognize.",
    "The Meccan / Medinan classification is free metadata. Surahs were revealed in two distinct phases (Meccan: 13 years, cosmic, urgent, short; Medinan: 10 years, legislative, communal, long). Colouring by revelation period gives the map a layer of meaning a religious reader already recognises."
  ],

  // ─── VANTAGE ───
  [
    "Read 100+ Stratechery articles to internalise Ben Thompson's structure: every piece is a verdict (the headline IS the thesis), follow the money first, name names, end with a falsifiable prediction. Translated this into an explicit system prompt with banned phrases ('In a move that…', 'It's worth noting…') and required structures.",
    "The Stratechery structure is the model: every piece is a verdict (the headline IS the thesis), follow the money first, name names, end with a falsifiable prediction. It became an explicit system prompt with banned phrases ('In a move that…', 'It's worth noting…') and required structures."
  ],
  [
    "Studied NewsAPI's free tier limits in detail before architecting anything. 100 requests/day, language=en filter, 10 articles per query. That number determined the entire pipeline: I couldn't fan-out to all six regions in parallel, I had to chain them through a single daily run.",
    "NewsAPI's free tier sets the pipeline: 100 requests/day, language=en filter, 10 articles per query. That number rules out parallel fan-out across six regions, so the regions chain through a single daily run."
  ],
  [
    "Read Vercel's Hobby plan limits carefully. Crons run once per day max. Edge function timeout is 60s. These two constraints shaped everything: chain-of-regions through a single cron, every region fits inside 60s, drop the slowest sub-pipelines.",
    "Vercel's Hobby plan sets the constraints: crons run once per day max, edge functions time out at 60s. Those two limits shaped everything: chain-of-regions through a single cron, every region fits inside 60s, drop the slowest sub-pipelines."
  ],
  [
    "Studied the provider's pricing tiers across model families. Sonnet is 3x the cost of Haiku. For a synthesise-and-score pipeline running unattended, Haiku's quality at one-third the cost was the right trade, I lost subtle nuance, kept the editorial voice via the strict prompt.",
    "The provider's pricing tiers made Haiku the choice. Sonnet costs 3x as much. For an unattended synthesise-and-score pipeline, Haiku at one-third the cost is the right trade. The strict prompt carries the editorial voice."
  ],
  [
    "Studied RFC 5005 / RSS specs while building the regional sources. Most regional tech publications still publish RSS even if their websites are bad. Africa especially, TechCabal, Disrupt Africa, Iwacu, etc. RSS was the cheapest way in.",
    "RSS (RFC 5005 and the general specs) is the entry point. Most regional tech publications publish RSS even if their websites are bad, Africa especially: TechCabal, Disrupt Africa, Iwacu. RSS was the cheapest way in."
  ],

  // ─── GAMBIA LEGAL AID ───
  [
    "Read every Act we ingested (Constitution, Criminal Code, Labour Act, Children's Act, Sexual Offences Act, Domestic Violence Act, Immigration Act, Rent Act 2014/2017/2024, etc.) end-to-end before writing the system prompt. Could not enforce grounding without knowing what grounded actually meant.",
    "The full text of every Act ingested (Constitution, Criminal Code, Labour Act, Children's Act, Sexual Offences Act, Domestic Violence Act, Immigration Act, Rent Act 2014/2017/2024) set the system prompt. Grounding cannot be enforced without knowing what grounded actually means."
  ],
  [
    "Studied how Westlaw and LexisNexis structure citations. They cite by section number, sub-section, and Act. Realised my retrieval had to surface those exact metadata pieces or the citations would be unverifiable.",
    "Westlaw and LexisNexis cite by section number, sub-section, and Act. The retrieval had to surface those exact metadata pieces or the citations would be unverifiable."
  ],
  [
    "Read the OpenAI 'Constitutional AI' paper and the provider's RAG literature. The pattern that stuck: validate the answer against the retrieved context BEFORE returning it. If the model hallucinated, reject and retry.",
    "The pattern from the Constitutional AI paper and the provider's RAG literature is: validate the answer against the retrieved context BEFORE returning it. If the model hallucinated, reject and retry."
  ],
  [
    "Studied curly-quote vs straight-quote behaviour across browsers and PDFs because the model would generate the curly version of \"section 14\" when the source text had the straight version, and my substring validator initially missed this and let hallucinations through.",
    "Curly-quote vs straight-quote behaviour differs across browsers and PDFs. The model would generate the curly version of \"section 14\" when the source text had the straight version, and the substring validator initially missed this and let hallucinations through."
  ],
  [
    "Read Gambian legal cases on unfair dismissal, domestic violence prosecutions, and immigration appeals to make sure the topic anchors I was building actually retrieved the sections that mattered to real disputes.",
    "Gambian legal cases on unfair dismissal, domestic violence prosecutions, and immigration appeals set the topic anchors, so the retrieval surfaces the sections that matter to real disputes."
  ],

  // ─── DALASI PULSE ───
  [
    "Read the Central Bank of The Gambia's annual reports (2019-2024) to understand which currencies matter for the Dalasi's stability (USD, EUR, GBP, CHF, JPY) and how seasonality plays in (remittance peaks during Ramadan, Eid, school-year start in September).",
    "The Central Bank of The Gambia's annual reports (2019-2024) set the currency list (USD, EUR, GBP, CHF, JPY) and the seasonality: remittance peaks during Ramadan, Eid, school-year start in September."
  ],
  [
    "Read World Bank KNOMAD methodology on bilateral remittance estimation. The data is corridor-level: UK to GM, US to GM, ES to GM, DE to GM, and so on. Knowing the methodology was crucial because it's mostly imputed from migration stocks + sender-country incomes, not from actual transaction data.",
    "The World Bank KNOMAD methodology on bilateral remittance estimation is the source. The data is corridor-level: UK to GM, US to GM, ES to GM, DE to GM. The methodology matters because the numbers are mostly imputed from migration stocks and sender-country incomes, not actual transaction data."
  ],
  [
    "Read Prophet's Bayesian framework (Taylor and Letham 2017) while working out how to handle Ramadan and Eid, which drift 11 days a year against the Gregorian calendar and so are invisible to a month-of-year seasonal term. Compared with SARIMA: Prophet better at multi-period seasonality, SARIMA better at short cyclicality. Used both, ensemble.",
    "Prophet's Bayesian framework (Taylor and Letham 2017) is the reference for handling Ramadan and Eid, which drift 11 days a year against the Gregorian calendar and are invisible to a month-of-year seasonal term. Prophet is better at multi-period seasonality, SARIMA at short cyclicality. Both are used in ensemble."
  ],
  [
    "Read GitHub Actions cron syntax + storage limits. Decided to refresh forecasts daily via Actions instead of Vercel cron, Vercel's Hobby cron wakes the function once per day at a non-customisable schedule. Actions gave me precise scheduling and a free workflow log.",
    "GitHub Actions cron is the scheduler, not Vercel's. Vercel's Hobby cron wakes the function once per day at a non-customisable time. Actions gives precise scheduling and a free workflow log."
  ],
  [
    "Time-series cross-validation is different from random-split CV. You can't shuffle time-ordered data without leaking the future into the training set. Read about walk-forward validation and rewrote the evaluation pipeline. Forecast metrics dropped from optimistic to realistic.",
    "Time-series cross-validation is different from random-split CV. Shuffling time-ordered data leaks the future into the training set. The evaluation pipeline was rewritten around walk-forward validation. Forecast metrics dropped from optimistic to realistic."
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
  [
    "I had not implemented WoE/IV from scratch before. Read Siddiqi's book chapter twice, then implemented `compute_all_woe_iv` and `woe_transform` myself. The implementation made the formulas concrete.",
    "WoE/IV was new to implement from scratch. The Siddiqi chapter is the reference, and `compute_all_woe_iv` and `woe_transform` are the implementation. Writing the code made the formulas concrete."
  ],

  // ─── LIFE INSURANCE ───
  [
    "Read the original Gompertz (1825) paper and Makeham's (1860) extension. Pure Gompertz models exponential mortality increase with age; Makeham adds a constant background hazard. For Sub-Saharan Africa where the constant hazard is materially higher (malaria, road traffic, infectious disease), the Makeham term is essential. The original papers, rather than the textbook summaries, were where the intuition came from.",
    "Gompertz (1825) and Makeham (1860) are the basis. Pure Gompertz models exponential mortality increase with age; Makeham adds a constant background hazard. For Sub-Saharan Africa, where the constant hazard is materially higher (malaria, road traffic, infectious disease), the Makeham term is essential. The original papers, rather than the textbook summaries, are where the second term's role becomes clear."
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
