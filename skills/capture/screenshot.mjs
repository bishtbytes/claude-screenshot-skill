#!/usr/bin/env node

import { chromium } from "playwright";
import path from "path";
import fs from "fs";

const args = process.argv.slice(2);
const url = args[0];

if (!url) {
  console.error("Usage: screenshot.mjs <url> [--selector <css>] [--full-page] [--out-dir <path>] [--headless] [--name <name>] [--scroll-to <px>] [--wait <ms>]");
  process.exit(1);
}

const selectorIdx = args.indexOf("--selector");
const selector = selectorIdx !== -1 ? args[selectorIdx + 1] : null;
const fullPage = args.includes("--full-page");
const headless = args.includes("--headless");

const outDirIdx = args.indexOf("--out-dir");
const outDir = outDirIdx !== -1
  ? args[outDirIdx + 1]
  : path.join(process.env.HOME, "Desktop", "claude-screenshot");

const nameIdx = args.indexOf("--name");
const customName = nameIdx !== -1 ? args[nameIdx + 1] : null;

const scrollToIdx = args.indexOf("--scroll-to");
const scrollTo = scrollToIdx !== -1 ? parseInt(args[scrollToIdx + 1], 10) : 0;

const waitIdx = args.indexOf("--wait");
const extraWait = waitIdx !== -1 ? parseInt(args[waitIdx + 1], 10) : 0;

fs.mkdirSync(outDir, { recursive: true });

const hostname = new URL(url).hostname.replace(/\./g, "-");
const timestamp = new Date()
  .toISOString()
  .replace(/[:.]/g, "-")
  .slice(0, 19);
const filename = customName
  ? `${customName}.png`
  : `${hostname}-${timestamp}.png`;
const outPath = path.join(outDir, filename);

// Common popup/overlay selectors to auto-dismiss
const POPUP_SELECTORS = [
  '[class*="cookie"] button',
  '[class*="Cookie"] button',
  '[id*="cookie"] button',
  '[class*="consent"] button',
  '[class*="banner"] button[class*="close"]',
  '[class*="modal"] button[class*="close"]',
  '[class*="popup"] button[class*="close"]',
  '[class*="overlay"] button[class*="close"]',
  'button[aria-label="Close"]',
  'button[aria-label="close"]',
  'button[aria-label="Dismiss"]',
  'button[aria-label="Accept"]',
  '[class*="gdpr"] button',
  '.fc-button-label',
];

async function dismissPopups(page) {
  for (const sel of POPUP_SELECTORS) {
    try {
      const btn = await page.$(sel);
      if (btn && await btn.isVisible()) {
        await btn.click();
        await page.waitForTimeout(300);
      }
    } catch {}
  }
  // Press Escape as a fallback
  try {
    await page.keyboard.press("Escape");
    await page.waitForTimeout(200);
  } catch {}
}

async function main() {
  const browser = await chromium.launch({ headless });
  const page = await browser.newPage({
    viewport: { width: 1280, height: 720 },
  });

  await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });

  // Always dismiss popups
  await dismissPopups(page);

  // Scroll if requested
  if (scrollTo > 0) {
    await page.evaluate((y) => window.scrollTo(0, y), scrollTo);
    await page.waitForTimeout(500);
  }

  // Extra wait for JS-rendered content
  if (extraWait > 0) {
    await page.waitForTimeout(extraWait);
  }

  if (selector) {
    const el = await page.waitForSelector(selector, { timeout: 15000 });
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

  const stat = fs.statSync(outPath);
  if (stat.size < 2048) {
    fs.unlinkSync(outPath);
    console.error(`Capture too small (${stat.size} bytes) — likely a favicon or broken render. Deleted.`);
    process.exit(1);
  }

  console.log(outPath);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
