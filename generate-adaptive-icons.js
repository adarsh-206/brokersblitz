const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const outputDir = path.join(__dirname, "assets", "images");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 1. Standard Square Icon (for iOS / web / fallback) - 1024x1024
const fullIconSvg = `
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#6366F1" />
      <stop offset="100%" stop-color="#4338CA" />
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#000000" flood-opacity="0.3" />
    </filter>
  </defs>

  <rect width="1024" height="1024" rx="220" fill="url(#bgGrad)" />
  <path d="M570 200L350 530H510L440 824L674 484H510L570 200Z" fill="#FFFFFF" filter="url(#shadow)" />
</svg>
`;

// 2. Android Adaptive Foreground (432x432 transparent canvas with centered logo in safe zone)
const foregroundSvg = `
<svg width="432" height="432" viewBox="0 0 432 432" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="fgShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#000000" flood-opacity="0.25" />
    </filter>
  </defs>
  <path d="M238 90L150 220H214L186 342L282 202H214L238 90Z" fill="#FFFFFF" filter="url(#fgShadow)" />
</svg>
`;

// 3. Android Adaptive Background (432x432 solid brand purple)
const backgroundSvg = `
<svg width="432" height="432" viewBox="0 0 432 432" xmlns="http://www.w3.org/2000/svg">
  <rect width="432" height="432" fill="#5D45F9" />
</svg>
`;

// 4. Android Monochrome Icon (for Android 13+ Material You themed icons)
const monochromeSvg = `
<svg width="432" height="432" viewBox="0 0 432 432" xmlns="http://www.w3.org/2000/svg">
  <path d="M238 90L150 220H214L186 342L282 202H214L238 90Z" fill="#000000" />
</svg>
`;

async function run() {
  await sharp(Buffer.from(fullIconSvg))
    .resize(1024, 1024)
    .png()
    .toFile(path.join(outputDir, "icon.png"));

  await sharp(Buffer.from(fullIconSvg))
    .resize(192, 192)
    .png()
    .toFile(path.join(outputDir, "favicon.png"));

  await sharp(Buffer.from(foregroundSvg))
    .resize(432, 432)
    .png()
    .toFile(path.join(outputDir, "android-icon-foreground.png"));

  await sharp(Buffer.from(backgroundSvg))
    .resize(432, 432)
    .png()
    .toFile(path.join(outputDir, "android-icon-background.png"));

  await sharp(Buffer.from(monochromeSvg))
    .resize(432, 432)
    .png()
    .toFile(path.join(outputDir, "android-icon-monochrome.png"));

  console.log("Adaptive icons generated successfully in assets/images/");
}

run().catch(console.error);
