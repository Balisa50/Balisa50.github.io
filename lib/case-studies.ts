/**
 * Case studies, the engineering memo behind each project.
 *
 * Each project is presented as eight sections that mirror how I actually
 * built it: the problem I felt in the world, what I read before writing
 * any code, what I couldn't do, the decisions that shaped the system,
 * what broke and how I changed course, what I didn't know that I had
 * to learn, what shipped, and what I'd still do differently.
 *
 * Written first-person. Grounded in real commits, not abstract polish.
 * Designed to be read in 2-3 minutes by someone who wants to know how
 * I think before they decide to talk to me.
 */

export interface Decision {
  call: string;       // headline of the decision
  reason: string;     // why this over the alternative
}

export interface CaseStudy {
  slug: string;
  problem: string;
  research: string[];        // what I read / studied before / during
  constraints: string[];
  decisions: Decision[];
  pivots: string[];          // what broke + how I changed course (with specifics)
  weaknesses: string[];      // what I didn't know + how I learned
  outcome: string[];
  regret: string;
  takeaway: string;
}

export const CASE_STUDIES: Record<string, CaseStudy> = {
  "nova": {
    slug: "nova",
    problem:
      "Banks in West Africa hold the data that could power local AI. They cannot share it. Privacy law, customer trust, and competitive advantage keep loan books and transaction histories on bank servers. For rural borrowers, the informal economy, and most of the interior, though, the data does not exist anywhere to begin with. I did not want to build another model that copies a dataset somebody already has. I wanted two things. Learn a real dataset when one exists. Generate realistic data from domain knowledge when none does. Privacy-safe either way, with the validation numbers shown rather than claimed.",
    research: [
      "The CTGAN paper (Xu et al., 2019) is the basis for the model. Two ideas make tabular GANs work: mode-specific normalisation for multimodal continuous columns, and conditional training-by-sampling for imbalanced categoricals. Neither is obvious, and both are implemented from the paper rather than inherited from a library.",
      "The synthetic-data survey (Jordon et al., 2022) and the SDMetrics scoring conventions set the evaluation. They are why the first validation run was measuring the wrong thing. A KS p-value is meaningless at n=10,000. The field scores the KS statistic, the effect size, instead.",
      "WGAN-GP (Gulrajani et al., 2017) is the stabiliser. Plain GAN training on tabular data is unstable. The gradient penalty keeps the critic honest, and PacGAN packing is a cheap defence against mode collapse.",
      "TimeGAN (Yoon et al., 2019) covers sequential data. This project is tabular, so it was not used. It is the right next step for real fraud data.",
      "West African microfinance dynamics set the calibration. Loan sizes run 50 to 2,000 USD. APRs sit at 8 to 30 percent. Default rates at 20 to 30 percent. Group-lending lowers that. Rural borrowers skew agricultural, urban borrowers skew trading. None of this is in the architecture papers, and without it the ground-truth data would be a fantasy.",
    ],
    constraints: [
      "No real financial data. Banks do not hand loan books to students, and the compliance burden makes it a non-starter even when someone is willing. Every number had to be either synthetic-by-design or sourced. Nothing invented and passed off as real.",
      "No generic training set either. German Credit and Kaggle loan dumps do not reflect West African dynamics: group lending, sector-specific default, the informal economy. A model trained on those learns the wrong structure, and I would not be able to defend it.",
      "No GPU. Everything trains on a CPU laptop, so the architecture and the training budget had to stay CPU-feasible. That ruled out the largest networks and forced real choices about width and epochs.",
      "The deployment target is a 512 MB machine. PyTorch plus a RandomForest validation pass is heavy. The backend had to fit a tight memory and image-size budget. That shaped the Docker build and how much I generate per request.",
    ],
    decisions: [
      {
        call: "Build CTGAN from scratch in PyTorch, not on top of SDV.",
        reason:
          "SDV ships a perfectly good CTGAN. Using it would have been a black box. I needed to understand every piece: mode-specific normalisation, the conditional generator and its cross-entropy term, the gradient penalty, the training-by-sampling loop. So I implemented all of it from the paper, with no sdv or ctgan import. That is also what later made the criteria-engine mode possible, since the generator internals were mine to reuse.",
      },
      {
        call: "Build the ground truth as a structural-causal model, not independent draws.",
        reason:
          "Sampling every column independently and forcing a correlation matrix on top produces incoherent data. Validating that a GAN preserves correlations becomes meaningless. So the relationships run through shared latent drivers: education and age load onto income, income onto loan size, risk drivers onto a calibrated default logit. Income really does drive loan size. The generator verifies all ten target correlations and seven integrity constraints on every run. Nested default flags, a borrower cannot default more loans than they took, valid ranges. It fails loudly if a change breaks them.",
      },
      {
        call: "Validate four ways, and pick the metric that tells the truth over the one that flatters.",
        reason:
          "I scored four things rather than one, because they measure different properties: statistical similarity, correlation preservation, train-on-synthetic-test-on-real utility, and privacy. Shape, relationships, usefulness, safety. Twice I changed the metric itself rather than the result. Effect size instead of KS p-values. Distance-to-closest-record instead of a real-versus-synthetic detector. The convenient metric was lying both times.",
      },
      {
        call: "Make NOVA two modes, and refuse to brute-force the second one with seven more GANs.",
        reason:
          "Copying a real dataset is one problem. Generating data for populations where none exists is a different problem, and it needs a rule engine, not a GAN. So I built a criteria engine: define columns, distributions, domain rules, and it generates from nothing. Later, the brief asked for seven separate CTGANs, one per financial domain. I did not train them. Roughly a day of CPU, seven model files, and a weaker create-from-nothing story. The seven domains became presets of the criteria engine instead. A user can define an eighth, or rural-Gambia student records, themselves.",
      },
      {
        call: "Ship a deployed web app on a real backend, not a notebook.",
        reason:
          "A notebook serves an analyst. A running app serves whoever needs the output. The model is served by a FastAPI backend behind a Next.js studio. Upload a CSV and copy it, or pick a domain and create from rules. Getting it live meant solving the unglamorous parts: a CPU-only torch image, a checkpoint that only unpickles under the right library versions. Those decide whether a thing runs in production or just on my machine.",
      },
    ],
    pivots: [
      "My first validation run reported a 4 percent statistical pass rate. That looked like failure. It was the metric, not the model. At n=10,000 a KS p-value collapses to near zero for differences too small to matter. I switched to effect size, mean column-shape similarity, which is sample-size independent and the SDMetrics convention. Kept the p-values as context. Real fidelity: 0.94.",
      "The CTGAN over-produced defaulters. 41 percent against a real 25. Cause: log-frequency conditioning, which I had used to help rare categories during training. It taught the generator a more balanced default base rate than reality. I switched to true-frequency conditioning and added conditional generation so a user can dial the rate directly. The marginal snapped back to real. TSTR rose from about 0.82 to 0.92.",
      "Two columns had a problem. `interest_rate_apr` and `interest_rate_daily` were independent in the generator. They should not be. Daily is apr divided by 36,500, a deterministic identity the GAN had no reason to respect. I added a post-processing step that re-imposes known identities. Synthetic data is now internally consistent instead of subtly contradictory.",
      "My first privacy metric was a real-versus-synthetic detector. It scored about 0.99. I almost reported it as a privacy failure. It is not a privacy metric at all. It measures distinguishability, and a model that simply memorised the training data would be undetectable yet maximally unsafe. I switched to distance-to-closest-record: are synthetic rows abnormally close to real training rows? Ratio 1.10, with 1.1 percent near-duplicates. Kept the detector on as a fidelity diagnostic.",
      "First Docker build was heading for 2.5 GB. The default PyTorch wheel bundles CUDA I never use on a CPU box. Installing the CPU-only wheel cut the image to 367 MB. Then the container crashed on boot. The checkpoint had been pickled under NumPy 2.x and scikit-learn 1.7. Pinning the older versions the brief suggested raised 'No module named numpy._core'. Matching the library majors fixed it.",
    ],
    weaknesses: [
      "I did not appreciate how much of this is domain knowledge rather than architecture. The CTGAN paper gives you the network. It does not tell you that microfinance default sits at 20 to 30 percent, that group lending lowers it, or that rural and urban borrowers borrow for different things. I had to learn the domain before the data meant anything.",
      "Conditional sampling was the lever for utility, and I missed it the first time. My train-on-synthetic score was 0.81 and I assumed the model was under-trained. It was not. I was generating wrong. Sampling the target freely instead of conditioning on the reference prevalence. The same checkpoint jumped to 0.92 once I used it properly.",
      "The four metrics are not redundant, and I only learned that by watching them disagree. A model can match every marginal and still break the correlations. It can be useful for prediction and still sit too close to a real row. Seeing which one disagreed is what stopped me from chasing a single score.",
      "I started out thinking synthetic data meant copying. Building the criteria engine changed that. The more useful thing is generating data that should exist but does not. Different problem, different tool. I would not have seen it if I had stopped at the GAN.",
    ],
    outcome: [
      "A fifth measure the headline four leave out: a classifier tells real from synthetic 89% of the time against a 0.50 baseline. Reported as a diagnostic rather than a gate.",
      "A structural-causal ground-truth set: 10,000 rows by 29 columns of realistic West African microfinance data, with all ten correlations and seven integrity constraints verified on every generation",
      "A CTGAN implemented from scratch in PyTorch. Mode-specific normalisation, PacGAN critic, WGAN-GP, conditional training-by-sampling, early stopping. No SDV or ctgan import.",
      "All four validation metrics pass: statistical similarity 0.94, correlation L1 0.05, TSTR 0.92 (AUC ratio 0.94), and distance-to-closest-record privacy 1.10 with 1.1 percent near-duplicates",
      "A criteria engine that generates data from columns, distributions, and domain rules with no source dataset, behind a whitelist expression evaluator so user-supplied rules cannot inject code",
      "Seven financial-domain presets for create-mode: banking, payments and fraud, insurance, remittances, macro indicators, wealth, and corporate statements",
      "A FastAPI backend serving both copy and create endpoints, live on Fly.io. A Next.js studio with a Create/Copy toggle, live on Vercel. All open source.",
    ],
    regret:
      "The backend runs on Fly's no-card trial, so the machine sleeps after five minutes and cold-starts on the next request. Making it always-on is a card away. 512 MB is tight for the heavier copy-mode validation. DCR shows no memorisation empirically, but it is not a formal guarantee. I would add a differentially-private training option for a formal guarantee. Transaction data here is tabular. Real fraud is sequential, which is why I read TimeGAN. Extending both modes to time series is the next build. I would also push TSTR across all seven domains rather than mainly loans, and add a third mode that blends a handful of real rows with domain rules, for the user who has a little data and a lot of knowledge.",
    takeaway:
      "The GAN took three weeks. Proving the data was worth trusting took longer, and it meant replacing two metrics that flattered the model with two that did not.",
  },
  "gambia-population-projection": {
    slug: "gambia-population-projection",
    problem:
      "The Gambia has no complete civil registration. Deaths go largely unrecorded, so there is no national time series of age-specific death rates, and the country is absent from the Human Mortality Database, the standard input for mortality forecasting. Every long-range public decision still runs on population projections: how many classrooms to build, how large the future labour force and pension bill will be, how many clinics to staff. The only figures available are the UN's. Those were finalised before The Gambia's first-ever digital census in 2024. I wanted to build an independent projection, based on the 2024 census, with uncertainty quantified, that a Gambian could check and a planner could use.",
    research: [
      "Lee & Carter's 1992 paper is the basis for the model. The single-index log-bilinear structure (log m(x,t) = a_x + b_x k_t) is the backbone of every mortality forecast the UN publishes. The classical SVD version was the first implementation, as a transparent baseline.",
      "Brouhns, Denuit & Vermunt (2002) is the Poisson log-bilinear approach. The standard SVD assumes homoskedastic Gaussian errors on log-rates, which is wrong where death counts are small and noisy. Exactly The Gambia's case. Poisson-on-deaths is the principled fix and the basis for the Bayesian version.",
      "Li & Lee (2005) is the coherent forecasting method. A single small-population forecast can drift to implausible long-run mortality. The coherent extension forecasts a country jointly with a reference group so it cannot diverge, and it is why the model pools The Gambia with seven West-African neighbours.",
      "Raftery et al. (2012, PNAS) is the Bayesian hierarchical method the UN adopted for WPP in 2015. Understanding it was necessary before benchmarking against WPP rather than just citing it.",
      "Preston, Heuveline & Guillot's 'Demography' Ch. 6 is the reference for the cohort-component method: survivorship ratios from life tables, Leslie-matrix accounting, the open-age interval.",
      "The Human Mortality Database does not list The Gambia. The thing that made the project feasible is the Farafenni Health & Demographic Surveillance System, running since 1981, and Basse since 2007. Rare multi-decade empirical mortality data for a sub-Saharan country.",
    ],
    constraints: [
      "No civil registration, no national age-specific death-rate series, The Gambia is absent from the HMD. Any model runs on reconstructed or surveillance data, and pretending otherwise would be indefensible to an examiner.",
      "The UN WPP data portal's /data API is token-gated (returns 401 without a generated bearer token), so the obvious programmatic route was closed.",
      "Mid-project the machine's C: drive hit ~50 MB free. The PyMC conda environment, which pulls a multi-GB compiler toolchain, could not install.",
      "PyMC on Windows had no C++ compiler available, so PyTensor fell back to its slow no-compiler mode.",
      "Examiner-grade accuracy: every figure had to regenerate from public data, and I refused to invent any number I couldn't source (I left the exact census total flagged for verification rather than guess).",
    ],
    decisions: [
      {
        call: "Make the data-scarcity limitation the research question, not a footnote.",
        reason:
          "The obvious version of this project is to fit Lee-Carter to the available series and publish a point estimate. That leaves the central problem, no national death registration, unaddressed. So I reframed: how does one build a credible, uncertainty-honest projection for a country with no death registration, and how much do the answers depend on the method and the data vintage?",
      },
      {
        call: "Pin the data to the UN team's open R package, not the token-gated API.",
        reason:
          "When the /data API returned 401, I found that the UN Population Division's own `PPgp/wpp2024` R package publishes the WPP series as plain text in its data-raw directory. I pinned to a specific commit SHA, streamed each (sometimes 50 MB) file, kept only The Gambia's rows, and wrote a checksummed manifest. No token, exact commit version, and it sidestepped the disk limit because the full multi-country files never touch disk.",
      },
      {
        call: "Bayesian Poisson Lee-Carter with a_x fixed and b ~ Dirichlet(1).",
        reason:
          "Estimating a_x, b_x and k_t jointly creates the classic Lee-Carter identifiability ridge, and NUTS would not mix (r-hat ~1.02). Fixing a_x at the empirical mean log-rate (which is literally how Lee & Carter define it) and constraining b to the simplex via a Dirichlet removed the ridge and let the chains converge, while still propagating full parameter and forecast uncertainty into life expectancy.",
      },
      {
        call: "Validate the projection engine against WPP before trusting it with my own inputs.",
        reason:
          "A cohort-component engine has a hundred places to get an index or a survivorship ratio subtly wrong. So I fed it WPP's own mortality, fertility, sex-ratio and migration and checked that it reproduced WPP's published projection. It matched to within 0.3 to 0.9% through 2074. Only then did I swap in the census base and my own mortality.",
      },
      {
        call: "Re-base the whole projection on the 2024 census, and vectorise it over 1,000 simulations.",
        reason:
          "WPP's 2023 population is ~13% above the new census, so starting from WPP would bake in the overcount. I reconciled the base to the census total and its broad age structure, then ran the cohort-component model over 1,000 simulated mortality and fertility futures, carrying the population as an (age × simulation) matrix, which vectorises the run and produces credible intervals rather than a single line.",
      },
    ],
    pivots: [
      "The UN WPP /data API returned 401 across every variant I tried. Instead of chasing a token, I reverse-engineered the download site, found it builds file URLs from a runtime manifest, and then discovered the cleaner source entirely: the UN team's `PPgp/wpp2024` package on GitHub. Pinned a commit, streamed and filtered to Gambia. The blocker turned into a more citable, more reproducible pipeline.",
      "The PyMC conda environment failed mid-install with 'No space left on device', the disk was at 50 MB. I cleared regenerable caches, confirmed system Python already had numpy/scipy/pandas, and installed PyMC lean via pip into system Python rather than the multi-GB conda toolchain. The Bayesian model that 'needed' conda ran fine on a 200-line pip install.",
      "The first Bayesian fit would not converge. The 101-dimensional Dirichlet plus a free a_x left a ridge in the posterior. Fixing a_x at the empirical mean (the classical definition) dropped max r-hat from ~1.02 to 1.010 and lifted the effective sample size into the thousands for the parameters that matter.",
      "Halfway through I noticed WPP's 2023 population (2,728,905) sits about 13% above the 2024 census (around 2.42M), and runs above every historical Gambian census too. WPP was finalised before the census came out, so I rebuilt the projection on the census base.",
    ],
    weaknesses: [
      "This was my first time fitting Lee-Carter in a fully Bayesian framework. I learned why the identifiability constraints (sum of b = 1, sum of k = 0) exist the hard way, by watching chains refuse to mix until I imposed them properly.",
      "PyMC sampled without a C compiler, so a single 4-chain run took ~8 minutes. I learned to validate the model on a short run (and on synthetic data with known parameters) before committing to longer ones, and to background the long runs.",
      "The open-ended 100+ age group in the Leslie matrix is genuinely fiddly. Rather than fake precision I used a one-year survival approximation for the open group and confirmed it doesn't move the national totals or dependency ratios, because almost no one is over 100.",
    ],
    outcome: [
      "Eleven reproducible modules, from data fetch and life tables through the classical, Bayesian and coherent mortality models to the projection engine and validation",
      "Life table reproduces WPP's published e0(2023) of 65.86 exactly",
      "Lee-Carter backtest (fit up to 2010, predict 2011 to 2023): 0.65-year mean error, with the truth inside the 95% range every year",
      "The three mortality methods agree on life expectancy in 2074 to within about 0.8 years.",
      "Cohort-component engine validated to within 1% of WPP's published projection",
      "Population reaches 4.66M by 2074 (range 4.35 to 4.98M), from a census base rather than the UN's pre-census estimate",
      "The demographic dividend quantified: the dependency ratio falls from 77 to 49 while old-age dependency triples",
      "Full research report plus a plain-language policy brief written for Gambian media and planners",
    ],
    regret:
      "I haven't yet digitised the Farafenni and Basse HDSS published life tables or run a GBD cross-check. Both would turn the validation chapter from 'validated against the UN's reconstruction' into 'validated against independent empirical Gambian data'. I flagged them as remaining data tasks rather than inventing numbers. I'd also fit the Bayesian model sex-specifically for the projection and add the UN's own bayesPop as a fourth benchmark.",
    takeaway:
      "The UN projection was finalised before the 2024 census, so its base is out of date. Re-basing on the census moves the 2074 figure down by roughly 0.7 million.",
  },
  "ayat": {
    slug: "ayat",
    problem:
      "I had been reading the Qur'an my whole life through scrolling apps that treat the book as a list of 6,236 numbered cells. Every Quran app does the same thing: scroll, tap, scroll, tap. But the Qur'an is not linear. It loops. It cross-references itself. Surah 2 borrows imagery from Surah 12. Surah 12 mirrors structures from Surah 7. Reading it linearly is like reading a hypertext document with all the links removed. I wanted to make those connections physically visible. Let a reader feel the book's geometry instead of just see its text.",
    research: [
      "The UMAP paper (McInnes, Healy 2018) is the reason for picking it over t-SNE. UMAP preserves global structure better, which is what the visualisation needs: themes have to land near each other across the whole corpus, not just locally.",
      "Two sentence-transformer candidates were tested: `all-mpnet-base-v2` (768-dim, slower) and `all-MiniLM-L6-v2` (384-dim, faster). MiniLM lost about 3% on cluster coherence over a 200-verse sample but ran 2.5x faster on CPU. MiniLM was picked because the corpus is fixed and the speed allows iterating on clustering parameters at no cost.",
      "Existing Quran apps (Quran.com, Tarteel, Muslim Pro, Bayyinah) all share one thing: the verse list. None of them have a spatial sense of the corpus.",
      "Three.js batching was the constraint. Naive Three.js creates one DrawCall per object, fine for 50 cubes, fatal for 6,236 verses on a phone. Three example codebases were compared, two using InstancedMesh and one using a Points cloud, before writing this one.",
      "Aupetit and Espadoto's work on user-steerable projections (arXiv 2506.15479, June 2025) is the reference for the query-driven layout. Their approach zero-shot-classifies every item with an LLM, then re-runs UMAP. Reported throughput is 2.4-3.6 items/sec, which for 6,236 verses is roughly half an hour per question. That number is why the projection is steered geometrically from the query vector alone, and why exactly one model call runs afterwards, on labelling, instead of six thousand.",
      "The Meccan / Medinan classification is free metadata. Surahs were revealed in two distinct phases (Meccan: 13 years, cosmic, urgent, short; Medinan: 10 years, legislative, communal, long). Colouring by revelation period gives the map a layer of meaning a religious reader already recognises.",
    ],
    constraints: [
      "Free tier on everything. No GPU, no managed vector DB, no paid embeddings API. If a feature required a paid service I had to either find a free path or skip it.",
      "Static export hosted on Vercel free tier. No long-running server I'd have to pay for when I left the laptop closed.",
      "LLM spend had to stay near zero. Every uncached AI call cost real money I didn't have, so caching had to be aggressive from the first deploy.",
      "Had to render 6,236 particles smoothly on a Tecno or Infinix Android phone. Those are the devices my actual users would have. iPhone-only WebGL was unacceptable.",
      "Audio for 18 reciters had to load progressively without choking 3G connections, a single Hafs recitation of the full Qur'an is ~2GB.",
    ],
    decisions: [
      {
        call: "Embed once in Python, ship a static JSON. Never embed at runtime.",
        reason:
          "The corpus is fixed forever, 6,236 verses, never changes. So I run sentence-transformers locally, project to 3D with UMAP, cluster with HDBSCAN, then dump the result as a JSON file the frontend just downloads. No vector DB, no embedding API at runtime, zero per-user cost.",
      },
      {
        call: "One WebGL point cloud, not HTML/SVG/canvas.",
        reason:
          "6,236 DOM nodes melts a phone, sustained 60fps rotation requires GPU. I looked at InstancedMesh first, which is the usual answer for batching, but instanced geometry is overkill for particles that never rotate and always face the camera, it carries a full transform matrix per instance you'd never use. A single THREE.Points cloud with PointsMaterial draws all 6,236 as one call with three floats of position each. Getting per-particle behaviour out of it meant learning shader-level customisation, so I inject a custom vertex/fragment shader via onBeforeCompile with attribute-based color and a per-point size attribute driving the glow and pulse.",
      },
      {
        call: "Color verses by Meccan vs Medinan revelation, not by cluster ID.",
        reason:
          "Cluster IDs are abstract. A religious reader looking at the galaxy needs the visualisation to mean something they already understand. Coloring by revelation period gives the cosmos an immediate readable narrative, early Meccan verses (cosmic, urgent) cluster together, late Medinan verses (legislative, communal) cluster together. The map reads before anyone clicks anything.",
      },
      {
        call: "Ship the full 384-dim embeddings rather than reuse the PCA-64 already in the file.",
        reason:
          "The galaxy already shipped a 64-dim PCA vector per verse, so reusing it for semantic search was free and I assumed it would work. It didn't, and only measurement showed why. PCA-64 ranks fine but destroys absolute similarity calibration: projecting into a 64-dim subspace and renormalising inflates whatever component survived, so an unrelated query scores as high as a relevant one. Scored over 34 probe queries, top-10 mean cosine separates on-topic from off-topic with AUC 1.000 in 384-dim and AUC 0.480 in PCA-64, which is worse than a coin flip. So the full vectors ship, int8-quantised: 2.4 MB instead of 9.6 MB, mean cosine fidelity 0.999, 97% agreement on top-20 ranking. Absolute scores are what let the app say the Qur'an does not address something.",
      },
      {
        call: "Reprojection swaps what 'home' means instead of adding an animation system.",
        reason:
          "The galaxy's physics loop already springs every star toward a home position each frame. So query-conditioned layout doesn't animate anything itself, it just changes what home is, and the existing spring carries the whole corpus into the new geometry at damping the galaxy was already tuned for. One prop, no second tween to keep in sync, and it composes with the pulse and shooting-star states rather than fighting them. The projection maths runs client-side in about 22ms for 6,236 verses at 384 dimensions.",
      },
      {
        call: "Let an unanswerable question return nothing.",
        reason:
          "Every search interface returns something. Type anything into any Qur'an app and it returns a ranked list, which implies an answer exists. Because the 384-dim scores are absolutely calibrated I can set a floor with a measured basis rather than a guess: 20 deliberately off-topic queries score 0.187 to 0.442 on their best match, 14 on-topic ones score 0.412 to 0.735. Below the floor the galaxy stays dark and the readout says the Qur'an does not frame it that way.",
      },
      {
        call: "AI tafsir cached per verse globally, not per user.",
        reason:
          "Once the model has analysed verse 2:255, that analysis is the same for every user. I cache it server-side keyed on `surah:ayah`, so the second user pays nothing. With ~6,236 verses, the entire tafsir corpus costs about $30 to generate once, then is free forever.",
      },
      {
        call: "Custom pill dropdown for reciter selection, not native <select>.",
        reason:
          "Native selects render inconsistently across mobile browsers, different on iOS, Android Chrome, Samsung Internet. I needed a dropdown that visually matched the cosmos aesthetic and wrapped its width to the reciter's name (some names are long, 'Mahmoud Khalil Al Husary'). I went through three iterations: bleed-off-screen bug, clipping inside parent containers, then portal-rendered with smart up/down placement. A small detail, hours of work, a real UX upgrade.",
      },
      {
        call: "Theme search animates the matched stars, dims the rest, and locks clicks.",
        reason:
          "When a user searches 'mercy', the matching verses light up across the cosmos. But the unmatched verses were still clickable, which broke the focus. I added a state machine: during search-results mode, all non-matched stars become un-clickable and dim, matches stay bright at their settled positions until the user clears the search. Without this, users would tap a dim star by mistake and exit the results.",
      },
    ],
    pivots: [
      "The feature I was proudest of designing did not survive measurement, and killing it was the right call. The plan was that a question would fan the matching verses into a ring of labelled arcs, so 'mercy' would separate into mercy-as-forgiveness, mercy-as-provision, mercy-as-withheld-punishment. I built a demo on synthetic vectors and it looked beautiful. Then I checked it against the actual corpus. The residual after removing the query direction is essentially one-dimensional: across five queries the first eigenvalue carries 22-33% of the variance and the second only 4-6%, indistinguishable from the third and fourth. My two-axis fan was spreading verses along one real direction and one axis of pure noise. I tried clustering the matched set instead, and k-means silhouette scored 0.03-0.07 for every k from 2 to 6, which is near zero, meaning the groups overlap almost entirely. This corpus is semantically continuous rather than clumpy, which is the same property that made HDBSCAN call 78% of it noise.",
      "What survived that measurement is different from what I designed. One axis of difference is real and reads as a genuine polarity: for 'mercy' it runs from divine attribute (The Most Merciful) to mercy enacted (protect them from evil consequences); for 'patience in hardship' from the counsel to be patient to the affliction itself; for 'forgiving my father' from literal kin to repentance before God. So the galaxy spreads answers along one named axis instead of a fictional ring, and the two ends are labelled by one cached model call rather than the arcs I could not produce. The visualisation now claims only as much structure as the data contains.",
      "First version did the embedding + clustering at request time on Vercel Edge. It worked but took 8 seconds on cold start. Moved everything to a one-shot Python pipeline that writes the static file at build time. Cold start is now instant. Documented in commit 9520c55: galaxy physics, video reset, debounce, shooting stars all stabilised together.",
      "Originally fetched the AI analysis on every verse open. Realised most users skim, so I made it click-to-reveal, the analysis only fetches when the user explicitly asks for it. Cut my LLM spend by ~70%. This pattern became the default for every AI feature in v2.",
      "First tour implementation had a race condition where the next step would fire before the previous step's animation finished. Caused card overlap on mobile (commit 0309957). Fixed by holding tour state in a state machine with explicit transitions instead of setTimeout chains.",
      "Theme search was originally just keyword matching. Got too many false positives, 'mercy' would match every verse with 'merciful' which is most of the Qur'an. Added synonym expansion + PCA-64 semantic boost, narrowing matches to verses that are actually about mercy as a theme.",
    ],
    weaknesses: [
      "I made the same calibration mistake twice in one feature, in two different places, and only caught it because I tested the output instead of trusting the code. Both times I normalised a score to its observed range when the meaning depended on its absolute value. First in the coherence readout, where mean-centring made a deliberately unanswerable question score highest of the four I tried. Then again in the galaxy layout, where min-max normalising relevance stretched any query to fill the range, so 'kubernetes pod autoscaling config' pulled 1,416 verses into the bright core against 510 for 'mercy'. Exactly backwards, and it would have looked plausible on screen. Relative normalisation quietly destroys any claim about absence, and absence is the thing this feature exists to express.",
      "I shipped a NaN into the single best-matching verse and did not see it for a while. Relevance was stored as float32 but the bounds were captured from the float64 accumulator, so a value that rounded above the maximum pushed the normalised term just past 1, and a negative base raised to a fractional power is NaN. It affected exactly the top hit for a query, the one verse a reader is most likely to look at, and everything else rendered fine. Now the bounds come from the stored values and the term is clamped as well.",
      "I had never written a fragment shader before this project. Spent two weeks learning GLSL through The Book of Shaders, then implemented per-particle glow on hover. The per-point size attribute I feed into the injected shader is the result of that struggle.",
      "I didn't know what UMAP and HDBSCAN actually did at the math level when I started, and it cost me. I read the papers and ran both on toy datasets, but I shipped the clustering step silently broken: UMAP was correctly using cosine distance while HDBSCAN ran euclidean on the raw 384-dim embeddings, where density estimation falls apart. 78% of the corpus came back as noise with one surviving cluster of 33 verses, and I never checked the label distribution, so 'clustered with HDBSCAN' sat in my README for months while being effectively untrue. The fix is the standard one BERTopic uses, cluster on a UMAP-reduced space rather than the raw vectors, and it took noise from 78% to 1.2%. I had validated the visualisation by looking at it, and never validated the numbers underneath it.",
      "Three.js performance was a steep learning curve. My first prototype used regular Mesh objects in a loop, 4fps on a phone. Rewriting as a single THREE.Points cloud + custom shaders + reducing pixel ratio on low-end devices got it to a steady 60fps.",
    ],
    outcome: [
      "All 6,236 verses live in the galaxy with semantic neighbour relations",
      "Semantic search that runs entirely in the browser, no inference server",
      "The galaxy reshapes itself around the question, along one measured axis of meaning",
      "Says so when the Qur'an does not address a question, instead of returning a plausible list",
      "Clustering stopped collapsing: noise fell from 78% to 1.2%. Measured afterwards it recovers only 2 coarse clusters at a silhouette of 0.06, so the noise share was never evidence of quality",
      "The trail remembers the question that led to each verse, not just the destination",
      "18 reciters with word-level audio highlighting",
      "Sub-1-second initial load on 3G",
      "AI tafsir caches globally, second user pays nothing",
      "Theme search with synonym expansion, click-locked results",
      "Custom shader-based particle glow",
      "Guided onboarding tour with state-machine transitions",
    ],
    regret:
      "I proposed the labelled-arc feature publicly before I had tested whether the structure existed. The write-up was confident, the demo was persuasive, and the whole thing rested on synthetic vectors with the clusters planted in them by construction. If I had run the eigenvalue check first, an afternoon's work, I would have designed the one-dimensional version from the start.",
    takeaway:
      "When the corpus is fixed, do the expensive work once and ship the artefact. When the per-user cost is zero, the app runs on free tiers forever. The narrower lesson: measure the claim your design depends on before you build on it. Two thirds of the proposed feature died to an eigenvalue check and a silhouette score.",
  },
  "vantage": {
    slug: "vantage",
    problem:
      "Tech news is unreadable. The volume per day is in the hundreds of thousands of articles globally, and most of it is noise, patch notes, gadget sales, recycled press releases, identical takes on the same Reuters wire. I wanted a feed that did the synthesis for me, scored each story by signal strength, and let me skim only what mattered across six regions. I also wanted it to read like editorial, in the register of Ben Thompson or The Economist.",
    research: [
      "The Stratechery structure is the model: every piece is a verdict (the headline IS the thesis), follow the money first, name names, end with a falsifiable prediction. It became an explicit system prompt with banned phrases ('In a move that…', 'It's worth noting…') and required structures.",
      "NewsAPI's free tier sets the pipeline: 100 requests/day, language=en filter, 10 articles per query. That number rules out parallel fan-out across six regions, so the regions chain through a single daily run.",
      "Vercel's Hobby plan sets the constraints: crons run once per day max, edge functions time out at 60s. Those two limits shaped everything: chain-of-regions through a single cron, every region fits inside 60s, drop the slowest sub-pipelines.",
      "The provider's pricing tiers made Haiku the choice. Sonnet costs 3x as much. For an unattended synthesise-and-score pipeline, Haiku at one-third the cost is the right trade. The strict prompt carries the editorial voice.",
      "RSS (RFC 5005 and the general specs) is the entry point. Most regional tech publications publish RSS even if their websites are bad, Africa especially: TechCabal, Disrupt Africa, Iwacu. RSS was the cheapest way in.",
    ],
    constraints: [
      "Free Vercel Hobby plan, one cron per day max, edge functions timeout in 60 seconds.",
      "Free NewsAPI tier, 100 requests/day total across the whole pipeline.",
      "Free Supabase tier, 500 MB DB, no concurrent connection pooling.",
      "LLM budget: tight. Every article generated had to be cheap or the system breaks at scale.",
      "Editorial voice has to be consistent, no boring summaries, no generic AI prose.",
    ],
    decisions: [
      {
        call: "Chain-of-regions cron, not parallel fetch.",
        reason:
          "The single daily cron at 8 AM UTC hits `/api/generate-articles?region=global`. That route, once done, fires off `/api/generate-articles?region=africa` using a chain-secret header. Africa fires asia. Asia fires europe. Six regions, one cron entry, no fan-out, stays inside Vercel free-tier limits while still hitting every region daily. The chain is held together by a fire-and-forget fetch and a shared `x-chain-secret` env var. If one link breaks the chain dies silently, which is acceptable since the next day's run starts the chain over.",
      },
      {
        call: "Slug-based de-duplication BEFORE the AI call.",
        reason:
          "NewsAPI returns the same headline from multiple sources (Reuters, AP, then 30 outlets quoting them). I slugify the title and check Supabase first, if the slug exists, skip the model entirely. Saves the LLM call on roughly 70% of what NewsAPI returns.",
      },
      {
        call: "Edge runtime + direct fetch to the LLM provider, no SDK.",
        reason:
          "The an LLM Node SDK pulls in dependencies that don't run on Vercel Edge. I wrote a 30-line direct fetch to `the provider's messages endpoint` instead. Edge runtime keeps cold starts under 100ms (vs ~800ms for Node runtime), which matters when six chained route calls are racing the 60-second timeout. Also cuts deployment size.",
      },
      {
        call: "Strict editorial system prompt with explicit banned phrases.",
        reason:
          "VANTAGE exists so articles read like editorial, not like a language model explaining the news. The system prompt is ~400 words of explicit constraints: every headline is a verdict, follow the money first, name names, no em-dashes (use commas/colons/periods only), no 'it's worth noting' / 'interestingly' / 'in a move that…', short paragraphs (2-3 sentences), end with a falsifiable prediction.",
      },
      {
        call: "Use Haiku for the pipeline, not Sonnet.",
        reason:
          "Article synthesis is high-volume and low-stakes-per-token (the pipeline can re-generate tomorrow if today's output is mediocre). Haiku at 1/3 the cost lets the pipeline run sustainably on the budget I had. The strict editorial system prompt does the heavy lifting, Haiku follows it well enough for the format.",
      },
      {
        call: "Region-by-region article cap (1 per region per run).",
        reason:
          "Originally tried to generate 3 articles per region per cron. Hit Vercel's 60s edge timeout repeatedly. Cut to 1 per region per run. Less content per day, but the cron completes.",
      },
      {
        call: "Disable article deletion when credits run out, even though it bloats the feed.",
        reason:
          "Originally a nightly /api/expire cron deleted articles older than 48 hours to keep the feed fresh. When LLM credits exhausted, regeneration stopped, but expiration kept running. I'd wake up to a half-empty feed with no way to refill it. Disabled the expire cron, and the route now returns `{disabled: true}` even on manual trigger.",
      },
    ],
    pivots: [
      "First version stored articles forever. Quickly the feed had 800 articles and the page took 4 seconds to load. Added the /api/expire route to delete >48h. Then ran out of credits, disabled deletion. The feed now persists historic articles intentionally.",
      "Pipeline timeout was a recurring battle. First attempt with full prompt at 4000 tokens timed out. Trimmed prompt, then still timed out. Switched Haiku, then fitted. Then added Reddit + HN sub-pipelines, then timed out again. Dropped them. Final: lean RSS-only ingestion, 2500 tokens, Haiku, fits 60s. Half the iterations were add capability, blow timeout, remove capability.",
      "NEXT_PUBLIC_SITE_URL was hardcoded to a stale Vercel auto-URL (`vantage-three-chi.vercel.app`) that broke after a project rename. The chain-of-regions silently died because `fetch().catch(() => {})` swallowed the DNS error. No alarm fired; the feed just stopped updating regional content. Took me weeks to notice because global was still working.",
      "Found a stray `OneDrive/Desktop/FORGE/` folder accidentally committed inside the vantage repo (probably a Windows OneDrive sync mishap). Vercel build failed with a TypeScript error pointing into FORGE's `prisma.config.ts`. Removed the folder, added it to .gitignore.",
    ],
    weaknesses: [
      "I didn't fully understand SSE streaming when I started. Vercel Edge has different streaming semantics than Node. Spent a day debugging why chunks were buffering instead of arriving incrementally. Fix was using `controller.enqueue(encoder.encode(chunk))` instead of trying to write to the response body directly.",
      "I underestimated how aggressive Vercel's edge timeout is. 60s sounds like a lot until your pipeline does fetch, then JSON parse, then embedding lookup, then the model call, then DB insert per article. Learning to budget across the chain (under 10s per article, leave headroom for cold start) took a while.",
      "I learned the hard way that NewsAPI sorts by `relevancy` differently across regions. 'AI' in `global` returns major AI labs news. 'AI' in `africa` returns 80% Nigerian fintech. Ended up using region-specific keyword sets and RSS feeds for non-global regions to escape NewsAPI's relevancy bias.",
    ],
    outcome: [
      "6 regions × 6 categories = 36 distinct content streams",
      "Single daily cron, fully autonomous, runs on Vercel free tier",
      "Articles scored 1-100 by signal strength",
      "Each article structured: headline (verdict), what happened, why it matters, who wins/loses, what to watch (with falsifiable prediction)",
      "Slug-based de-duplication before any AI call",
      "Edge runtime + direct the LLM provider fetch (no SDK overhead)",
      "Graceful degradation: when credits exhaust, articles persist instead of dying silently",
    ],
    regret:
      "I'd add an embedding-based 'find me articles like this one' next step. Right now the user picks a region and category. Semantic similarity would be more useful than topical buckets. The same approach from AYAT would work here.",
    takeaway:
      "De-duplicating before the model call cut roughly 70% of the LLM spend. The free-tier constraints (60s timeout, 100 requests a day, 500 MB database) shaped the whole pipeline: chain-of-regions instead of parallel fetch, RSS instead of scraping, Haiku instead of Sonnet.",
  },
  "gambia-legal-aid": {
    slug: "gambia-legal-aid",
    problem:
      "Gambians have almost no access to legal information. Lawyers are scarce and expensive, a one-hour consultation is more than a week's wage for most. The laws themselves are scattered across PDFs that most people will never find or be able to read. Hallucinated legal advice from a chatbot would be actively harmful: a person told they have rights they don't, or vice versa, in matters of arrest, dismissal, eviction, domestic violence. The requirement was a chatbot that refuses to invent an answer, even at the cost of being less useful.",
    research: [
      "The full text of every Act ingested (Constitution, Criminal Code, Labour Act, Children's Act, Sexual Offences Act, Domestic Violence Act, Immigration Act, Rent Act 2014/2017/2024) set the system prompt. Grounding cannot be enforced without knowing what grounded actually means.",
      "Westlaw and LexisNexis cite by section number, sub-section, and Act. The retrieval had to surface those exact metadata pieces or the citations would be unverifiable.",
      "The pattern from the Constitutional AI paper and the provider's RAG literature is: validate the answer against the retrieved context BEFORE returning it. If the model hallucinated, reject and retry.",
      "Curly-quote vs straight-quote behaviour differs across browsers and PDFs. The model would generate the curly version of \"section 14\" when the source text had the straight version, and the substring validator initially missed this and let hallucinations through.",
      "Gambian legal cases on unfair dismissal, domestic violence prosecutions, and immigration appeals set the topic anchors, so the retrieval surfaces the sections that matter to real disputes.",
    ],
    constraints: [
      "Hallucinated legal advice is worse than no legal advice, could literally harm people who acted on it.",
      "No budget for managed vector DB. Had to build retrieval cheaply on Supabase pgvector + a TF-IDF layer.",
      "Statute PDFs are messy: scanned text, inconsistent formatting, mixed heading styles, footnotes baked into body text.",
      "Mobile-first UI, the audience is mostly phone users on slow connections. Streaming had to feel natural, not like a stuck page.",
      "Gambian English has its own register; the system had to switch tones depending on whether the user asked a legal question or just chatted.",
    ],
    decisions: [
      {
        call: "Groq Llama 3.3 70B as the generation model, not the model or GPT-4.",
        reason:
          "Legal Q&A is high-volume (every Gambian who has the link uses it for free) and the cost math has to work. Groq's Llama 3.3 70B is fast (sub-second first token), generous on free tier, and quality is high enough for the format I need (one tight paragraph with citations). The strict system prompt + multi-layer hallucination guard does the heavy lifting; the model itself just needs to be coherent and follow instructions. Priced for a public-good product.",
      },
      {
        call: "Multi-layer hallucination guard: section allowlist + verbatim quote validation + banned phrases.",
        reason:
          "Standard RAG guards against hallucination by retrieving good context. This pipeline adds a per-Act allowlist mapping section number to section title. The prompt instructs the model to cite ONLY numbers from this allowlist, AND to quote any direct text VERBATIM as a substring of the retrieved chunks. Post-generation validator: every cited section number is checked against the allowlist; every quoted span is checked as a substring of context. Anything that fails is hard-rejected, the system retries with explicit feedback ('you cited section 15 but only sections 14, 18, 22 are valid; quoted text was not in context'). If the retry also fails, the system refuses to answer rather than ship a bad citation.",
      },
      {
        call: "Section title allowlist with claim-matching, not just number allowlist.",
        reason:
          "An early bug had the model citing the right number but for the wrong reason, 'Section 15 (Powers of tribunal) for a claim about notice periods' when notice was actually Section 14. Numbers matched, semantics didn't. Fixed by passing the full allowlist as `15. Powers of tribunal\\n14. Notice of termination\\n…` so the model could see WHY each number existed and match the claim to the right title (commit 2102d0e).",
      },
      {
        call: "TF-IDF ranking + topic anchors + low temperature, layered.",
        reason:
          "Pure semantic search returned the chunks closest in meaning to the query. But legal queries often involve specific terms that semantic search smooths over (e.g. 'section 130' as a phrase). I added TF-IDF ranking on top to surface chunks containing the rare terms, plus topic anchors (hand-curated keyword maps like `unfair dismissal, then [Sections 130, 132, 139, 140 of Labour Act]`) to force-include sections that had to be in scope. Low temperature (0.1-0.2) eliminated the model's tendency to creatively combine unrelated chunks. Three orthogonal lenses, layered (commit 88d0e72).",
      },
      {
        call: "Multi-word anchor filtering when building the SQL OR clause.",
        reason:
          "The retrieval query was being built dynamically as `text ILIKE '%anchor1%' OR text ILIKE '%anchor2%'…`. Multi-word anchors like 'unfair dismissal' were getting passed in but Postgres ILIKE treated them as literal strings, fine. The problem: low-signal terms ('the', 'and') were polluting the OR clause and matching everything. Filtered to drop those when high-signal terms were present (commit 05a9f64).",
      },
      {
        call: "Stream the answer word-by-word AFTER validation, not during generation.",
        reason:
          "Standard SSE streaming would write tokens as the model produces them. But if a hallucinated citation appears mid-stream, it cannot be pulled back, the user already read it. Instead I generate the full answer, validate it, then stream it word-by-word for the typewriter effect. Slightly slower start (the user waits ~3s for first token instead of ~1s), but every word that appears has already been validated (commit dc4ae3f).",
      },
      {
        call: "Banned-phrase list: no 'consult a lawyer', no 'review your contract'.",
        reason:
          "The user is here because they do not have a lawyer, so 'consult a lawyer' is not useful advice. Banned at the prompt level and at the post-processing level. If the model slips them in, the post-processor strips them (commits 5f68053, 61a93b1).",
      },
      {
        call: "Section number extraction via 'NUMBER. Title' inline regex, not block parsing.",
        reason:
          "Statute PDFs vary wildly in heading style. Some have section numbers as `Section 14.`, others as `14.`, others embed them mid-paragraph. Block-based parsing missed half of them. Switched to an inline regex pattern that matches `NUMBER. Title` wherever it appears in the text. Caught more sections, including ones that were headings inside paragraphs (commit f7133d7).",
      },
      {
        call: "Diagnostic response headers in production, `X-Search-Error`, build IDs.",
        reason:
          "When something failed in production, I had no easy way to see why. Vercel logs were behind a paywall I couldn't afford. I added response headers: `X-Search-Error` for retrieval failures, `X-Build-Id` for caching debugging. Every response carries enough metadata that I can debug a user's issue from their browser dev tools alone (commits a361856, c13ecd9).",
      },
    ],
    pivots: [
      "First version retrieved top-5 chunks unconditionally and let the model write whatever. Tested it on questions outside the corpus, it confabulated convincingly, citing fake section numbers with fake quotes. Built the citation-anchor and verbatim-quote check as the gate. Pass rate dropped sharply.",
      "Initial chunking was naive 1000-char windows. A user asked about marriage law and got back chunks from a tax statute that happened to share a phrase. Switched to section-aware chunking: parse the statute's section markers, chunk on them, each chunk is a self-contained legal unit (commit 22f5c6f).",
      "Curly quotes vs straight quotes broke the validator silently. the model would output the curly version of a quoted span and the substring check against straight-quote source text would fail to match. Tightened the regex to normalise both flavours and added 3-word span detection (commit 8cb717a). The bug was invisible in dev (where I copy-pasted source) and only appeared in production where the model's outputs differed from my inputs.",
      "Added a hard-fail validation that REFUSES to ship the answer if the retry also produces hallucinated citations. Logging shows the user 'I couldn't find this in the statutes I have' instead of returning a confidently wrong answer. The metric I optimise is fabricated citations per million queries, and hard fail is the way to drive it to zero (commit 5d5a1e4).",
      "Surfaced 400-status messages in the UI. Originally the client showed 'Something went wrong' for every failure. Legal-validation rejection now shows 'I couldn't ground this in the statutes I have' instead of 'Something went wrong' (commit 5f68053).",
    ],
    weaknesses: [
      "I did not understand TF-IDF deeply enough at the start. Pure semantic retrieval was failing on rare-but-critical terms (specific section numbers, specific named provisions). Spent a weekend reading sklearn's TF-IDF implementation, then wrote my own minimal version that combined cosine similarity from embeddings with sparse TF-IDF scores. The hybrid retrieves better than either alone.",
      "I had never written a hallucination guard before. First version was just 'check each cited section number against the source'. That caught 30% of bugs. Iteratively added: verbatim quote check, section title matching, banned phrase post-processing, hard-fail on retry, diagnostic headers. Each layer caught a class of failure the previous layers missed.",
      "I didn't know how messy real statute PDFs would be. Footnotes inline in body text, OCR errors ('s.l4' instead of 's.14'), inconsistent section numbering across acts. Wrote a per-Act ingestion script that normalised each one's quirks before chunking. It is not generalisable. Every act needed its own preprocessing rules.",
      "I underestimated how aggressively users would test the system. Within a week of deploying, someone asked 'what does the constitution say about [made up topic]?', the model used to confabulate. Adding the hard-fail was the response to that.",
    ],
    outcome: [
      "Live RAG chatbot answering Gambian legal questions",
      "12+ Acts ingested (Constitution, Criminal Code, Labour Act, Children's Act, Sexual Offences, Domestic Violence, Immigration, Rent 2014/2017/2024)",
      "Multi-layer hallucination guard: section allowlist + verbatim quote validation + banned phrases + hard-fail on retry",
      "TF-IDF ranking + topic anchors + low temperature, layered with semantic search",
      "Streamed answers, validated before display",
      "Diagnostic response headers in production for debugging without paid logs",
      "Mobile-optimised, works on slow connections",
      "Refuses to answer rather than hallucinate, measurable: zero shipped citations to non-existent sections",
    ],
    regret:
      "I'd add multilingual support, Wolof, Mandinka, Fula, Jola. Most of my target users speak those before English. The retrieval layer can stay English (the source statutes are English) but input/output translation around it would dramatically expand the audience. Especially for women in rural areas dealing with the Domestic Violence Act, who often don't have written English literacy.",
    takeaway:
      "Hallucination prevention is a stack: better retrieval, allowlists, verbatim validation, banned phrases, hard-fail on retry.",
  },
  "dalasi-pulse": {
    slug: "dalasi-pulse",
    problem:
      "Remittances are ~20% of The Gambia's GDP. Every Gambian family has someone abroad sending money home. The Central Bank of The Gambia has internal forecasts of FX rates and remittance inflows; ordinary Gambians don't. There is no public-facing forecast of what the Dalasi will do next month, no dashboard showing diaspora corridors, no calculator for 'what will £100 be worth when I receive it'. I built the citizens' version: a public dashboard that shows what the Dalasi is doing, where remittances are coming from, and what the next six months look like, so a family deciding when to send or receive can plan instead of guess.",
    research: [
      "The Central Bank of The Gambia's annual reports (2019-2024) set the currency list (USD, EUR, GBP, CHF, JPY) and the seasonality: remittance peaks during Ramadan, Eid, school-year start in September.",
      "The World Bank KNOMAD methodology on bilateral remittance estimation is the source. The data is corridor-level: UK to GM, US to GM, ES to GM, DE to GM. The methodology matters because the numbers are mostly imputed from migration stocks and sender-country incomes, not actual transaction data.",
      "Prophet's Bayesian framework (Taylor and Letham 2017) is the reference for handling Ramadan and Eid, which drift 11 days a year against the Gregorian calendar and are invisible to a month-of-year seasonal term. Prophet is better at multi-period seasonality, SARIMA at short cyclicality. Both are used in ensemble.",
      "Reverse-engineered the Central Bank of The Gambia website's network behaviour by opening their FX rates page in Chrome devtools. Saw an undocumented JSON endpoint at `cbg.gm/ajax/indicative-exchange-rates/{CURRENCY}` returning 25 years of daily rates. Authoritative, free, no key required. Confirmed it worked across all major currencies before betting the project on it.",
      "GitHub Actions cron is the scheduler, not Vercel's. Vercel's Hobby cron wakes the function once per day at a non-customisable time. Actions gives precise scheduling and a free workflow log.",
    ],
    constraints: [
      "All data sources had to be free. No Bloomberg terminal, no paid APIs, no licensed datasets.",
      "Forecast accuracy had to be honest about uncertainty (intervals, not point estimates).",
      "Dashboard had to load in seconds on a Gambian 3G connection, most users are on Tecno/Infinix phones, not iPhones.",
      "Could not call any paid API at runtime (per-user cost would crush the project).",
      "Had to be visually trustworthy. Financial data on a badly designed page reads as wrong even when it is not.",
    ],
    decisions: [
      {
        call: "Reverse-engineer the CBG's undocumented JSON endpoint as the primary data source.",
        reason:
          "The Central Bank publishes daily indicative rates as a webpage with no documented API. Opened the network tab and found `cbg.gm/ajax/indicative-exchange-rates/{CURRENCY}` returning 25 years of daily rates as JSON, no auth required. Official, authoritative, free. Built the entire pipeline on it; cross-validated against `exchangerate.host` as a backup.",
      },
      {
        call: "SARIMA only, and the holiday model is still unbuilt.",
        reason:
          "The plan was a Prophet and SARIMA ensemble: Prophet for the Ramadan and Eid remittance spikes, which drift 11 days a year against the Gregorian calendar and are therefore invisible to a month-of-year seasonal term, and SARIMA for the shorter cyclicality in the FX series. What ships is SARIMA(1,1,1)(1,1,1,12) alone. Prophet is named as the next step in the exploration notebooks and was never built, so the holiday model is the largest open item rather than a shipped feature.",
      },
      {
        call: "Static export pre-rendered at build time, not server-rendered per request.",
        reason:
          "The data updates daily, not by user request. Pre-render once at build time with the latest forecast, ship as static HTML + JSON, host on Vercel free tier. Loads instantly anywhere, costs nothing per visitor. The build is triggered by the daily Actions job that refreshes the forecast.",
      },
      {
        call: "Daily GitHub Actions refresh + auto-commit, not Vercel cron.",
        reason:
          "Vercel Hobby cron runs once per day but at a server-determined time. Actions cron runs at a precise schedule, has free unlimited minutes for public repos, and produces a visible workflow log. The Actions job: fetch CBG rates, then recompute Prophet/SARIMA, then commit `data/processed/*.csv`, then push, then Vercel auto-deploys the updated build. The ~25 commits visible in `git log` (`Refresh forecasts 2026-04-12`, `2026-04-13`, …) are this loop running on autopilot.",
      },
      {
        call: "Bypass Next.js fetch cache + use browser-like headers when querying CBG.",
        reason:
          "First version had `/api/fx` returning year-2000 rates instead of latest. Spent half a day debugging, turned out Next.js's fetch cache was holding a stale CBG response from build time. Worse: CBG occasionally returned different data based on user-agent (presumably to discourage scraping). Fix was to set `cache: 'no-store'` AND send a normal browser User-Agent header. Two unrelated bugs on the same code path (commits 06a6d18, 4e2d1e2).",
      },
      {
        call: "Plain-language interpretation alongside the chart.",
        reason:
          "A line chart with a forecast band is not enough for the average user. Added a plain-English interpretation paragraph: 'The Dalasi has weakened ~3% against the Pound this year. Forecasts suggest moderate stability through the next 6 months with a wider band around Eid. £100 today buys GMD 8,750, and the forecast suggests it will buy 8,400-9,100 next month.' The chart is for analysts; the prose is for everyone else (commit ac5e78f).",
      },
      {
        call: "Live-status badge with CBG date stamp, polled every 15 minutes.",
        reason:
          "Users don't trust financial data without knowing when it last updated. Added a 'Live · CBG date 2026-05-08' badge that polls the API every 15 minutes. If the date is more than 24 hours stale, it visibly flags it (commit db5e7b1).",
      },
    ],
    pivots: [
      "First version was just FX. Added remittances as an afterthought. Realised they mattered MORE than FX for the typical Gambian family, most don't trade currencies, they receive transfers. Reframed the dashboard around remittances and made FX the supporting layer.",
      "Used `exchangerate.host` as the primary FX source initially. Then discovered the CBG endpoint by accident while inspecting the bank's website. Switched primary to CBG and kept exchangerate.host as a cross-validation backup.",
      "Original ETL pipeline had no cleaning layer, just fetched, plotted. Found that CBG had occasional duplicate rows from their backend, plus a methodology break around 2010 where the calculation changed and rates jumped 8% overnight. Wrote a cleaning script: dedupe, outlier removal (3-sigma), and a methodology-break correction factor for pre-2010 rates. The forecasts stopped having weird spikes (commit ba82a7e).",
      "Mobile UX broke because the currency selector pills wrapped onto a second line under the amount input on narrow screens, pushing content off-screen. Restructured the layout so currency pills sit above the amount field on mobile, side-by-side on desktop (commit 64e7bec).",
    ],
    weaknesses: [
      "I did not know how Prophet and SARIMA differed before this project. I read both papers and fitted SARIMA with walk-forward holdouts, but I never got Prophet running on the Dalasi series, so the comparison I set out to make is still unmade.",
      "I was new to GitHub Actions cron schedules. First version had the wrong cron syntax and the job ran every minute. Fortunately discovered before committing API-key usage to that.",
      "Time-series cross-validation is different from random-split CV. Shuffling time-ordered data leaks the future into the training set. The evaluation pipeline was rewritten around walk-forward validation. Forecast metrics dropped from optimistic to realistic.",
      "I underestimated how much pre-2010 Dalasi data was non-comparable to post-2010 data due to a methodology break. Adding the correction factor was a research task rather than a coding task. I had to read the CBG's methodology footnotes to find the conversion ratio.",
    ],
    outcome: [
      "Live FX dashboard for Dalasi vs USD, EUR, GBP, CHF, JPY",
      "25 years of daily CBG rates",
      "6-month-horizon forecasts with confidence intervals (SARIMA, walk-forward validated against a random-walk baseline)",
      "Bilateral remittance corridor breakdown (UK, US, Spain and Germany to GM)",
      "'£100 next month' calculator for diaspora users",
      "60-day daily forecasts + monthly sending calendar",
      "Plain-language interpretation paragraph",
      "Daily auto-refresh via GitHub Actions, deploys on commit",
      "Static export, instant load on 3G",
    ],
    regret:
      "I'd add a free SMS-out for non-smartphone users, text the dashboard a query like 'GBP forecast' and get the answer back. Most of the audience that would benefit most is not on smartphones. Would need a free SMS gateway (Africa's Talking has limited free credits) or a Telegram bot as a stopgap. Adding next.",
    takeaway:
      "The CBG endpoint was sitting in the network tab the whole time. For financial forecasts, uncertainty intervals, model ensembles, plain-language interpretation, and last-updated timestamps are what make the numbers usable.",
  },
  "forge": {
    slug: "forge",
    problem:
      "I kept skipping days on my own learning and lying to myself about it. Streak apps don't work because they're trivially fakeable, you tap 'yes I studied' and move on. I wanted a lock screen that would actually grill me on what I claimed to have done, the way a good coach would. The app's job is to push back when I try to coast.",
    research: [
      "The behavioural-economics literature on commitment devices (Karlan's stickK, Beeminder's monetary penalties, Forest's tree-killing) is the reference. The apps that work make failure expensive in a way the user actually feels.",
      "The structure of a good cross-examination (Reid technique critique, NIJ structured interviewing) is the model for the interrogator. What makes it hard to fake is asking for SPECIFICS the liar doesn't have. 'What did you build?' is gameable. 'What was the bug, what did you try first, why didn't it work?' isn't.",
      "Apple's Screen Time and Android's Focus Mode share the same flaw: they can be disabled from inside themselves. If the constraint can be turned off when willpower is low, it does nothing. Settings live behind a PIN.",
      "OpenRouter's routing model is the fit. Quality on a daily 200-token interrogation is fine across many models. Locking to one provider costs more without a quality benefit.",
      "Accountability-pod patterns from Nat Eliason and Tim Ferriss are the reference.",
    ],
    constraints: [
      "Has to be impossible to bypass casually, a checkbox isn't enough.",
      "Has to feel earned to unlock, not annoying, otherwise you uninstall it within a week.",
      "LLM cost per check-in had to stay near zero, since this fires every day, every user.",
      "Has to work without the user opening the app, push notification at the lock-time.",
      "Couldn't be coercive in a way that crosses ethical lines (no surveillance, no shaming).",
    ],
    decisions: [
      {
        call: "An LLM interrogator, not a form.",
        reason:
          "A form asks 'what did you do today?' and accepts any answer. The interrogator reads your claim and asks specific cross-examining follow-ups. Generic 'I studied React' gets pushed back: 'what specifically did you build, what was the bug, what would you do differently?' The system prompt is calibrated to reject vague claims and require specifics.",
      },
      {
        call: "PIN-locked settings, not user-disable.",
        reason:
          "If the app can be disabled from inside the app, it will be, when willpower runs out at 11 PM after a bad day. Settings live behind a PIN that was set when the decision was fresh and cannot be changed without re-entering it. Same logic as ScreenTime parental controls. The PIN is checked server-side, so clearing the app cache or reinstalling does not help.",
      },
      {
        call: "OpenRouter, not major AI labs direct.",
        reason:
          "OpenRouter routes to whatever model is cheapest while meeting quality bar. For a daily 200-token interrogation, GPT-4o-mini or Llama 3.3 70B is fine. I save 10x vs hardcoding to a single provider, and if one provider goes down the app keeps working. Provider neutrality is the right architecture for high-volume low-stakes calls.",
      },
      {
        call: "Streak resets on skip, no make-ups, no buybacks.",
        reason:
          "If yesterday can be bought back with twice the work today, the gamble becomes attractive and skipping increases. Streak loss has to be permanent or it is not a deterrent.",
      },
      {
        call: "Accountability pods, small groups (3-5), public skip notifications.",
        reason:
          "Internal motivation is unreliable. External accountability is harder to fool. When you skip, your pod sees it. When they skip, you see it. Built this in (commit 7fbcdb2). Opt-in because forced groups feel coercive.",
      },
      {
        call: "Public build log, posts of what users built, opt-in.",
        reason:
          "A public stream of 'today I built X' creates a soft pressure to have something interesting to post.",
      },
      {
        call: "Grace days, but limited and visible.",
        reason:
          "Pure no-skip is too brittle. Real life: travel, illness, family emergencies. I added 3 grace days per quarter, visible in the streak UI. Using them costs nothing but is visible to your pod. Skipping without grace days resets the streak.",
      },
    ],
    pivots: [
      "Original interrogator was too soft, accepted 'I studied for 2 hours' without follow-up. Tightened the system prompt: 'Reject any claim that lacks specifics. Ask for what was built, what failed, what was learned.' Pass rate dropped 40%. Iteratively rewrote the prompt 6+ times to get the right level of skepticism.",
      "First model was the model Sonnet, which was overkill and expensive for daily check-ins. Moved to OpenRouter with cheaper routing (Llama / Gemma / Mixtral, picked by cost-quality bid). Quality stayed identical, cost dropped 90%.",
      "Tried camera-based proctoring, make the user appear on camera during interrogation to make lying harder. Removed it (commit b032662). Reasons: too invasive for the religious and privacy-conscious users I cared about, and it proved you were physically there without preventing lying about what was done.",
      "Added a leaderboard of streaks. Removed it (commit b032662). Public ranking turned the system into a competition and produced the wrong incentive: people gaming streak length instead of doing work. Built it, shipped it, removed it.",
      "Re-entry flow: when a user broke their streak, the original UX showed them a sad face and 'streak: 0'. Felt punishing in a demoralising way, not a productive way. Rewrote the re-entry as 'day 1 again, what's the first specific thing you'll build?' (commit 7fbcdb2).",
      "Initially required sign-up for every visit. Added a guest/demo mode (commit 12cdb83). Users try the interrogator without creating an account, data wipes on tab close. Activation went up about 10x.",
    ],
    weaknesses: [
      "I had not built a NextAuth v5 app before. Spent days on the new auth.config / middleware patterns. NextAuth v4, then v5 is a breaking redesign. Had to rebuild the whole auth surface around the new useSession hook + edge-friendly middleware.",
      "I underestimated how aggressive my own willpower-bypass instincts would be. Built features assuming users would respect them; tested on myself; immediately broke them by uninstalling and reinstalling. Hardened them against my own future self. The PIN lock is there because I tried to disable it on day 3.",
      "Prompt engineering for 'be skeptical without being cruel' is a delicate calibration. Overshoot and the app feels mean and people uninstall. Undershoot and it accepts anything. Eventually settled on a tone that's like a respectful old coach: 'I hear you. Tell me more. What was the actual bug you hit?'",
      "Cron jobs on Vercel free tier max at one per day. I needed multiple, one for daily check-ins, one for streak-loss notifications, one for digest emails. Worked around it by triggering downstream crons from the daily one (chain pattern, same as VANTAGE).",
    ],
    outcome: [
      "Daily lock-screen interrogation, ~200 tokens/day per user via OpenRouter",
      "PIN-protected settings (anti-cheat against your future self)",
      "Streak engine with no buy-back, 3 quarterly grace days",
      "Accountability pods (3-5 users, opt-in, peer skip-visibility)",
      "Public build log",
      "Re-entry flow that reframes failure as fresh start",
      "Guest/demo mode for instant try-without-signup",
      "PWA, share certificates, OG images, onboarding shortcut",
      "Removed features (leaderboard, camera proctoring) when they produced wrong incentives",
    ],
    regret:
      "I'd add a calendar-blocking feature: when you set 'I'll build between 7 AM and 9 AM tomorrow', the app automatically blocks distracting apps during that window. Pure check-in is reactive. Pre-commitment + blocking is proactive. Adding next iteration.",
    takeaway:
      "The leaderboard and camera proctoring both shipped and were later removed when they produced the wrong incentive.",
  },
  "hireiq": {
    slug: "hireiq",
    problem:
      "Job application forms are a disaster for both sides. Candidates dump CVs into black holes; hiring teams drown in unqualified applications. The conversation that should be happening, 'tell me about a project, I'll ask follow-ups', is replaced with a static form. A static form can't ask follow-ups, can't probe weak answers, and can't tell a strong candidate from a polished CV. I built an AI that has the conversation instead, and produces a scored, defensible report at the end.",
    research: [
      "Structured-interview research (Schmidt & Hunter 1998 meta-analysis, more recent McDaniel reviews) is the basis. Structured interviews predict job performance about 2x better than unstructured ones. Key levers: rubric-based scoring, anchored rating scales, multiple criteria per run.",
      "Workday, Greenhouse and Lever structure their candidate pipelines around the static form, which is what 1990s HR software was. The conversation is absent from all three.",
      "Gemini Flash 2.0 was the choice for latency and cost: sub-second responses, 10x cheaper than GPT-4. For a high-volume conversational interviewer, latency and cost matter more than peak reasoning ability.",
      "Legal hiring constraints (EEOC US, GDPR EU, employment law) set the boundaries on what the AI can ask and what the report can say. Protected-category questions are avoided; assessments are role-relevant.",
      "WeasyPrint and CSS-print specs are the PDF path. PDF generation from HTML is well-trodden, but small mistakes (missing print stylesheet, browser-quirk fonts) ruin the output.",
    ],
    constraints: [
      "The conversation has to feel like a real interview. Multi-second response delays kill the flow.",
      "Hiring teams have to justify their decisions internally, so the scoring has to be defensible on its own terms.",
      "Couldn't pay for GPT-4 on every candidate at scale.",
      "Candidates apply on slow connections; all interactions had to feel instant.",
      "Render free tier for the Python backend, which means cold starts of ~30s if no traffic for 15 min.",
    ],
    decisions: [
      {
        call: "Gemini Flash 2.0, not GPT-4 or the model.",
        reason:
          "Conversational interviewing is high-volume, low-stakes-per-token (the report is where reasoning matters, not the question generation). Flash is sub-second, 10x cheaper than GPT-4, and quality is fine for structured Q&A. Saving budget for scoring, where quality actually matters.",
      },
      {
        call: "Adaptive follow-up, not a fixed question list.",
        reason:
          "If the candidate gives a weak answer, the system asks for specifics. If they nailed it, it moves on. Mirrors how a good interviewer behaves. A fixed list of questions cannot do that.",
      },
      {
        call: "Scored report with strengths + concerns + binary recommendation.",
        reason:
          "Hiring teams need to defend decisions to compliance, to other interviewers, to themselves. The report breaks down what the candidate did well, what was weak, and gives a hire/no-hire recommendation. Hiring manager can override but has the structure to override against.",
      },
      {
        call: "PDF reports via WeasyPrint, not browser print.",
        reason:
          "Recruiters live in PDF, they print, share, attach to ATS systems. Generating the report as styled HTML and converting via WeasyPrint gives me a clean PDF without writing PDF layout code by hand. Picked WeasyPrint over alternatives (ReportLab too low-level, Puppeteer needs Chrome) because it renders CSS faithfully on a Python-only stack.",
      },
      {
        call: "LocalStorage session persistence with auto-resume.",
        reason:
          "Candidates abandon mid-interview if they lose connection or close the tab. Lost candidates = wasted interview cost. I persist the conversation state to localStorage on every turn. On refresh, the app silently resumes from the last turn without re-asking anything. Removed the auth screen entirely for `/apply`. Anyone with the link can apply, and the session token is in the URL (commits a370f33, 540b575).",
      },
      {
        call: "Knockout questions + severity engine, not just open Q&A.",
        reason:
          "Some criteria are non-negotiable, such as whether the candidate has legal authorisation to work in country X, or a driver's licence for a delivery role. Those should be knockout questions that auto-reject if failed. Built a severity engine where each question carries a hire/maybe/reject weight, and a single 'reject' on a knockout ends the interview gracefully (commits 920c3d7, 5113156).",
      },
      {
        call: "Job form v2 with structured fields (visibility, language proficiency, candidate info sections).",
        reason:
          "Original job form was free-text. Realised employers need structured fields for: job visibility (public vs private link), required language proficiency (CEFR levels), candidate info collection sections. Rewrote the form as v2 with these as first-class fields. Took months but the data model now supports filtering by language, by role type, by seniority (commit 7803262).",
      },
      {
        call: "Cold-start CORS warmup gate.",
        reason:
          "Render free tier sleeps the backend after 15 min idle. First candidate after a sleep hits a 30-second cold start that ALSO causes CORS failures (preflight fails before the function is up). Built a `/health` warmup gate that the frontend pings before showing the chat UI. UI shows 'getting interview ready…' for the cold-start window, then transitions cleanly (commit 0c55a07).",
      },
    ],
    pivots: [
      "First version generated all questions upfront from the job description, then asked them in order. Felt robotic. Switched to streaming question generation per turn, conditioning on prior answers. Slower per turn but the conversation flowed (commit 354462b).",
      "Initial scoring model gave wildly different scores for the same answer when re-run. Added temperature=0 plus a structured prompt with an explicit rubric (1-5 on each criterion). Consistency went up 80%.",
      "Tried AsyncGroq SDK first, then ran into mysterious connection bugs in production. Switched to direct httpx REST calls (commit f2b896d).",
      "Originally used Gemini Flash everywhere. Hit rate-limit issues during traffic spikes. Added Groq as a fallback (commit 5b3df5d, 6874a2e). Multi-provider with automatic failover became table stakes after that.",
      "Auth flash bug: candidates would briefly see a login screen even though /apply doesn't require auth. Caused by a race condition, AuthProvider mounted before checking the route. Excluded /apply from AuthProvider entirely (commit 1109b40).",
      "OAuth loop: signing in with Google would redirect into an infinite cycle on certain edge cases. Spent two days debugging Supabase OAuth + Vercel SSR + Render API CORS interactions. Fix involved hardcoding the production CORS origin instead of wildcard+credentials (which is invalid CORS), and a fix in the redirect_to flow (commit 3e651e0).",
    ],
    weaknesses: [
      "I had not built a multi-page Streamlit-like flow with state persistence before. Streamlit's state model resets on every interaction. Switched to Next.js pages with localStorage hydration after a frustrating week.",
      "CORS in production with credentials + multiple origins is genuinely confusing. I shipped wildcard+credentials twice before realising it's silently invalid. Now I default to hardcoded explicit origins per environment.",
      "I underestimated how brittle SSE streaming is across reverse proxies. Vercel's edge proxy buffered chunks instead of forwarding them. Had to set explicit response headers (`X-Accel-Buffering: no`, `Cache-Control: no-cache, no-transform`) to force pass-through (commit a2bbe53 in coldpilot, but the lesson came from hireiq first).",
      "Scoring rubric design is its own field. The first scoring prompt produced inconsistent results because it asked the model to score on multiple dimensions simultaneously without clear weight. The multi-criteria decision-analysis literature is the reference. Scoring was rewritten as per-criterion 1-5 with explicit anchors, then aggregated.",
    ],
    outcome: [
      "Full pipeline: job posting, then adaptive interview, then scored report, then PDF",
      "Runs on NVIDIA's free OpenAI-compatible endpoint (mistral-medium-3.5-128b), after pivoting off Gemini for rate limits and then off Groq",
      "Supabase + RLS for candidate data",
      "WeasyPrint PDF reports for hiring teams",
      "LocalStorage session resume, candidates can refresh / lose connection without losing the interview",
      "Knockout question + severity engine",
      "Job form v2 with structured fields (visibility, language proficiency, candidate sections)",
      "Cold-start warmup gate hides Render's 30s wakeup from candidates",
    ],
    regret:
      "Should have added video question support from the start. Some senior roles want to see candidates speak, not just type. Roadmap. Also should have built an ATS-export integration (Greenhouse, Lever, Workday) earlier, recruiters live in those tools and copying scored reports manually is friction.",
    takeaway:
      "A static form can be replaced with an interview at roughly the same UX cost if the model is chosen for the job. The remaining work was edge cases: CORS, cold starts, OAuth loops.",
  },
  "credit-risk-scorecard": {
    slug: "credit-risk-scorecard",
    problem:
      "Microfinance institutions in West Africa make lending decisions on intuition because the analytical infrastructure isn't there. Loans are granted or denied based on the loan officer's read of the applicant's character, with results that range from biased to disastrous depending on the officer. I wanted to build a Basel II-compliant credit scorecard from scratch, not import a black-box library, to actually understand WoE, IV, points conversion, validation gauntlets, and stress testing the way an actuary would. It gives the loan officer a quantified second opinion rather than taking the decision off them.",
    research: [
      "Naeem Siddiqi's 'Credit Risk Scorecards' is the methodology reference. The WoE/IV chapter is the core of the pipeline.",
      "The Basel II framework (BCBS Pillar 1) sets the target. The Internal Ratings-Based Approach has three components: PD (probability of default), LGD (loss given default), EAD (exposure at default). The scorecard implements PD; the rest are placeholders for the next iteration.",
      "Regulatory technical standards from BCBS, EBA and the Federal Reserve set the validation requirements. The gauntlet (Gini, KS, PSI, ROC) is non-negotiable for a regulated model. All four are implemented.",
      "Population Stability Index methodology (Karakoulas 2004) sets the drift check. PSI compares score distributions between training and out-of-time samples. Below 0.1 is no shift, 0.1 to 0.25 is moderate, above 0.25 is significant. The industry threshold for 'do not deploy' is 0.25.",
      "West African microfinance dynamics set the generator: group lending (joint liability), seasonal income (agricultural cycles), gender roles in finance (women's repayment rates often higher than men's). The synthetic generator reflects those patterns rather than cloning German Credit defaults.",
    ],
    constraints: [
      "No real loan data. Privacy, NDAs, none of it accessible to a student researcher.",
      "Had to be explainable end-to-end, every step audit-able for a regulator.",
      "Aspirational target: Basel II framework, the international standard.",
      "Models like XGBoost or random forest, while higher-accuracy, are NOT permitted in regulated credit scoring without extensive explainability layers. Logistic regression with WoE was the only sound choice.",
      "Validation: Gini, KS, PSI, all required to pass.",
    ],
    decisions: [
      {
        call: "Generate 12,000 synthetic West African microfinance loans with regionally-calibrated distributions.",
        reason:
          "I can't get real microfinance data, and toy datasets like German Credit don't reflect West African dynamics (group lending, sector-specific defaults, dependent counts that matter). I built a synthetic generator with fields specific to the region: `group_lending` (boolean), `has_collateral` (boolean), `country` (categorical), `sector` (agriculture, services, manufacturing), `dpd_history_days` (days past due in prior loans). Default rates calibrated to public microfinance default-rate stats. Not perfect, but more honest than a German Credit clone.",
      },
      {
        call: "WoE/IV feature selection, then logistic regression, no fancier model.",
        reason:
          "Basel II requires explainability. Random forests and XGBoost are forbidden in production credit scoring without extensive explainability layers because regulators can't audit them. Logistic regression with WoE-transformed features is the industry standard for a reason: the points-per-feature can be read off the model, and a score of 480 can be explained exactly.",
      },
      {
        call: "WoE binning by deciles for continuous features, optimal binning for categoricals.",
        reason:
          "Raw `monthly_income_usd` had high IV but skewed distribution and unstable bands. Binned into deciles via WoE, became more stable across the population. For categorical features (`sector`, `loan_purpose`), used optimal binning to merge low-volume categories together. The trade-off: lose some information, gain stability and explainability.",
      },
      {
        call: "Validation gauntlet: Gini, KS, PSI, ROC, all required to pass.",
        reason:
          "Three different lenses on model quality: Gini (overall discrimination, want > 0.4), KS (best cutoff separation, want > 0.3), PSI (population stability over time, want < 0.1). A model that passes one and fails another is a red flag. I rejected several feature sets that had high Gini but unstable PSI before settling on the final set. Final: Gini 0.29 and KS 0.23 on the time-based holdout, both short of those thresholds, with PSI 0.008 comfortably inside. The discrimination ceiling is set by the generator, not the modelling: no feature clears Strong information value (previous_defaults tops out at IV 0.13, total IV across the eight selected features is about 0.51), and a scorecard cannot separate better than its features do. The number reported is the one the pipeline actually produces.",
      },
      {
        call: "Time-based holdout, not random-split holdout.",
        reason:
          "The first version validated on a random split, so the holdout came from the same months as the training data and every stability measure was flattering by construction. The loan book had no origination date at all, so a time-based split was not merely unused, it was impossible. Adding a vintage column and refitting on the earlier 70 percent of the book cost about 0.02 Gini, and it produced a result I did not expect: PSI stayed at 0.002 while realised defaults rose from 12.3 to 15.9 percent. PSI compares score distributions, so it cannot see a deterioration driven by something no feature measures. Monitoring PSI alone would have reported this model as stable.",
      },
      {
        call: "Multi-scenario stress tests: drought, currency crisis, pandemic.",
        reason:
          "Real lenders need to know: what happens to default rates under shock? I implemented stress tests that multiply default probabilities by scenario-specific factors (drought: 1.5x for agriculture loans, currency crisis: 1.3x across the board, pandemic: 2.0x for services). The output shows band-by-band default-rate impact and capital-requirement implications. The stress test runs the whole book through the scenario.",
      },
      {
        call: "Basel II points conversion with explicit factor + offset.",
        reason:
          "Logistic regression coefficients are abstract. Points conversion turns them into a 300-850 score every loan officer can use. Picked factor 28.85 / offset 487.123 (industry standard) so the score doubles odds at every 20-point increment. The points card is what a loan officer actually sees.",
      },
    ],
    pivots: [
      "First feature set had monthly_income as raw, high IV but skewed. WoE-binning by deciles became more stable across population shifts. Standard scorecard practice but I had to discover it via the validation failing.",
      "I assumed a time-based holdout would make PSI reveal the drift. It did not. The split was still the right change, because a same-period holdout measures nothing, but the number I expected to move stayed flat and the damage showed up in the outcome rate instead. That taught me more than a confirming result would have: a stability metric can only see the thing it is computed on.",
      "Originally tried XGBoost first because the accuracy was higher. Realised the explainability requirement made it disqualifying. Killed the XGBoost branch and went back to logistic regression. The right model is the one regulators allow.",
      "Stress tests originally hardcoded scenario multipliers in the script. Refactored to a `SCENARIOS` config so new shocks (climate, geopolitical) could be added without rewriting validation code.",
    ],
    weaknesses: [
      "WoE/IV was new to implement from scratch. The Siddiqi chapter is the reference, and `compute_all_woe_iv` and `woe_transform` are the implementation. Writing the code made the formulas concrete.",
      "Population Stability Index was new. The intuition, comparing two distributions via a sum of `(actual - expected) * ln(actual/expected)`, wasn't obvious at first. Built a synthetic test where I manually shifted the distribution and watched PSI track it.",
      "Synthetic data generation is more art than science. My first generator produced loans where every feature was uniformly distributed; the model learned nothing because there was no real signal. Re-built the generator with realistic correlations: higher income, lower default; longer term, higher default; group lending, lower default.",
      "Capital-requirement math (RWA, capital floor) is in the Basel II framework but I'm only at the PD layer. I have not implemented LGD or EAD.",
    ],
    outcome: [
      "12,000 synthetic West African microfinance loans, regionally-calibrated",
      "WoE/IV feature selection pipeline, optimal binning for categoricals",
      "Basel II points conversion (factor 28.85, offset 487.123)",
      "Validation: Gini 0.27, KS 0.21 on a later-vintage holdout, below industry thresholds and reported as such, capped by the synthetic generator's weak feature signal rather than by the fitting",
      "PSI 0.002 across vintages: the score distribution held while realised defaults rose from 12.3 to 15.9 percent, because the deterioration came from a macro shock no feature observes. PSI alone would have called the model stable",
      "Multi-scenario stress testing (drought, currency crisis, pandemic)",
      "Live Next.js + Recharts dashboard",
      "Explainable end-to-end: every score traceable back to feature contributions",
    ],
    regret:
      "I'd swap synthetic data for real anonymised data the moment I have access. The synthetic generator is calibrated to public stats, but it cannot capture interaction effects I have not thought of. I also need to extend to LGD and EAD for full Basel II coverage.",
    takeaway:
      "In regulated domains, explainability is the constraint that picks the model. Logistic regression with WoE is the industry standard because a regulator can read the points off it. Random-split metrics that look good but will not survive production are how models fail after deployment.",
  },
  "life-insurance-risk": {
    slug: "life-insurance-risk",
    problem:
      "I wanted to learn actuarial science by doing, not by reading textbooks. Built a full life insurance risk model for Sub-Saharan Africa from scratch, mortality, survival analysis, premium pricing, Monte Carlo VaR. Every step is implemented myself rather than imported from an actuarial package. Sub-Saharan Africa specifically, because the standard models are calibrated on US and UK data. They under-represent the constant background hazard rate that matters here: accidents, infectious disease, road traffic. They also over-represent old-age mortality patterns that do not apply to a younger population.",
    research: [
      "Gompertz (1825) and Makeham (1860) are the basis. Pure Gompertz models exponential mortality increase with age; Makeham adds a constant background hazard. For Sub-Saharan Africa, where the constant hazard is materially higher (malaria, road traffic, infectious disease), the Makeham term is essential. The original papers, rather than the textbook summaries, are where the second term's role becomes clear.",
      "Cox (1972) Proportional Hazards is the survival-analysis standard. The C-index (concordance) is the equivalent of AUC. Industry-standard 'good' is above 0.7, 'excellent' above 0.8.",
      "Klein & Moeschberger's 'Survival Analysis' is the reference for censoring and truncation handling. Most insurance data has both: right-censoring when a policy term ends, left-truncation for delayed entry.",
      "Monte Carlo variance-reduction techniques (control variates, antithetic variables) stabilise VaR at 5,000 scenarios.",
      "Sub-Saharan Africa health stats from the World Bank and WHO set the profile calibration: life expectancy distributions, mortality ratios by age band, leading causes of death.",
      "COVID-era mortality data set the pandemic stress calibration. Sub-Saharan Africa's reported pandemic mortality was lower than other regions, with higher uncertainty bands.",
    ],
    constraints: [
      "No real African insurance data, most insurers don't share, and what's published is too aggregate to fit individual-level models.",
      "Pandemic was recent. Any stress test had to take that seriously without overfitting to a one-time event.",
      "Target: Cox PH C-index above 0.75 (industry good).",
      "Actuarial work is regulated. Black-box ML does not pass review.",
    ],
    decisions: [
      {
        call: "Gompertz-Makeham, not just Gompertz.",
        reason:
          "Pure Gompertz models the exponential mortality increase with age. Makeham adds a constant background hazard rate, accidents, infectious disease, baseline causes that don't depend on age. For Sub-Saharan Africa, where the constant hazard is materially higher (malaria, road traffic), the Makeham term matters. Implemented via maximum likelihood with scipy.optimize rather than a canned package.",
      },
      {
        call: "Cox Proportional Hazards via lifelines, not bespoke.",
        reason:
          "Implementing Cox PH from scratch is a rabbit hole, Breslow ties, partial likelihood, baseline hazard estimation. lifelines is solid for the regression part. I implemented Gompertz-Makeham fitting myself, where the learning was, and used lifelines for Cox.",
      },
      {
        call: "Add age × risk-class interaction term to Cox PH.",
        reason:
          "First Cox PH had C-index of 0.62, below industry standard. The marginal effect of being a smoker is different at age 25 vs age 65. Adding the interaction term (age × risk_class) jumped C-index to 0.77. Cox PH's proportional-hazards assumption is violated when interactions matter, and the low C-index is what surfaced it.",
      },
      {
        call: "Monte Carlo VaR with 5,000 scenarios + pandemic shock.",
        reason:
          "VaR at 95% and 99% gives the insurer two budget constraints. Single-point projections are useless for capital reserves; only the tail matters. The pandemic scenario multiplies mortality by 1.8x to 3.5x, calibrated to COVID excess-mortality data. 5,000 scenarios is enough for a stable 99th-percentile VaR.",
      },
      {
        call: "5,000 synthetic profiles calibrated to regional age distributions.",
        reason:
          "Same constraint as the credit scorecard, no real data. The profiles match Sub-Saharan Africa World Bank data on age, sex, and risk class. The model learns regional patterns, not American textbook ones. Real data would be better, and calibrated synthetic is the next best alternative.",
      },
      {
        call: "Vectorise Monte Carlo in NumPy, not pandas.",
        reason:
          "First implementation looped over 5,000 scenarios in a pandas DataFrame. Took 4 minutes per run. Rewrote in NumPy with vectorised sampling. Same results, 30x faster, 8 seconds per run.",
      },
      {
        call: "Mobile-first dashboard with responsive percentile cells.",
        reason:
          "Actuarial dashboards are usually desktop-first. The percentile table (P50, P75, P95, P99 of loss distribution) overflowed on phones. Rewrote each cell as a responsive grid with label-left and value-right on phone, full row on desktop (commits 3882545, b89e8c2).",
      },
    ],
    pivots: [
      "First Cox PH had C-index of 0.62, below industry standard. Realised I'd left out interaction effects between age and risk class. Adding the interaction term jumped C-index to 0.77.",
      "Monte Carlo initially ran in pandas. 4 minutes per run. Rewrote in NumPy with vectorised sampling. 8 seconds. Same results.",
      "Pandemic stress factor was originally a single 2.5x multiplier across all ages. Realised the COVID excess-mortality data shows much higher concentration at older ages. Re-calibrated to age-band-specific multipliers: 1.5x at 30-50, 3.5x at 70+.",
      "Survival curve plots had inconsistent y-axis ranges across risk groups, making them hard to compare. Standardised the y-axis range and added grid lines so the curves compare directly.",
    ],
    weaknesses: [
      "I had not used scipy.optimize for MLE before this project. Spent a day learning the BFGS optimiser's quirks and how to set initial parameter estimates so it converges.",
      "Censoring and truncation are subtle. My first survival fit ignored left-truncation (delayed entry into the risk pool), which biased the hazard rate downward. Re-read Klein & Moeschberger, fixed the entry-time handling.",
      "Cox PH's proportional-hazards assumption is exactly that, an assumption. When violated, the model is wrong in subtle ways. Schoenfeld residuals are what surface a violation. I check them as part of every fit.",
      "Variance reduction in Monte Carlo (control variates, antithetic variables) reduced the run time and stabilised the tail estimates once implemented.",
    ],
    outcome: [
      "Gompertz-Makeham mortality model fitted from scratch via MLE",
      "Cox PH C-index 0.78 on a held-out 30 percent, 0.77 in-sample, with 0 of 5 covariates breaching proportional hazards",
      "Kaplan-Meier curves with log-rank tests across risk groups",
      "5,000-scenario Monte Carlo VaR (95%, 99%)",
      "Pandemic stress test calibrated to COVID excess-mortality data",
      "Age-band-specific shock multipliers",
      "Vectorised NumPy implementation (8s for full Monte Carlo)",
      "Live Next.js + Recharts mobile-responsive dashboard",
    ],
    regret:
      "I'd add a reserves projection module: given current policies and the mortality model, what's the IBNR (incurred but not reported) estimate? I also need to add LGD and EAD analogues for life products (sum-assured at risk).",
    takeaway:
      "The textbook explains Gompertz-Makeham. Writing the gradient descent yourself shows why the second term matters in the data you actually have.",
  }
};

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return CASE_STUDIES[slug];
}
