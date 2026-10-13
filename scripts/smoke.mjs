import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
const base = (process.env.SITE_URL || 'http://127.0.0.1:4321').replace(/\/$/, '');
const canonical = (process.env.SITE_CANONICAL || 'https://rooknotes.com').replace(/\/$/, '');
const browser = await chromium.launch({executablePath:process.env.CHROMIUM_PATH || '/usr/bin/chromium',args:['--no-sandbox']});
const results=[];
await mkdir('.artifacts',{recursive:true});
async function check(name, fn) { await fn(); results.push({name,result:'passed'}); console.log('PASS',name); }
try {
 for(const locale of ['en','tr']) {
  const context=await browser.newContext({viewport:{width:1440,height:1000},locale:'en-US'});
  const page=await context.newPage(); const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(base+(locale==='en'?'/':'/tr/'));
  await check(`${locale}: language, metadata, real assets, and destinations`, async()=>{
   assert.equal(await page.locator('html').getAttribute('lang'),locale);
   assert.equal(await page.locator('h1').count(),1);
   assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'),`${canonical}/${locale==='tr'?'tr/':''}`);
   assert.equal(await page.locator('meta[property="og:image"]').getAttribute('content'),`${canonical}/images/social-${locale}.png`);
   const dead=await page.locator('a[href^="#"]').evaluateAll(links=>links.map(a=>a.getAttribute('href')).filter(h=>!document.querySelector(h)));
   assert.deepEqual(dead,[]);
   const appLinks=await page.locator('a[href="https://lite.rooknotes.com"]').count();assert(appLinks>=4);
   await page.locator('footer').scrollIntoViewIfNeeded();
   await page.locator('img:not(#dialog-image)').evaluateAll(async imgs=>{await Promise.all(imgs.map(async img=>{img.loading='eager';await img.decode();}));});
   const broken=await page.locator('img:not(#dialog-image)').evaluateAll(imgs=>imgs.filter(img=>!img.complete||img.naturalWidth===0).map(img=>img.src));assert.deepEqual(broken,[]);
  });
  await check(`${locale}: tabs support arrows, Home, End, and correct panels`,async()=>{
   await page.locator('#tab-0').focus();await page.keyboard.press('ArrowRight');
   assert.equal(await page.locator('#tab-1').getAttribute('aria-selected'),'true');assert(await page.locator('#panel-1').isVisible());assert(!await page.locator('#panel-0').isVisible());
   await page.keyboard.press('End');assert.equal(await page.locator('#tab-2').getAttribute('aria-selected'),'true');
   await page.keyboard.press('Home');assert.equal(await page.locator('#tab-0').getAttribute('aria-selected'),'true');
  });
  await check(`${locale}: screenshot dialog traps focus, closes with Escape, and restores focus`,async()=>{
   const opener=page.locator('#panel-0 [data-zoom]');await opener.click();assert(await page.locator('#image-dialog').isVisible());
   for(let i=0;i<4;i++)await page.keyboard.press('Tab');
   assert(await page.evaluate(()=>!!document.activeElement?.closest('#image-dialog')));
   const violations=(await new AxeBuilder({page}).include('#image-dialog').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations;assert.deepEqual(violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[]);
   await page.keyboard.press('Escape');assert(!await page.locator('#image-dialog').isVisible());assert(await opener.evaluate(el=>el===document.activeElement));
  });
  await check(`${locale}: FAQ keyboard operation`,async()=>{
   const summary=page.locator('.faq-list summary').first();await summary.focus();await page.keyboard.press('Enter');assert(await summary.evaluate(el=>el.parentElement.open));await page.keyboard.press('Enter');assert(!await summary.evaluate(el=>el.parentElement.open));
  });
  await check(`${locale}: WCAG AA automated checks`,async()=>{
   const report=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
   await writeFile(`.artifacts/axe-${locale}.json`,JSON.stringify(report,null,2));
   assert.deepEqual(report.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))})),[]);
  });
  for(const width of [390,768,1440]) {
   await page.setViewportSize({width,height:width===390?844:1000});
   await check(`${locale}: ${width}px layout has no horizontal overflow`,async()=>{assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`Overflow at ${width}`);});
   if(width===390){
    await check(`${locale}: mobile navigation and zoom`,async()=>{
     await page.locator('.menu-toggle').click();assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'true');await page.locator('#site-navigation a').first().click();assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'),'false');
     await page.locator('#panel-0 [data-zoom]').click();assert(await page.locator('#image-dialog').isVisible());assert(await page.locator('.dialog-image-scroll').evaluate(el=>el.scrollWidth>el.clientWidth));await page.keyboard.press('Escape');
    });
    await page.evaluate(()=>scrollTo(0,0));
    await page.screenshot({path:`.artifacts/${locale}-mobile.png`,fullPage:true});
   }
   if(width===1440) {await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:`.artifacts/${locale}-desktop.png`,fullPage:true});await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:`.artifacts/${locale}-hero.png`});}
  }
  await check(`${locale}: no JavaScript errors`,async()=>assert.deepEqual(errors,[]));
  await context.close();
 }
 const context=await browser.newContext({reducedMotion:'reduce'});const page=await context.newPage();await page.goto(base+'/');
 await check('Reduced motion is respected',async()=>assert.equal(await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior),'auto'));
 await check('Language link changes all content',async()=>{await page.locator('.language-link').click();await page.waitForURL('**/tr/');assert.equal(await page.locator('html').getAttribute('lang'),'tr');assert.equal(await page.locator('#hero-title').innerText(),'Gününü kaydet.\nİlerlemeni gör.');});
 await context.close();
 console.log(`${results.length} checks passed.`);
} finally {await writeFile('.artifacts/test-results.json',JSON.stringify({base,testedAt:new Date().toISOString(),results},null,2));await browser.close();}
