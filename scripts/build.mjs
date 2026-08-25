#!/usr/bin/env node
/**
 * Build entrypoint.
 *
 * Exists for two reasons. First, `NEXT_OUTPUT=export next build` is not a thing
 * you can write in a package.json script and have it run on both Windows and
 * ubuntu-latest. Second, the diagrams are generated artefacts, and generating
 * them here means no build can ship a page whose architecture SVG is stale.
 *
 *   node scripts/build.mjs dev|server|export|standalone
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const TARGETS = {
  dev: { output: null, args: ["dev"] },
  server: { output: null, args: ["build"] },
  export: { output: "export", args: ["build"] },
  standalone: { output: "standalone", args: ["build"] }
};

const mode = process.argv[2] ?? "server";

// Anything after the target is handed straight to next, so `npm run dev --
// --hostname 0.0.0.0` still works from inside a container.
const passthrough = process.argv.slice(3);
const target = TARGETS[mode];

if (!target) {
  console.error(`Unknown build target "${mode}". Expected one of: ${Object.keys(TARGETS).join(", ")}`);
  process.exit(1);
}

function run(args, env) {
  const result = spawnSync(process.execPath, args, { stdio: "inherit", cwd: root, env });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

// Regenerate the architecture and stack SVGs from data/ before anything reads them.
run([path.join(root, "scripts", "generate-diagrams.mjs")], process.env);

// Regenerate the hero voiceover if edge-tts is installed here. On a build machine
// without it this is a no-op and the committed mp3 ships unchanged.
run([path.join(root, "scripts", "generate-hero-audio.mjs")], process.env);

const env = { ...process.env };
if (target.output) env.NEXT_OUTPUT = target.output;

run([path.join(root, "node_modules", "next", "dist", "bin", "next"), ...target.args, ...passthrough], env);
