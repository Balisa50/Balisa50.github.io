import { readFileSync, writeFileSync } from "node:fs";
const p = "/data/data/com.termux/files/home/portfolio/lib/case-studies.ts";
let s = readFileSync(p, "utf8");

const pairs = [
  [
    "So I implemented all of it from the paper, with no sdv or ctgan import. That decision is what later let me add a second generation mode the library does not ship.",
    "So I implemented all of it from the paper, with no sdv or ctgan import. That is also what later made the criteria-engine mode possible, since the generator internals were mine to reuse."
  ],
  [
    "Most GAN write-ups report one number. I scored four things because they measure genuinely different properties:",
    "I scored four things rather than one, because they measure different properties:"
  ],
  [
    "The GAN took three weeks. Proving the data was worth trusting took the rest of the project, and it meant throwing out two metrics that flattered the model for two that did not.",
    "The GAN took three weeks. Proving the data was worth trusting took longer, and it meant replacing two metrics that flattered the model with two that did not."
  ]
];

for (const [from, to] of pairs) {
  const n = s.split(from).length - 1;
  s = s.split(from).join(to);
  console.log(`Replaced ${n} of 1`);
}

writeFileSync(p, s);
