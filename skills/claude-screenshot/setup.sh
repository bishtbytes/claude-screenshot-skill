#!/usr/bin/env bash
# Install dependencies and Playwright browsers
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
DATA_DIR="${CLAUDE_PLUGIN_DATA:-$SCRIPT_DIR}"

if ! diff -q "$SCRIPT_DIR/package.json" "$DATA_DIR/package.json" >/dev/null 2>&1; then
  cp "$SCRIPT_DIR/package.json" "$DATA_DIR/"
  cd "$DATA_DIR"
  npm install --no-fund --no-audit 2>/dev/null
  npx playwright install chromium 2>/dev/null
fi
