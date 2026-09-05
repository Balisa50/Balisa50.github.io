#!/usr/bin/env bash
# Compile the CV and publish it to the site.
#
# Run twice: hyperref writes its link targets on the first pass and resolves
# them on the second, so a single run leaves the internal references stale.
#
#   ./cv/build.sh
#
# The PDF lands in public/ so the site serves exactly what this source
# produces. Do not edit the PDF; edit cv.tex.
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$HERE"

pdflatex -interaction=nonstopmode -halt-on-error cv.tex >/dev/null
pdflatex -interaction=nonstopmode -halt-on-error cv.tex >/dev/null

mkdir -p ../public
cp cv.pdf ../public/Abdoulie-Balisa-CV.pdf

# LaTeX leaves these beside the source on every run.
rm -f cv.aux cv.log cv.out

pages=$(python -c "from pypdf import PdfReader; print(len(PdfReader('cv.pdf').pages))" 2>/dev/null || echo "?")
echo "built cv.pdf (${pages} pages) -> public/Abdoulie-Balisa-CV.pdf"
[ "$pages" = "2" ] || echo "WARNING: expected 2 pages, got ${pages}"
