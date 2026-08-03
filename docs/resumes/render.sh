#!/usr/bin/env bash
# Render a résumé HTML document to an A4 PDF ready to print.
#
#   ./render.sh olatuja-oyinkansola-resume.html
#
# Renders every .html in this folder when called with no argument.
# Requires a Chromium/Chrome binary; override with CHROME=/path/to/chrome.

set -euo pipefail
cd "$(dirname "$0")"

find_chrome() {
  if [[ -n "${CHROME:-}" ]]; then printf '%s' "$CHROME"; return; fi
  for c in \
    /opt/pw-browsers/chromium*/chrome-linux/chrome \
    "$(command -v google-chrome || true)" \
    "$(command -v chromium || true)" \
    "$(command -v chromium-browser || true)" \
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
  do
    [[ -x "$c" ]] && { printf '%s' "$c"; return; }
  done
  echo "No Chromium/Chrome binary found. Set CHROME=/path/to/chrome." >&2
  exit 1
}

CHROME_BIN="$(find_chrome)"
targets=("$@")
if [[ ${#targets[@]} -eq 0 ]]; then
  mapfile -t targets < <(ls -1 ./*.html)
fi

for html in "${targets[@]}"; do
  pdf="${html%.html}.pdf"
  "$CHROME_BIN" \
    --headless --disable-gpu --no-sandbox \
    --no-pdf-header-footer \
    --allow-file-access-from-files \
    --virtual-time-budget=8000 \
    --print-to-pdf="$pdf" \
    "file://$(pwd)/${html#./}" 2>/dev/null
  echo "→ $pdf"
done
