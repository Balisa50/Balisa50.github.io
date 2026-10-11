from pathlib import Path

p = Path("lib/projects.ts")
s = p.read_text()

R = [
("The Gambia has no death registration system, so its population figures come from the UN alone, locked in before the first digital census. I built an independent projection that reaches 4.66 million by 2074, about 0.7 million below the UN.",
 "The Gambia's civil registration has limited coverage of deaths, particularly in rural areas, so official population figures lean on UN estimates locked in before the first digital census. This projection is built independently from public inputs and reaches 4.66 million by 2074, about 0.7 million below the UN."),
("Banks in West Africa hold customer data they cannot share, and for rural borrowers the data was never collected. NOVA generates",
 "Banks in West Africa hold customer data they can't share, and for rural borrowers it was never collected. NOVA generates"),
("and a hallucinated answer in a legal question does real harm. I built a RAG system over 13 Acts of Parliament where every answer names the section it came from.",
 "and a hallucinated answer in a legal question does real harm. Every answer from this RAG system names the section it came from, across 13 Acts of Parliament."),
("Microfinance loan officers in West Africa make lending decisions on intuition because the analytical infrastructure is not there. I built a Basel II scorecard from scratch:",
 "Microfinance loan officers in West Africa make lending decisions on intuition because the analytical infrastructure isn't there. This Basel II scorecard was built from scratch:"),
("Application forms can't ask a follow-up when an answer is thin, so hiring teams sort through polished CVs and miss the candidates who can actually do the work. HireIQ runs a conversation instead.",
 "Application forms can't ask a follow-up when an answer is thin, so hiring teams sort through polished CVs and miss candidates who can actually do the work. HireIQ runs a conversation instead."),
("and reading it linearly hides the way it cross-references itself. I embedded every verse with sentence-transformers,",
 "and reading it linearly hides the way it cross-references itself. Every verse here is embedded with sentence-transformers,"),
("Standard actuarial models were calibrated on US and UK data, and they under-represent the constant background hazard that dominates mortality in Sub-Saharan Africa. I built the model from the mortality table up:",
 "Standard actuarial models were calibrated on US and UK data, and they under-represent the constant background hazard that dominates mortality in Sub-Saharan Africa. This model is built from the mortality table up:"),
]

n = 0
for old, new in R:
    if old in s:
        s = s.replace(old, new, 1)
        n += 1
        print(f"✅ {old[:55]}...")
    else:
        print(f"❌ NOT FOUND: {old[:55]}...")

p.write_text(s)
print(f"\n{n}/{len(R)} replacements applied.")




