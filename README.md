# Work3 — executive newsletter landing page (local only)

Dedicated free-signup landing page for https://wrk3.substack.com/, modeled on Luca's Refactoring sales-page structure. The original /workspace/salespage/landing was only read and copied; it was not edited or pushed. No Git repo, deployment configuration or remote was created here.

**Revised audience:** CEOs, CFOs, CHROs and other senior leaders responsible for the future of work, change management and AI implementation. Copy grounded in Work3 articles, not the ad angles. Sources: SOURCES.md. Publication decisions: PENDING.md.

## Stack
React 19 + TypeScript + Vite 8 + Tailwind CSS v4 + shadcn/ui (base-nova) + Phosphor icons. Local fonts (Inter/Inter Tight, IBM Plex Serif, Caveat; OFL licenses included). Same template stack, a Work3 editorial theme and neutral forest/mint/cream visuals. Motion respects reduced-motion preference. No private Refactoring fonts, logos, faces or brand theme retained.

## Run
Node 20.19+ (Node 22+ also works).

```sh
cd /workspace/work3/landing
npm ci
npm run dev             # http://127.0.0.1:5173
npm run build           # output: public/
npm run preview         # http://127.0.0.1:4173 (production build)
```

Local preview was left running on :4173. No public deployment.

## Section order (follows the source template)
1. Hero — organizational change and leadership; five-question executive reading agenda replaces the paid/free week switch.
2. Recently in Work3 — recent real article titles/dates, replacing the podcast-guest strip.
3. Featured perspective — exact Andy Spence passage on adoption versus outcomes, replacing the large testimonial.
4. Leadership challenge — technology deployment versus work redesign.
5. What you get — research/frameworks and four executive decision areas, replacing paid/free membership comparison.
6. Essay sample — exact passage from Managing AI Employees, linked to the free article.
7. Public recommendations — two real quotes printed on Work3's About page.
8. Free subscription — clear offer and Substack signup steps, replacing paid pricing.
9. No-payment reassurance — free signup and ability to unsubscribe, replacing refund guarantee.
10. Authors — Matteo and Andy, public biographies and portraits.
11. FAQ — free/paid boundaries, cadence, audience, approach, authors and subscriptions.
12. Final signup — concise leadership proposition and the reading agenda.
13. Footer — About, archive and subscribe links.

All conversion CTAs point to Work3's /subscribe, never paid checkout. UTM parameters forwarded. Direct-link flow; no email is collected here. The page itself has no cookies, analytics or tracking pixels. Outbound Substack pages have their own policies.

## Screenshots and QA
`npm run shots` runs headless Chrome through Playwright (box-installed module path in scripts/shoot.mjs; override PLAYWRIGHT_PATH/CHROME_PATH if needed). Full-page images scroll/reveal all sections before capture.

- screenshots/desktop-full.png — 1440px desktop, full page
- screenshots/mobile-full.png — 390px mobile viewport at 2x, full page
- screenshots/desktop-hero.png and screenshots/mobile-hero.png — viewport views

`npm run build` passes. Playwright screenshots produced without console errors. Interaction checks in screenshots/qa.json. No signup submitted; original template remains unchanged. The page is noindex/nofollow while unpublished.
