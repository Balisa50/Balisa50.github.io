/**
 * Print stylesheet for the PDF portfolio.
 *
 * The one rule that overrides taste here: no `letter-spacing` on anything that
 * carries meaning. The previous PDF tracked out its section headings, and PDF
 * text extraction turned "SELECTED WORK" into "S E L E C T E D  W O R K" and
 * "WHAT I SET OUT TO DO" into "WHATISETOUTTODO", because the extractor has to
 * guess word boundaries from glyph gaps and tracking destroys that signal. An
 * applicant tracking system reading either one finds no words it recognises.
 * The small, quiet look of the labels is done with size, weight and colour
 * instead, which extract cleanly.
 *
 * Everything is one column for the same reason: extraction follows layout
 * order, and side-by-side blocks interleave into nonsense.
 */
export const PRINT_CSS = `
@page {
  size: A4;
  margin: 15mm 16mm 14mm;
}

:root {
  --paper: #fdfcf8;
  --ink: #1a1a1a;
  --muted: #5b5b5b;
  --faint: #8a8a8a;
  --accent: #9c3d2e;
  --rule: #d8d4c8;
}

html, body {
  background: var(--paper) !important;
  color: var(--ink) !important;
  margin: 0;
  padding: 0;
}

/* The site chrome has no business in a printed document. */
body > *:not(.doc) { display: none !important; }
.doc, .doc * { box-sizing: border-box; }

.doc {
  background: var(--paper);
  color: var(--ink);
  font-family: "Source Serif 4", "Source Serif Pro", Georgia, "Times New Roman", serif;
  font-size: 9.2pt;
  line-height: 1.38;
}

.page {
  page-break-after: always;
  break-after: page;
}
.page:last-child { page-break-after: auto; break-after: auto; }

/* ── Running heads ──────────────────────────────────────────────────── */
.running {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}
.kicker {
  font-family: "IBM Plex Mono", ui-monospace, "Courier New", monospace;
  font-size: 7.5pt;
  text-transform: uppercase;
  color: var(--accent);
}
.running .kicker:last-child { color: var(--faint); }
.kicker-inline {
  font-family: "IBM Plex Mono", ui-monospace, monospace;
  font-size: 7.5pt;
  text-transform: uppercase;
  color: var(--accent);
  margin: 2pt 0 4pt;
}
.rule { border-top: 1px solid var(--ink); margin: 4pt 0 11pt; }

/* ── Headings ───────────────────────────────────────────────────────── */
.h-page {
  font-size: 24pt;
  font-weight: 600;
  line-height: 1.1;
  margin: 0 0 6pt;
}
.h-project {
  font-size: 28pt;
  font-weight: 600;
  line-height: 1.05;
  margin: 0 0 8pt;
}
.h-section {
  font-family: "IBM Plex Mono", ui-monospace, monospace;
  font-size: 8pt;
  text-transform: uppercase;
  color: var(--accent);
  margin: 12pt 0 5pt;
  font-weight: 500;
}
.h-item { font-size: 11pt; font-weight: 600; margin: 0 0 3pt; }
.h-sub { font-size: 12pt; font-weight: 600; margin: 18pt 0 6pt; }
.h-group { font-size: 10pt; font-weight: 600; margin: 12pt 0 4pt; }

/* ── Text ───────────────────────────────────────────────────────────── */
.body { margin: 0 0 6pt; color: var(--muted); max-width: 88ch; }
.lede { margin: 0 0 11pt; color: var(--muted); font-size: 10pt; }
.standfirst {
  font-size: 10.5pt;
  line-height: 1.4;
  color: var(--ink);
  margin: 0 0 10pt;
  max-width: 88ch;
}
.meta {
  font-family: "IBM Plex Mono", ui-monospace, monospace;
  font-size: 7.5pt;
  color: var(--faint);
  margin: 1pt 0;
}
.bullets { margin: 0 0 8pt; padding-left: 12pt; max-width: 88ch; }
.bullets li { margin-bottom: 3pt; color: var(--muted); }
.decision, .habit, .role, .reading-group { margin-bottom: 9pt; break-inside: avoid; }

/* ── Cover ──────────────────────────────────────────────────────────── */
.cover-name {
  font-size: 46pt;
  font-weight: 600;
  line-height: 1.02;
  margin: 26pt 0 18pt;
}
.cover-line { font-size: 13pt; line-height: 1.45; max-width: 88ch; margin: 0 0 12pt; }
.cover-sub { font-size: 9.5pt; color: var(--muted); max-width: 88ch; margin: 0 0 26pt; }

.cover-list { list-style: none; margin: 0 0 28pt; padding: 0; border-top: 1px solid var(--rule); }
.cover-list li {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12pt;
  padding: 7pt 0;
  border-bottom: 1px solid var(--rule);
}
.cover-list-title { font-weight: 600; font-size: 11pt; }
.cover-list-kicker {
  font-family: "IBM Plex Mono", ui-monospace, monospace;
  font-size: 7pt;
  text-transform: uppercase;
  color: var(--faint);
  text-align: right;
}

.cover-contact {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12pt 16pt;
  border-top: 1px solid var(--rule);
  padding-top: 12pt;
}
.field { display: flex; flex-direction: column; gap: 2pt; }
.field-label {
  font-family: "IBM Plex Mono", ui-monospace, monospace;
  font-size: 7pt;
  text-transform: uppercase;
  color: var(--faint);
}
.field-value { font-size: 9.5pt; }

/* ── Contents ───────────────────────────────────────────────────────── */
.toc { list-style: none; margin: 0 0 8pt; padding: 0; border-top: 1px solid var(--rule); }
.toc li {
  display: grid;
  grid-template-columns: 26pt 1fr auto;
  gap: 10pt;
  align-items: baseline;
  padding: 7pt 0;
  border-bottom: 1px solid var(--rule);
}
.toc-no { font-family: "IBM Plex Mono", ui-monospace, monospace; font-size: 8pt; color: var(--accent); }
.toc-title { font-weight: 600; font-size: 11pt; }
.toc-kicker { font-size: 8.5pt; color: var(--faint); text-align: right; }

/* ── Figures ────────────────────────────────────────────────────────── */
.fig { margin: 0 0 10pt; break-inside: avoid; }
.fig img {
  width: 100%;
  /* Capped, or a tall chart pushes the rest of its section onto a page of its
     own. The figures are landscape matplotlib output, so contain never crops
     anything meaningful. */
  max-height: 38mm;
  object-fit: contain;
  object-position: left;
  display: block;
  border: 1px solid var(--rule);
  background: #fff;
}
.fig figcaption {
  font-family: "IBM Plex Mono", ui-monospace, monospace;
  font-size: 7pt;
  line-height: 1.5;
  color: var(--faint);
  margin-top: 5pt;
}

/* ── Stats ──────────────────────────────────────────────────────────── */
.stats {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10pt;
  margin: 0 0 12pt;
  padding: 8pt 0;
  border-top: 1px solid var(--ink);
  border-bottom: 1px solid var(--rule);
}
.stats li { display: flex; flex-direction: column; gap: 3pt; }
.stat-value { font-size: 17pt; font-weight: 600; line-height: 1; }
.stat-label {
  font-family: "IBM Plex Mono", ui-monospace, monospace;
  font-size: 6.5pt;
  text-transform: uppercase;
  line-height: 1.45;
  color: var(--faint);
}

/* ── Also built ─────────────────────────────────────────────────────── */
.also {
  display: grid;
  grid-template-columns: 150pt 1fr;
  gap: 14pt;
  padding: 12pt 0;
  border-top: 1px solid var(--rule);
  break-inside: avoid;
}
.also-shot { width: 100%; height: auto; border: 1px solid var(--rule); }

/* ── Reading, certs, colophon ───────────────────────────────────────── */
.reading { margin: 0; padding-left: 12pt; }
.reading li { margin-bottom: 4pt; color: var(--muted); font-size: 9pt; }

.certs { list-style: none; margin: 0; padding: 0; border-top: 1px solid var(--rule); }
.certs li {
  display: flex;
  justify-content: space-between;
  gap: 12pt;
  padding: 5pt 0;
  border-bottom: 1px solid var(--rule);
}

.colophon { margin-top: 8pt; padding-top: 5pt; border-top: 1px solid var(--rule); }

@media screen {
  .doc { max-width: 210mm; margin: 0 auto; padding: 18mm 17mm; }
  .page { border-bottom: 1px dashed var(--rule); padding-bottom: 20mm; margin-bottom: 20mm; }
}
`;
