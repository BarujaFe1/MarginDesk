/**
 * Capture real lab screenshots (no PII — synthetic demo only).
 * Usage (from apps/web after `npm run build` with empty BASE_PATH for local serve,
 * or serve the Pages export):
 *
 *   npx playwright install chromium
 *   node scripts/capture_screenshots.mjs
 */
import { createServer } from "node:http";
import { readFileSync, existsSync, mkdirSync, copyFileSync } from "node:fs";
import { join, extname, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT = join(ROOT, "apps", "web", "out");
const SHOT_DIR = join(ROOT, "assets", "screenshots");
const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".txt": "text/plain",
};

function contentType(filePath) {
  return MIME[extname(filePath)] || "application/octet-stream";
}

function startStaticServer(root, basePath) {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      let urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
      if (basePath && urlPath.startsWith(basePath)) {
        urlPath = urlPath.slice(basePath.length) || "/";
      }
      if (urlPath.endsWith("/")) urlPath += "index.html";
      const filePath = join(root, urlPath.replace(/^\//, ""));
      if (!existsSync(filePath)) {
        res.writeHead(404);
        res.end("not found");
        return;
      }
      res.writeHead(200, { "Content-Type": contentType(filePath) });
      res.end(readFileSync(filePath));
    });
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      resolve({ server, port });
    });
  });
}

async function main() {
  if (!existsSync(OUT)) {
    console.error("Missing apps/web/out — run NEXT_PUBLIC_BASE_PATH=/MarginDesk npm run build first");
    process.exit(1);
  }
  mkdirSync(SHOT_DIR, { recursive: true });

  const basePath = "/MarginDesk";
  const { server, port } = await startStaticServer(OUT, basePath);
  const origin = `http://127.0.0.1:${port}${basePath}/`;
  console.log("serving", origin);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });

  await page.goto(origin, { waitUntil: "networkidle" });
  await page.waitForSelector(".brand");
  await page.waitForTimeout(800);

  // Hero / overview
  await page.screenshot({
    path: join(SHOT_DIR, "01-margin-calculator.png"),
    fullPage: false,
  });

  // Focus calculator region via scroll
  await page.locator("#margin-calc-title").scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await page.screenshot({
    path: join(SHOT_DIR, "02-proposal-builder.png"),
    fullPage: false,
  });

  await page.locator("#scope-risk-title").scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  await page.screenshot({
    path: join(SHOT_DIR, "03-scope-risk-checklist.png"),
    fullPage: false,
  });

  await page.locator("#cost-lib-title").scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  await page.screenshot({
    path: join(SHOT_DIR, "04-cost-library.png"),
    fullPage: false,
  });

  await page.locator("#tracker-title").scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  await page.screenshot({
    path: join(SHOT_DIR, "05-project-margin-tracker.png"),
    fullPage: false,
  });

  await page.locator("#profit-panel-title").scrollIntoViewIfNeeded();
  await page.waitForTimeout(200);
  await page.screenshot({
    path: join(SHOT_DIR, "06-profit-panel.png"),
    fullPage: false,
  });

  // Switch to Lume for overrun story
  const lume = page.getByRole("tab", { name: /Social media retainer/i });
  if (await lume.count()) {
    await lume.click();
    await page.waitForTimeout(500);
  }
  await page.locator("#proposal-preview-title").scrollIntoViewIfNeeded();
  await page.screenshot({
    path: join(SHOT_DIR, "07-public-proposal.png"),
    fullPage: false,
  });

  await page.locator("#demo-guide-title").scrollIntoViewIfNeeded();
  await page.screenshot({
    path: join(SHOT_DIR, "08-billing-overview.png"),
    fullPage: false,
  });

  // Full-page hero cover + social
  await page.goto(origin, { waitUntil: "networkidle" });
  await page.waitForTimeout(500);
  await page.screenshot({
    path: join(ROOT, "assets", "hero-cover.png"),
    fullPage: false,
  });
  copyFileSync(
    join(ROOT, "assets", "hero-cover.png"),
    join(ROOT, "assets", "social-preview.png"),
  );

  // Smoke assertions for stale-deploy detection
  const body = await page.textContent("body");
  for (const token of ["Lab demo", "MarginDesk", "Studio Norte", "Roteiro de demo"]) {
    if (!body?.includes(token)) {
      throw new Error(`Smoke failed: missing "${token}"`);
    }
  }
  console.log("smoke ok + screenshots written to", SHOT_DIR);

  await browser.close();
  server.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
