#!/usr/bin/env bash
# Build the pockets-app web export and sync it into apps/web/public/pocketsapp-demo
# so it can be embedded as a live demo at /portfolio/pocketsapp/.
#
# Usage:
#   scripts/build-pocketsapp-demo.sh                                 (defaults to /benandtue/pocketsapp-demo)
#   POCKETS_BASE=/some-other-prefix/pocketsapp-demo scripts/build-pocketsapp-demo.sh
#
# Required: POCKETS_REPO env var or default location at ../pockets-app/PocketsApp.

set -euo pipefail

POCKETS_REPO="${POCKETS_REPO:-$HOME/pockets-app/PocketsApp}"
# Default to the production-deploy prefix so the committed bundle works on
# GitHub Pages out of the box. The Next.js dev server runs with the same
# `/benandtue` basePath locked in (apps/web/next.config.ts), so the same
# build also serves correctly at http://localhost:3000/benandtue/...
POCKETS_BASE="${POCKETS_BASE:-/benandtue/pocketsapp-demo}"
DEST_DIR="$(cd "$(dirname "$0")/.." && pwd)/apps/web/public/pocketsapp-demo"

if [[ ! -d "$POCKETS_REPO" ]]; then
  echo "pockets-app repo not found at $POCKETS_REPO" >&2
  echo "set POCKETS_REPO to override." >&2
  exit 1
fi

echo "▸ exporting pockets-app web bundle (base=$POCKETS_BASE)..."
(
  cd "$POCKETS_REPO"
  rm -rf dist-web
  EXPO_WEB_BASE_URL="$POCKETS_BASE" npx expo export --platform web --output-dir dist-web
)

echo "▸ syncing into $DEST_DIR..."
mkdir -p "$DEST_DIR"
rsync -a --delete "$POCKETS_REPO/dist-web/" "$DEST_DIR/"

INDEX="$DEST_DIR/index.html"

echo "▸ patching index.html..."

# 1) Switch the entry script from classic-defer to type=module so the bundle's
#    `import.meta.env` references (from Zustand 5 / @reduxjs/toolkit-style devtools
#    checks) parse correctly. Classic <script defer> disallows import.meta.
sed -i '' "s|<script src=\"$POCKETS_BASE/_expo/static/js/web/entry-\([^\"]*\)\" defer>|<script src=\"$POCKETS_BASE/_expo/static/js/web/entry-\1\" type=\"module\">|g" "$INDEX"

# 2) Inject a tiny URL-fixup that rewrites /index.html → / before the bundle
#    runs, so expo-router sees a clean root path (otherwise it shows the
#    "Unmatched Route" page when loaded as ${POCKETS_BASE}/index.html).
FIX='<script>(function(){try{var p=location.pathname;if(p.endsWith("/index.html"))history.replaceState(null,"",p.slice(0,-"index.html".length)+location.search+location.hash);}catch(e){}})();</script>'
perl -i -pe "s|(<script src=\"${POCKETS_BASE//\//\\/}/_expo)|$FIX\n  \$1|g" "$INDEX"

echo "▸ done. demo available at /portfolio/pocketsapp/"
