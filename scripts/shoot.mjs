// Full-page desktop + mobile screenshots of the local preview (npm run preview, :4173).
// Usage: node scripts/shoot.mjs [url]. Needs Playwright (PLAYWRIGHT_PATH) and Chrome/Chromium (CHROME_PATH).
import { createRequire } from "node:module"
const require = createRequire(import.meta.url)
const pwPath = process.env.PLAYWRIGHT_PATH ?? "/usr/local/lib/pnpm/5/.pnpm/playwright@1.63.0-alpha-2026-08-31/node_modules/playwright"
const { chromium } = require(pwPath)
const url = process.argv[2] ?? "http://127.0.0.1:4173/"
const out = new URL("../screenshots/", import.meta.url).pathname
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH ?? "/usr/bin/google-chrome", args: ["--no-sandbox"] })
const shots = [
  ["desktop", { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 }],
  ["mobile", { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }],
]
for (const [name, opts] of shots) {
  const page = await browser.newPage(opts)
  const errors = []
  page.on("pageerror", (e) => errors.push(e.message))
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()) })
  await page.goto(url, { waitUntil: "load" })
  await page.waitForTimeout(1800)
  // Hero: viewport-only shot after the entrance.
  await page.waitForTimeout(1200)
  await page.screenshot({ path: `${out}${name}-hero.png` })
  // scroll through so every .reveal fires, then shoot the full page
  const h = await page.evaluate(() => document.documentElement.scrollHeight)
  for (let y = 0; y < h; y += 400) { await page.evaluate((y) => window.scrollTo(0, y), y); await page.waitForTimeout(120) }
  await page.waitForTimeout(1500)
  await page.waitForTimeout(2500)
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(800)
  await page.screenshot({ path: `${out}${name}-full.png`, fullPage: true })
  console.log(name, "done", errors.length ? `errors: ${errors.join(" | ")}` : "no console errors")
  await page.close()
}
await browser.close()
