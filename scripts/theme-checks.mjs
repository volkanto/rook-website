import assert from 'node:assert/strict';

export async function checkThemes(browser, base, check) {
  const url = `${base}/`;
  const key = 'rook-notes-theme';
  const waitForTheme = (page, theme) => page.waitForFunction(
    expected => document.documentElement.dataset.theme === expected, theme,
  );

  for (const colorScheme of ['light', 'dark']) {
    await check(`${colorScheme}: system preference works without JavaScript`, async () => {
      const context = await browser.newContext({ colorScheme, javaScriptEnabled: false });
      try {
        const page = await context.newPage();
        await page.goto(url);
        assert.equal(await page.locator('html').evaluate(el => getComputedStyle(el).colorScheme), colorScheme);
        assert.equal(await page.locator('html').evaluate(el => getComputedStyle(el).backgroundColor),
          colorScheme === 'dark' ? 'rgb(32, 32, 36)' : 'rgb(255, 255, 255)');
        assert(await page.locator('#theme-select').isDisabled());
      } finally { await context.close(); }
    });
  }

  await check('Saved theme applies before the body renders, overriding the system', async () => {
    const context = await browser.newContext({ colorScheme: 'light' });
    try {
      await context.addInitScript(() => {
        localStorage.setItem('rook-notes-theme', 'dark');
        const observer = new MutationObserver(() => {
          if (document.body) {
            window.__rookFirstBodyTheme = document.documentElement.dataset.theme;
            observer.disconnect();
          }
        });
        observer.observe(document, { childList: true, subtree: true });
      });
      const page = await context.newPage();
      await page.goto(url);
      assert.equal(await page.evaluate(() => window.__rookFirstBodyTheme), 'dark');
      assert.equal(await page.locator('#theme-select').inputValue(), 'dark');
      assert.equal(await page.locator('meta[name="theme-color"]').getAttribute('content'), '#202024');
    } finally { await context.close(); }
  });

  const context = await browser.newContext({ colorScheme: 'light' });
  try {
    const page = await context.newPage();
    await page.goto(url);
    await check('System theme follows live operating-system changes', async () => {
      await page.emulateMedia({ colorScheme: 'dark' });
      await waitForTheme(page, 'dark');
      assert.equal(await page.locator('#theme-select').inputValue(), 'system');
      assert.equal(await page.locator('meta[name="theme-color"]').getAttribute('content'), '#202024');
    });
    await check('Keyboard theme choice overrides later system changes', async () => {
      await page.locator('#theme-select').focus();
      await page.keyboard.press('ArrowDown');
      await waitForTheme(page, 'light');
      assert.equal(await page.locator('#theme-select').inputValue(), 'light');
      assert.equal(await page.evaluate(key => localStorage.getItem(key), key), 'light');
      await page.emulateMedia({ colorScheme: 'light' });
      await page.emulateMedia({ colorScheme: 'dark' });
      assert.equal(await page.locator('html').getAttribute('data-theme'), 'light');
    });
    await check('Theme choice persists through reload and language navigation', async () => {
      await page.reload();
      assert.equal(await page.locator('html').getAttribute('data-theme'), 'light');
      await page.locator('.language-link').click();
      await page.waitForURL('**/tr/');
      assert.equal(await page.locator('#theme-select').getAttribute('aria-label'), 'Renk teması');
      assert.equal(await page.locator('#theme-select').inputValue(), 'light');
      assert.equal(await page.locator('html').getAttribute('data-theme'), 'light');
    });
    await check('System option clears the override and resumes automatic switching', async () => {
      await page.locator('#theme-select').selectOption('system');
      await waitForTheme(page, 'dark');
      assert.equal(await page.evaluate(key => localStorage.getItem(key), key), null);
      await page.emulateMedia({ colorScheme: 'light' });
      await waitForTheme(page, 'light');
    });
    await check('Theme choices and returning to system synchronize across tabs', async () => {
      const other = await context.newPage();
      try {
        await other.goto(url);
        await page.locator('#theme-select').selectOption('dark');
        await waitForTheme(other, 'dark');
        assert.equal(await other.locator('#theme-select').inputValue(), 'dark');
        await page.locator('#theme-select').selectOption('system');
        await waitForTheme(other, 'light');
        assert.equal(await other.locator('#theme-select').inputValue(), 'system');
      } finally { await other.close(); }
    });
  } finally { await context.close(); }

  await check('Theme selection works when browser storage is unavailable', async () => {
    const context = await browser.newContext({ colorScheme: 'light' });
    try {
      await context.addInitScript(() => {
        Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('Storage unavailable', 'SecurityError'); } });
      });
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(url);
      assert.equal(await page.locator('html').getAttribute('data-theme'), 'light');
      await page.locator('#theme-select').selectOption('dark');
      await waitForTheme(page, 'dark');
      assert.deepEqual(errors, []);
    } finally { await context.close(); }
  });
  await check('Invalid saved preferences fall back to the system theme', async () => {
    const context = await browser.newContext({ colorScheme: 'dark' });
    try {
      await context.addInitScript(() => localStorage.setItem('rook-notes-theme', 'invalid'));
      const page = await context.newPage();
      await page.goto(url);
      assert.equal(await page.locator('html').getAttribute('data-theme'), 'dark');
      assert.equal(await page.locator('#theme-select').inputValue(), 'system');
    } finally { await context.close(); }
  });
}
