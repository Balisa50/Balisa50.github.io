import fs from "node:fs";
const p = "lib/case-studies.ts";
let t = fs.readFileSync(p, "utf8");

const edits = [
  // -------- VANTAGE --------
  [
    "I also wanted it to read like an actual editorial voice, Ben Thompson, Matt Levine, The Economist, not like a Twitter bot summarising headlines.",
    "I also wanted it to read like editorial, the register of Ben Thompson or The Economist, not a Twitter bot summarising headlines."
  ],
  [
    "Saves an the LLM provider call per duplicate, which is ~70% of what's returned. The cheapest call is the one you don't make.",
    "Saves the LLM call on roughly 70% of what NewsAPI returns."
  ],
  [
    "Cut to 1 per region per run. Trade-off: less content per day, but the cron actually completes. Better to ship 6 high-signal articles than to time out at article 9 and lose the region's whole batch.",
    "Cut to 1 per region per run. Less content per day, but the cron completes."
  ],
  [
    "Disabled the expire cron + neutered the route to return `{disabled: true}` even on manual trigger. Better to show old articles than to show nothing.",
    "Disabled the expire cron, and the route now returns `{disabled: true}` even on manual trigger."
  ],
  [
    "Then ran out of credits, disabled deletion. The feed now persists historic articles intentionally, context as a feature.",
    "Then ran out of credits, disabled deletion. The feed now persists historic articles intentionally."
  ],
  [
    "Half the iterations were 'add capability, blow timeout, remove capability'.",
    "Half the iterations were: add capability, blow timeout, remove capability."
  ],
  [
    "Took me weeks to notice because global was still working. Lesson: silent fire-and-forget + free-tier observability = bugs that hide for weeks.",
    "Took me weeks to notice because global was still working."
  ],
  [
    "Removed the folder, added it to .gitignore. Cross-project filesystem leakage is a real Windows-specific hazard.",
    "Removed the folder, added it to .gitignore."
  ],
  [
    "Ended up using region-specific keyword sets and RSS feeds for non-global to escape NewsAPI's relevancy bias.",
    "Ended up using region-specific keyword sets and RSS feeds for non-global regions to escape NewsAPI's relevancy bias."
  ],
  [
    "Right now the user picks a region/category to filter, but semantic similarity is more useful than topical buckets, readers want 'more on this thread', not 'more in this folder'. Same trick I used in AYAT could ride along here.",
    "Right now the user picks a region and category. Semantic similarity would be more useful than topical buckets. Same trick I used in AYAT would work here."
  ],
  [
    "When you're optimising AI cost, the cheapest call is the one you don't make. De-dup before you spend. When you're optimising on a free tier, treat every constraint (60s timeout, 100 req/day, 500MB DB) as the input to your architecture, not an obstacle. Constraints force creative wiring.",
    "De-duplicating before the model call cut roughly 70% of the LLM spend. The free-tier constraints (60s timeout, 100 requests a day, 500 MB database) shaped the whole pipeline: chain-of-regions instead of parallel fetch, RSS instead of scraping, Haiku instead of Sonnet."
  ],

  // -------- GAMBIA LEGAL AID --------
  [
    "So the bar wasn't 'build a chatbot'. The bar was: build a chatbot that REFUSES to lie, even at the cost of being less useful.",
    "The requirement was a chatbot that refuses to invent an answer, even at the cost of being less useful."
  ],
  [
    "If the model hallucinated, reject and retry, don't ship and apologise.",
    "If the model hallucinated, reject and retry."
  ],
  [
    "Pass rate dropped sharply, trust went up. Ship the system that says 'I don't know' over the one that confidently lies.",
    "Pass rate dropped sharply. Trust went up."
  ],
  [
    "The metric I optimise is 'lies shipped per million queries', hard fail is the only way to drive that to zero (commit 5d5a1e4).",
    "The metric I optimise is fabricated citations per million queries, and hard fail is the only way to drive it to zero (commit 5d5a1e4)."
  ],
  [
    "Now legal-validation rejection is shown as 'I couldn't ground this in the statutes I have' which is a different message from network failure. Honest UX is harder than generic UX (commit 5f68053).",
    "Legal-validation rejection now shows 'I couldn't ground this in the statutes I have' instead of 'Something went wrong' (commit 5f68053)."
  ],
  [
    "It's not generalisable, every act needed its own preprocessing rules. The honest answer is: legal-doc ingestion is a manual job pretending to be an automated one.",
    "It is not generalisable. Every act needed its own preprocessing rules."
  ],
  [
    "Adding the hard-fail was the response to that. The lesson: every confident answer is implicitly a contract. Break it once and the whole system loses trust.",
    "Adding the hard-fail was the response to that."
  ],
  [
    "In high-stakes domains, refusing to answer is a feature, not a failure. The system that says 'I don't know' is more useful than the one that confidently hallucinates. Hallucination prevention is not one technique, it's a stack: better retrieval, allowlists, verbatim validation, banned phrases, hard-fail on retry. Each layer catches what the previous one missed.",
    "Hallucination prevention is a stack: better retrieval, allowlists, verbatim validation, banned phrases, hard-fail on retry. Each layer catches what the previous one missed."
  ],

  // -------- DALASI PULSE --------
  [
    "the model suggests it'll buy 8,400-9,100 next month.' The chart is for analysts; the prose is for everyone else (commit ac5e78f).",
    "the model suggests it'll buy 8,400-9,100 next month.' The chart is for analysts, the prose is for everyone else (commit ac5e78f)."
  ],
  [
    "If the date is more than 24 hours stale, it visibly flags it. Honest provenance over fake real-time-ness (commit db5e7b1).",
    "If the date is more than 24 hours stale, it visibly flags it (commit db5e7b1)."
  ],
  [
    "Reframed the dashboard around remittances and made FX the supporting layer. Reframing what the product is about, not just what it shows, was the harder pivot.",
    "Reframed the dashboard around remittances and made FX the supporting layer."
  ],
  [
    "Switched primary to CBG (official) and kept exchangerate.host as a cross-validation backup. Sometimes you build the wrong thing first because the right thing wasn't visible yet.",
    "Switched primary to CBG and kept exchangerate.host as a cross-validation backup."
  ],
  [
    "Wrote a cleaning script: dedupe, outlier removal (3-sigma), and a methodology-break correction factor for pre-2010 rates. The data looked sane after, the forecasts stopped having weird spikes (commit ba82a7e).",
    "Wrote a cleaning script: dedupe, outlier removal (3-sigma), and a methodology-break correction factor for pre-2010 rates. The forecasts stopped having weird spikes (commit ba82a7e)."
  ],
  [
    "Restructured the layout so currency pills sit ABOVE the amount field on mobile, side-by-side on desktop. Mobile-first means actually testing on a real phone, which I should have done sooner (commit 64e7bec).",
    "Restructured the layout so currency pills sit above the amount field on mobile, side-by-side on desktop (commit 64e7bec)."
  ],
  [
    "Read about walk-forward validation and rewrote my evaluation pipeline. Forecast metrics dropped from optimistic to realistic, which was the point.",
    "Read about walk-forward validation and rewrote the evaluation pipeline. Forecast metrics dropped from optimistic to realistic."
  ],
  [
    "Open data exists in unlikely places. The CBG endpoint was sitting in the network tab the whole time. Curiosity outranks documentation. When publishing financial forecasts, honesty about uncertainty (intervals, model ensembles, plain-language interpretation, last-updated timestamps) is the difference between trustworthy data and fake-precise data.",
    "The CBG endpoint was sitting in the network tab the whole time. For financial forecasts, uncertainty intervals, model ensembles, plain-language interpretation, and last-updated timestamps are what make the numbers usable."
  ],

  // -------- FORGE --------
  [
    "The app's job is not to be liked. It's to be the friend who says 'that's not enough, what specifically did you build?' when you try to coast. If I succeed I uninstall it; if I fail I keep it.",
    "The app's job is to push back when I try to coast."
  ],
  [
    "Pattern: the apps that work make failure expensive in a way you actually feel. Apps that just track without consequence are noise.",
    "The apps that work make failure expensive in a way you actually feel."
  ],
  [
    "If you can disable the constraint when willpower is low (which is exactly when you'd want to), the constraint is theatre. PIN-locking the settings is the fix.",
    "If you can disable the constraint when willpower is low, the constraint does nothing. Settings are behind a PIN."
  ],
  [
    "Studied accountability-pod patterns from Nat Eliason, Tim Ferriss, and a few habit-tracking communities. External accountability beats internal accountability when willpower fails.",
    "Studied accountability-pod patterns from Nat Eliason and Tim Ferriss."
  ],
  [
    "The system prompt is calibrated to reject vague claims and require specifics. Faking specifics is harder than just doing the work, that's the whole mechanism.",
    "The system prompt is calibrated to reject vague claims and require specifics. Faking specifics is harder than doing the work."
  ],
  [
    "Streak loss has to be permanent or it isn't a deterrent. Hard, but the whole point of accountability is the cost of failure.",
    "Streak loss has to be permanent or it is not a deterrent."
  ],
  [
    "When you skip, your pod sees it. When they skip, you see it. Social pressure becomes the second deterrent layer behind the streak. Built this in (commit 7fbcdb2). It's opt-in because forced groups feel coercive.",
    "When you skip, your pod sees it. When they skip, you see it. Built this in (commit 7fbcdb2). Opt-in because forced groups feel coercive."
  ],
  [
    "Showing the work IS the work. A public stream of 'today I built X' creates a soft pressure to have something interesting to post. Also doubles as marketing for the app, visitors see real users actually building things. Two-for-one motivational layer.",
    "A public stream of 'today I built X' creates a soft pressure to have something interesting to post."
  ],
  [
    "Using them costs nothing but is visible to your pod. Skipping without grace days resets the streak. Grace makes the system humane without gaming it.",
    "Using them costs nothing but is visible to your pod. Skipping without grace days resets the streak."
  ],
  [
    "Reasons: too invasive for the religious / privacy-conscious users I cared about, and it didn't actually prevent lying about what was DONE, only proved you were physically there. Wrong layer of accountability.",
    "Reasons: too invasive for the religious and privacy-conscious users I cared about, and it proved you were physically there without preventing lying about what was done."
  ],
  [
    "Public ranking turned the system into a competition and produced the wrong incentive: people gaming streak length over real work. Built it, lived with it, deleted it. Some features look good in mockups and bad in production.",
    "Public ranking turned the system into a competition and produced the wrong incentive: people gaming streak length instead of doing work. Built it, lived with it, deleted it."
  ],
  [
    "Rewrote the re-entry as 'day 1 again, what's the first specific thing you'll build?' Reframes the failure as a fresh start without sugar-coating it (commit 7fbcdb2).",
    "Rewrote the re-entry as 'day 1 again, what's the first specific thing you'll build?' (commit 7fbcdb2)."
  ],
  [
    "Added a guest/demo mode (commit 12cdb83), users can try the interrogator without creating an account, the data is wiped on tab close. Lowered the activation barrier to 'click try', 10x more people actually use it once.",
    "Added a guest/demo mode (commit 12cdb83). Users try the interrogator without creating an account, data wipes on tab close. Activation went up about 10x."
  ],
  [
    "Studied multi-criteria decision-analysis literature, rewrote scoring as per-criterion 1-5 with explicit anchors, then aggregated.",
    "Studied multi-criteria decision-analysis literature, rewrote scoring as per-criterion 1-5 with explicit anchors, and aggregated."
  ],
  [
    "The hardest software to build is software that's hard on you. Most apps optimise for retention; FORGE optimises for honesty. Ship the feature, watch how it actually changes behaviour, kill it if it produces the wrong incentive, even if you were proud of it. Removing software is harder than adding it.",
    "FORGE optimises for honesty over retention. The leaderboard and camera proctoring both shipped and were removed when they produced the wrong incentive. Removing software is harder than adding it."
  ],

  // -------- HIREIQ --------
  [
    "Conversation has to feel like a real interview, not a bot quiz, multi-second response delays kill the vibe.",
    "The conversation has to feel like a real interview. Multi-second response delays kill the flow."
  ],
  [
    "Removed the auth screen entirely for `/apply`, anyone with the link can apply, the session token is in the URL (commits a370f33, 540b575).",
    "Removed the auth screen entirely for `/apply`. Anyone with the link can apply, and the session token is in the URL (commits a370f33, 540b575)."
  ],
  [
    "UI shows 'getting interview ready…' for the cold-start window, then transitions cleanly. Hides the bug from the user without papering over it (commit 0c55a07).",
    "UI shows 'getting interview ready…' for the cold-start window, then transitions cleanly (commit 0c55a07)."
  ],
  [
    "Added temperature=0 + a structured prompt with explicit rubric (1-5 on each criterion). Consistency went up 80%. The lesson: scoring needs to be deterministic in a way generation doesn't.",
    "Added temperature=0 plus a structured prompt with an explicit rubric (1-5 on each criterion). Consistency went up 80%."
  ],
  [
    "Switched to direct httpx REST calls, proven working approach (commit f2b896d). 'The library exists' is not the same as 'the library works in production'.",
    "Switched to direct httpx REST calls (commit f2b896d)."
  ],
  [
    "Excluded /apply from AuthProvider entirely (commit 1109b40). Sometimes the right fix is removing the protection from a public page.",
    "Excluded /apply from AuthProvider entirely (commit 1109b40)."
  ],
  [
    "The bug list is the case study.",
    "The bug list is the case study."
  ],
  [
    "You can replace a static form with intelligence at the same UX cost, if you pick the right model for the job. Don't use GPT-4 for what Flash can do. Production is full of edge cases (CORS, cold starts, OAuth loops) that nobody warns you about, the bug list is the case study.",
    "A static form can be replaced with an interview at roughly the same UX cost if the model is chosen for the job. Production is full of edge cases nobody warns you about: CORS, cold starts, OAuth loops. The bug list is the case study."
  ],

  // -------- CREDIT RISK --------
  [
    "It is there to give the loan officer a quantified second opinion, not to take the decision off them.",
    "It gives the loan officer a quantified second opinion rather than taking the decision off them."
  ],
  [
    "A model that passes one and fails another is a red flag. I rejected several feature sets that had high Gini but unstable PSI before settling on the final.",
    "A model that passes one and fails another is a red flag. I rejected several feature sets that had high Gini but unstable PSI before settling on the final set."
  ],
  [
    "I report the number the pipeline actually produces rather than the one I wanted.",
    "The number reported is the one the pipeline actually produces."
  ],
  [
    "Monitoring PSI alone would have reported this model as stable the whole way down.",
    "Monitoring PSI alone would have reported this model as stable."
  ],
  [
    "Stresses the system, not just the score.",
    "The stress test runs the whole book through the scenario, not just the score distribution."
  ],
  [
    "Killed the XGBoost branch and went back to logistic regression. The right model is the one regulators allow, not the one that scores best.",
    "Killed the XGBoost branch and went back to logistic regression. The right model is the one regulators allow."
  ],
  [
    "The implementation taught me what every formula in the book actually meant.",
    "The implementation made the formulas concrete."
  ],
  [
    "Built it on a synthetic test where I manually shifted the distribution and watched PSI track the shift.",
    "Built a synthetic test where I manually shifted the distribution and watched PSI track it."
  ],
  [
    "Re-built the generator with realistic correlations: higher income, then lower default, longer term, then higher default, group lending, then lower default. Then the model could actually learn.",
    "Re-built the generator with realistic correlations: higher income, lower default; longer term, higher default; group lending, lower default."
  ],
  [
    "I know what LGD and EAD are; haven't implemented them. Honest about the scope limit.",
    "I have not implemented LGD or EAD."
  ],
  [
    "The synthetic generator is calibrated to public stats but it can't capture interaction effects I haven't thought of. Also need to extend to LGD and EAD for full Basel II coverage.",
    "The synthetic generator is calibrated to public stats, but it cannot capture interaction effects I have not thought of. I also need to extend to LGD and EAD for full Basel II coverage."
  ],

  // -------- LIFE INSURANCE --------
  [
    "The point was to implement every step myself instead of importing a pre-built actuarial package. Sub-Saharan Africa specifically because the standard models (calibrated on US/UK data) under-represent the constant background hazard rate that matters here, accidents, infectious disease, road traffic, and over-represent old-age mortality patterns that don't apply to a younger demographic.",
    "Every step is implemented myself rather than imported from an actuarial package. Sub-Saharan Africa specifically, because the standard models are calibrated on US and UK data. They under-represent the constant background hazard rate that matters here: accidents, infectious disease, road traffic. They also over-represent old-age mortality patterns that do not apply to a younger population."
  ],
  [
    "Reading the original papers, not the textbook summaries, was where the intuition came from.",
    "The original papers, rather than the textbook summaries, were where the intuition came from."
  ],
  [
    "Read Klein & Moeschberger's 'Survival Analysis: Techniques for Censored and Truncated Data' for the censoring + truncation handling, most insurance data has both (right-censoring when policy term ends, left-truncation for delayed entry).",
    "Read Klein & Moeschberger's 'Survival Analysis: Techniques for Censored and Truncated Data' for censoring and truncation handling. Most insurance data has both: right-censoring when a policy term ends, left-truncation for delayed entry."
  ],
  [
    "Studied Monte Carlo simulation methods, specifically variance-reduction techniques (control variates, antithetic variables). Useful when you need 5,000 scenarios to converge to stable VaR estimates.",
    "Studied Monte Carlo variance-reduction techniques (control variates, antithetic variables) for stable VaR estimates at 5,000 scenarios."
  ],
  [
    "Read about COVID-era mortality shocks across regions to calibrate the pandemic stress scenario. Sub-Saharan Africa's reported pandemic mortality was lower than other regions but with higher uncertainty bands.",
    "Read COVID-era mortality data across regions to calibrate the pandemic stress scenario. Sub-Saharan Africa's reported pandemic mortality was lower than other regions, with higher uncertainty bands."
  ],
  [
    "Had to be auditable, actuarial work is inherently regulated; black-box ML doesn't pass review.",
    "Actuarial work is regulated. Black-box ML does not pass review."
  ],
  [
    "For Sub-Saharan Africa where the constant hazard is materially higher (malaria, road traffic), the Makeham term matters. Better fit, more honest model. Implemented the Makeham fit via maximum likelihood with scipy.optimize, not a canned package.",
    "For Sub-Saharan Africa, where the constant hazard is materially higher (malaria, road traffic), the Makeham term matters. Implemented via maximum likelihood with scipy.optimize rather than a canned package."
  ],
  [
    "lifelines is rock-solid for the regression part. I implemented Gompertz-Makeham fitting myself (where the learning was) and used lifelines for Cox where I just needed a working tool. Pick your battles. The point of the project was to learn, but learning everything from scratch is a different project.",
    "lifelines is solid for the regression part. I implemented Gompertz-Makeham fitting myself, where the learning was, and used lifelines for Cox."
  ],
  [
    "Adding the interaction term (age × risk_class) jumped C-index to 0.77. The interaction was obvious in retrospect: a 25-year-old smoker has different relative risk than a 65-year-old smoker. Cox PH's 'proportional hazards' assumption is violated when interactions matter, and I had to learn that by debugging a low C-index.",
    "Adding the interaction term (age × risk_class) jumped C-index to 0.77. A 25-year-old smoker has a different relative risk than a 65-year-old smoker. Cox PH's proportional-hazards assumption is violated when interactions matter, and the low C-index is what surfaced it."
  ],
  [
    "The pandemic scenario multiplies mortality by 1.8x-3.5x, calibrated loosely to COVID excess-mortality data. 5,000 scenarios is enough for stable 99th-percentile VaR, anything less and the tail estimate jumps around between runs.",
    "The pandemic scenario multiplies mortality by 1.8x to 3.5x, calibrated to COVID excess-mortality data. 5,000 scenarios is enough for a stable 99th-percentile VaR."
  ],
  [
    "I built profiles whose age, sex, and risk-class distributions match Sub-Saharan Africa World Bank data. The model learns realistic patterns, not American actuarial textbook patterns. Would prefer real data; calibrated synthetic is the next-best honest alternative.",
    "The profiles match Sub-Saharan Africa World Bank data on age, sex, and risk class. The model learns regional patterns, not American textbook ones. Real data would be better, and calibrated synthetic is the next best alternative."
  ],
  [
    "Rewrote in NumPy with vectorised sampling, 8 seconds. Same results, 30x faster. The lesson: in numerical Python, the second time you write the loop you're doing it wrong. Vectorise from the start.",
    "Rewrote in NumPy with vectorised sampling. 8 seconds, same results, 30x faster."
  ],
  [
    "Rewrote each cell as a responsive grid with label-left / value-right on phone, full row on desktop. The dashboard ships value to a wider audience because the experience scales (commits 3882545, b89e8c2).",
    "Rewrote each cell as a responsive grid with label-left and value-right on phone, full row on desktop (commits 3882545, b89e8c2)."
  ],
  [
    "Adding the interaction term jumped C-index to 0.77. Standard PH assumption was being violated; the model needed help.",
    "Adding the interaction term jumped C-index to 0.77."
  ],
  [
    "Re-calibrated to age-band-specific multipliers (1.5x at 30-50, 3.5x at 70+). More accurate, more honest.",
    "Re-calibrated to age-band-specific multipliers: 1.5x at 30-50, 3.5x at 70+."
  ],
  [
    "Standardised the y-axis range and added grid lines. Visual comparability matters when the audience is humans not models.",
    "Standardised the y-axis range and added grid lines so the curves compare directly."
  ],
  [
    "Spent a day learning the BFGS optimiser's quirks and how to set good initial parameter estimates so it converges. Bad initial estimates = optimiser diverges = no fit.",
    "Spent a day learning the BFGS optimiser's quirks and how to set initial parameter estimates so it converges."
  ],
  [
    "Variance reduction in Monte Carlo (control variates, antithetic variables) sounded scary in textbooks but reduced my run time and improved tail-estimate stability noticeably once I implemented them. Good textbook techniques are usually less mysterious in code.",
    "Variance reduction in Monte Carlo (control variates, antithetic variables) reduced the run time and stabilised the tail estimates once implemented."
  ],
  [
    "I'd add a reserves projection module, given current policies and the mortality model, what's the IBNR (incurred but not reported) estimate? That's the actuary's bread and butter and I skipped it. Also need to add LGD/EAD analogues for life products (sum-assured at risk). Adding next iteration.",
    "I'd add a reserves projection module: given current policies and the mortality model, what's the IBNR (incurred but not reported) estimate? I also need to add LGD and EAD analogues for life products (sum-assured at risk)."
  ],
  [
    "You learn actuarial science by writing the math. The textbook tells you Gompertz-Makeham; doing the gradient descent yourself shows you why the second term matters in the data you actually have. When the assumptions are violated (proportional hazards, no interaction), the model tells you with a low C-index, listen to it.",
    "The textbook explains Gompertz-Makeham. Writing the gradient descent yourself shows why the second term matters in the data you actually have. When the assumptions are violated, the model tells you with a low C-index."
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
