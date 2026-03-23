---
name: claude-screenshot
description: Take a screenshot of any URL, optionally targeting a specific CSS selector. Use when user says "screenshot", "capture page", "show me what this looks like", or needs to see a website visually.
---

Take a screenshot of a web page using Playwright and save it to `~/Desktop/claude-screenshot/`.

## Setup

Run setup once to install dependencies (Playwright + Chromium):

```bash
bash ${CLAUDE_PLUGIN_ROOT}/skills/claude-screenshot/setup.sh
```

## How to run

```bash
NODE_PATH="${CLAUDE_PLUGIN_DATA}/node_modules" node ${CLAUDE_PLUGIN_ROOT}/skills/claude-screenshot/screenshot.mjs <URL> [--selector <CSS_SELECTOR>] [--full-page] [--out-dir <PATH>]
```

If `CLAUDE_PLUGIN_DATA` is not set (standalone install), run from the skill directory:

```bash
cd ${CLAUDE_PLUGIN_ROOT}/skills/claude-screenshot && node screenshot.mjs <URL> [--selector <CSS_SELECTOR>] [--full-page]
```

This command will likely need sandbox disabled since target URLs are arbitrary.

## Arguments

- `<URL>` (required): Full URL to screenshot (include https://)
- `--selector <CSS>`: CSS selector to screenshot a specific element
- `--full-page`: Capture the full scrollable page (ignored when --selector is used)
- `--out-dir <PATH>`: Override output directory (default: ~/Desktop/claude-screenshot/)

## After running

The script prints the absolute path to the saved PNG on stdout. Use the Read tool to view the screenshot image and describe what you see to the user.

## Examples

Full viewport:
```bash
NODE_PATH="${CLAUDE_PLUGIN_DATA}/node_modules" node ${CLAUDE_PLUGIN_ROOT}/skills/claude-screenshot/screenshot.mjs https://example.com
```

Full scrollable page:
```bash
NODE_PATH="${CLAUDE_PLUGIN_DATA}/node_modules" node ${CLAUDE_PLUGIN_ROOT}/skills/claude-screenshot/screenshot.mjs https://example.com --full-page
```

Specific element:
```bash
NODE_PATH="${CLAUDE_PLUGIN_DATA}/node_modules" node ${CLAUDE_PLUGIN_ROOT}/skills/claude-screenshot/screenshot.mjs https://codepen.io/pen/abc123 --selector ".result"
```
