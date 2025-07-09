const fs = require('fs');
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: true, // set to false to see the browser
    defaultViewport: null,
  });

  const page = await browser.newPage();

  const routesToScrape = [
    '/#/status',  // Status Page
    '/#/status/AllAlarms',
    '/#/status/Versions',
    '/#/status/Fans',
    '/#/status/Temperatures',
    '/#/status/System',
    '/#/status/Lamp',
    '/#/status/Lens',
    '/#/status/Network',
    '/#/status/Interlocks',
    '/#/status/Serial',
    '/#/status/Video',
    '/#/status/Playback',
    '/#/status/Scheduler',
    '/#/status/Automation',
    '/#/status/ChristieNAS',
    '/#/status/Debugging',
    '/#/menu/MMM%2BABOT',  // About Page
    '/#/menu/MMM%2BSERV/MMM%2BPREF/General',
    '/#/menu/MMM%2BSERV/MMM%2BPREF/HDR',
    '/#/menu/MMM%2BSERV/MMM%2BPREF/Alarm%20Triggers',
    '/#/menu/MMM%2BSERV/MMM%2BPREF/Service%20Mode',
    '/#/menu/MMM%2BSERV/MMM%2BPREF/Lens%20ILS',
    '/#/menu/MMM%2BSERV/MMM%2BPREF/Automation',
    '/#/menu/MMM%2BSERV/MMM%2BPREF/IMB',
    '/#/menu/MMM%2BSERV/MMM%2BPREF/3D%20Configuration',
    '/#/menu/MMM%2BSERV/MMM%2BPREF/Test%20Patterns',
    '/#/menu/MMM%2BSERV/MMM%2BPREF/EDID%20File%20Import',
    '/#/menu/MMM%2BAUTO/MMM%2BMCRE',    
    '/#/menu/MMM%2BAUTO/MMM%2BDIPT/PLTR',
    '/#/menu/MMM%2BAUTO/MMM%2BAUDD',
    '/#/menu/MMM%2BAUTO/MMM%2BDLIB',
    '/#/menu/MMM%2BCHAN',
    '/#/menu/MMM%2BIMGS/MMM%2BILSF',
    '/#/dashboard', //dashboard
    
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
      return Array.from(document.querySelectorAll('body *' || 'body #info-display' || 'body #copyright-text'))
        .map(el => el.innerText.trim())
        .filter(text => text.length > 0 );
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
