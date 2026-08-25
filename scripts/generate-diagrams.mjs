#!/usr/bin/env node
/**
 * Turns the JSON in data/ into SVG.
 *
 * Mermaid was the obvious answer and I did not take it: it is several hundred
 * kilobytes of client JavaScript to draw a picture that never changes after
 * build, on a site whose whole argument is that it is cheap to run. These
 * diagrams are laid out here, once, at build time, and ship as markup. No
 * runtime, no layout shift, no flash of an un-rendered code fence, and the
 * labels are still real text for a screen reader and for search.
 *
 * Writes two things per diagram:
 *   public/diagrams/<slug>.svg   standalone file, for direct links and previews
 *   lib/generated/diagrams.ts    the same markup, inlined, so pages can style it
 *
 * Both are committed. A generated artefact you cannot read in a diff is a
 * generated artefact nobody checks.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ARCH_DIR = path.join(root, "data", "architecture");
const STACK_FILE = path.join(root, "data", "stack.json");
const OUT_SVG = path.join(root, "public", "diagrams");
const OUT_TS = path.join(root, "lib", "generated", "diagrams.ts");

/* ---------------------------------------------------------------- layout */

const PAD = 20;
const COL_GAP = 54;
const ROW_GAP = 16;
const LAYER_LABEL_H = 26;
const CHAR_W = 6.45; // 12px Inter, checked against the rendered output
const LINE_H = 15;
const NODE_PAD_X = 13;
const NODE_PAD_Y = 12;
const MAX_LINE = 16;
const MIN_W = 118;

function wrap(label) {
  const words = String(label).split(/\s+/);
  const lines = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? line + " " + word : word;
    if (candidate.length > MAX_LINE && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function measure(node) {
  const lines = wrap(node.label);
  const longest = lines.reduce((n, l) => Math.max(n, l.length), 0);
  const w = Math.max(MIN_W, Math.round(longest * CHAR_W) + NODE_PAD_X * 2);
  const h = lines.length * LINE_H + NODE_PAD_Y * 2;
  return { lines, w, h };
}

/**
 * Columns run left to right, and each column is centred on a shared midline so
 * the eye reads one horizontal flow rather than a staircase.
 */
function layout(graph) {
  const columns = graph.layers.map((layer) => {
    const nodes = layer.nodes.map((n) => Object.assign({}, n, measure(n)));
    const w = nodes.reduce((m, n) => Math.max(m, n.w), 0);
    const h = nodes.reduce((sum, n) => sum + n.h, 0) + ROW_GAP * (nodes.length - 1);
    return Object.assign({}, layer, { nodes, w, h });
  });

  const bodyH = columns.reduce((m, c) => Math.max(m, c.h), 0);
  const top = PAD + LAYER_LABEL_H;

  let x = PAD;
  for (const col of columns) {
    let y = top + (bodyH - col.h) / 2;
    col.x = x;
    for (const node of col.nodes) {
      node.x = x + (col.w - node.w) / 2;
      node.y = y;
      y += node.h + ROW_GAP;
    }
    x += col.w + COL_GAP;
  }

  return {
    columns,
    width: Math.round(x - COL_GAP + PAD),
    height: Math.round(top + bodyH + PAD)
  };
}

/* ------------------------------------------------------------------ draw */

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Six kinds, and the difference between them is line weight and dash, not hue.
 * The single accent is reserved for the box that is doing the modelling, which
 * is the thing a reader is looking for on an architecture diagram.
 */
const KIND = {
  source: { fill: "none", stroke: "var(--dgm-rule, #d6d3d1)", dash: "4 3", accent: false },
  service: { fill: "var(--dgm-bg, #ffffff)", stroke: "var(--dgm-rule, #d6d3d1)", dash: null, accent: false },
  model: { fill: "var(--dgm-bg, #ffffff)", stroke: "var(--dgm-accent, #1d4ed8)", dash: null, accent: true },
  store: { fill: "var(--dgm-surface, #f4f4f2)", stroke: "var(--dgm-rule, #d6d3d1)", dash: null, accent: false },
  ui: { fill: "var(--dgm-surface, #f4f4f2)", stroke: "var(--dgm-ink, #0c0a09)", dash: null, accent: false },
  external: { fill: "none", stroke: "var(--dgm-faint, #a8a29e)", dash: "2 3", accent: false }
};

function drawNode(node) {
  const style = KIND[node.kind] || KIND.service;
  const parts = [];
  const dash = style.dash ? ' stroke-dasharray="' + style.dash + '"' : "";

  parts.push(
    '<rect x="' + node.x + '" y="' + node.y + '" width="' + node.w + '" height="' + node.h +
      '" rx="3" fill="' + style.fill + '" stroke="' + style.stroke + '" stroke-width="1"' + dash + "/>"
  );

  if (style.accent) {
    parts.push(
      '<rect x="' + node.x + '" y="' + node.y + '" width="3" height="' + node.h +
        '" fill="var(--dgm-accent, #1d4ed8)"/>'
    );
  }

  const startY = node.y + NODE_PAD_Y + 11;
  node.lines.forEach(function (line, i) {
    parts.push(
      '<text x="' + (node.x + node.w / 2) + '" y="' + (startY + i * LINE_H) +
        '" text-anchor="middle" class="dgm-node">' + esc(line) + "</text>"
    );
  });

  return parts.join("");
}

function drawEdge(edge, byId, slug) {
  const a = byId.get(edge.from);
  const b = byId.get(edge.to);
  if (!a || !b) return "";

  const forward = b.x > a.x;
  const x1 = forward ? a.x + a.w : a.x;
  const y1 = a.y + a.h / 2;
  const x2 = forward ? b.x : b.x + b.w;
  const y2 = b.y + b.h / 2;

  let d;
  if (forward) {
    const dx = Math.max(24, (x2 - x1) * 0.45);
    d = "M " + x1 + " " + y1 + " C " + (x1 + dx) + " " + y1 + ", " + (x2 - dx) + " " + y2 + ", " + x2 + " " + y2;
  } else {
    // A feedback edge. Route it under both boxes so it cannot be misread as
    // part of the forward flow.
    const dip = Math.max(a.y + a.h, b.y + b.h) + 26;
    d = "M " + x1 + " " + y1 + " C " + (x1 - 40) + " " + dip + ", " + (x2 + 40) + " " + dip + ", " + x2 + " " + y2;
  }

  const dashed = edge.optional ? ' stroke-dasharray="4 3"' : "";
  const parts = [
    '<path d="' + d + '" fill="none" stroke="var(--dgm-rule, #d6d3d1)" stroke-width="1"' +
      dashed + ' marker-end="url(#dgm-arrow-' + slug + ')"/>'
  ];

  if (edge.label) {
    const mx = (x1 + x2) / 2;
    const my = forward ? (y1 + y2) / 2 - 7 : Math.max(a.y + a.h, b.y + b.h) + 32;
    const w = edge.label.length * 5.4 + 8;
    parts.push(
      '<rect x="' + (mx - w / 2) + '" y="' + (my - 9) + '" width="' + w +
        '" height="13" fill="var(--dgm-bg, #ffffff)"/>',
      '<text x="' + mx + '" y="' + (my + 1) + '" text-anchor="middle" class="dgm-edge">' + esc(edge.label) + "</text>"
    );
  }

  return parts.join("");
}

const STYLE = [
  ".dgm-node { font: 12px var(--font-inter, ui-sans-serif, system-ui, sans-serif); fill: var(--dgm-ink, #1c1917); }",
  ".dgm-layer { font: 10px var(--font-geist-mono, ui-monospace, monospace); letter-spacing: 0.11em; fill: var(--dgm-faint, #a8a29e); }",
  ".dgm-edge { font: 9.5px var(--font-geist-mono, ui-monospace, monospace); fill: var(--dgm-faint, #78716c); }"
].join(" ");

// The marker id is namespaced per diagram. Two inline SVGs on one page with
// the same defs id is a real bug: the second one silently borrows the first
// arrowhead, and if the first is ever removed both lose their arrows.
function marker(slug) {
  const id = "dgm-arrow-" + slug;
  return (
    '<defs><marker id="' + id + '" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" ' +
    'orient="auto-start-reverse"><path d="M 0 1 L 7 4 L 0 7 z" fill="var(--dgm-rule, #d6d3d1)"/></marker></defs>'
  );
}

function render(graph) {
  const box = layout(graph);
  const byId = new Map();
  for (const col of box.columns) for (const node of col.nodes) byId.set(node.id, node);

  const layers = box.columns
    .map(function (col) {
      return '<text x="' + col.x + '" y="' + (PAD + 12) + '" class="dgm-layer">' + esc(col.name.toUpperCase()) + "</text>";
    })
    .join("");

  const edges = (graph.edges || []).map(function (e) { return drawEdge(e, byId, graph.slug); }).join("");
  const nodes = box.columns.map(function (col) { return col.nodes.map(drawNode).join(""); }).join("");

  // Edges are drawn first so a box always sits on top of the line entering it.
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + box.width + " " + box.height +
    '" width="' + box.width + '" height="' + box.height + '" role="img" aria-label="' +
    esc(graph.caption || graph.title) + '">' +
    "<style>" + STYLE + "</style>" +
    marker(graph.slug) +
    layers +
    edges +
    nodes +
    "</svg>";

  return { width: box.width, height: box.height, svg: svg };
}

/* ------------------------------------------------------------------ main */

function readGraphs() {
  const graphs = [];
  const files = fs.readdirSync(ARCH_DIR).filter(function (f) { return f.endsWith(".json"); }).sort();
  for (const file of files) {
    graphs.push(JSON.parse(fs.readFileSync(path.join(ARCH_DIR, file), "utf8")));
  }
  if (fs.existsSync(STACK_FILE)) graphs.push(JSON.parse(fs.readFileSync(STACK_FILE, "utf8")));
  return graphs;
}

fs.mkdirSync(OUT_SVG, { recursive: true });
fs.mkdirSync(path.dirname(OUT_TS), { recursive: true });

const entries = [];
for (const graph of readGraphs()) {
  const out = render(graph);
  fs.writeFileSync(path.join(OUT_SVG, graph.slug + ".svg"), out.svg);
  entries.push({
    slug: graph.slug,
    title: graph.title,
    caption: graph.caption || "",
    width: out.width,
    height: out.height,
    svg: out.svg
  });
  console.log("  " + graph.slug + ".svg  " + out.width + "x" + out.height);
}

const header =
  "// GENERATED by scripts/generate-diagrams.mjs from data/. Do not edit by hand.\n" +
  "// Run `npm run diagrams` after changing data/architecture/*.json or data/stack.json.\n\n" +
  "export interface GeneratedDiagram {\n" +
  "  slug: string;\n" +
  "  title: string;\n" +
  "  caption: string;\n" +
  "  width: number;\n" +
  "  height: number;\n" +
  "  /** Inline SVG markup, laid out at build time. There is no client renderer. */\n" +
  "  svg: string;\n" +
  "}\n\n";

const body =
  "export const DIAGRAMS: Record<string, GeneratedDiagram> = " +
  JSON.stringify(
    Object.fromEntries(entries.map(function (e) { return [e.slug, e]; })),
    null,
    2
  ) +
  ";\n";

fs.writeFileSync(OUT_TS, header + body);
console.log("\n" + entries.length + " diagrams written to public/diagrams/ and lib/generated/diagrams.ts");
