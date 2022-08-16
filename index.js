const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const lodash = require('lodash');
const fs = require('fs');
const video = "https://www.youtube.com/watch?v=thYZEWVv3mE";

(async() => {
    console.time('get-data');
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto(video, { waitUntil: 'networkidle0' });

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

    const html = await page.content();

    const $ = cheerio.load(html);

    $('.style-scope ytd-transcript-segment-renderer > div').each((i, row) => {
        console.log(i);
        console.log(lodash.trim($(row).find('.segment-timestamp').text()));
        console.log(lodash.trim($(row).find('.segment-text').text()));
    });

    await browser.close();

    console.timeEnd('get-data');
})();