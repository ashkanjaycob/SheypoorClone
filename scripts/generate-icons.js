import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.join(__dirname, '..', 'public');

const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const svgPaths = `
  <path fill="#3E7BFA" d="m684.589 544.832 50.563-138.813c2.663-7.68-1.18-16.247-8.87-18.902l-55.591-20.087c-7.687-2.656-16.262 1.184-18.922 8.861l-10.054 27.764-208.461-75.904-30.457 83.29 208.461 75.904-10.052 27.764c-2.662 7.68 1.181 16.243 8.87 18.902l55.591 20.083c7.392 2.954 15.965-1.18 18.922-8.861z"></path>
  <path fill="#3E7BFA" d="M369.094 317.156c-18.333.296-34.889 3.544-49.971 8.271-2.661.887-5.618 1.769-8.279 2.954-15.08 5.609-28.387 12.697-39.327 20.672-5.914 4.138-11.236 8.567-15.967 12.407l-.296.295c-4.731 4.432-9.166 8.567-13.01 12.7-15.968 17.129-23.951 32.784-29.273 43.12-2.365 5.318-4.139 9.158-5.027 12.112l-1.478 4.135c-7.984 21.856-11.532 45.188-10.645 68.522.296 9.155 1.478 18.016 3.253 26.877v.295c5.618 27.175 17.446 52.868 34.596 74.723 5.914 7.385 12.419 14.473 19.516 20.973 17.15 15.651 37.257 28.058 59.138 36.032s45.242 11.517 68.599 10.63c8.576-.295 17.152-1.475 25.728-2.95 27.497-5.318 53.815-17.133 75.991-34.557 7.69-5.907 14.489-12.407 20.996-19.495 15.671-17.129 28.09-37.213 36.073-59.068 0 0 .592-1.478 1.478-4.138.886-2.656 2.071-6.79 3.843-12.404 2.663-11.222 6.505-28.649 5.325-51.686 0-2.953-.298-5.907-.592-8.861-.298-4.135-.889-7.975-1.478-11.815-2.957-18.016-9.168-38.099-20.701-58.774-1.478-2.362-2.957-5.02-4.436-7.382a176.289 176.289 0 0 0-33.411-38.989c-15.376-13.289-34.006-25.104-55.885-33.079a453726.096 453726.096 0 0 1-15.082 41.644l-15.079 41.644c45.83 16.835 69.782 67.635 52.928 113.709-13.011 36.035-47.312 58.186-83.386 58.186a88.971 88.971 0 0 1-30.16-5.315c-45.833-16.835-69.784-67.639-52.929-113.712 16.855-45.779 67.713-69.703 113.841-52.868l15.079-41.644 15.082-41.644c-20.403-7.385-41.101-10.633-60.32-10.633-2.071-.886-3.549-.886-4.733-.886z"></path>
  <path fill="#3E7BFA" d="m402.8 411.031 30.457-83.29-114.728-41.643-156.716-184.89c-7.392-8.565-21.29-6.202-25.134 4.43L32.892 390.948c-3.844 10.634 5.322 21.562 16.263 19.495l239.214-41.056L402.8 411.031z"></path>
`;

function getHtml(size) {
  return `<!DOCTYPE html>
<html>
<head>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: ${size}px;
      height: ${size}px;
      background: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .icon-container {
      width: 60%;
      height: 60%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    svg {
      width: 100%;
      height: 100%;
      overflow: visible;
    }
  </style>
</head>
<body>
  <div class="icon-container">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 768 768">
      ${svgPaths}
    </svg>
  </div>
</body>
</html>`;
}

async function generate() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const targets = [
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'Sheypoor-192.png', size: 192 },
    { name: 'Sheypoor-512.png', size: 512 },
    { name: 'sheypoor-Logo.png', size: 512 }
  ];

  for (const target of targets) {
    const page = await browser.newPage();
    await page.setViewport({ width: target.size, height: target.size, deviceScaleFactor: 2 });
    await page.setContent(getHtml(target.size));
    const outputPath = path.join(publicDir, target.name);
    await page.screenshot({ path: outputPath, type: 'png', omitBackground: false });
    console.log(`Generated ${target.name} (${target.size}x${target.size})`);
    await page.close();
  }

  await browser.close();
  console.log('All icons generated successfully with generous padding and center alignment!');
}

generate().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
