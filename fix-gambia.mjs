import { readFileSync, writeFileSync } from "node:fs";
const p = "/data/data/com.termux/files/home/portfolio/lib/case-studies.ts";
let s = readFileSync(p, "utf8");

const pairs = [
  [
    "I wanted to build an independent projection, census-based, uncertainty-quantified, that a Gambian could verify and a planner could use. Same methodology family the UN Population Division uses. Rebuilt from scratch on open data.",
    "I wanted to build an independent projection, based on the 2024 census, with uncertainty quantified, that a Gambian could check and a planner could use."
  ],
  [
    "The three mortality methods agree on life expectancy in 2074 to within about 0.8 years. All three are tighter than WPP's range.",
    "The three mortality methods agree on life expectancy in 2074 to within about 0.8 years."
  ],
  [
    "Population reaches 4.66M by 2074 (range 4.35 to 4.98M), about 0.7M below WPP because it is re-based on the census",
    "Population reaches 4.66M by 2074 (range 4.35 to 4.98M), from a census base rather than the UN's pre-census estimate"
  ],
  [
    "The UN figure is about 13% too high for The Gambia. That came from taking the new census seriously and checking every step against a known answer before believing it.",
    "The UN projection was finalised before the 2024 census, so its base is out of date. Re-basing on the census moves the 2074 figure down by roughly 0.7 million."
  ],
  [
    "The naive version of this project is to fit Lee-Carter to whatever series is available and publish a point estimate. That is exactly the thing a sharp examiner sinks. So I reframed:",
    "The obvious version of this project is to fit Lee-Carter to the available series and publish a point estimate. That leaves the central problem, no national death registration, unaddressed. So I reframed:"
  ]
];

for (const [from, to] of pairs) {
  const n = s.split(from).length - 1;
  s = s.split(from).join(to);
  console.log(`Replaced ${n} of 1`);
}

writeFileSync(p, s);
