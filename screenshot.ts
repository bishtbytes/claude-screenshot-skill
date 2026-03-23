import { chromium } from "@playwright/test";
import path from "path";
import fs from "fs";

const args = process.argv.slice(2);
const url = args[0];

if (!url) {
  console.error(
    "Usage: screenshot.ts <url> [--selector <css>] [--full-page]"
  );
  process.exit(1);
}

const selectorIdx = args.indexOf("--selector");
const selector = selectorIdx !== -1 ? args[selectorIdx + 1] : null;
const fullPage = args.includes("--full-page");

const outDir = path.join(process.env.HOME!, "Desktop", "claude-screenshot");
fs.mkdirSync(outDir, { recursive: true });

const hostname = new URL(url).hostname.replace(/\./g, "-");
const timestamp = new Date()
  .toISOString()
  .replace(/[:.]/g, "-")
  .slice(0, 19);
const filename = `${hostname}-${timestamp}.png`;
const outPath = path.join(outDir, filename);

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1280, height: 800 },
  });

  await page.goto(url, { waitUntil: "networkidle" });

  if (selector) {
    const el = await page.waitForSelector(selector, { timeout: 10000 });
    if (!el) {
      console.error(`Selector "${selector}" not found`);
      await browser.close();
      process.exit(1);
    }
    await el.screenshot({ path: outPath });
  } else {
    await page.screenshot({ path: outPath, fullPage });
  }

  await browser.close();
  console.log(outPath);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
