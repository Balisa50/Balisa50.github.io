#!/usr/bin/env node
/**
 * Generate the hero voiceover with Edge TTS.
 *
 * This runs from scripts/build.mjs, which means it runs on machines that do
 * not have edge-tts installed: the Docker builder, the CI runner that produces
 * the static export, and whatever Vercel is using this week. So the contract
 * here is that it is allowed to do nothing.
 *
 * The generated file is committed. If the tool is present and the line has
 * changed, it regenerates; otherwise it leaves the committed audio alone and
 * exits zero. A build must never fail because a speech synthesiser was not
 * installed on the build machine.
 *
 *   node scripts/generate-hero-audio.mjs [--force]
 *
 * Requires (locally only):  pip install edge-tts
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "public", "audio");
const outFile = path.join(outDir, "hero.mp3");
// Sidecar holding the exact line the committed mp3 was generated from. This is
// what lets the script tell "already done" from "the copy changed".
const stampFile = path.join(outDir, "hero.txt");

const VOICE = "en-GB-SoniaNeural";

// Slightly slower than default. The default rate reads as an advertisement.
const RATE = "-8%";

const TEXT =
  "I'm Balisa. I build AI systems that solve real problems in West Africa. This is my work.";

const force = process.argv.includes("--force");

function log(message) {
  console.log(`[hero-audio] ${message}`);
}

/** edge-tts ships a console script; on Windows it is often only on the module path. */
function findRunner() {
  const candidates = [
    { cmd: "python", pre: ["-m", "edge_tts"] },
    { cmd: "python3", pre: ["-m", "edge_tts"] },
    { cmd: "py", pre: ["-m", "edge_tts"] },
    { cmd: "edge-tts", pre: [] }
  ];

  for (const candidate of candidates) {
    const probe = spawnSync(candidate.cmd, [...candidate.pre, "--help"], {
      stdio: "ignore",
      shell: process.platform === "win32"
    });
    if (probe.status === 0) return candidate;
  }
  return null;
}

function main() {
  const current = fs.existsSync(stampFile) ? fs.readFileSync(stampFile, "utf8") : null;
  const stamp = `${VOICE}|${RATE}|${TEXT}`;

  if (!force && fs.existsSync(outFile) && current === stamp) {
    log("committed audio matches the current line, nothing to do");
    return;
  }

  const runner = findRunner();
  if (!runner) {
    if (fs.existsSync(outFile)) {
      log("edge-tts not available, keeping the committed audio");
    } else {
      log("edge-tts not available and no committed audio; the hero will render without the player");
      log("to generate it locally:  pip install edge-tts  &&  npm run audio");
    }
    return;
  }

  fs.mkdirSync(outDir, { recursive: true });

  const result = spawnSync(
    runner.cmd,
    // --rate takes its value with an equals sign. Passed as a separate argument
    // the leading minus in "-8%" is parsed as the start of another flag.
    [...runner.pre, "--voice", VOICE, `--rate=${RATE}`, "--text", TEXT, "--write-media", outFile],
    // Deliberately no shell. On Windows spawnSync does not quote arguments for
    // the shell, so the spaces in TEXT arrive as separate arguments and argparse
    // rejects them. The probe above is what establishes that this command runs.
    { stdio: "inherit" }
  );

  if (result.status !== 0) {
    // Synthesis needs the network. Failing here must not fail the build.
    log("edge-tts failed, keeping whatever was already committed");
    return;
  }

  fs.writeFileSync(stampFile, stamp, "utf8");
  const kb = (fs.statSync(outFile).size / 1024).toFixed(0);
  log(`wrote public/audio/hero.mp3 (${kb} KB) in ${VOICE}`);
  log("commit it, so the machines without edge-tts have something to serve");
}

main();
