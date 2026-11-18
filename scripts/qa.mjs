import { createRequire } from 'node:module'
import { writeFileSync } from 'node:fs'
const require=createRequire(import.meta.url)
const {chromium}=require(process.env.PLAYWRIGHT_PATH??'/usr/local/lib/pnpm/5/.pnpm/playwright@1.63.0-alpha-2026-08-31/node_modules/playwright')
const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']})
const results=[]
for (const width of [390,768,1440]) {
 const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'reduce'})
 const errors=[];page.on('pageerror',e=>errors.push(e.message))
 await page.goto('http://127.0.0.1:4173/?utm_source=qa&utm_campaign=executive',{waitUntil:'networkidle'})
 await page.getByRole('button',{name:'Is the newsletter free?'}).click()
 const faq=await page.getByText('Yes. You can subscribe to Work3 for free.',{exact:false}).isVisible()
 await page.locator('#about-title').scrollIntoViewIfNeeded()
 await page.evaluate(async()=>{await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})))})
 const data=await page.evaluate(()=>({
  overflow:document.documentElement.scrollWidth>innerWidth,
  brokenImages:[...document.images].filter(i=>!i.complete||i.naturalWidth===0).map(i=>i.src),
  links:[...document.querySelectorAll('a')].map(a=>a.href),
  sections:[...document.querySelectorAll('main>section')].map(s=>s.getAttribute('aria-labelledby')||s.getAttribute('aria-label')),
  body:document.body.innerText,
 }))
 const conversions=data.links.filter(u=>u.includes('/subscribe'))
 const correct=conversions.every(u=>u.startsWith('https://wrk3.substack.com/subscribe?')&&u.includes('utm_source=qa')&&u.includes('utm_campaign=executive')&&!u.includes('plan='))
 const stale=/peacock|entry.level|AI Operations Lead|Refactoring|\$150|money.back/i.test(data.body)
 results.push({width,faqOpens:faq,horizontalOverflow:data.overflow,brokenImages:data.brokenImages,conversionLinks:conversions.length,conversionDestinationsCorrect:correct,staleAdOrTemplateCopy:stale,pageErrors:errors,sectionOrder:data.sections})
 await page.close()
}
await browser.close()
writeFileSync(new URL('../screenshots/qa.json',import.meta.url),JSON.stringify(results,null,2))
console.log(JSON.stringify(results,null,2))
if(results.some(r=>!r.faqOpens||r.horizontalOverflow||r.brokenImages.length||!r.conversionDestinationsCorrect||r.staleAdOrTemplateCopy||r.pageErrors.length))process.exit(1)
