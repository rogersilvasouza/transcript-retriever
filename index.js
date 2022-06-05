const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const fs = require('fs');

(async() => {
    const video = "https://www.youtube.com/watch?v=jNQXAC9IVRw"
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto(video, { waitUntil: 'networkidle0' });

    // await page.click('aria-label="More actions"');
    // const buttons = await page.$$('button[class*="--slot-available"]')
    const buttons = await page.$$('button[aria-label="More actions"]')
    // const buttons = await page.$$('button')

    for (const button of buttons) {
        // console.dir(button)
        // await button.click();
        await button.evaluate(b => b.click());

    }

    const html = await page.content();

    fs.writeFile('result.html', html, function () {
        console.log(null);
    });

    const $ = cheerio.load(html);

    // $('.style-scope ytd-transcript-segment-list-renderer').each((i, row) => {
    //     console.log(i, $(row).find('yt-formatted-string').text());
    // });

    // await browser.close();
})();