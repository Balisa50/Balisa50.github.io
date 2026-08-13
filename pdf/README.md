# Print portfolio

The 19-page PDF portfolio was generated in an earlier session and its source
was never saved, so only the compiled artifact survived on the Desktop. This
directory exists so that cannot happen again.

- `assets/` — the 17 charts recovered from the original PDF with PyMuPDF.
  These are matplotlib output from the project repos, re-extracted rather than
  regenerated so the figures stay identical to the ones already circulated.
- `extracted-text.txt` — the full text of the original, kept as the reference
  for the rebuild.

## How it is meant to be rebuilt

Not by hand. The document's structure already matches `lib/case-studies.ts`:

| PDF section                  | Field         |
| ---------------------------- | ------------- |
| What I set out to do         | `problem`     |
| How I approached it          | `decisions`   |
| What came out of it          | `outcome`     |
| What went wrong              | `pivots`      |
| What I would do differently  | `regret`      |
| What I read along the way    | `research`    |

So the PDF should render from that data through a print-styled route, and be
printed to PDF with headless Chrome. One source of truth: fixing a number in
`lib/case-studies.ts` then corrects the site and the PDF together, which is
the failure mode worth designing out. The original PDF and the site had
already drifted, the PDF omits Wingman entirely.
