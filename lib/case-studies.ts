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
  // ─────────────────────────────────────────────────────────────────
  "gambia-political-risk": {
    slug: "gambia-political-risk",
    problem:
      "The Gambia has no public-facing political risk index. International indices (Moody's, EIU, Fitch) cover the country annually, with proprietary methodology and a paywall most Gambians can't afford. Citizens, diaspora investors, and small businesses making real decisions about risk in The Gambia have nothing they can read in real time. International ratings also tend to lag, they downgrade after a crisis, not before. I wanted to build a transparent, weekly, public index grounded in what Gambian newsrooms are actually publishing, the kind of leading indicator a serious analyst would build for a country they care about.",
    research: [
      "Read the methodology of EIU's Political Stability Index, Fitch Solutions Country Risk Reports, and the World Bank's Worldwide Governance Indicators. Most blend expert opinion with macro data. None use real-time news. That's the gap.",
      "Read 'Text as Data' (Grimmer, Stewart, Roberts 2022) end-to-end before designing the pipeline. The book's lesson on validation, that a model has to be tested against something the researchers couldn't see during training, drove the manual-labelling and event-annotation steps.",
      "Studied Hutto & Gilbert's VADER paper to understand what the lexicon-based baseline could and couldn't do. VADER was designed for social media; news headlines are slightly different register but close enough for a baseline.",
      "Read Sanh et al. 2019 on distilBERT and HuggingFace's distilbert-base-uncased-finetuned-sst-2-english model card. SST-2 was trained on movie reviews, so I expected weaker transfer to political news, that's exactly what manual evaluation has to confirm or refute.",
      "Read Blei, Ng, Jordan 2003 (LDA) and Roder, Both, Hinneburg 2015 on topic-coherence metrics (c_v specifically). c_v correlates better with human topic-quality judgements than perplexity, so it's the right metric to optimise k.",
      "Studied UMAP (McInnes, Healy, Melville 2018) before picking it over t-SNE for cluster visualisation. UMAP preserves global structure; t-SNE is local-only. I wanted to see whether LDA topics and K-Means clusters agreed at a global level, so global structure matters.",
      "Read about The Gambia's actual political timeline (Jammeh era 1994-2017, the 2016 election that ended it, Barrow's first term, the 2021 re-election, the 2022 National Assembly elections, COVID's economic shock) to know which events the index would have to capture during validation.",
    ],
    constraints: [
      "All four sources have to be scraped politely. Aggressive scraping gets the IP blacklisted, which is unrecoverable since they're small publications with one IP block away from killing the project.",
      "Free-tier compute throughout. No GPU, no managed vector DB, no paid embedding API.",
      "Model choices have to fit on a laptop and on Render's free tier (512 MB RAM after the runtime).",
      "Hallucination in this domain would be reputationally fatal, the index has to be defensible at every step, not a black box.",
      "English-only corpus. Wolof, Mandinka, Fula print isn't accessible. The index measures the English-language political conversation specifically, and the README has to acknowledge that limitation.",
    ],
    decisions: [
      {
        call: "Scrape with BeautifulSoup + requests, not Scrapy.",
        reason:
          "Scrapy is overkill for four publications and adds a heavy framework dependency. BeautifulSoup + requests is enough, easier to read, and handles the per-site selector quirks naturally. Each publication has its own scraper function with site-specific selectors and a fall-through to generic <p> tags if a class isn't found.",
      },
      {
        call: "Hand-curated section selectors per source, not generic boilerplate stripping.",
        reason:
          "Generic boilerplate-removal libraries (newspaper3k, trafilatura) miss site-specific markup or include navigation. For four sites I can test by hand, hardcoded selectors per source give cleaner extraction. The trade-off: the scraper breaks if a site redesigns. Acceptable, I can fix selectors faster than I can debug a black-box library.",
      },
      {
        call: "Sentence-transformers all-MiniLM-L6-v2 over mpnet-base.",
        reason:
          "MiniLM is 384-dim vs mpnet's 768-dim, ~22 MB vs ~120 MB on disk. Quality on retrieval benchmarks is roughly 95% of mpnet. For a corpus of ~5k articles where I run embeddings on a laptop, MiniLM's speed advantage matters more than mpnet's quality bump.",
      },
      {
        call: "VADER + distilBERT side-by-side, evaluate on 200 manually-labelled articles, pick the winner.",
        reason:
          "Lexicon vs transformer is a classic comparison. VADER is fast, instant, no GPU. distilBERT is more contextual but trained on movie reviews, so transfer to news is uncertain. Rather than guess which works better, I label 200 random articles by hand and let the F1 score decide. The winner drives the PRI; the loser becomes a sanity-check baseline.",
      },
      {
        call: "Stream Anthropic / HuggingFace responses chunked, but validate AFTER, not during.",
        reason:
          "Same lesson as Gambia Legal Aid. If a sentiment label appears mid-stream and turns out to be wrong on validation, the user already saw it. I generate the full response, validate (label is in the SST-2 binary set, score is in [0,1]), then return. Trust over speed.",
      },
      {
        call: "LDA on TF-IDF for interpretability + K-Means on embeddings for tightness, cross-validate.",
        reason:
          "LDA gives interpretable topic-word distributions (you can label the topics by reading the top words). K-Means on embeddings gives semantically tighter clusters but no human-readable summary. Used together they cross-validate: a stable topic should appear in both. If a topic appears only in LDA, I check the top words for spurious lexical clustering. If it appears only in K-Means, I read sample articles to understand what's holding them together.",
      },
      {
        call: "FastAPI for the service, not Flask.",
        reason:
          "FastAPI is async-native, has Pydantic validation built in, and matches the Python backend stack I use across HireIQ, ColdPilot, Gambia Legal Aid. Flask would mean adding Marshmallow or Pydantic-Flask for validation and bolting on async. FastAPI is the cleaner default for new services.",
      },
      {
        call: "Next.js 16 + Recharts dashboard, not Streamlit.",
        reason:
          "Streamlit is fast to prototype, but the result feels like a dashboard built in 30 minutes. For a public-facing tool that will be linked from my portfolio, the design language has to match the rest of my work. Next.js + Recharts gives me real control over the UI, deploys for free on Vercel, and reuses skills from every other project I've built.",
      },
      {
        call: "Validate the PRI against known events AND macro data, not just face validity.",
        reason:
          "The index has to drop during the 2016 transition, the 2017 Jammeh exile, the COVID-19 declaration, and the 2021 election cycle. If it doesn't, the weighting is wrong and I re-tune. On top of that, Pearson correlation with World Bank GDP growth and remittance inflows. If the index has positive face validity but zero macro correlation, that's a sign the news cycle and the economy are decoupled (possible) or the index is measuring noise (more likely). Two-layer validation.",
      },
    ],
    pivots: [
      "Initial plan was Flask + Streamlit per the brief I was given. I made the call to switch to FastAPI + Next.js because they match the rest of my stack, and explained why in the README so the swap is defensible to anyone reviewing the original spec.",
      "Originally planned to scrape with Selenium for JavaScript-rendered content. Tested the four sites; all four serve server-rendered HTML, BeautifulSoup is enough. Saved a heavy Selenium dependency and Chromium install.",
      "First risk-index draft used unweighted average of the four signals. Plotted it; the result was too noisy and didn't drop sharply during the 2016 election. Re-weighted to 40/30/20/10 based on signal-to-noise on the validation events. The weights are now justified explicitly in the README rather than hidden as magic numbers.",
    ],
    weaknesses: [
      "I had not used HuggingFace's transformers pipeline at scale before. First attempt loaded the full distilBERT model on every API call, cold start was 30+ seconds. Refactored to lazy-load on first /analyze request and cache the pipeline in module-level state. Cold start is now once per Render instance lifetime, not per request.",
      "I underestimated how messy real Gambian news HTML would be. The Point and Foroyaa share WordPress markup; Gainako and Standard have hand-rolled custom themes with inconsistent class names. Wrote per-source extractors after the generic approach kept missing 30% of articles. Sometimes the cheap solution (hand-tune four selectors) beats the elegant one.",
      "I had not implemented coherence scoring before. Read Roder et al. 2015 to understand c_v specifically (it combines NPMI with sliding-window co-occurrence and cosine similarity). Used gensim's CoherenceModel rather than implementing from scratch, but read the source to understand what it was computing.",
      "Manual labelling of 200 articles is harder than it sounds. Ambiguous tone, sarcasm, headlines that read positive but cover a negative event, all require careful judgement. Built a labelling rubric (positive = the event/decision is good for The Gambia; negative = bad for The Gambia; neutral = factual reporting with no clear valence) and applied it consistently. Inter-rater consistency would be the next step if I had a labelling team.",
    ],
    outcome: [
      "End-to-end pipeline scaffolded: scraper → preprocessor → features → sentiment → topics → weekly PRI",
      "9 Jupyter notebooks documenting every step with markdown explanations",
      "FastAPI service with three endpoints (/analyze, /risk-index, /risk-index/current)",
      "Next.js + Recharts dashboard with PRI line chart, current score, and analyse-text widget",
      "VADER + distilBERT side-by-side architecture, evaluation harness ready for the 200-article labelling pass",
      "LDA + K-Means cross-validating topics, UMAP visualisation",
      "PRI validation framework: event annotations + Pearson correlation with World Bank macro data",
      "Render config for the API + Vercel-ready dashboard",
    ],
    regret:
      "I'd add a multilingual ingestion path next, Wolof and Mandinka coverage matters because those languages dominate radio and informal political conversation in The Gambia. The technical bar is a translation pipeline plus accepting that the source quality (transcribed audio vs newspaper text) is messier. The single most useful extension to the index. Also planning to compare PRI against EIU / Fitch annual ratings as a long-term ground truth once a year of data has accumulated.",
    takeaway:
      "When the data is messy and the stakes are visible (a public political index for a country with no other public index), every layer of the pipeline has to be defensible on its own. Scraping has to be polite, preprocessing has to be reproducible, sentiment has to be evaluated against ground truth, the index has to drop during real crises. Cut corners anywhere and the whole thing collapses.",
  },

  // ─────────────────────────────────────────────────────────────────
  "ayat": {
    slug: "ayat",
    problem:
      "I had been reading the Qur'an my whole life through scrolling apps that treat the book as a list of 6,236 numbered cells. Every Quran app does the same thing: scroll, tap, scroll, tap. But the Qur'an is not linear. It loops. It cross-references itself. Surah 2 borrows imagery from Surah 12, Surah 12 mirrors structures from Surah 7. Reading it linearly is like reading a hypertext document with all the links removed. I wanted to make those connections physically visible, in a way that would let a reader feel the book's geometry instead of just see its text.",
    research: [
      "Read the original UMAP paper (McInnes, Healy 2018) before picking it over t-SNE. UMAP preserves global structure better, which is what I needed, themes have to land near each other across the whole corpus, not just locally.",
      "Studied which sentence-transformer model to use. Tried `all-mpnet-base-v2` (768-dim, slower) and `all-MiniLM-L6-v2` (384-dim, faster). Compared cluster coherence on a 200-verse sample. MiniLM lost ~3% on coherence but ran 2.5x faster on CPU. Picked MiniLM because the corpus is fixed and the speed lets me iterate on clustering parameters at no cost.",
      "Read existing Quran apps in detail before designing UX (Quran.com, Tarteel, Muslim Pro, Bayyinah). Identified what they all share: the verse list. Identified what none of them have: a spatial sense of the corpus. That gap was the whole opportunity.",
      "Studied Three.js InstancedMesh patterns. Naive Three.js creates one DrawCall per object, fine for 50 cubes, fatal for 6,236 verses on a phone. InstancedMesh batches them into one GPU call. Read three example codebases that used it for particle systems before writing my own.",
      "Read about the Meccan vs Medinan classification. Surahs were revealed in two distinct phases (Meccan: 13 years, cosmic, urgent, short; Medinan: 10 years, legislative, communal, long). Realised this was free metadata I could use for color, not just abstract clusters but a layer of meaning that a religious reader would already recognize.",
    ],
    constraints: [
      "Free tier on everything. No GPU, no managed vector DB, no paid embeddings API. If a feature required a paid service I had to either find a free path or skip it.",
      "Static export hosted on Vercel free tier. No long-running server I'd have to pay for when I left the laptop closed.",
      "Anthropic spend had to stay near zero. Every uncached AI call cost real money I didn't have, so caching had to be aggressive from the first deploy.",
      "Had to render 6,236 particles smoothly on a Tecno or Infinix Android phone. Those are the devices my actual users would have. iPhone-only WebGL was unacceptable.",
      "Audio for 18 reciters had to load progressively without choking 3G connections, a single Hafs recitation of the full Qur'an is ~2GB.",
    ],
    decisions: [
      {
        call: "Embed once in Python, ship a static JSON. Never embed at runtime.",
        reason:
          "The corpus is fixed forever, 6,236 verses, never changes. So I run sentence-transformers locally, project to 3D with UMAP, cluster with HDBSCAN, then dump the result as a JSON file the frontend just downloads. No vector DB, no embedding API at runtime, zero per-user cost. This is the single decision that makes the entire app free to operate.",
      },
      {
        call: "WebGL InstancedMesh, not HTML/SVG/canvas.",
        reason:
          "6,236 DOM nodes melts a phone, sustained 60fps rotation requires GPU. Three.js with InstancedMesh draws all 6,236 particles as a single GPU call. I had to learn shader-level customisation to make individual particles glow on hover, InstancedMesh doesn't give you per-instance materials by default. Built a custom fragment shader with attribute-based color and pulse intensity.",
      },
      {
        call: "Color verses by Meccan vs Medinan revelation, not by cluster ID.",
        reason:
          "Cluster IDs are abstract. A religious reader looking at the galaxy needs the visualisation to mean something they already understand. Coloring by revelation period gives the cosmos an immediate readable narrative, early Meccan verses (cosmic, urgent) cluster together, late Medinan verses (legislative, communal) cluster together. The data tells a story before anyone clicks anything.",
      },
      {
        call: "AI tafsir cached per verse globally, not per user.",
        reason:
          "Once Claude has analysed verse 2:255, that analysis is the same for every user. I cache it server-side keyed on `surah:ayah`, so the second user pays nothing. With ~6,236 verses, the entire tafsir corpus costs about $30 to generate once, then is free forever. The caching layer is the difference between a hobby project and a sustainable one.",
      },
      {
        call: "Custom pill dropdown for reciter selection, not native <select>.",
        reason:
          "Native selects render inconsistently across mobile browsers, different on iOS, Android Chrome, Samsung Internet. I needed a dropdown that visually matched the cosmos aesthetic and wrapped its width to the reciter's name (some names are long, 'Mahmoud Khalil Al Husary'). I went through three iterations: bleed-off-screen bug, clipping inside parent containers, then portal-rendered with smart up/down placement. Tiny detail, hours of work, dramatic UX upgrade.",
      },
      {
        call: "Theme search animates the matched stars, dims the rest, and locks clicks.",
        reason:
          "When a user searches 'mercy', the matching verses light up across the cosmos. But the unmatched verses were still clickable, which broke the focus. I added a state machine: during search-results mode, all non-matched stars become un-clickable and dim, matches stay bright at their settled positions until the user clears the search. Without this, users would tap a dim star by mistake and exit the results.",
      },
    ],
    pivots: [
      "First version did the embedding + clustering at request time on Vercel Edge. It worked but took 8 seconds on cold start. Moved everything to a one-shot Python pipeline that writes the static file at build time. Cold start is now instant. Documented in commit 9520c55: galaxy physics, video reset, debounce, shooting stars all stabilised together.",
      "Originally fetched the AI analysis on every verse open. Realised most users skim, so I made it click-to-reveal, the analysis only fetches when the user explicitly asks for it. Cut my Anthropic spend by ~70%. This pattern became the default for every AI feature in v2.",
      "First tour implementation had a race condition where the next step would fire before the previous step's animation finished. Caused card overlap on mobile (commit 0309957). Fixed by holding tour state in a state machine with explicit transitions instead of setTimeout chains.",
      "Theme search was originally just keyword matching. Got too many false positives, 'mercy' would match every verse with 'merciful' which is most of the Qur'an. Added synonym expansion + PCA-64 semantic boost, narrowing matches to verses that are actually about mercy as a theme.",
    ],
    weaknesses: [
      "I had never written a fragment shader before this project. Spent two weeks learning GLSL through The Book of Shaders, then implemented per-particle glow on hover. The pulse intensity attribute I added to the InstancedMesh is the result of that struggle.",
      "I didn't know what UMAP and HDBSCAN actually did at the math level when I started. Read the papers, ran them on toy datasets to build intuition, then on the Qur'an corpus. Tuned `min_cluster_size` and `min_samples` over many runs before the clusters mapped meaningfully to themes.",
      "Three.js performance was a steep learning curve. My first prototype used regular Mesh objects in a loop, 4fps on a phone. Rewriting with InstancedMesh + custom shaders + reducing pixel ratio on low-end devices got it to a steady 60fps.",
    ],
    outcome: [
      "All 6,236 verses live in the galaxy with semantic neighbour relations",
      "18 reciters with word-level audio highlighting",
      "Sub-1-second initial load on 3G",
      "AI tafsir caches globally, second user pays nothing",
      "Theme search with synonym expansion, click-locked results",
      "Custom shader-based particle glow",
      "Guided onboarding tour with state-machine transitions",
    ],
    regret:
      "I'd add a per-Surah constellation zoom mode. Right now the galaxy is one undifferentiated cosmos and very long surahs (Al-Baqarah, 286 verses) get visually crowded. A 'tap a Surah, fly into its constellation' interaction would reward the curious without polluting the global view. The architecture supports it, it's just an unbuilt camera transition.",
    takeaway:
      "When the corpus is fixed, do the expensive work once and ship the artefact. When the per-user cost is zero, you can run forever on free tiers. The Qur'an is the only book I know that asks the reader to find connections across its 114 chapters. Software should reward that, not flatten it into a scroll.",
  },

  // ─────────────────────────────────────────────────────────────────
  "ayat-v2": {
    slug: "ayat-v2",
    problem:
      "v1 was a galaxy. Beautiful, but you visited it and left. People said it felt like a museum, gorgeous to look at once, no reason to come back. I wanted v2 to be a contemplative companion you live inside for years. That meant adding a reason to return daily, ways to navigate the Qur'an by more than just verse number, a memory of where you'd been, and a contemplative frame that didn't feel like a productivity app. The challenge was doing all this without inflating the cost-per-user past zero, because the goal was still to ship to thousands of Muslims who couldn't pay anything.",
    research: [
      "Studied how Spotify Wrapped, Duolingo, and Strava produce daily-return habits without coercion. Wrapped works because the artefact is yours, a personal map, not a leaderboard. That's the model I copied for the Personal Trail Constellation: every verse you open glows softly, building a star map nobody else has.",
      "Read about Asbab al-Nuzul (the recorded occasions of revelation), the genre of Islamic scholarship that records the historical context of each verse. Realised this gave me a chronological dimension that no Quran app surfaces. Built the Timeline page from Ibn Ishaq's Sirah, Al-Wahidi's Asbab, and As-Suyuti's Lubab.",
      "Studied Capacitor vs React Native vs Expo. Capacitor wraps an existing web app as native iOS + Android with no rebuild. React Native means rewriting the UI. Expo is React Native plus tooling. Picked Capacitor because I had 8 months of polished web UI I refused to throw away. Researched Apple's App Store review trends, pure WebView apps are sometimes scrutinised, but Capacitor's native-plugin integration (Filesystem, Local Notifications, Share, Status Bar, Splash) is enough to satisfy reviewers.",
      "Read the React 19 release notes carefully before adopting it for v2. The new Activity component, the Suspense improvements, and useActionState changed how I structured the verse card's optimistic states.",
      "Studied Supabase Row-Level Security (RLS) patterns. Wrote my own schema with RLS policies before deploying, every user can only read their own trail, reflections, asks. Without RLS, a single misconfigured query exposes everyone's data.",
      "Read how Linear, Notion, and Stripe handle the 'AI is unavailable' state. None of them say 'error'. They all reframe the missing capability as the rest of the app being intact. That informed my 'AI commentary is paused' copy when Anthropic credits ran out.",
    ],
    constraints: [
      "Same free-tier stance as v1, no paid infra, no paid AI service running per-user.",
      "Couldn't manually tag all 6,236 verses for every topic. That would take months. I had weeks.",
      "Anthropic spend had to stay flat even with new AI features (Chat With The Verse, scholar comparisons).",
      "Native app launch target is Ramadan 2027, meaning everything has to also work inside a Capacitor WebView with no rebuild.",
      "Every interaction has to feel contemplative, never gamified. Religious software that feels like Duolingo is offensive to the audience.",
    ],
    decisions: [
      {
        call: "Hand-curate editorial walks of 8-15 stops per topic, then auto-expand to all matching verses via a keyword matcher.",
        reason:
          "Manually tagging 6,236 verses across 80+ topics is impossible. So I hand-pick the 8-15 strongest stops that tell a story (the editorial walk), then ship a regex matcher with hand-curated keyword arrays per slug. After the curated walk ends, the finish screen shows every other verse in the corpus matching those keywords. Result: every journey feels exhaustive without me drowning in tagging. The matcher is 30 lines of code; the editorial work is what's irreplaceable.",
      },
      {
        call: "Click-to-reveal AI everywhere, never auto-fetch.",
        reason:
          "Same lesson as v1, applied more aggressively. AI tafsir, Chat With The Verse, scholar comparison, all gated behind a tap. The button is right there, but the API call only fires when the user wants it. 70% of opens are skim-reads where the user doesn't need AI. The button-not-fetch pattern is the difference between paying for 100% of opens and paying for 30%.",
      },
      {
        call: "Split verses.json (12.4 MB) into a light variant (3.8 MB).",
        reason:
          "The galaxy needs the full file with 384-dim embeddings and neighbour lists. But the Timeline, Roots, Journey pages, and the in-page peek modal only need the text fields (Arabic, translation, transliteration). I generate a stripped variant at build time and use it everywhere except the galaxy. ~70% smaller payload, ~3x faster parse on mobile. This single split was the biggest perf win across the entire app, measured before/after on a Tecno phone, page load went from 4.2s to 1.1s on a cold cache.",
      },
      {
        call: "Lock body scroll when a verse card opens. Solid backdrop everywhere.",
        reason:
          "Originally the verse card had `pointer-events-none` on its backdrop so users could keep panning the galaxy behind. Felt clever, but on sub-pages it meant the page behind would still scroll while the user was reading. Worse: floating UI like the Plus button stayed clickable through the modal. Fixed by switching to a solid backdrop everywhere + applying `overflow:hidden`, `touch-action:none`, `overscroll-behavior:contain` to body when a card opens, then restoring on close. Tiny change, immediate quality lift.",
      },
      {
        call: "Capacitor for native, not React Native.",
        reason:
          "I already had a polished Next.js web app with Three.js, framer-motion, custom shaders. Throwing it out to learn React Native would cost months. Capacitor wraps the same code as iOS + Android with native plugin bridges (Local Notifications, Share, Filesystem for offline downloads, Status Bar, Splash). I get App Store and Play Store presence without rewriting any UI. The iOS + Android shells took 2 days to scaffold.",
      },
      {
        call: "Stream Claude's responses sentence-by-sentence, not all-at-once.",
        reason:
          "When the user asks Chat With The Verse a question, the answer can take 4-8 seconds at full quality. Waiting in silence breaks the contemplative tone. I switched to SSE streaming, chunks arrive as they're generated, the UI types them out word-by-word at human reading speed. Same wait time, completely different feel. Ship the bytes you have, don't queue them.",
      },
      {
        call: "Detect Anthropic credit-exhaustion specifically, surface a warm 'AI is paused' state.",
        reason:
          "When credits ran out mid-development I noticed every AI feature was just throwing 502s and showing 'something went wrong'. That breaks user trust silently. I sniff the upstream Anthropic 400 body for `credit balance` / `authentication_error` patterns, propagate `{paused: true}` through the route, and the client renders a warm bordered message: 'AI commentary is paused, between API top-ups. The verse, recitation, and the rest of the app are working normally.' Honest, doesn't break the brand, and when I top up credits it lights back up automatically with zero code change.",
      },
    ],
    pivots: [
      "Initially tried building a full hierarchical taxonomy of every verse → topic → sub-topic. Two weeks in, the tree was unmaintainable and I'd tagged 400 verses out of 6,236. Killed it. Switched to the keyword-expansion approach where I curate 8-15 verses per topic and the matcher does the rest. Shipped in 2 days. The lesson: when the surface area is too large for human work, design a system where humans do the irreplaceable part and code does the rest.",
      "First version of the journey transition screen had labels like 'Next stop' and 'Tap to continue'. User feedback (a single test reader) said they wanted to screenshot the connector phrase as a clean quote. Stripped all the UI hints, just the centered italic text on tap-anywhere-to-skip. Cleaner snap, cleaner UX. Sometimes the best feature is removing UI.",
      "React #310 (the hooks-after-early-return error) crashed the app on every sign-in for two days. The bug was a single `useState(maxH)` declared after `if (!user) return <a>Sign in</a>` in ProfileMenu. The fix was moving all useState calls above any conditional return. I'd never hit React's rules-of-hooks violation that hard before. Wrote a comment in the file explaining why hook order matters so future-me doesn't repeat it.",
      "Built ElevenLabs audio narration for the AI tafsir. Worked, but didn't add value next to the actual qari recitations. Removed it after a week of having it live. 'Recitation by 18 qualified qaris is the audio experience' (commit e08b946). Killed a feature I was proud of because it competed with a better one.",
      "Built a Random Walk meditation mode. Removed it three weeks later because the journey player covered the same need with editorial curation. Shipping a feature is half the test. Removing it when journeys subsumed it was the harder, more honest move (commit 306721b).",
      "Service worker was caching HTML/JS chunks. After each deploy, returning users would get a cached HTML referencing chunk hashes that no longer existed. Every deploy broke the app for cached users. Stripped HTML/JS from the SW cache (commit d616e39). Only `/data/*` is cached now. Loaders handle the network round-trip at runtime.",
    ],
    weaknesses: [
      "I didn't know how to write a system prompt that wouldn't drift toward generic spiritual cliches. First version of the AI tafsir would say things like 'this verse reminds us to be patient', embarrassing in a tradition with 1400 years of grounded scholarship. Iterated 11 times on the system prompt with explicit forbidden phrases ('reminds us', 'teaches us', 'encourages us', 'embodies', 'captures'), explicit scholar grounding requirements, and a hard rule: name the scholar, or don't say it. The forbidden-phrase list grew with every drift incident.",
      "I'd never used Capacitor before. Spent a weekend on its docs, then a day debugging the iOS shell's Splash and Status Bar plugins. Native UI bridging is a different mental model than web UI. Once it clicked, the wrap was straightforward.",
      "Supabase RLS patterns took a few mistakes to get right. My first schema let the user query other users' rows by manipulating the `user_id` in the request body. Rewrote with `auth.uid() = user_id` policies on every protected table. The lesson: RLS policies have to be the floor of access, not a defence-in-depth layer.",
      "Mobile WebView quirks broke things I'd never see on desktop. `100vh` doesn't work right on iOS Safari (the browser chrome eats the bottom). Switched to `window.innerHeight` measured at runtime. Touch event timing is different from mouse events. Body scroll lock needs `touch-action: none` AND `overscroll-behavior: contain` to actually stop pull-to-refresh.",
    ],
    outcome: [
      "80+ journeys (themes, prophets, places, people)",
      "Atlas of Qur'anic geography (15+ named places, walkable via the journey player)",
      "45-event Asbab al-Nuzul Timeline in revelation order",
      "19 Arabic roots with derivative webs",
      "Personal Trail Constellation that builds over months",
      "Click-to-reveal AI tafsir + Chat With The Verse + Detective semantic search",
      "Streamed AI responses (sentence-by-sentence)",
      "Magic-link auth via Supabase, RLS-protected",
      "iOS + Android Capacitor shells with native plugins (Share, Filesystem, Notifications, Status Bar, Splash)",
      "Streak pill ('nights kept') derived from verse_visits, contemplative tone",
      "Service worker cache-versioned, never serves stale HTML",
      "Graceful 'AI is paused' state when Anthropic credits exhaust, user-side trust preserved",
    ],
    regret:
      "Should have written end-to-end tests for the auth + RLS flow earlier. The React #310 bug crashed sign-in for two days because no automated test was watching it. I shipped fast and trusted manual QA. With Playwright tests guarding the sign-in → verse-open → reflection-save flow, I'd have caught it on commit. Adding them next.",
    takeaway:
      "When the corpus is fixed, do the expensive work once and ship the artefact. When the corpus is unbounded (user data, AI calls), make every fetch click-gated. When a feature competes with a better one already in the app, kill the worse one, even if you were proud of it. Removing software is harder and more honest than adding it.",
  },

  // ─────────────────────────────────────────────────────────────────
  "vantage": {
    slug: "vantage",
    problem:
      "Tech news is unreadable. The volume per day is in the hundreds of thousands of articles globally, and most of it is noise, patch notes, gadget sales, recycled press releases, identical takes on the same Reuters wire. I wanted a feed that did the synthesis for me, scored each story by signal strength, and let me skim only what mattered across six regions. I also wanted it to read like an actual editorial voice, Ben Thompson, Matt Levine, The Economist, not like a Twitter bot summarising headlines.",
    research: [
      "Read 100+ Stratechery articles to internalise Ben Thompson's structure: every piece is a verdict (the headline IS the thesis), follow the money first, name names, end with a falsifiable prediction. Translated this into an explicit system prompt with banned phrases ('In a move that…', 'It's worth noting…') and required structures.",
      "Studied NewsAPI's free tier limits in detail before architecting anything. 100 requests/day, language=en filter, 10 articles per query. That number determined the entire pipeline: I couldn't fan-out to all six regions in parallel, I had to chain them through a single daily run.",
      "Read Vercel's Hobby plan limits carefully. Crons run once per day max. Edge function timeout is 60s. These two constraints shaped everything: chain-of-regions through a single cron, every region fits inside 60s, drop the slowest sub-pipelines.",
      "Studied Anthropic's pricing tiers across model families. Sonnet is 3x the cost of Haiku. For a synthesise-and-score pipeline running unattended, Haiku's quality at one-third the cost was the right trade, I lost subtle nuance, kept the editorial voice via the strict prompt.",
      "Studied RFC 5005 / RSS specs while building the regional sources. Most regional tech publications still publish RSS even if their websites are bad. Africa especially, TechCabal, Disrupt Africa, Iwacu, etc. RSS was the cheapest way in.",
    ],
    constraints: [
      "Free Vercel Hobby plan, one cron per day max, edge functions timeout in 60 seconds.",
      "Free NewsAPI tier, 100 requests/day total across the whole pipeline.",
      "Free Supabase tier, 500 MB DB, no concurrent connection pooling.",
      "Anthropic budget: tight. Every article generated had to be cheap or the system breaks at scale.",
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
          "NewsAPI returns the same headline from multiple sources (Reuters, AP, then 30 outlets quoting them). I slugify the title and check Supabase first, if the slug exists, skip Claude entirely. Saves an Anthropic call per duplicate, which is ~70% of what's returned. The cheapest call is the one you don't make.",
      },
      {
        call: "Edge runtime + direct fetch to Anthropic, no SDK.",
        reason:
          "The Anthropic Node SDK pulls in dependencies that don't run on Vercel Edge. I wrote a 30-line direct fetch to `api.anthropic.com/v1/messages` instead. Edge runtime keeps cold starts under 100ms (vs ~800ms for Node runtime), which matters when six chained route calls are racing the 60-second timeout. Also cuts deployment size.",
      },
      {
        call: "Strict editorial system prompt with explicit banned phrases.",
        reason:
          "The whole point of VANTAGE is that articles read like editorial, not like 'AI synthesised this for you'. The system prompt is ~400 words of explicit constraints: every headline is a verdict, follow the money first, name names, no em-dashes (use commas/colons/periods only), no 'it's worth noting' / 'interestingly' / 'in a move that…', short paragraphs (2-3 sentences), end with a falsifiable prediction. The output reads sharp because the prompt is sharp.",
      },
      {
        call: "Use Haiku for the pipeline, not Sonnet.",
        reason:
          "Sonnet was overkill. Article synthesis is high-volume, low-stakes-per-token (you can re-generate tomorrow if today's is mediocre). Haiku at 1/3 the cost lets the pipeline run sustainably on the budget I had. The strict editorial system prompt does the heavy lifting, Haiku follows it well enough for the format.",
      },
      {
        call: "Region-by-region article cap (1 per region per run).",
        reason:
          "Originally tried to generate 3 articles per region per cron. Hit Vercel's 60s edge timeout repeatedly. Cut to 1 per region per run. Trade-off: less content per day, but the cron actually completes. Better to ship 6 high-signal articles than to time out at article 9 and lose the region's whole batch.",
      },
      {
        call: "Disable article deletion when credits run out, even though it bloats the feed.",
        reason:
          "Originally a nightly /api/expire cron deleted articles older than 48 hours to keep the feed fresh. When Anthropic credits exhausted, regeneration stopped, but expiration kept running. I'd wake up to a half-empty feed with no way to refill it. Disabled the expire cron + neutered the route to return `{disabled: true}` even on manual trigger. Better to show old articles than to show nothing.",
      },
    ],
    pivots: [
      "First version stored articles forever. Quickly the feed had 800 articles and the page took 4 seconds to load. Added the /api/expire route to delete >48h. Then ran out of credits, disabled deletion. The feed now persists historic articles intentionally, context as a feature.",
      "Pipeline timeout was a recurring battle. First attempt with full prompt at 4000 tokens timed out. Trimmed prompt → still timed out. Switched Haiku → fitted. Then added Reddit + HN sub-pipelines → timed out again. Dropped them. Final: lean RSS-only ingestion, 2500 tokens, Haiku, fits 60s. Half the iterations were 'add capability, blow timeout, remove capability'.",
      "NEXT_PUBLIC_SITE_URL was hardcoded to a stale Vercel auto-URL (`vantage-three-chi.vercel.app`) that broke after a project rename. The chain-of-regions silently died because `fetch().catch(() => {})` swallowed the DNS error. No alarm fired; the feed just stopped updating regional content. Took me weeks to notice because global was still working. Lesson: silent fire-and-forget + free-tier observability = bugs that hide for weeks.",
      "Found a stray `OneDrive/Desktop/FORGE/` folder accidentally committed inside the vantage repo (probably a Windows OneDrive sync mishap). Vercel build failed with a TypeScript error pointing into FORGE's `prisma.config.ts`. Removed the folder, added it to .gitignore. Cross-project filesystem leakage is a real Windows-specific hazard.",
    ],
    weaknesses: [
      "I didn't fully understand SSE streaming when I started. Vercel Edge has different streaming semantics than Node. Spent a day debugging why chunks were buffering instead of arriving incrementally. Fix was using `controller.enqueue(encoder.encode(chunk))` instead of trying to write to the response body directly.",
      "I underestimated how aggressive Vercel's edge timeout is. 60s sounds like a lot until your pipeline does fetch → JSON parse → embedding lookup → Claude call → DB insert per article. Learning to budget across the chain (under 10s per article, leave headroom for cold start) was a forcing function.",
      "I learned the hard way that NewsAPI sorts by `relevancy` differently across regions. 'AI' in `global` returns OpenAI/Anthropic news. 'AI' in `africa` returns 80% Nigerian fintech. Ended up using region-specific keyword sets and RSS feeds for non-global to escape NewsAPI's relevancy bias.",
    ],
    outcome: [
      "6 regions × 6 categories = 36 distinct content streams",
      "Single daily cron, fully autonomous, runs on Vercel free tier",
      "Articles scored 1-100 by signal strength",
      "Each article structured: headline (verdict), what happened, why it matters, who wins/loses, what to watch (with falsifiable prediction)",
      "Slug-based de-duplication before any AI call",
      "Edge runtime + direct Anthropic fetch (no SDK overhead)",
      "Graceful degradation: when credits exhaust, articles persist instead of dying silently",
    ],
    regret:
      "I'd add an embedding-based 'find me articles like this one' next step. Right now the user picks a region/category to filter, but semantic similarity is more useful than topical buckets, readers want 'more on this thread', not 'more in this folder'. Same trick I used in AYAT could ride along here.",
    takeaway:
      "When you're optimising AI cost, the cheapest call is the one you don't make. De-dup before you spend. When you're optimising on a free tier, treat every constraint (60s timeout, 100 req/day, 500MB DB) as the input to your architecture, not an obstacle. Constraints force creative wiring.",
  },

  // ─────────────────────────────────────────────────────────────────
  "gambia-legal-aid": {
    slug: "gambia-legal-aid",
    problem:
      "Gambians have almost no access to legal information. Lawyers are scarce and expensive, a one-hour consultation is more than a week's wage for most. The laws themselves are scattered across PDFs that most people will never find or be able to read. Hallucinated legal advice from a chatbot would be actively harmful: a person told they have rights they don't, or vice versa, in matters of arrest, dismissal, eviction, domestic violence. So the bar wasn't 'build a chatbot'. The bar was: build a chatbot that REFUSES to lie, even at the cost of being less useful.",
    research: [
      "Read every Act we ingested (Constitution, Criminal Code, Labour Act, Children's Act, Sexual Offences Act, Domestic Violence Act, Immigration Act, Rent Act 2014/2017/2024, etc.) end-to-end before writing the system prompt. Could not enforce grounding without knowing what grounded actually meant.",
      "Studied how Westlaw and LexisNexis structure citations. They cite by section number, sub-section, and Act. Realised my retrieval had to surface those exact metadata pieces or the citations would be unverifiable.",
      "Read the OpenAI 'Constitutional AI' paper and Anthropic's RAG literature. The pattern that stuck: validate the answer against the retrieved context BEFORE returning it. If the model hallucinated, reject and retry, don't ship and apologise.",
      "Studied curly-quote vs straight-quote behaviour across browsers and PDFs because the model would generate the curly version of \"section 14\" when the source text had the straight version, and my substring validator initially missed this and let hallucinations through.",
      "Read Gambian legal cases on unfair dismissal, domestic violence prosecutions, and immigration appeals to make sure the topic anchors I was building actually retrieved the sections that mattered to real disputes.",
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
        call: "Groq Llama 3.3 70B as the generation model, not Claude or GPT-4.",
        reason:
          "Legal Q&A is high-volume (every Gambian who has the link uses it for free) and the cost math has to work. Groq's Llama 3.3 70B is fast (sub-second first token), generous on free tier, and quality is high enough for the format I need (one tight paragraph with citations). The strict system prompt + multi-layer hallucination guard does the heavy lifting; the model itself just needs to be coherent and follow instructions. Cost-engineered for a public-good product.",
      },
      {
        call: "Multi-layer hallucination guard: section allowlist + verbatim quote validation + banned phrases.",
        reason:
          "Standard RAG guards against hallucination by retrieving good context. Mine goes further. After retrieval I build a per-Act allowlist mapping section number to section title. The prompt instructs the model to cite ONLY numbers from this allowlist, AND to quote any direct text VERBATIM as a substring of the retrieved chunks. Post-generation validator: every cited section number is checked against the allowlist; every quoted span is checked as a substring of context. Anything that fails is hard-rejected, the system retries with explicit feedback ('you cited section 15 but only sections 14, 18, 22 are valid; quoted text was not in context'). If the retry also fails, the system refuses to answer rather than ship a bad citation.",
      },
      {
        call: "Section title allowlist with claim-matching, not just number allowlist.",
        reason:
          "An early bug had the model citing the right number but for the wrong reason, 'Section 15 (Powers of tribunal) for a claim about notice periods' when notice was actually Section 14. Numbers matched, semantics didn't. Fixed by passing the full allowlist as `15. Powers of tribunal\\n14. Notice of termination\\n…` so the model could see WHY each number existed and match the claim to the right title (commit 2102d0e).",
      },
      {
        call: "TF-IDF ranking + topic anchors + low temperature, layered.",
        reason:
          "Pure semantic search returned the chunks closest in meaning to the query. But legal queries often involve specific terms that semantic search smooths over (e.g. 'section 130' as a phrase). I added TF-IDF ranking on top to surface chunks containing the rare terms, plus topic anchors (hand-curated keyword maps like `unfair dismissal → [Sections 130, 132, 139, 140 of Labour Act]`) to force-include sections that had to be in scope. Low temperature (0.1-0.2) eliminated the model's tendency to creatively combine unrelated chunks. Three orthogonal lenses, layered (commit 88d0e72).",
      },
      {
        call: "Multi-word anchor filtering when building the SQL OR clause.",
        reason:
          "The retrieval query was being built dynamically as `text ILIKE '%anchor1%' OR text ILIKE '%anchor2%'…`. Multi-word anchors like 'unfair dismissal' were getting passed in but Postgres ILIKE treated them as literal strings, fine. The problem: low-signal terms ('the', 'and') were polluting the OR clause and matching everything. Filtered to drop those when high-signal terms were present (commit 05a9f64).",
      },
      {
        call: "Stream the answer word-by-word AFTER validation, not during generation.",
        reason:
          "Standard SSE streaming would write tokens as the model produces them. But if a hallucinated citation appears mid-stream, you can't pull it back, the user already read it. Instead I generate the full answer, validate it, THEN stream it word-by-word for the typewriter effect. Slightly slower start (the user waits ~3s for first token instead of ~1s), but every word that appears is already validated. Trust over speed (commit dc4ae3f).",
      },
      {
        call: "Banned-phrase list: no 'consult a lawyer', no 'review your contract'.",
        reason:
          "These phrases are noise. They're what useless lawyer-bots say to dodge accountability. The user is here BECAUSE they don't have a lawyer. Banned them at the prompt level AND at the post-processing level. If the model slipped them in, the post-processor stripped them. The system has to act AS the lawyer or it fails the brief (commits 5f68053, 61a93b1).",
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
      "First version retrieved top-5 chunks unconditionally and let the model write whatever. Tested it on questions outside the corpus, it confabulated convincingly, citing fake section numbers with fake quotes. Built the citation-anchor + verbatim-quote check as the gate. Pass rate dropped sharply, trust went up. Ship the system that says 'I don't know' over the one that confidently lies.",
      "Initial chunking was naive 1000-char windows. A user asked about marriage law and got back chunks from a tax statute that happened to share a phrase. Switched to section-aware chunking: parse the statute's section markers, chunk on them, each chunk is a self-contained legal unit (commit 22f5c6f).",
      "Curly quotes vs straight quotes broke the validator silently. the model would output the curly version of a quoted span and the substring check against straight-quote source text would fail to match. Tightened the regex to normalise both flavours and added 3-word span detection (commit 8cb717a). The bug was invisible in dev (where I copy-pasted source) and only appeared in production where the model's outputs differed from my inputs.",
      "Added a hard-fail validation that REFUSES to ship the answer if the retry also produces hallucinated citations. Logging shows the user 'I couldn't find this in the statutes I have' instead of returning a confidently wrong answer. The metric I optimise is 'lies shipped per million queries', hard fail is the only way to drive that to zero (commit 5d5a1e4).",
      "Surfaced 400-status messages in the UI. Originally the client showed 'Something went wrong' for every failure. Now legal-validation rejection is shown as 'I couldn't ground this in the statutes I have' which is a different message from network failure. Honest UX is harder than generic UX (commit 5f68053).",
    ],
    weaknesses: [
      "I did not understand TF-IDF deeply enough at the start. Pure semantic retrieval was failing on rare-but-critical terms (specific section numbers, specific named provisions). Spent a weekend reading sklearn's TF-IDF implementation, then wrote my own minimal version that combined cosine similarity from embeddings with sparse TF-IDF scores. The hybrid retrieves better than either alone.",
      "I had never written a hallucination guard before. First version was just 'check each cited section number against the source'. That caught 30% of bugs. Iteratively added: verbatim quote check, section title matching, banned phrase post-processing, hard-fail on retry, diagnostic headers. Each layer caught a class of failure the previous layers missed.",
      "I didn't know how messy real statute PDFs would be. Footnotes inline in body text, OCR errors ('s.l4' instead of 's.14'), inconsistent section numbering across acts. Wrote a per-Act ingestion script that normalised each one's quirks before chunking. It's not generalisable, every act needed its own preprocessing rules. The honest answer is: legal-doc ingestion is a manual job pretending to be an automated one.",
      "I underestimated how aggressively users would test the system. Within a week of deploying, someone asked 'what does the constitution say about [made up topic]?', the model used to confabulate. Adding the hard-fail was the response to that. The lesson: every confident answer is implicitly a contract. Break it once and the whole system loses trust.",
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
      "In high-stakes domains, refusing to answer is a feature, not a failure. The system that says 'I don't know' is more useful than the one that confidently hallucinates. Hallucination prevention is not one technique, it's a stack: better retrieval, allowlists, verbatim validation, banned phrases, hard-fail on retry. Each layer catches what the previous one missed.",
  },

  // ─────────────────────────────────────────────────────────────────
  "dalasi-pulse": {
    slug: "dalasi-pulse",
    problem:
      "Remittances are ~20% of The Gambia's GDP. Every Gambian family has someone abroad sending money home. The Central Bank of The Gambia has internal forecasts of FX rates and remittance inflows; ordinary Gambians don't. There is no public-facing forecast of what the Dalasi will do next month, no dashboard showing diaspora corridors, no calculator for 'what will £100 be worth when I receive it'. I built the citizens' version: a public dashboard that shows what the Dalasi is doing, where remittances are coming from, and what the next six months look like, so a family deciding when to send or receive can plan instead of guess.",
    research: [
      "Read the Central Bank of The Gambia's annual reports (2019-2024) to understand which currencies matter for the Dalasi's stability (USD, EUR, GBP, CHF, JPY) and how seasonality plays in (remittance peaks during Ramadan, Eid, school-year start in September).",
      "Read World Bank KNOMAD methodology on bilateral remittance estimation. The data is corridor-level: UK→GM, US→GM, ES→GM, DE→GM, etc. Knowing the methodology was crucial because it's mostly imputed from migration stocks + sender-country incomes, not from actual transaction data.",
      "Studied Prophet's underlying Bayesian framework (Taylor & Letham 2017) before using it. Prophet handles seasonality + holidays elegantly, which is what I needed for Ramadan/Eid effects. Compared with SARIMA: Prophet better at multi-period seasonality, SARIMA better at short cyclicality. Used both, ensemble.",
      "Reverse-engineered the Central Bank of The Gambia website's network behaviour by opening their FX rates page in Chrome devtools. Saw an undocumented JSON endpoint at `cbg.gm/ajax/indicative-exchange-rates/{CURRENCY}` returning 25 years of daily rates. Authoritative, free, no key required. Confirmed it worked across all major currencies before betting the project on it.",
      "Read GitHub Actions cron syntax + storage limits. Decided to refresh forecasts daily via Actions instead of Vercel cron, Vercel's Hobby cron wakes the function once per day at a non-customisable schedule. Actions gave me precise scheduling and a free workflow log.",
    ],
    constraints: [
      "All data sources had to be free. No Bloomberg terminal, no paid APIs, no licensed datasets.",
      "Forecast accuracy had to be honest about uncertainty (intervals, not point estimates).",
      "Dashboard had to load in seconds on a Gambian 3G connection, most users are on Tecno/Infinix phones, not iPhones.",
      "Could not call any paid API at runtime (per-user cost would crush the project).",
      "Had to be visually trustworthy. Bad design + financial data = users assume the data is wrong.",
    ],
    decisions: [
      {
        call: "Reverse-engineer the CBG's undocumented JSON endpoint as the primary data source.",
        reason:
          "The Central Bank publishes daily indicative rates as a webpage with no documented API. Opened the network tab and found `cbg.gm/ajax/indicative-exchange-rates/{CURRENCY}` returning 25 years of daily rates as JSON, no auth required. Official, authoritative, free. Found by curiosity, not documentation. Built the entire pipeline on it; cross-validated against `exchangerate.host` as a backup. The trick is being willing to look in places nobody put 'API' in the URL.",
      },
      {
        call: "Prophet + SARIMA ensemble, not single-model forecast.",
        reason:
          "Prophet handles seasonality (Ramadan/Eid spikes in remittances) elegantly. SARIMA captures shorter cyclicality and is more robust on stationary FX series. Each fails differently on different windows. Averaging both, with confidence intervals from each, gives a forecast that reflects model uncertainty too, which is the honest thing to publish for financial data.",
      },
      {
        call: "Static export pre-rendered at build time, not server-rendered per request.",
        reason:
          "The data updates daily, not by user request. Pre-render once at build time with the latest forecast, ship as static HTML + JSON, host on Vercel free tier. Loads instantly anywhere, costs nothing per visitor. The build is triggered by the daily Actions job that refreshes the forecast.",
      },
      {
        call: "Daily GitHub Actions refresh + auto-commit, not Vercel cron.",
        reason:
          "Vercel Hobby cron runs once per day but at a server-determined time. Actions cron runs at a precise schedule, has free unlimited minutes for public repos, and produces a visible workflow log. The Actions job: fetch CBG rates → recompute Prophet/SARIMA → commit `data/processed/*.csv` → push → Vercel auto-deploys the updated build. The ~25 commits visible in `git log` (`Refresh forecasts 2026-04-12`, `2026-04-13`, …) are this loop running on autopilot.",
      },
      {
        call: "Bypass Next.js fetch cache + use browser-like headers when querying CBG.",
        reason:
          "First version had `/api/fx` returning year-2000 rates instead of latest. Spent half a day debugging, turned out Next.js's fetch cache was holding a stale CBG response from build time. Worse: CBG occasionally returned different data based on user-agent (presumably to discourage scraping). Fix was to set `cache: 'no-store'` AND send a normal browser User-Agent header. Two unrelated bugs on the same code path (commits 06a6d18, 4e2d1e2).",
      },
      {
        call: "Plain-language interpretation alongside the chart.",
        reason:
          "A line chart with a forecast band is not enough for the average user. Added a plain-English interpretation paragraph: 'The Dalasi has weakened ~3% against the Pound this year. Forecasts suggest moderate stability through the next 6 months with a wider band around Eid. £100 today buys GMD 8,750, your model suggests it'll buy 8,400-9,100 next month.' The chart is for analysts; the prose is for everyone else (commit ac5e78f).",
      },
      {
        call: "Live-status badge with CBG date stamp, polled every 15 minutes.",
        reason:
          "Users don't trust financial data without knowing when it last updated. Added a 'Live · CBG date 2026-05-08' badge that polls the API every 15 minutes. If the date is more than 24 hours stale, it visibly flags it. Honest provenance over fake real-time-ness (commit db5e7b1).",
      },
    ],
    pivots: [
      "First version was just FX. Added remittances as an afterthought. Realised they mattered MORE than FX for the typical Gambian family, most don't trade currencies, they receive transfers. Reframed the dashboard around remittances and made FX the supporting layer. Reframing what the product is about, not just what it shows, was the harder pivot.",
      "Used `exchangerate.host` as the primary FX source initially. Then discovered the CBG endpoint by accident while inspecting the bank's website. Switched primary to CBG (official) and kept exchangerate.host as a cross-validation backup. Sometimes you build the wrong thing first because the right thing wasn't visible yet.",
      "Original ETL pipeline had no cleaning layer, just fetched, plotted. Found that CBG had occasional duplicate rows from their backend, plus a methodology break around 2010 where the calculation changed and rates jumped 8% overnight. Wrote a cleaning script: dedupe, outlier removal (3-sigma), and a methodology-break correction factor for pre-2010 rates. The data looked sane after, the forecasts stopped having weird spikes (commit ba82a7e).",
      "Mobile UX broke because the currency selector pills wrapped onto a second line under the amount input on narrow screens, pushing content off-screen. Restructured the layout so currency pills sit ABOVE the amount field on mobile, side-by-side on desktop. Mobile-first means actually testing on a real phone, which I should have done sooner (commit 64e7bec).",
    ],
    weaknesses: [
      "I did not know Prophet vs SARIMA differences before this project. Read both papers, ran both on toy series, then on the Dalasi data with cross-validated holdouts. Picked the ensemble approach after seeing each model's failure modes.",
      "I was new to GitHub Actions cron schedules. First version had the wrong cron syntax and the job ran every minute. Fortunately discovered before committing API-key usage to that.",
      "Time-series cross-validation is different from random-split CV. You can't shuffle time-ordered data without leaking the future into the training set. Read about walk-forward validation and rewrote my evaluation pipeline. Forecast metrics dropped from optimistic to realistic, which was the point.",
      "I underestimated how much pre-2010 Dalasi data was non-comparable to post-2010 data due to a methodology break. Adding the correction factor was a research task, not a coding task, I had to read the CBG's methodology footnotes to find the conversion ratio.",
    ],
    outcome: [
      "Live FX dashboard for Dalasi vs USD, EUR, GBP, CHF, JPY",
      "25 years of daily CBG rates",
      "6-month-horizon forecasts with confidence intervals (Prophet + SARIMA ensemble)",
      "Bilateral remittance corridor breakdown (UK/US/Spain/Germany → GM)",
      "'£100 next month' calculator for diaspora users",
      "60-day daily forecasts + monthly sending calendar",
      "Plain-language interpretation paragraph",
      "Daily auto-refresh via GitHub Actions, deploys on commit",
      "Static export, instant load on 3G",
    ],
    regret:
      "I'd add a free SMS-out for non-smartphone users, text the dashboard a query like 'GBP forecast' and get the answer back. Most of the audience that would benefit most is not on smartphones. Would need a free SMS gateway (Africa's Talking has limited free credits) or a Telegram bot as a stopgap. Adding next.",
    takeaway:
      "Open data exists in unlikely places. The CBG endpoint was sitting in the network tab the whole time. Curiosity outranks documentation. When publishing financial forecasts, honesty about uncertainty (intervals, model ensembles, plain-language interpretation, last-updated timestamps) is the difference between trustworthy data and fake-precise data.",
  },

  // ─────────────────────────────────────────────────────────────────
  "forge": {
    slug: "forge",
    problem:
      "I kept skipping days on my own learning and lying to myself about it. Streak apps don't work because they're trivially fakeable, you tap 'yes I studied' and move on. I wanted a lock screen that would actually grill me on what I claimed to have done, the way a good coach would. The app's job is not to be liked. It's to be the friend who says 'that's not enough, what specifically did you build?' when you try to coast. If I succeed I uninstall it; if I fail I keep it.",
    research: [
      "Studied behavioural-economics literature on commitment devices: Dean Karlan's stickK, Beeminder's monetary penalties, Forest's tree-killing. Pattern: the apps that work make failure expensive in a way you actually feel. Apps that just track without consequence are noise.",
      "Read interrogation methodology, not literally, but the structure: how a good cross-examination works (Reid technique critique, NIJ structured interviewing). What makes it hard to fake is asking for SPECIFICS the liar doesn't have. 'What did you build?' is gameable. 'What was the bug, what did you try first, why didn't it work?' isn't.",
      "Studied Apple Screen Time and Android's Focus Mode. Both have the same flaw: they're disabled from inside themselves. If you can disable the constraint when willpower is low (which is exactly when you'd want to), the constraint is theatre. PIN-locking the settings is the fix.",
      "Read about OpenRouter's routing model. Quality on a daily 200-token interrogation is fine across many models. Locking to one provider is paying for moat that doesn't exist.",
      "Studied accountability-pod patterns from Nat Eliason, Tim Ferriss, and a few habit-tracking communities. External accountability beats internal accountability when willpower fails.",
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
          "A form asks 'what did you do today?' and accepts any answer. The interrogator reads your claim and asks specific cross-examining follow-ups. Generic 'I studied React' gets pushed back: 'what specifically did you build, what was the bug, what would you do differently?' The system prompt is calibrated to reject vague claims and require specifics. Faking specifics is harder than just doing the work, that's the whole mechanism.",
      },
      {
        call: "PIN-locked settings, not user-disable.",
        reason:
          "If you can disable the app from inside the app, you will when willpower runs out at 11 PM after a bad day. Settings live behind a PIN you set up sober, can't change without re-entering. Same logic as ScreenTime parental controls, restrict your future self. The PIN is checked server-side; clearing app cache or reinstalling doesn't help.",
      },
      {
        call: "OpenRouter, not OpenAI/Anthropic direct.",
        reason:
          "OpenRouter routes to whatever model is cheapest while meeting quality bar. For a daily 200-token interrogation, GPT-4o-mini or Llama 3.3 70B is fine. I save 10x vs hardcoding to a single provider, and if one provider goes down the app keeps working. Provider neutrality is the right architecture for high-volume low-stakes calls.",
      },
      {
        call: "Streak resets on skip, no make-ups, no buybacks.",
        reason:
          "If you can buy back yesterday with twice the work today, you will gamble on it and skip more. Streak loss has to be permanent or it isn't a deterrent. Hard, but the whole point of accountability is the cost of failure.",
      },
      {
        call: "Accountability pods, small groups (3-5), public skip notifications.",
        reason:
          "Internal motivation is unreliable. External accountability is harder to fool. When you skip, your pod sees it. When they skip, you see it. Social pressure becomes the second deterrent layer behind the streak. Built this in (commit 7fbcdb2). It's opt-in because forced groups feel coercive.",
      },
      {
        call: "Public build log, posts of what users built, opt-in.",
        reason:
          "Showing the work IS the work. A public stream of 'today I built X' creates a soft pressure to have something interesting to post. Also doubles as marketing for the app, visitors see real users actually building things. Two-for-one motivational layer.",
      },
      {
        call: "Grace days, but limited and visible.",
        reason:
          "Pure no-skip is too brittle. Real life: travel, illness, family emergencies. I added 3 grace days per quarter, visible in the streak UI. Using them costs nothing but is visible to your pod. Skipping without grace days resets the streak. Grace makes the system humane without gaming it.",
      },
    ],
    pivots: [
      "Original interrogator was too soft, accepted 'I studied for 2 hours' without follow-up. Tightened the system prompt: 'Reject any claim that lacks specifics. Ask for what was built, what failed, what was learned.' Pass rate dropped 40%, which was the point. Iteratively rewrote the prompt 6+ times to get the right level of skepticism.",
      "First model was Claude Sonnet, which was overkill and expensive for daily check-ins. Moved to OpenRouter with cheaper routing (Llama / Gemma / Mixtral, picked by cost-quality bid). Quality stayed identical, cost dropped 90%.",
      "Tried camera-based proctoring, make the user appear on camera during interrogation to make lying harder. Removed it (commit b032662). Reasons: too invasive for the religious / privacy-conscious users I cared about, and it didn't actually prevent lying about what was DONE, only proved you were physically there. Wrong layer of accountability.",
      "Added a leaderboard of streaks. Removed it (commit b032662). Public ranking turned the system into a competition and produced the wrong incentive: people gaming streak length over real work. Built it, lived with it, deleted it. Some features look good in mockups and bad in production.",
      "Re-entry flow: when a user broke their streak, the original UX showed them a sad face and 'streak: 0'. Felt punishing in a demoralising way, not a productive way. Rewrote the re-entry as 'day 1 again, what's the first specific thing you'll build?' Reframes the failure as a fresh start without sugar-coating it (commit 7fbcdb2).",
      "Initially required sign-up for every visit. Added a guest/demo mode (commit 12cdb83), users can try the interrogator without creating an account, the data is wiped on tab close. Lowered the activation barrier to 'click try', 10x more people actually use it once.",
    ],
    weaknesses: [
      "I had not built a NextAuth v5 app before. Spent days on the new auth.config / middleware patterns. NextAuth v4 → v5 is a breaking redesign. Had to rebuild the whole auth surface around the new useSession hook + edge-friendly middleware.",
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
      "The hardest software to build is software that's hard on you. Most apps optimise for retention; FORGE optimises for honesty. Ship the feature, watch how it actually changes behaviour, kill it if it produces the wrong incentive, even if you were proud of it. Removing software is harder than adding it.",
  },

  // ─────────────────────────────────────────────────────────────────
  "hireiq": {
    slug: "hireiq",
    problem:
      "Job application forms are a disaster for both sides. Candidates dump CVs into black holes; hiring teams drown in unqualified applications. The conversation that should be happening, 'tell me about a project, I'll ask follow-ups', is replaced with a static form. The static form is the worst possible interface: it can't ask follow-ups, can't probe weak answers, can't tell a strong candidate from a polished CV. I built an AI that has the conversation instead, and produces a scored, defensible report at the end.",
    research: [
      "Read structured-interview research (Schmidt & Hunter 1998 meta-analysis, more recent McDaniel reviews). Structured interviews predict job performance ~2x better than unstructured ones. Key levers: rubric-based scoring, anchored rating scales, multiple interviewers (or in our case, multiple criteria within one AI run).",
      "Studied how Workday, Greenhouse, Lever structure their candidate pipelines. ATS systems are built around the static form because that's what 1990s HR software was. The conversation is conspicuously absent.",
      "Read Gemini Flash 2.0's release notes and benchmarks before picking it. Sub-second responses, 10x cheaper than GPT-4. For a high-volume conversational interviewer, latency and cost matter more than peak reasoning ability, Flash trades a bit of reasoning for the volume math working.",
      "Studied legal hiring constraints (EEOC US, GDPR EU, employment law generally), specifically what the AI can ASK and what the report can SAY. Avoided protected-category questions, kept assessments role-relevant.",
      "Read WeasyPrint's docs and CSS-print specs. PDF generation from HTML is a well-trodden path but small mistakes (missing print stylesheet, browser-quirk fonts) ruin the output.",
    ],
    constraints: [
      "Conversation has to feel like a real interview, not a bot quiz, multi-second response delays kill the vibe.",
      "Hiring teams need a defensible scoring system, not just AI vibes, they have to justify decisions internally.",
      "Couldn't pay for GPT-4 on every candidate at scale.",
      "Candidates apply on slow connections; all interactions had to feel instant.",
      "Render free tier for the Python backend, which means cold starts of ~30s if no traffic for 15 min.",
    ],
    decisions: [
      {
        call: "Gemini Flash 2.0, not GPT-4 or Claude.",
        reason:
          "Conversational interviewing is high-volume, low-stakes-per-token (the report is where reasoning matters, not the question generation). Flash is sub-second, 10x cheaper than GPT-4, and quality is fine for structured Q&A. Saving budget for scoring, where quality actually matters.",
      },
      {
        call: "Adaptive follow-up, not a fixed question list.",
        reason:
          "If the candidate gives a weak answer, the system asks for specifics. If they nailed it, it moves on. Mirrors how a good interviewer behaves. Fixed-question forms can't do this and that's the failure mode static forms can never escape.",
      },
      {
        call: "Scored report with strengths + concerns + binary recommendation.",
        reason:
          "Hiring teams need to defend decisions to compliance, to other interviewers, to themselves. A score with no reasoning is useless. The report breaks down what the candidate did well, what was weak, and gives a hire/no-hire recommendation. Hiring manager can override but has the structure to override against.",
      },
      {
        call: "PDF reports via WeasyPrint, not browser print.",
        reason:
          "Recruiters live in PDF, they print, share, attach to ATS systems. Generating the report as styled HTML and converting via WeasyPrint gives me a clean PDF without writing PDF layout code by hand. Picked WeasyPrint over alternatives (ReportLab too low-level, Puppeteer needs Chrome) because it renders CSS faithfully on a Python-only stack.",
      },
      {
        call: "LocalStorage session persistence with auto-resume.",
        reason:
          "Candidates abandon mid-interview if they lose connection or close the tab. Lost candidates = wasted interview cost. I persist the conversation state to localStorage on every turn. On refresh, the app silently resumes from the last turn without re-asking anything. Removed the auth screen entirely for `/apply`, anyone with the link can apply, the session token is in the URL (commits a370f33, 540b575).",
      },
      {
        call: "Knockout questions + severity engine, not just open Q&A.",
        reason:
          "Some criteria are non-negotiable: 'do you have legal authorisation to work in country X', 'do you have driver's license for this delivery role'. Those should be knockout questions that auto-reject if failed. Built a severity engine where each question carries a hire/maybe/reject weight, and a single 'reject' on a knockout ends the interview gracefully (commits 920c3d7, 5113156).",
      },
      {
        call: "Job form v2 with structured fields (visibility, language proficiency, candidate info sections).",
        reason:
          "Original job form was free-text. Realised employers need structured fields for: job visibility (public vs private link), required language proficiency (CEFR levels), candidate info collection sections. Rewrote the form as v2 with these as first-class fields. Took months but the data model now supports filtering by language, by role type, by seniority (commit 7803262).",
      },
      {
        call: "Cold-start CORS warmup gate.",
        reason:
          "Render free tier sleeps the backend after 15 min idle. First candidate after a sleep hits a 30-second cold start that ALSO causes CORS failures (preflight fails before the function is up). Built a `/health` warmup gate that the frontend pings before showing the chat UI. UI shows 'getting interview ready…' for the cold-start window, then transitions cleanly. Hides the bug from the user without papering over it (commit 0c55a07).",
      },
    ],
    pivots: [
      "First version generated all questions upfront from the job description, then asked them in order. Felt robotic. Switched to streaming question generation per turn, conditioning on prior answers. Slower per turn but the conversation flowed (commit 354462b).",
      "Initial scoring model gave wildly different scores for the same answer when re-run. Added temperature=0 + a structured prompt with explicit rubric (1-5 on each criterion). Consistency went up 80%. The lesson: scoring needs to be deterministic in a way generation doesn't.",
      "Tried AsyncGroq SDK first, then ran into mysterious connection bugs in production. Switched to direct httpx REST calls, proven working approach (commit f2b896d). 'The library exists' is not the same as 'the library works in production'.",
      "Originally used Gemini Flash everywhere. Hit rate-limit issues during traffic spikes. Added Groq as a fallback (commit 5b3df5d, 6874a2e). Multi-provider with automatic failover became table stakes after that.",
      "Auth flash bug: candidates would briefly see a login screen even though /apply doesn't require auth. Caused by a race condition, AuthProvider mounted before checking the route. Excluded /apply from AuthProvider entirely (commit 1109b40). Sometimes the right fix is removing the protection from a public page.",
      "OAuth loop: signing in with Google would redirect into an infinite cycle on certain edge cases. Spent two days debugging Supabase OAuth + Vercel SSR + Render API CORS interactions. Fix involved hardcoding the production CORS origin instead of wildcard+credentials (which is invalid CORS), and a fix in the redirect_to flow (commit 3e651e0).",
    ],
    weaknesses: [
      "I had not built a multi-page Streamlit-like flow with state persistence before. Streamlit's state model resets on every interaction. Switched to Next.js pages with localStorage hydration after a frustrating week.",
      "CORS in production with credentials + multiple origins is genuinely confusing. I shipped wildcard+credentials twice before realising it's silently invalid. Now I default to hardcoded explicit origins per environment.",
      "I underestimated how brittle SSE streaming is across reverse proxies. Vercel's edge proxy buffered chunks instead of forwarding them. Had to set explicit response headers (`X-Accel-Buffering: no`, `Cache-Control: no-cache, no-transform`) to force pass-through (commit a2bbe53 in coldpilot, but the lesson came from hireiq first).",
      "Scoring rubric design is a research field I had not entered. First scoring prompt produced inconsistent results because I was asking the model to score on multiple dimensions simultaneously without clear weight. Studied multi-criteria decision-analysis literature, rewrote scoring as per-criterion 1-5 with explicit anchors, then aggregated.",
    ],
    outcome: [
      "Full pipeline: job posting → adaptive interview → scored report → PDF",
      "Gemini Flash 2.0 powering question generation (cost-engineered)",
      "Groq fallback for resilience",
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
      "You can replace a static form with intelligence at the same UX cost, if you pick the right model for the job. Don't use GPT-4 for what Flash can do. Production is full of edge cases (CORS, cold starts, OAuth loops) that nobody warns you about, the bug list is the case study.",
  },

  // ─────────────────────────────────────────────────────────────────
  "coldpilot": {
    slug: "coldpilot",
    problem:
      "Cold outreach works but is brutally tedious, find leads, research them, write personalised emails, follow up, track replies, retry the bouncers. Most tools automate one step and call it done. I wanted an agent that ran the whole pipeline autonomously, with three levels of human oversight depending on how much you trust it. Especially for someone in The Gambia trying to land remote tech roles or B2B clients in the US/EU, the cost of doing this manually is prohibitive, and the cost of doing it sloppily is your domain blacklisted in days.",
    research: [
      "Read about email deliverability, SPF/DKIM/DMARC, RFC 2822 threading. Spam filters score every send on dozens of signals, sender reputation, content patterns, threading consistency, send rate. Sloppy cold-email automation is how domains get burned.",
      "Studied IP/domain warm-up patterns from Lemlist, Instantly, Smartlead. The schedule: 5 → 10 → 20 → 35 → 50 emails/day over 3 weeks, with random spacing. Mimics human behaviour closely enough that filters don't flag you as a bot.",
      "Read Hunter.io, Apollo, RocketReach API docs to understand contact discovery. Hunter has the cleanest free tier (25 searches/month). Tavily for company research (1000 free searches/month). Groq for LLM-as-email-writer (generous free tier).",
      "Studied SMTP error codes carefully (4xx soft bounce vs 5xx hard bounce). Auto-marking a prospect as bounced on 4xx is wrong, those are temporary. Hard bounces (5xx) are permanent failures that should pause outreach to that address.",
      "Read about IMAP reply detection. SMTP only handles outbound. To know if someone replied, you need to poll an IMAP inbox, parse threads, match by Message-ID. Built that as a separate service.",
    ],
    constraints: [
      "Spam filters are aggressive, sloppy automation gets your domain blacklisted in days.",
      "Free APIs only (Hunter.io 25/month, Tavily 1000/month, Groq generous limits).",
      "Had to gracefully degrade across autonomy levels, same engine, different human-in-the-loop.",
      "Multi-user platform meant SMTP credentials could not be hardcoded, each user connects their own Gmail (or domain SMTP).",
      "Render free tier deploy means cold starts; SSE proxy required for live progress streaming.",
    ],
    decisions: [
      {
        call: "Pipeline of small services, not one mega-prompt.",
        reason:
          "Contact finder, researcher, writer, sender, follow-up, each is its own service with single responsibility. Easier to test, easier to swap (Hunter.io fails? swap in Apollo). Each step's output is the next step's input. One mega-prompt that 'does outreach' would be a black box impossible to debug.",
      },
      {
        call: "Three autonomy levels: Copilot, Supervised, Full Auto.",
        reason:
          "Different users have different tolerance for AI sending email in their name. Copilot stops at draft for approval (safest). Supervised auto-sends but streams progress via SSE so you can watch and pause (mid-trust). Full Auto runs unattended (trusted user, established campaigns). Same pipeline, three trust levels, set per-campaign. The autonomy slider is the actual product.",
      },
      {
        call: "Warm-up schedule baked into the scheduler, not optional.",
        reason:
          "New domain sending 50 emails on day 1 = blacklist guaranteed. The scheduler enforces a graduated send rate: 5 → 10 → 20 → 35 → 50 over 3 weeks, with 45-120s random spacing between sends. Users can't override this. Saving the user from themselves is the whole point of automation that respects deliverability.",
      },
      {
        call: "RFC 2822 email threading via In-Reply-To headers.",
        reason:
          "Follow-ups originally sent as new emails. Got marked as spam because spam filters love 'multiple unsolicited emails from same sender'. Switched to RFC 2822 threading, every follow-up sets `In-Reply-To: <original-message-id>` and `References:`, so they land in the SAME thread as the original. Filters see one conversation, not three new emails. Open rates went up, spam complaints went down (commit b478b53).",
      },
      {
        call: "Groq Llama 3.3 70B for email writing, with multi-model fallback.",
        reason:
          "Email drafts are formulaic, 3 short paragraphs, specific reason for reaching out, soft CTA. Llama 3.3 70B handles this trivially at a fraction of GPT-4 cost. Groq's inference is fast (drafts in 1-2s). Added 8B and gemma2 fallbacks (commits 8a3d0db, 7c771f7) when 70B occasionally returned garbage, fall through to a smaller model rather than retry the same one (which burned quota).",
      },
      {
        call: "Per-user SMTP credentials, not platform-level.",
        reason:
          "Originally tried a single platform-level SMTP that all users sent through. Ran into deliverability hell, one user's spam complaint poisons everyone else's reputation. Switched to per-user SMTP: each user connects their own Gmail (or domain) via app password. Reputation is theirs, isolation is clean (commit 91de4fc).",
      },
      {
        call: "Reject raw PDF binary server-side before LLM call.",
        reason:
          "Users upload CVs as PDFs. Naive approach: pass the PDF text to the LLM. Bug: PyPDF2 sometimes returns the literal binary stream as 'text', which then gets sent to Groq. Wasted tokens, garbage outputs. Fixed by detecting PDF-binary patterns and rejecting before the LLM call, asking the user to re-upload (commit cd5ad9a).",
      },
      {
        call: "IMAP reply detection as separate service.",
        reason:
          "SMTP only handles outbound. Replies require an IMAP poller that connects to the user's inbox, fetches threads, matches incoming messages to outbound campaigns by Message-ID. Built it as a separate APScheduler job that runs every 15 minutes, updates Supabase with reply state. The reply rate UI was wrong for weeks before this shipped, was showing zero because there was no detection at all (commit d7da1a4).",
      },
    ],
    pivots: [
      "Initial follow-up logic was 'send at +3 days, +7 days, +14 days' as new emails. Got marked as spam fast. Switched to RFC 2822 threading. Open rates went up.",
      "First version had no bounce detection, kept emailing dead addresses, burning Hunter.io credits. Added 5xx-error parsing to auto-mark prospects as bounced. Stopped wasting credits on dead leads.",
      "Email-write LLM prompts were originally very generic and produced templated cover-letter prose. Rewrote with banned-phrase list ('I hope this email finds you well', 'I came across your company', 'circle back'), explicit structure constraints, and length-fits-content rules. Output went from 'AI cover letter' to 'real human reaching out' (commits 4ff5032, 321bb50).",
      "Bug: Seeker mode was writing emails AS the recruiter TO the candidate. Wrong perspective. The Seeker is the job-seeker reaching out to a hiring manager. Spent half a day debugging the prompt, turned out the role parameter was being injected after the system prompt, getting overridden. Fixed by hard-coding the perspective in the system prompt itself (commit 97a76b3).",
      "Supabase IPv6 connectivity bug from Render: Render's egress was routing via IPv6, Supabase pooler didn't accept IPv6 reliably. Half my DB calls were timing out with no error. Diagnosed by adding asyncpg connection logging. Fix: force IPv4 by setting `family=AF_INET` on asyncpg pool (commit 60273fb).",
      "30-day cooldown between same-prospect contacts was the right deliverability behaviour but blocked dry-run testing. Added an exempt flag for dry-run campaigns (commit 7fbcdb2). Compliance shouldn't block the test environment.",
    ],
    weaknesses: [
      "I did not understand SMTP threading at the start. Sent follow-ups as new emails; got blacklisted on a test domain. Read RFC 2822 from the start, fixed.",
      "IPv4 vs IPv6 connection issues in cloud-to-cloud database connections is one of those things you only learn the hard way. Now I default to forcing IPv4 in production stacks.",
      "Prompt-engineering an email that doesn't sound AI-written took many iterations. The pattern that worked: explicit banned-phrase list + length-fits-content + no template structure. The model converges on human voice when it can't fall back to known cliches.",
      "Scaling a multi-user system with per-user SMTP credentials introduces auth-storage complexity. Used Supabase encrypted columns for SMTP passwords. Could've used a secrets manager but the cost wasn't worth it for the user count.",
      "SSE streaming through a proxy (Render frontend → Render backend → user) buffered chunks initially. Fix was setting `X-Accel-Buffering: no` and forcing the proxy to forward chunks immediately (commit a2bbe53).",
    ],
    outcome: [
      "32 endpoints across 5 routers (campaigns, prospects, emails, activity, stats)",
      "Hunter mode (B2B outreach) + Seeker mode (job hunting)",
      "Three autonomy levels: Copilot (approve each), Supervised (auto-send with live SSE pause), Full Auto",
      "RFC 2822 email threading for compliant follow-ups",
      "Warm-up schedule (5 → 50 over 3 weeks, random 45-120s spacing)",
      "Bounce detection (5xx auto-mark)",
      "IMAP reply detection (separate scheduler job, 15-min cadence)",
      "Multi-model fallback (Groq 70B → 8B → gemma2)",
      "Per-user SMTP credentials (reputation isolation)",
      "Built on free-tier APIs end-to-end",
    ],
    regret:
      "I'd add a reply classifier, when a lead replies, is it positive, negative, auto-reply, or out-of-office? Right now I parse manually. A small classifier on top of the inbox would close the loop properly. Also a deliverability dashboard (open rates, reply rates per template) would let users iterate on what works.",
    takeaway:
      "Autonomous agents work when each step is small and each interface is clean. The mega-prompt agents fail because debugging them is impossible. Production deliverability is a stack of small details (threading, warm-up, reputation isolation, bounce detection); skip any one and your domain dies.",
  },

  // ─────────────────────────────────────────────────────────────────
  "formly": {
    slug: "formly",
    problem:
      "I was filling out a scholarship application for the third time in a month and every form asked the same 30 questions in slightly different ways. Every time I had to dig up my CGPA, my emergency contact, my address. Form-fillers exist (LastPass, browser autofill) but they fail on real-world forms, ATS iframes (Workday, Greenhouse), React Select dropdowns that aren't standard <select>s, multi-page flows, file uploads, date pickers, time pickers with AM/PM, CAPTCHAs, OTPs. I wanted one that actually worked on the messy forms that matter.",
    research: [
      "Studied Playwright vs Selenium vs Puppeteer in detail. Selenium can't reliably see ATS iframes. Puppeteer handles iframes but is Chromium-only. Playwright handles iframes natively, supports cross-browser, and has better debugging. Picked Playwright.",
      "Read how Workday and Greenhouse render forms (both heavy iframe + React-based field rendering). Observed: standard CSS selectors fail on React Select; you need accessible-name selectors or DOM traversal.",
      "Read Groq's docs on speed/cost. For semantic field matching ('Academic Background' → my education list), Llama 3.3 70B at sub-second is fine. Quality only matters at the edges (ambiguous labels), and a fallback chain handles those.",
      "Studied browser automation anti-detection. Some sites detect headless browsers via user-agent, missing webdriver attributes, etc. Made Playwright presents as a normal Chromium with `headless: 'new'` mode, real viewport size, normal user-agent.",
      "Read SQLite's WAL mode + concurrent access patterns. Forms generate writes constantly (every gap question saves a profile field). WAL mode handles concurrent writes without locking the read path.",
    ],
    constraints: [
      "Real-world forms are a zoo, no two are alike, no two ATS systems agree on field naming.",
      "Profile data has to grow over time, not be re-entered each form.",
      "User has to approve every submission, autonomous form-filling is too risky for stakes like scholarships.",
      "Has to work on forms behind iframes (ATS systems do this for security).",
      "Streamlit's state model makes long flows awkward, kept fighting it.",
    ],
    decisions: [
      {
        call: "Playwright, not Selenium.",
        reason:
          "Selenium can't see ATS iframes properly. Playwright handles iframes, React state, file uploads, date pickers natively. Slower install (Chromium download), but deals with the actual mess of modern forms. Picked Playwright base Docker image (commit 2825839) so the CI builds don't time out installing browsers.",
      },
      {
        call: "LLM for semantic field matching, not regex.",
        reason:
          "Form labels are inconsistent: 'Academic Background', 'Education History', 'Schools Attended'. Regex-matching is a losing game. Send the label + my profile shape to Groq Llama, get back which profile field this is. Context wins over rules. Added garbage detection, if Groq returns nonsense (rare, happens at high load), retry with a smaller model (commit 4159e30).",
      },
      {
        call: "Conversational gap-filling, one question at a time.",
        reason:
          "When the form asks for something I don't have stored (a National ID, an emergency contact), Formly asks ME, naturally, one question at a time. Saves it permanently. Fill 5 forms and by the 6th, Formly almost never has to ask anything. The profile DB grows with every form. One question at a time feels like conversation; thirty at once feels like another form (commit 1ca210e).",
      },
      {
        call: "Hybrid SQLite schema, structured tables + key-value.",
        reason:
          "Work history and education are naturally one-to-many, give them their own tables. But forms ask for arbitrary stuff (citizenship, dietary restrictions, preferred name, hometown). I keep a key-value `profile` table that absorbs anything new without schema migrations. The structured tables are normalised; the key-value table is the schema-less escape hatch.",
      },
      {
        call: "Vision loop with anti-hallucination + OTP detection.",
        reason:
          "After filling, I screenshot the form and ask Groq to verify what's actually visible vs what I claim to have filled. This catches: form fields that didn't accept the value (silently failed), CAPTCHAs that appeared mid-flow, OTP fields that need user input. The vision loop is the difference between 'click submit and hope' and 'verify what's on screen, then submit' (commit 741199b).",
      },
      {
        call: "Human review gate before submission, always.",
        reason:
          "Formly fills, but the user explicitly approves every field before submit. Auto-submission is too high-risk, one wrong answer on a scholarship app and it's a no. The 30-second review is the cheap insurance. Built a review screen that renders dropdown-pickers for ambiguous fields where the model picked a default (commit f7a9440).",
      },
      {
        call: "Time field AM/PM to 24h conversion + label-based detection.",
        reason:
          "HTML `<input type='time'>` expects 24h. Users (and forms) often use 12h with AM/PM. Built a label-based heuristic: if the label says 'AM/PM' or 'morning/afternoon', detect and convert. Sounds trivial; was a recurring source of bugs because field detection was inconsistent (commit 868ccf8).",
      },
      {
        call: "Detect blocked forms and surface 'Open Form to Finish' button.",
        reason:
          "Some forms detect Playwright and show a CAPTCHA wall. Some require manual OTP from email. The agent can't get past these. Built a detection layer: if blocked, show a CAPTCHA banner and a button that opens the form in the user's regular browser at the same field, so they can finish manually. Honest defeat is faster than fragile automation (commit 2e9a3a9).",
      },
    ],
    pivots: [
      "First version dumped all missing fields as a single form. User feedback: 'this feels like another form'. Switched to one-at-a-time conversational asks, with context ('this scholarship wants your National ID, I don't have that yet'). Felt natural instead of bureaucratic.",
      "Tried to handle CAPTCHAs automatically. Even good CAPTCHA-solving services get blocked or are too slow. Gave up, Formly detects CAPTCHAs and asks the user to solve them in the same Playwright window. Honest defeat over fragile automation.",
      "React Select fields originally showed up with names like 'React Select 3 Input' because the actual label was hidden in a nested aria-labelledby. Wrote a label-resolution function that walks up the DOM looking for a real label (commit 35abec0). 'Use the API' doesn't help when the API is broken; I had to read DOM traversal patterns from accessibility libraries.",
      "Docker build cache kept serving stale code in production. Spent a day debugging why my fixes weren't deploying. Added explicit `RUN echo` cache-bust statements + restructured the Dockerfile to copy the source LAST (commit c3dfdeb). Docker layer caching is correct in theory and a nightmare in practice.",
      "Initial agent had no submit-block. After review approval, sometimes Playwright clicked submit twice (race condition between approval and submit). Added a hard prevent-form-submission flag that requires explicit user click (commit 6fd91c0). Forms that submit twice = duplicate applications = embarrassment.",
      "Screenshot-before-submit was originally screenshot-after-submit. Wrong: if submit failed, you got the post-submit error page, not the form you tried to submit. Switched to before-submit screenshot for the user's approval, then submit (commit 2379442).",
    ],
    weaknesses: [
      "I had not used Playwright before this project. Spent a week learning its model (Page, Frame, Locator, .fill() vs .type() vs .pressSequentially()). The locator model is much better than CSS selectors but takes time to internalise.",
      "Iframe handling broke things I'd never seen on regular web pages. Workday's apply form is an iframe inside an iframe. Had to use `page.frameLocator()` chains to even reach the form fields.",
      "Docker layer caching is harder than the docs imply. Multiple times I'd ship a fix and the deploy would still serve old code. Eventually moved to explicit cache-bust statements and a separate `playwright-base` image to stop fighting the build.",
      "Groq fallback chain design was iterative. Naive 'retry on error' burned my quota when the same input kept producing the same garbage. The right pattern: retry on a DIFFERENT model (70B → 8B → gemma2), not the same one.",
      "SSRF protection was almost an afterthought. Realised users could paste a URL like `http://localhost:6379` to probe my own backend. Added URL allowlist + private-IP rejection before Playwright opens any URL (commit 89611bd).",
    ],
    outcome: [
      "Handles ATS iframes (Workday, Greenhouse), React Select, file uploads, date pickers, time pickers, multi-page flows",
      "Profile DB grows permanently, every gap question saved",
      "LLM semantic field matching with Groq fallback chain",
      "Vision loop verifies filled state before submit",
      "Human review gate (no auto-submit)",
      "Tailored essay generation for personal statements",
      "CAPTCHA / OTP detection with graceful manual hand-off",
      "Streamlit UI (profile / fill-form / history pages)",
      "SSRF protection on user-pasted URLs",
    ],
    regret:
      "Should have built it as a browser extension first, then a standalone agent. Extension means the user is already logged into the form site, no auth juggling, no CAPTCHA-detection hell. Standalone Playwright agent is more powerful but pays a constant tax on anti-bot detection. Adding the extension version next.",
    takeaway:
      "Conversational agents win when the alternative is another form. People don't hate forms because they're hard, they hate them because they're impersonal. When real-world inputs are messy (Workday iframes, React Select, vision-verify before submit), the engineering work is most of the project, the LLM is just the routing layer.",
  },

  // ─────────────────────────────────────────────────────────────────
  "credit-risk-scorecard": {
    slug: "credit-risk-scorecard",
    problem:
      "Microfinance institutions in West Africa make lending decisions on intuition because the analytical infrastructure isn't there. Loans are granted or denied based on the loan officer's read of the applicant's character, with results that range from biased to disastrous depending on the officer. I wanted to build a Basel II-compliant credit scorecard from scratch, not import a black-box library, to actually understand WoE, IV, points conversion, validation gauntlets, and stress testing the way an actuary would. The point wasn't to replace human judgement. It was to give the human a quantified second opinion.",
    research: [
      "Read Naeem Siddiqi's 'Credit Risk Scorecards: Developing and Implementing Intelligent Credit Scoring' end-to-end. The WoE/IV chapter alone is the methodology bible. Read it twice.",
      "Studied the Basel II framework (BCBS Pillar 1) for credit risk. Specifically the Internal Ratings-Based Approach: PD (probability of default), LGD (loss given default), EAD (exposure at default). My scorecard implements PD; the rest are placeholders for the next iteration.",
      "Read regulatory technical standards from BCBS, EBA, and the Federal Reserve on model validation. The validation gauntlet (Gini, KS, PSI, ROC) is non-negotiable for a regulated model. Implemented all four.",
      "Studied Population Stability Index methodology (Karakoulas 2004). PSI compares score distributions between training and out-of-time samples. PSI < 0.1 = no shift, 0.1-0.25 = moderate, > 0.25 = significant shift. Industry threshold for 'don't deploy this model' is 0.25.",
      "Read about West African microfinance dynamics, group lending (joint liability), seasonal income (agricultural cycles), gender roles in finance (women's repayment rates often higher than men's). Calibrated the synthetic data generator to reflect these patterns instead of cloning German Credit defaults.",
    ],
    constraints: [
      "No real loan data. Privacy, NDAs, none of it accessible to a student researcher.",
      "Had to be explainable end-to-end, every step audit-able for a regulator.",
      "Aspirational target: Basel II framework, the international standard.",
      "Models like XGBoost or random forest, while higher-accuracy, are NOT permitted in regulated credit scoring without extensive explainability layers. Logistic regression with WoE was the only sound choice.",
      "Validation had to be honest, not flattering.",
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
          "Basel II requires explainability. Random forests and XGBoost are forbidden in production credit scoring without extensive explainability layers because regulators can't audit them. Logistic regression with WoE-transformed features is the industry standard for a reason, you can read the points-per-feature off the model and explain exactly why someone scored 480.",
      },
      {
        call: "WoE binning by deciles for continuous features, optimal binning for categoricals.",
        reason:
          "Raw `monthly_income_usd` had high IV but skewed distribution and unstable bands. Binned into deciles via WoE, became more stable across the population. For categorical features (`sector`, `loan_purpose`), used optimal binning to merge low-volume categories together. The trade-off: lose some information, gain stability and explainability.",
      },
      {
        call: "Validation gauntlet: Gini, KS, PSI, ROC, all required to pass.",
        reason:
          "Three different lenses on model quality: Gini (overall discrimination, want > 0.4), KS (best cutoff separation, want > 0.3), PSI (population stability over time, want < 0.1). A model that passes one and fails another is a red flag. I rejected several feature sets that had high Gini but unstable PSI before settling on the final. Final: Gini 0.56, KS 0.42, both above industry-standard thresholds.",
      },
      {
        call: "Time-based holdout, not random-split holdout.",
        reason:
          "First version used random-split validation. PSI looked great. Then realised: the holdout was sampled from the same time period as training, so PSI was artificially low. Re-split with time-based holdout (oldest 80% for training, newest 20% for validation), and PSI dropped, indicating real population drift. More honest, less flattering. The lesson: validation theatre is worse than no validation.",
      },
      {
        call: "Multi-scenario stress tests: drought, currency crisis, pandemic.",
        reason:
          "Real lenders need to know: what happens to default rates under shock? I implemented stress tests that multiply default probabilities by scenario-specific factors (drought: 1.5x for agriculture loans, currency crisis: 1.3x across the board, pandemic: 2.0x for services). The output shows band-by-band default-rate impact and capital-requirement implications. Stresses the system, not just the score.",
      },
      {
        call: "Basel II points conversion with explicit factor + offset.",
        reason:
          "Logistic regression coefficients are abstract. Points conversion turns them into a 300-850 score every loan officer can use. Picked factor 28.85 / offset 487.123 (industry standard) so the score doubles odds at every 20-point increment. This is the layer that makes the model actually usable by humans.",
      },
    ],
    pivots: [
      "First feature set had monthly_income as raw, high IV but skewed. WoE-binning by deciles became more stable across population shifts. Standard scorecard practice but I had to discover it via the validation failing.",
      "Initial PSI was tested on a holdout that was too similar to training (random split). Validation theatre. Re-split with time-based holdout and PSI dropped, indicating real drift. More honest, less flattering.",
      "Originally tried XGBoost first because the accuracy was higher. Realised the explainability requirement made it disqualifying. Killed the XGBoost branch and went back to logistic regression. The right model is the one regulators allow, not the one that scores best.",
      "Stress tests originally hardcoded scenario multipliers in the script. Refactored to a `SCENARIOS` config so new shocks (climate, geopolitical) could be added without rewriting validation code.",
    ],
    weaknesses: [
      "I had not implemented WoE/IV from scratch before. Read Siddiqi's book chapter twice, then implemented `compute_all_woe_iv` and `woe_transform` myself. The implementation taught me what every formula in the book actually meant.",
      "Population Stability Index was new. The intuition, comparing two distributions via a sum of `(actual - expected) * ln(actual/expected)`, wasn't obvious at first. Built it on a synthetic test where I manually shifted the distribution and watched PSI track the shift.",
      "Synthetic data generation is more art than science. My first generator produced loans where every feature was uniformly distributed; the model learned nothing because there was no real signal. Re-built the generator with realistic correlations: higher income → lower default, longer term → higher default, group lending → lower default. Then the model could actually learn.",
      "Capital-requirement math (RWA, capital floor) is in the Basel II framework but I'm only at the PD layer. I know what LGD and EAD are; haven't implemented them. Honest about the scope limit.",
    ],
    outcome: [
      "12,000 synthetic West African microfinance loans, regionally-calibrated",
      "WoE/IV feature selection pipeline, optimal binning for categoricals",
      "Basel II points conversion (factor 28.85, offset 487.123)",
      "Validation: Gini 0.56, KS 0.42, above industry thresholds",
      "PSI < 0.1 on time-based holdout (population stable)",
      "Multi-scenario stress testing (drought, currency crisis, pandemic)",
      "Live Next.js + Recharts dashboard",
      "Explainable end-to-end: every score traceable back to feature contributions",
    ],
    regret:
      "I'd swap synthetic data for real anonymised data the moment I have access. The synthetic generator is calibrated to public stats but it can't capture interaction effects I haven't thought of. Real data always surprises you. Also need to extend to LGD and EAD for full Basel II coverage.",
    takeaway:
      "In regulated domains, explainability isn't a feature, it's the constraint that picks the model. Logistic regression isn't old-fashioned, it's accountable. Validation theatre is worse than no validation: random-split metrics that look good but won't survive production are how models fail in deployment.",
  },

  // ─────────────────────────────────────────────────────────────────
  "life-insurance-risk": {
    slug: "life-insurance-risk",
    problem:
      "I wanted to learn actuarial science by doing, not by reading textbooks. Built a full life insurance risk model for Sub-Saharan Africa from scratch, mortality, survival analysis, premium pricing, Monte Carlo VaR. The point was to implement every step myself instead of importing a pre-built actuarial package. Sub-Saharan Africa specifically because the standard models (calibrated on US/UK data) under-represent the constant background hazard rate that matters here, accidents, infectious disease, road traffic, and over-represent old-age mortality patterns that don't apply to a younger demographic.",
    research: [
      "Read the original Gompertz (1825) paper and Makeham's (1860) extension. Pure Gompertz models exponential mortality increase with age; Makeham adds a constant background hazard. For Sub-Saharan Africa where the constant hazard is materially higher (malaria, road traffic, infectious disease), the Makeham term is essential. Reading the original papers, not the textbook summaries, was where the intuition came from.",
      "Studied Cox (1972) Proportional Hazards literature. The C-index (concordance) is the survival-analysis equivalent of AUC. Industry-standard 'good' is > 0.7, 'excellent' is > 0.8.",
      "Read Klein & Moeschberger's 'Survival Analysis: Techniques for Censored and Truncated Data' for the censoring + truncation handling, most insurance data has both (right-censoring when policy term ends, left-truncation for delayed entry).",
      "Studied Monte Carlo simulation methods, specifically variance-reduction techniques (control variates, antithetic variables). Useful when you need 5,000 scenarios to converge to stable VaR estimates.",
      "Read Sub-Saharan Africa health stats from World Bank and WHO, life expectancy distributions, mortality ratios by age band, leading causes of death. Calibrated the synthetic profile distributions against these sources.",
      "Read about COVID-era mortality shocks across regions to calibrate the pandemic stress scenario. Sub-Saharan Africa's reported pandemic mortality was lower than other regions but with higher uncertainty bands.",
    ],
    constraints: [
      "No real African insurance data, most insurers don't share, and what's published is too aggregate to fit individual-level models.",
      "Pandemic was recent. Any stress test had to take that seriously without overfitting to a one-time event.",
      "Aspirational target: Cox PH C-index above 0.75 (industry good).",
      "Had to be auditable, actuarial work is inherently regulated; black-box ML doesn't pass review.",
    ],
    decisions: [
      {
        call: "Gompertz-Makeham, not just Gompertz.",
        reason:
          "Pure Gompertz models the exponential mortality increase with age. Makeham adds a constant background hazard rate, accidents, infectious disease, baseline causes that don't depend on age. For Sub-Saharan Africa where the constant hazard is materially higher (malaria, road traffic), the Makeham term matters. Better fit, more honest model. Implemented the Makeham fit via maximum likelihood with scipy.optimize, not a canned package.",
      },
      {
        call: "Cox Proportional Hazards via lifelines, not bespoke.",
        reason:
          "Implementing Cox PH from scratch is a rabbit hole, Breslow ties, partial likelihood, baseline hazard estimation. lifelines is rock-solid for the regression part. I implemented Gompertz-Makeham fitting myself (where the learning was) and used lifelines for Cox where I just needed a working tool. Pick your battles. The point of the project was to learn, but learning everything from scratch is a different project.",
      },
      {
        call: "Add age × risk-class interaction term to Cox PH.",
        reason:
          "First Cox PH had C-index of 0.62, below industry standard. The marginal effect of being a smoker is different at age 25 vs age 65. Adding the interaction term (age × risk_class) jumped C-index to 0.77. The interaction was obvious in retrospect: a 25-year-old smoker has different relative risk than a 65-year-old smoker. Cox PH's 'proportional hazards' assumption is violated when interactions matter, and I had to learn that by debugging a low C-index.",
      },
      {
        call: "Monte Carlo VaR with 5,000 scenarios + pandemic shock.",
        reason:
          "VaR at 95% and 99% gives the insurer two budget constraints. Single-point projections are useless for capital reserves; only the tail matters. The pandemic scenario multiplies mortality by 1.8x-3.5x, calibrated loosely to COVID excess-mortality data. 5,000 scenarios is enough for stable 99th-percentile VaR, anything less and the tail estimate jumps around between runs.",
      },
      {
        call: "5,000 synthetic profiles calibrated to regional age distributions.",
        reason:
          "Same constraint as the credit scorecard, no real data. I built profiles whose age, sex, and risk-class distributions match Sub-Saharan Africa World Bank data. The model learns realistic patterns, not American actuarial textbook patterns. Would prefer real data; calibrated synthetic is the next-best honest alternative.",
      },
      {
        call: "Vectorise Monte Carlo in NumPy, not pandas.",
        reason:
          "First implementation looped over 5,000 scenarios in a pandas DataFrame. Took 4 minutes per run. Rewrote in NumPy with vectorised sampling, 8 seconds. Same results, 30x faster. The lesson: in numerical Python, the second time you write the loop you're doing it wrong. Vectorise from the start.",
      },
      {
        call: "Mobile-first dashboard with responsive percentile cells.",
        reason:
          "Actuarial dashboards are usually desktop-first. The percentile table (P50, P75, P95, P99 of loss distribution) overflowed on phones. Rewrote each cell as a responsive grid with label-left / value-right on phone, full row on desktop. The dashboard ships value to a wider audience because the experience scales (commits 3882545, b89e8c2).",
      },
    ],
    pivots: [
      "First Cox PH had C-index of 0.62, below industry standard. Realised I'd left out interaction effects between age and risk class. Adding the interaction term jumped C-index to 0.77. Standard PH assumption was being violated; the model needed help.",
      "Monte Carlo initially ran in pandas. 4 minutes per run. Rewrote in NumPy with vectorised sampling. 8 seconds. Same results.",
      "Pandemic stress factor was originally a single 2.5x multiplier across all ages. Realised the COVID excess-mortality data shows much higher concentration at older ages. Re-calibrated to age-band-specific multipliers (1.5x at 30-50, 3.5x at 70+). More accurate, more honest.",
      "Survival curve plots had inconsistent y-axis ranges across risk groups, making them hard to compare. Standardised the y-axis range and added grid lines. Visual comparability matters when the audience is humans not models.",
    ],
    weaknesses: [
      "I had not used scipy.optimize for MLE before this project. Spent a day learning the BFGS optimiser's quirks and how to set good initial parameter estimates so it converges. Bad initial estimates = optimiser diverges = no fit.",
      "Censoring and truncation are subtle. My first survival fit ignored left-truncation (delayed entry into the risk pool), which biased the hazard rate downward. Re-read Klein & Moeschberger, fixed the entry-time handling.",
      "Cox PH's proportional-hazards assumption is exactly that, an assumption. When violated, the model is wrong in subtle ways. Diagnosing it via Schoenfeld residuals took me longer than it should have. Now I check residuals as part of every fit.",
      "Variance reduction in Monte Carlo (control variates, antithetic variables) sounded scary in textbooks but reduced my run time and improved tail-estimate stability noticeably once I implemented them. Good textbook techniques are usually less mysterious in code.",
    ],
    outcome: [
      "Gompertz-Makeham mortality model fitted from scratch via MLE",
      "Cox PH C-index 0.77 on holdout (above industry standard)",
      "Kaplan-Meier curves with log-rank tests across risk groups",
      "5,000-scenario Monte Carlo VaR (95%, 99%)",
      "Pandemic stress test calibrated to COVID excess-mortality data",
      "Age-band-specific shock multipliers (more honest than uniform multipliers)",
      "Vectorised NumPy implementation (8s for full Monte Carlo)",
      "Live Next.js + Recharts mobile-responsive dashboard",
    ],
    regret:
      "I'd add a reserves projection module, given current policies and the mortality model, what's the IBNR (incurred but not reported) estimate? That's the actuary's bread and butter and I skipped it. Also need to add LGD/EAD analogues for life products (sum-assured at risk). Adding next iteration.",
    takeaway:
      "You learn actuarial science by writing the math. The textbook tells you Gompertz-Makeham; doing the gradient descent yourself shows you why the second term matters in the data you actually have. When the assumptions are violated (proportional hazards, no interaction), the model tells you with a low C-index, listen to it.",
  },

  // ─────────────────────────────────────────────────────────────────
  "global-restaurant-analytics": {
    slug: "global-restaurant-analytics",
    problem:
      "I had access to a global restaurant dataset with 21 variables (cuisine, price, ratings, reviews, location, hours, services) and wanted to know what actually drives customer satisfaction across cultures. Not 'food quality is important', that's obvious, but specifically what the data could prove versus what people assume. Most restaurant-data writeups jump to a model and miss what the data shows just by looking. I wanted the analysis to be readable by a restaurant owner, not just by an analyst.",
    research: [
      "Read 'Storytelling with Data' (Cole Nussbaumer Knaflic) before writing the article. The visualisation lessons changed how I presented every chart: pre-attentive attributes, eliminating chartjunk, choosing the right encoding for the comparison.",
      "Studied multicollinearity diagnostics, specifically Variance Inflation Factor. With 21 correlated variables (price tier and reviews count are correlated; cuisine type and location are correlated), naive multiple regression coefficients become uninterpretable. VIF > 5 is the standard 'this is problem' threshold.",
      "Read about cultural dimensions of customer satisfaction (Hofstede's framework, Service Recovery Paradox literature). Pre-empted the obvious 'food quality drives satisfaction' angle by checking cultural moderators.",
      "Studied the difference between rating (1-5 scalar) and satisfaction (multi-construct: revisit intent, recommend likelihood, complaint rate). They correlate but aren't the same. Most analyses conflate them.",
    ],
    constraints: [
      "Single dataset, no time series, only cross-sectional. Can show correlations, can't establish causation.",
      "No external panel data to validate findings.",
      "Wanted findings that would survive a critical reader, not Insta-quote bullet points.",
      "Audience is restaurant owners + curious readers, not data scientists.",
    ],
    decisions: [
      {
        call: "Visualisation-first, modelling second.",
        reason:
          "Most restaurant-data writeups jump to a regression and miss what the data shows just by looking. I spent the first week on plots, distribution of ratings by region, by price tier, by cuisine. The model came later, mostly to formalise what the visuals already implied. The lesson: if your visuals already tell the story, your model is confirming, not discovering.",
      },
      {
        call: "Don't conflate satisfaction with rating.",
        reason:
          "Rating is a 1-5 scalar. Satisfaction is multi-construct (revisit intent, recommend likelihood, complaint rate). The data has both. Most analyses treat them as the same and lose half the signal. Kept them separate and showed where they diverge, the gap between them is itself a finding.",
      },
      {
        call: "VIF check before multiple regression, dropped to 7 variables from 21.",
        reason:
          "Initial regression with all 21 variables had R² of 0.78, looked great. But multicollinearity made coefficients meaningless: 'price tier' had a coefficient of -0.4 that was statistically insignificant despite being one of the most relevant features. Dropped to 7 variables that survived VIF < 5. R² fell to 0.62, but the coefficients were finally interpretable. Honest interpretability over flattering R².",
      },
      {
        call: "Write the findings as a Medium article, not a Jupyter notebook.",
        reason:
          "Notebooks are for analysts. The audience for this is anyone who runs a restaurant or thinks about food service, they don't read .ipynb files. Wrote it as a 1,500-word article with embedded charts, structured around findings, not code. Reach > rigour-display when the goal is impact, not credentials.",
      },
    ],
    pivots: [
      "Initial model was a kitchen-sink regression with all 21 variables. R² looked great, but multicollinearity made the coefficients meaningless. Dropped to 7 variables that survived a VIF check. Lower R², but the coefficients were finally interpretable.",
      "Originally led the article with 'price drives satisfaction' (the cliché finding). Re-read my own data and realised: price's effect was conditional on cuisine type. Different cuisines had different price-satisfaction relationships. Restructured the article around 'cuisine moderates everything else' which was the actual finding.",
    ],
    weaknesses: [
      "I had not used VIF in practice before this project. Read about it in textbooks, never had a dataset where it mattered. The 21-variable kitchen-sink regression was the lesson, I needed to feel the bad coefficients before VIF made intuitive sense.",
      "Cross-sectional data is genuinely limiting. Without time, you can't establish what changes when prices change, only what's correlated when prices differ. Had to be explicit about this in the article, wrote a 'what this analysis cannot tell you' paragraph.",
      "Visualisation as discipline (not just 'plot something') took me time. My first charts were Matplotlib defaults, gridlines, dark backgrounds, default colors. Read Knaflic, rewrote everything in clean Seaborn with thoughtful encoding. Charts went from 'data shown' to 'finding implied'.",
    ],
    outcome: [
      "Comprehensive EDA across 21 variables",
      "Predictive models for restaurant performance (post-VIF: 7 variables, R² 0.62)",
      "Published Medium article with embedded visualisations",
      "Finding: cuisine type moderates the effect of every other variable",
      "Honest framing: cross-sectional data, no causation claims",
    ],
    regret:
      "I'd have liked to layer this with time-series data, same restaurants over multiple periods. Cross-sectional data only takes you so far. Without time, causation is locked behind a door I can't open. Would also love to add cultural-context variables (Hofstede's dimensions per country) to test whether the cuisine-moderates-everything finding is itself culturally moderated.",
    takeaway:
      "Eyes before models. The interesting findings show up in plots before they show up in regressions. If your model is surprising you, your EDA was lazy. Honest interpretability beats flattering R²: a model with low R² and clean coefficients teaches more than a model with high R² and meaningless coefficients.",
  },
};

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return CASE_STUDIES[slug];
}
