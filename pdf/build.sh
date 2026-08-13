#!/usr/bin/env bash
# Build the print portfolio PDF.
#
#   npm run build && bash pdf/build.sh [output.pdf]
#
# Renders /print from the static export with headless Chrome. Chrome rather
# than WeasyPrint because WeasyPrint's native deps are broken on this machine,
# and rather than a JS PDF library because the document is already HTML and the
# browser is the highest-fidelity renderer available.
#
# The page is served over HTTP rather than opened as file://. The figures are
# referenced as root-absolute paths (/figures/...), which under file:// resolve
# against the filesystem root and silently produce a PDF with no charts in it.
set -euo pipefail

CHROME="${CHROME:-/c/Program Files/Google/Chrome/Application/chrome.exe}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="${1:-$ROOT/pdf/Abdoulie-Balisa-Portfolio.pdf}"
PORT="${PORT:-8731}"

[ -f "$ROOT/out/print/index.html" ] || {
  echo "missing out/print/index.html — run 'npm run build' first" >&2; exit 1; }

python -m http.server "$PORT" --directory "$ROOT/out" >/dev/null 2>&1 &
SERVER=$!
trap 'kill $SERVER 2>/dev/null || true' EXIT

for _ in $(seq 1 40); do
  curl -sf "http://localhost:$PORT/print/index.html" -o /dev/null && break
  sleep 0.25
done

"$CHROME" --headless --disable-gpu --no-sandbox \
  --print-to-pdf="$OUT" --no-pdf-header-footer \
  --virtual-time-budget=30000 \
  "http://localhost:$PORT/print/" 2>&1 | grep -v "externally_managed_app_manager" || true

echo "wrote $OUT"
