import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const manifest = JSON.parse(await readFile(new URL('../public/images/manifest.json', import.meta.url), 'utf8'));
const capturedThemes = new Map(manifest.screens.map(screen => [screen.file, screen.theme]));

export async function assertScreenshotTheme(page, expected) {
  const visible = await page.locator('.screenshot-button img:visible').evaluateAll(images =>
    images.map(image => image.currentSrc || image.src));
  assert(visible.length >= 7, 'Hero, active product tab, four benefits, and privacy screenshots must be visible');
  for (const src of visible) {
    const file = new URL(src).pathname.split('/').pop();
    assert.equal(capturedThemes.get(file), expected, `Wrong captured theme for ${file}`);
  }
}

export async function checkScreenshotVariants(page, expected) {
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
    for (const index of [0, 1, 2]) {
      await page.locator(`#tab-${index}`).click();
      await page.locator('.screenshot-button img:visible').evaluateAll(images => Promise.all(images.map(image => image.decode())));
      await assertScreenshotTheme(page, expected);
      const opener = page.locator(`#panel-${index} .screenshot-button`);
      const src = await opener.locator('img:visible').evaluate(image => image.currentSrc);
      await opener.click();
      assert.equal(await page.locator('#dialog-image').getAttribute('src'), src);
      await page.keyboard.press('Escape');
    }
    const heroSrc = await page.locator('.hero-screenshot img:visible').evaluate(image => image.currentSrc);
    assert.equal(new URL(heroSrc).pathname.split('/').pop(),
      width === 390 ? `daily-mobile${expected === 'dark' ? '-dark' : ''}.webp` : expected === 'dark' ? 'daily-dark.webp' : 'daily-notes.webp');
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.locator('#tab-0').click();
}

export async function checkLiveScreenshotChanges(browser, base, check) {
  await check('Open screenshots follow live system changes and responsive resizing', async () => {
    const context = await browser.newContext({ colorScheme: 'light', viewport: { width: 1440, height: 1000 } });
    try {
      const page = await context.newPage();
      await page.goto(`${base}/`);
      await page.locator('.hero-screenshot').click();
      assert((await page.locator('#dialog-image').getAttribute('src')).endsWith('/daily-notes.webp'));
      await page.emulateMedia({ colorScheme: 'dark' });
      await page.waitForFunction(() => document.querySelector('#dialog-image').src.endsWith('/daily-dark.webp'));
      await page.setViewportSize({ width: 390, height: 844 });
      await page.waitForFunction(() => document.querySelector('#dialog-image').src.endsWith('/daily-mobile-dark.webp'));
      await page.emulateMedia({ colorScheme: 'light' });
      await page.waitForFunction(() => document.querySelector('#dialog-image').src.endsWith('/daily-mobile.webp'));
      await page.keyboard.press('Escape');
      await page.locator('#theme-select').selectOption('dark');
      await assertScreenshotTheme(page, 'dark');
      await page.locator('.hero-screenshot').click();
      assert((await page.locator('#dialog-image').getAttribute('src')).endsWith('/daily-mobile-dark.webp'));
      await page.keyboard.press('Escape');
      await page.locator('#theme-select').selectOption('light');
      await assertScreenshotTheme(page, 'light');
    } finally { await context.close(); }
  });
}
