const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const lodash = require('lodash');

(async() => {
    console.time('get-data');

    let id = process.argv.slice(2);


    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(
        `https://www.youtube.com/watch?v=${id}`,
        { waitUntil: 'networkidle0' }
    );

    const awaitOnButtonMoreActions = await page.$$('button[aria-label="More actions"]');

    for (const buttonMoreActions of awaitOnButtonMoreActions) {
        await buttonMoreActions.evaluate(
            button => button.click()
        );
    }

    const items = await page.$$('#items > ytd-menu-service-item-renderer > tp-yt-paper-item')

    for (const item of items) {
        await item.evaluate(
            i => i.click()
        );
    }

    await page.waitForSelector('#segments-container > ytd-transcript-segment-renderer')

    const $ = cheerio.load(
        await page.content()
    );

    $('.style-scope ytd-transcript-segment-renderer > div').each((i, row) => {
        console.log(
            lodash.trim(i),
            lodash.trim($(row).find('.segment-timestamp').text()),
            lodash.trim($(row).find('.segment-text').text())
        );
    });

    await browser.close();

    console.timeEnd('get-data');
})();