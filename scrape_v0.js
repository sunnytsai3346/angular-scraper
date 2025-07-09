const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true, // set to false to see the browser
    defaultViewport: null,
  });

  const page = await browser.newPage();

  // ✅ Change this to the actual local route you want to scrape
  const targetUrl = 'http://localhost:4200/';

  console.log(`Navigating to: ${targetUrl}`);
  await page.goto(targetUrl, { waitUntil: 'networkidle2' });

  
  
  // Wait manually if needed
  await new Promise(resolve => setTimeout(resolve, 3000)); // ⏳ wait 3 seconds

  // ✅ Change this logic to extract real content
  const data = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('body *'))
      .map(el => el.innerText.trim())
      .filter(text => text.length > 0 && text.length < 200); // exclude long junk
  });

  console.log('Extracted Text:');
  console.log(data);

  await browser.close();
})();
