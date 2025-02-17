const fs = require('fs').promises;
const playwright = require('playwright');

(async () => {
    
    // Read and parse JSON data
    const jsonString = await fs.readFile('../../../../../scrape-and-ag/urls.json', 'utf8');
    const data = JSON.parse(jsonString);
        
    // SCREENSHOT CODE
    async function screenShot(pageUrl, screenshotPath) {
        const browser = await playwright.chromium.launch({ headless: false });
        const context = await browser.newContext();
        const page = await context.newPage();

        await page.goto(pageUrl);

        await page.evaluate(() => {
            document.body.style.transform = 'scale(1)'; // Zoom reset
            document.body.style.transformOrigin = 'top left';
            document.body.style.width = '100%';
        });

        // Take a full-page screenshot
        await page.screenshot({ path: screenshotPath, fullPage: true });
        await browser.close();
    }

    // Taking screenshots of different pages
    await screenShot(data.gloves.left.women["tgw.com"], data.gloves.left.women["tgw.com"] + ".png");
    await screenShot(data.gloves.left.women["rockbottomgolf.com"], data.gloves.left.women["rockbottomgolf.com"] + ".png");
    await screenShot(data.gloves.left.women["pgatoursuperstore.com"], data.gloves.left.women["pgatoursuperstore.com"] + ".png");
    await screenShot(data.gloves.left.women["golfdiscount.com"], data.gloves.left.women["golfdiscount.com"] + ".png");
    await screenShot(data.gloves.left.women["dickssportinggoods.com"], data.gloves.left.women["dickssportinggoods.com"] + ".png");

})();
