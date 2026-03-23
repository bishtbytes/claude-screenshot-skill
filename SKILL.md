---
name: claude-screenshot
description: Take a screenshot of any URL, optionally targeting a specific CSS selector. Use when user says "screenshot", "capture page", "show me what this looks like", or needs to see a website visually.
---

Take a screenshot of a web page using Playwright and save it to `~/Desktop/claude-screenshot/`.

## How to run

Run the screenshot script from the npriorities/ui directory (where Playwright is installed):

```bash
cd ~/code/bishtbytes/npriorities/ui && NODE_PATH=./node_modules npx tsx ~/.claude/skills/claude-screenshot/screenshot.ts <URL> [--selector <CSS_SELECTOR>] [--full-page]
```

This command will likely need sandbox disabled since target URLs are arbitrary.

## Arguments

- `<URL>` (required): The full URL to screenshot (include https://)
- `--selector <CSS>`: Optional CSS selector to screenshot a specific element instead of the full viewport
- `--full-page`: Capture the full scrollable page instead of just the viewport (ignored when --selector is used)

## After running

The script prints the absolute path to the saved PNG on stdout. Use the Read tool to view the screenshot image and describe what you see to the user.

## Examples

Full viewport:
```bash
cd ~/code/bishtbytes/npriorities/ui && NODE_PATH=./node_modules npx tsx ~/.claude/skills/claude-screenshot/screenshot.ts https://example.com
```

Full scrollable page:
```bash
cd ~/code/bishtbytes/npriorities/ui && NODE_PATH=./node_modules npx tsx ~/.claude/skills/claude-screenshot/screenshot.ts https://example.com --full-page
```

Specific element:
```bash
cd ~/code/bishtbytes/npriorities/ui && NODE_PATH=./node_modules npx tsx ~/.claude/skills/claude-screenshot/screenshot.ts https://example.com --selector "main"
```
