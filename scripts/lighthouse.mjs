import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "@playwright/test";
import lighthouse from "lighthouse";
import desktopConfig from "lighthouse/core/config/desktop-config.js";

const preview = process.env.PREVIEW_URL;
if (preview && !preview.startsWith("https://")) throw new Error("PREVIEW_URL must use HTTPS.");
const origin = preview || "http://127.0.0.1:3000";
let server;
let browser;
try {
  if (!preview) {
    // npm run build must already have succeeded. Never audit npm run dev.
    server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1"], { stdio: "inherit" });
    let ready = false;
    for (let attempt = 0; attempt < 120; attempt++) {
      if (server.exitCode !== null) throw new Error("Production server exited before the audit.");
      try { ready = (await fetch(origin)).ok; } catch { /* Wait for production startup. */ }
      if (ready) break;
      await new Promise(resolve => setTimeout(resolve, 250));
    }
    if (!ready) throw new Error("Production server did not start within 30 seconds.");
  }
  await mkdir("lighthouse-results", { recursive: true });
  browser = await chromium.launch({ headless: true, args: ["--remote-debugging-port=9222", "--no-sandbox"] });
  const paths = process.env.LIGHTHOUSE_PATHS?.split(",") || ["/", "/preview/case-study"];
  let failed = false;
  for (const [index, path] of paths.entries()) {
    const url = new URL(path, origin).href;
    const result = await lighthouse(url, {
      port: 9222, output: ["html", "json"], logLevel: "error",
      onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
    }, process.env.LIGHTHOUSE_DESKTOP === "1" ? desktopConfig : undefined);
    if (!result || result.lhr.runtimeError) throw new Error(`Lighthouse failed for ${url}: ${result?.lhr.runtimeError?.message}`);
    await writeFile(`lighthouse-results/${index}.html`, result.report[0]);
    await writeFile(`lighthouse-results/${index}.json`, result.report[1]);
    const scores = Object.fromEntries(Object.entries(result.lhr.categories).map(([key, category]) => [key, category.score]));
    console.log(JSON.stringify({ url, scores, cls: result.lhr.audits["cumulative-layout-shift"].numericValue, lcp: result.lhr.audits["largest-contentful-paint"].numericValue }));
    // Preview is intentionally noindex. Report SEO now; enforce it for launch URLs.
    const budgets = { performance: 0.8, accessibility: 0.95, "best-practices": 0.9, ...(process.env.LAUNCH_AUDIT === "1" ? { seo: 0.95 } : {}) };
    for (const [category, minimum] of Object.entries(budgets)) {
      if (scores[category] === null || scores[category] < minimum) {
        console.error(`${url}: ${category} ${scores[category]} is below ${minimum}.`); failed = true;
      }
    }
    if (result.lhr.audits["cumulative-layout-shift"].numericValue > 0.1) { console.error(`${url}: CLS exceeds 0.1.`); failed = true; }
  }
  if (failed) process.exitCode = 1;
} finally {
  await browser?.close();
  server?.kill("SIGTERM");
}
