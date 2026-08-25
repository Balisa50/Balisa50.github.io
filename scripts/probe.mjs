#!/usr/bin/env node
/**
 * Measures every deployed project and writes the result to
 * data/metrics-snapshot.json.
 *
 * Why a committed snapshot exists at all: the static build of this site has no
 * server, so there is nothing to answer a live probe. Rather than print nothing
 * on GitHub Pages, or worse, print a number I made up, the last real
 * measurement ships with the build and is labelled with the date it was taken.
 *
 * On the server build the same numbers are re-measured per request and the
 * snapshot is only the fallback.
 *
 *   node scripts/probe.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONFIG = path.join(root, "data", "monitors.json");
const OUT = path.join(root, "data", "metrics-snapshot.json");

const config = JSON.parse(fs.readFileSync(CONFIG, "utf8"));

async function probe(monitor) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), config.timeoutMs);
  const started = Date.now();

  try {
    // GET rather than HEAD: several of these are behind edge functions that
    // answer HEAD from cache and would report a response time that no visitor
    // ever experiences.
    const res = await fetch(monitor.url, {
      signal: controller.signal,
      redirect: "follow",
      headers: { "user-agent": "balisa-portfolio-probe" }
    });
    return {
      slug: monitor.slug,
      label: monitor.label,
      url: monitor.url,
      ok: res.ok,
      status: res.status,
      ms: Date.now() - started
    };
  } catch (err) {
    return {
      slug: monitor.slug,
      label: monitor.label,
      url: monitor.url,
      ok: false,
      status: 0,
      ms: Date.now() - started,
      error: err instanceof Error ? err.name : "error"
    };
  } finally {
    clearTimeout(timer);
  }
}

const results = await Promise.all(config.monitors.map(probe));
results.sort((a, b) => a.label.localeCompare(b.label));

const snapshot = {
  measuredAt: new Date().toISOString(),
  method: "One GET per endpoint from a residential connection in Ghana, redirects followed, 8s timeout.",
  results
};

fs.writeFileSync(OUT, JSON.stringify(snapshot, null, 2) + "\n");

for (const r of results) {
  const state = r.ok ? String(r.status) : r.error || String(r.status);
  console.log(String(r.ms).padStart(6) + "ms  " + state.padEnd(9) + r.label);
}
console.log("\nWrote " + path.relative(root, OUT));
