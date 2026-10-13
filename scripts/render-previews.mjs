import { chromium } from 'playwright';
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',args:['--no-sandbox']});
await mkdir('docs/previews',{recursive:true});
await mkdir('.artifacts',{recursive:true});
try {
 for(const locale of ['en','tr']){
 for(const colorScheme of ['light','dark']){
  const prefix = `${locale}${colorScheme === 'dark' ? '-dark' : ''}`;
  const page=await browser.newPage({viewport:{width:1440,height:1000},colorScheme});
  await page.goto((process.env.SITE_URL||'http://127.0.0.1:4322')+(locale==='tr'?'/tr/':'/'));
  await page.locator('img:not(#dialog-image)').evaluateAll(async imgs=>{await Promise.all(imgs.map(async img=>{img.loading='eager';await img.decode();}));});
  for(const [name,width,height] of [['desktop',1440,1000],['mobile',390,844]]){
   await page.setViewportSize({width,height});await page.evaluate(()=>scrollTo(0,0));
   await page.waitForTimeout(150);
   const shot=await page.screenshot({fullPage:true});
   await sharp(shot).webp({quality:88}).toFile(`docs/previews/${prefix}-${name}.webp`);
   if(locale==='en'&&name==='desktop'){
    await sharp(shot).extract({left:0,top:1750,width:1440,height:1100}).png().toFile(`.artifacts/visual-showcase-${colorScheme}.png`);
    await sharp(shot).extract({left:0,top:4000,width:1440,height:1400}).png().toFile(`.artifacts/visual-middle-${colorScheme}.png`);
   }
   if(locale==='en'&&name==='mobile')await sharp(shot).extract({left:0,top:0,width:390,height:844}).png().toFile(`.artifacts/visual-mobile-hero-${colorScheme}.png`);
   console.log('Rendered',locale,colorScheme,name);
  }
  await page.close();
 }
 }
} finally {await browser.close();}
