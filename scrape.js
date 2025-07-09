const fs = require('fs');
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true, // set to false to see the browser
    defaultViewport: null,
  });

  const page = await browser.newPage();

  const routesToScrape = [
    '/#/menu/MMM%2BSTAT',  // Status Page
    '/#/menu/MMM%2BABOT',  // About Page
    // Add more if needed
  ];

  const baseUrl = 'http://localhost:4200';
  const allResults = [];


  for (const route of routesToScrape) {
    const fullUrl = `${baseUrl}${route}`;
    console.log(`Navigating to: ${fullUrl}`);
    await page.goto(fullUrl, { waitUntil: 'networkidle2', timeout: 60000 });

    // Optional wait for Angular content to render
    await new Promise(resolve => setTimeout(resolve, 2000));

    const content = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('body *'))
        .map(el => el.innerText.trim())
        .filter(text => text.length > 0 && text.length < 200);
    });

    allResults.push({
      route: route,
      texts: content
    });

    console.log(`Extracted from ${route}:`, content);
  }

  await browser.close();

  // Write to output.json
  fs.writeFileSync('output.json', JSON.stringify(allResults, null, 2), 'utf-8');
  console.log('✅ Saved to output.json');
  
})();
