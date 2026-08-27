/* eslint-env node */
import puppeteer from 'puppeteer-core';
import path from 'path';

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const ARTIFACTS_DIR = '/Users/Ashi/.gemini/antigravity-ide/brain/b6907506-08ce-4948-b6d3-6d4ed4ce8c07';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,950'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 950 });

  // 1. Persian Card View
  console.log('Testing Persian cards view...');
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  await page.evaluate(() => {
    localStorage.setItem('sheypoor_lang', 'fa');
    localStorage.setItem('sheypoor_theme', 'dark');
    document.documentElement.lang = 'fa';
    document.documentElement.dir = 'rtl';
    window.scrollTo(0, 520);
  });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'sheypoor_cards_fa.png') });

  // 2. English Card View
  console.log('Testing English cards view...');
  await page.evaluate(() => {
    localStorage.setItem('sheypoor_lang', 'en');
    localStorage.setItem('sheypoor_theme', 'dark');
    document.documentElement.lang = 'en';
    document.documentElement.dir = 'ltr';
    window.location.reload();
  });
  await page.waitForNavigation({ waitUntil: 'networkidle0' });
  await page.evaluate(() => window.scrollTo(0, 520));
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'sheypoor_cards_en.png') });

  // 3. German Card View
  console.log('Testing German cards view...');
  await page.evaluate(() => {
    localStorage.setItem('sheypoor_lang', 'de');
    localStorage.setItem('sheypoor_theme', 'dark');
    document.documentElement.lang = 'de';
    document.documentElement.dir = 'ltr';
    window.location.reload();
  });
  await page.waitForNavigation({ waitUntil: 'networkidle0' });
  await page.evaluate(() => window.scrollTo(0, 520));
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'sheypoor_cards_de.png') });

  // Reset to Persian
  await page.evaluate(() => {
    localStorage.setItem('sheypoor_lang', 'fa');
    localStorage.setItem('sheypoor_theme', 'dark');
    document.documentElement.lang = 'fa';
    document.documentElement.dir = 'rtl';
  });

  await browser.close();
  console.log('Cards verification completed!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
