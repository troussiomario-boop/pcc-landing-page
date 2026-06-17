#!/usr/bin/env node

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const OUTPUT_PATH = path.join(__dirname, '../assets/og-image.jpg');

const HTML_TEMPLATE = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      width: 1200px;
      height: 630px;
      font-family: 'Inter', sans-serif;
      background: linear-gradient(135deg, #0A1628 0%, #142944 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
    }

    body::before {
      content: '';
      position: absolute;
      width: 800px;
      height: 800px;
      background: radial-gradient(circle, rgba(0, 194, 255, 0.15) 0%, transparent 70%);
      bottom: -200px;
      right: -200px;
      pointer-events: none;
    }

    .container {
      position: relative;
      z-index: 1;
      text-align: center;
      padding: 80px 60px;
      max-width: 1000px;
    }

    .logo {
      width: 80px;
      height: auto;
      margin-bottom: 40px;
      opacity: 0.9;
    }

    .headline {
      font-size: 56px;
      font-weight: 800;
      color: #FFFFFF;
      line-height: 1.1;
      letter-spacing: -0.02em;
      margin-bottom: 20px;
    }

    .subheadline {
      font-size: 24px;
      font-weight: 500;
      color: #00C2FF;
      margin-bottom: 40px;
    }

    .caption {
      font-size: 18px;
      font-weight: 500;
      color: #94A3B8;
    }
  </style>
</head>
<body>
  <div class="container">
    <img class="logo" src="data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 220 96%27%3E%3Crect x=%272%27 y=%272%27 width=%2792%27 height=%2792%27 rx=%2722%27 fill=%27%230E1E36%27 stroke=%27%2300C2FF%27 stroke-width=%272%27/%3E%3Cpolyline points=%2722,70 42,50 56,62 76,30 88,42%27 fill=%27none%27 stroke=%27%2300C2FF%27 stroke-width=%275%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27/%3E%3Ccircle cx=%2722%27 cy=%2770%27 r=%275%27 fill=%27%2300C2FF%27/%3E%3Ccircle cx=%2756%27 cy=%2762%27 r=%275%27 fill=%27%2300C2FF%27/%3E%3Ccircle cx=%2788%27 cy=%2742%27 r=%275%27 fill=%27%2300C896%27/%3E%3Cline x1=%2776%27 y1=%2730%27 x2=%2776%27 y2=%2716%27 stroke=%27%2300C2FF%27 stroke-width=%272.5%27 opacity=%270.6%27/%3E%3Ccircle cx=%2776%27 cy=%2716%27 r=%273%27 fill=%27%2300C2FF%27 opacity=%270.8%27/%3E%3Ctext x=%27112%27 y=%2762%27 font-family=%27Inter%27 font-size=%2746%27 font-weight=%27600%27 letter-spacing=%273%27 fill=%27%23FFFFFF%27%3EPCC%3C/text%3E%3C/svg%3E">

    <h1 class="headline">Le robot de trading 100% gratuit utilisé par 870+ Français</h1>

    <p class="subheadline">10 min pour démarrer · Aucune compétence requise</p>

    <p class="caption">@playcomedyclub · 50K+ vues sur TikTok</p>
  </div>
</body>
</html>
`;

async function generateOGImage() {
  console.log('Generating OG image...');

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 630 });
    await page.setContent(HTML_TEMPLATE, { waitUntil: 'networkidle0' });

    // Wait for fonts to load
    await page.evaluateHandle(() => document.fonts.ready);

    const screenshotBuffer = await page.screenshot({
      type: 'jpeg',
      quality: 85,
    });

    fs.writeFileSync(OUTPUT_PATH, screenshotBuffer);
    console.log(`✅ OG image generated: ${OUTPUT_PATH}`);
  } catch (error) {
    console.error('❌ Error generating OG image:', error);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

generateOGImage();
