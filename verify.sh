#!/usr/bin/env bash
# Lighthouse performance verify script for autoresearch.
# Spins up a local static server, runs headless lighthouse against both pages,
# averages the performance scores, emits a single number on stdout.

set -e
cd "$(dirname "$0")"

PORT=4173
# Use a project-local path so Node can resolve it on both Unix and Windows
LH_REPORT="$(pwd)/.lh-report.json"

# Start static server in background
python -m http.server $PORT --directory public > /tmp/lh-server.log 2>&1 &
SERVER_PID=$!
trap "kill $SERVER_PID 2>/dev/null || true" EXIT

# Wait for server ready (max 5s)
for i in 1 2 3 4 5 6 7 8 9 10; do
  if curl -s -o /dev/null -w "%{http_code}" "http://localhost:$PORT/" 2>/dev/null | grep -q "200"; then break; fi
  sleep 0.5
done

# Run lighthouse on each page
score_for() {
  local page=$1
  npx --yes lighthouse "http://localhost:$PORT/$page" \
    --only-categories=performance \
    --output=json --quiet \
    --chrome-flags="--headless=new --no-sandbox --disable-gpu --disable-dev-shm-usage" \
    --max-wait-for-load=20000 \
    --output-path="$LH_REPORT" 2>/dev/null
  node -e "const fs=require('fs');const r=JSON.parse(fs.readFileSync(process.argv[1],'utf8'));console.log(Math.round(r.categories.performance.score*100))" "$LH_REPORT"
}

S1=$(score_for "")            # landing
S2=$(score_for "inventory.html")
AVG=$(( (S1 + S2) / 2 ))

echo "$AVG"
