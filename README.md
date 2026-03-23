# claude-screenshot-skill

A Claude Code plugin that captures screenshots of any web page using Playwright. Capture full pages, viewports, or specific elements by CSS selector.

## Install

### Via marketplace (recommended)

```
/plugin marketplace add bishtbytes/claude-screenshot-skill
/plugin install claude-screenshot-skill
```

### Standalone (copy to skills directory)

```bash
git clone https://github.com/bishtbytes/claude-screenshot-skill.git ~/.claude/skills/claude-screenshot-skill
cd ~/.claude/skills/claude-screenshot-skill/skills/capture
bash setup.sh
```

## What it does

- Navigates to any URL with a headless Chromium browser
- Captures a screenshot (viewport, full page, or specific element)
- Saves the PNG to `~/Desktop/claude-screenshot/`
- Returns the file path so Claude can view and describe the image

## Usage

Once installed, just ask Claude:

- "Take a screenshot of https://example.com"
- "Screenshot this page and show me the hero section"
- "Capture the full page of https://codepen.io/pen/abc123"

Or invoke directly with `/claude-screenshot-skill:capture`.

## Options

| Flag | Description |
|------|-------------|
| `<URL>` | Required. The URL to screenshot |
| `--selector <CSS>` | Screenshot a specific element |
| `--full-page` | Capture the entire scrollable page |
| `--out-dir <PATH>` | Override output directory |

## Requirements

- Node.js 18+
- Chromium (auto-installed by `setup.sh`)

## License

MIT
