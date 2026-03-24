---
name: capture
description: Take a screenshot of any URL, optionally targeting a specific CSS selector. Use when user says "screenshot", "capture page", "show me what this looks like", or needs to see a website visually.
---

Take a screenshot of a web page using Playwright and save it to `~/Desktop/claude-screenshot/`.

## Setup

Run setup once to install dependencies (Playwright + Chromium):

```bash
bash ${CLAUDE_PLUGIN_ROOT}/skills/capture/setup.sh
```

## How to run

```bash
NODE_PATH="${CLAUDE_PLUGIN_DATA}/node_modules" node ${CLAUDE_PLUGIN_ROOT}/skills/capture/screenshot.mjs <URL> [--selector <CSS_SELECTOR>] [--full-page] [--out-dir <PATH>]
```

If `CLAUDE_PLUGIN_DATA` is not set (standalone install), run from the skill directory:

```bash
cd ${CLAUDE_PLUGIN_ROOT}/skills/claude-screenshot-skill && node screenshot.mjs <URL> [--selector <CSS_SELECTOR>] [--full-page]
```

This command will likely need sandbox disabled since target URLs are arbitrary.

## Arguments

- `<URL>` (required): Full URL to screenshot (include https://)
- `--selector <CSS>`: CSS selector to screenshot a specific element
- `--full-page`: Capture the full scrollable page (ignored when --selector is used)
- `--out-dir <PATH>`: Override output directory (default: ~/Desktop/claude-screenshot/)
- `--name <NAME>`: Custom filename (without .png extension)
- `--headless`: Run headless (default is visible browser to bypass Cloudflare)
- `--scroll-to <PX>`: Scroll to Y position before capturing
- `--wait <MS>`: Extra delay in ms after page load for JS-rendered content
- `--interact <JSON>`: JSON array of interaction steps to perform before capturing

## Interaction steps

The `--interact` flag accepts a JSON array of steps. Each step has an `action` field:

| Action    | Fields                          | Example                                                  |
|-----------|---------------------------------|----------------------------------------------------------|
| `click`   | `selector`                      | `{"action":"click","selector":"button:text('Submit')"}`  |
| `fill`    | `selector`, `value`             | `{"action":"fill","selector":"#email","value":"a@b.com"}`|
| `select`  | `selector`, `value`             | `{"action":"select","selector":"select","value":"video"}`|
| `type`    | `selector`, `text`              | `{"action":"type","selector":"#search","text":"hello"}`  |
| `press`   | `key`                           | `{"action":"press","key":"Enter"}`                       |
| `wait`    | `ms`                            | `{"action":"wait","ms":2000}`                            |
| `hover`   | `selector`                      | `{"action":"hover","selector":".menu"}`                  |
| `check`   | `selector`                      | `{"action":"check","selector":"#agree"}`                 |
| `uncheck` | `selector`                      | `{"action":"uncheck","selector":"#agree"}`               |

Steps run in order with a 300ms pause between each (except `wait` which uses its own `ms` value). Interactions run after popup dismissal and before scroll/wait/capture.

## Built-in behaviors

- Auto-dismisses cookie banners, consent modals, and overlays before capturing
- Rejects captures < 2KB (broken renders, favicons)
- Visible browser by default (bypasses Cloudflare)

## Quality rules

1. **Only capture the visual artifact** — the rendered component, pattern, or design. Never capture blog articles, GitHub repos, gallery landing pages, or pages *about* the thing.
2. **After every capture, Read the image to verify.** If it shows a 404, Cloudflare challenge, article, or anything other than the intended visual — delete it and try a different source.
3. **Use --selector to narrow to the content area.** Don't capture full pages with navbars, sidebars, and ads.
4. **Use --scroll-to when content is below the fold.**
5. **Prefer direct demo URLs** over collection pages. Good: deployed demos, CodePen embeds. Bad: blog posts, GitHub repos, npm pages.
6. **Don't pad count with junk.** 5 great captures beat 10 where 7 are useless.

## After running

The script prints the absolute path to the saved PNG on stdout. Use the Read tool to view the screenshot image and describe what you see to the user.

## Examples

Full viewport:
```bash
NODE_PATH="${CLAUDE_PLUGIN_DATA}/node_modules" node ${CLAUDE_PLUGIN_ROOT}/skills/capture/screenshot.mjs https://example.com
```

Full scrollable page:
```bash
NODE_PATH="${CLAUDE_PLUGIN_DATA}/node_modules" node ${CLAUDE_PLUGIN_ROOT}/skills/capture/screenshot.mjs https://example.com --full-page
```

Specific element:
```bash
NODE_PATH="${CLAUDE_PLUGIN_DATA}/node_modules" node ${CLAUDE_PLUGIN_ROOT}/skills/capture/screenshot.mjs https://codepen.io/pen/abc123 --selector ".result"
```

With interactions (select dropdown, click submit, wait for render):
```bash
NODE_PATH="${CLAUDE_PLUGIN_DATA}/node_modules" node ${CLAUDE_PLUGIN_ROOT}/skills/capture/screenshot.mjs http://localhost:3000 --headless --interact '[{"action":"select","selector":"select","value":"video"},{"action":"click","selector":"button:text(\"Submit\")"},{"action":"wait","ms":3000}]'
```
