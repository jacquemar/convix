#!/usr/bin/env bash
# Builds components/bundle.js (classic IIFE assigning window.Convix) from components/src/.
# React is NOT bundled: it is read from window.React (React 18+ loaded by the host page).
# Usage: design-system/tools/build_bundle.sh   (ESBUILD=/path/to/esbuild to override)
set -euo pipefail
cd "$(dirname "$0")/.."
ESBUILD="${ESBUILD:-npx --yes esbuild@0.23.1}"
HEADER='/* @ds-bundle: {"format":4,"namespace":"Convix","components":[{"name":"HeroCard"},{"name":"AppHeader"},{"name":"ConversionPair"},{"name":"CurrencyAmount"},{"name":"SwapButton"},{"name":"RateChip"},{"name":"Keypad"},{"name":"TabBar"},{"name":"Sheet"},{"name":"SectionTitle"},{"name":"CurrencyItem"},{"name":"SearchField"},{"name":"Button"},{"name":"IconButton"},{"name":"Divider"},{"name":"AppIcon"},{"name":"Avatar"},{"name":"Flag"},{"name":"Icon"}]} */'
$ESBUILD components/src/index.tsx --bundle --format=iife --target=es2019 --minify \
  --jsx=transform --jsx-factory=React.createElement --jsx-fragment=React.Fragment \
  --tsconfig=tsconfig.json --banner:js="$HEADER" --outfile=components/bundle.js --log-level=warning
if grep -qiE '</script|<!--' components/bundle.js; then echo "bundle.js contains </script or <!--" >&2; exit 1; fi
wc -c components/bundle.js
