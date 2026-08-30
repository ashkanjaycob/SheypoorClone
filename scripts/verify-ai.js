import puppeteer from 'puppeteer-core';
import path from 'path';

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const ARTIFACT_DIR = '/Users/Ashi/.gemini/antigravity-ide/brain/b6907506-08ce-4948-b6d3-6d4ed4ce8c07';
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function run() {
  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  // 1. Visit homepage (Persian)
  console.log('1. Loading Homepage...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
  await sleep(3500); // Allow proactive greeting bubble to show

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'ai_step1_greeting_bubble.png') });
  console.log('Saved ai_step1_greeting_bubble.png');

  // 2. Open AI Copilot Chat panel
  console.log('2. Clicking AI Orb to open Copilot...');
  await page.click('button[aria-label="Toggle AI Assistant"]');
  await sleep(1000);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'ai_step2_copilot_open.png') });

  // 3. Send search command through Copilot
  console.log('3. Sending search command: "ارزان‌ترین گوشی‌ها"...');
  const buttons = await page.$$('button');
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('ارزان‌ترین گوشی‌ها')) {
      await btn.click();
      break;
    }
  }
  await sleep(2500);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'ai_step3_agent_search_result.png') });

  // 4. Open AI Settings Modal
  console.log('4. Opening AI Settings Modal...');
  const settingsBtn = await page.$('button[title="تنظیمات کلید API"]');
  if (settingsBtn) {
    await settingsBtn.click();
    await sleep(800);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'ai_step4_settings_modal.png') });

    // Close settings modal
    const closeButtons = await page.$$('button');
    for (const btn of closeButtons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text && text.includes('انصراف')) {
        await btn.click();
        break;
      }
    }
    await sleep(500);
  }

  // Close Copilot chat panel before navigating to ad page
  console.log('Closing Copilot chat panel...');
  await page.click('button[aria-label="Toggle AI Assistant"]');
  await sleep(800);

  // 5. Navigate to an Ad page and test Price Negotiator Modal
  console.log('5. Navigating to an Ad page...');
  const firstAdCard = await page.$('a[href^="/dashboard/"]');
  if (firstAdCard) {
    await firstAdCard.click();
    await sleep(2500);

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'ai_step5_ad_page_with_negotiator_cta.png') });
    console.log('Saved ai_step5_ad_page_with_negotiator_cta.png');

    // Click on Smart AI Negotiation button
    console.log('6. Opening Smart Negotiation Modal...');
    const allButtons = await page.$$('button');
    for (const btn of allButtons) {
      const text = await page.evaluate(el => el.textContent, btn);
      if (text && text.includes('مذاکره هوشمند قیمت')) {
        await btn.click();
        break;
      }
    }
    await sleep(2000);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'ai_step6_negotiation_modal.png') });
    console.log('Saved ai_step6_negotiation_modal.png');
  }

  // 6. Test in English & Dark Mode
  console.log('7. Testing English & Dark mode...');
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2' });
  await page.evaluate(() => {
    localStorage.setItem('sheypoor_lang', 'en');
    localStorage.setItem('sheypoor_theme', 'dark');
    document.documentElement.classList.add('dark');
    document.documentElement.setAttribute('dir', 'ltr');
    document.documentElement.setAttribute('lang', 'en');
    window.dispatchEvent(new CustomEvent('sheypoor_lang_changed', { detail: 'en' }));
  });
  await sleep(1500);

  // Open Copilot in English & Dark
  await page.click('button[aria-label="Toggle AI Assistant"]');
  await sleep(1000);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'ai_step7_english_dark_copilot.png') });
  console.log('Saved ai_step7_english_dark_copilot.png');

  await browser.close();
  console.log('All verifications finished successfully!');
}

run().catch(console.error);
