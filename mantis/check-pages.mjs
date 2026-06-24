import { chromium } from 'playwright';

const PAGES = [
  '/',
  '/pulseras',
  '/collares',
  '/crear-pulsera',
  '/nosotros',
  '/cuidados',
  '/despacho',
  '/faq',
  '/seguimiento',
  '/wishlist',
  '/privacidad',
  '/checkout',
  '/admin',
];

const BASE = 'http://localhost:3000';

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });

const results = [];

for (const path of PAGES) {
  const page = await ctx.newPage();
  const errors = [];
  const consoleErrors = [];

  page.on('pageerror', e => errors.push(e.message));
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });

  let status = 0;
  try {
    const res = await page.goto(BASE + path, { waitUntil: 'networkidle', timeout: 15000 });
    status = res?.status() ?? 0;
    await page.waitForTimeout(1500);
  } catch (e) {
    errors.push('GOTO FAILED: ' + e.message.split('\n')[0]);
  }

  // Check for Next.js error overlay
  const hasErrorOverlay = await page.$('nextjs-portal') !== null ||
    await page.$('[data-nextjs-dialog]') !== null ||
    (await page.title()).includes('500') ||
    (await page.title()).includes('Error');

  // Check if page has meaningful content
  const bodyText = await page.evaluate(() => document.body?.innerText?.trim() ?? '');
  const hasContent = bodyText.length > 50;

  // Get h1 text if present
  const h1 = await page.evaluate(() => document.querySelector('h1')?.innerText?.trim() ?? '');

  // Screenshot
  const screenshotPath = `check-screenshots${path.replace(/\//g, '-') || '-home'}.png`;
  try {
    await page.screenshot({ path: screenshotPath, fullPage: false });
  } catch {}

  results.push({
    path,
    status,
    hasErrorOverlay,
    hasContent,
    h1: h1.slice(0, 80),
    errors: errors.slice(0, 3),
    consoleErrors: consoleErrors.slice(0, 3),
    screenshot: screenshotPath,
  });

  await page.close();
}

await browser.close();

console.log('\n=== PAGE AUDIT ===\n');
for (const r of results) {
  const ok = r.status === 200 && !r.hasErrorOverlay && r.hasContent && r.errors.length === 0;
  const icon = ok ? '✓' : (r.hasErrorOverlay || r.errors.length > 0 ? '✗' : '⚠');
  console.log(`${icon} ${r.path}`);
  console.log(`  HTTP: ${r.status} | Content: ${r.hasContent ? 'yes' : 'NO'} | Error overlay: ${r.hasErrorOverlay ? 'YES' : 'no'}`);
  if (r.h1) console.log(`  H1: "${r.h1}"`);
  if (r.errors.length > 0) console.log(`  JS errors: ${r.errors.join(' | ')}`);
  if (r.consoleErrors.length > 0) console.log(`  Console errors: ${r.consoleErrors.join(' | ')}`);
  console.log(`  Screenshot: ${r.screenshot}`);
  console.log('');
}
