const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const lodash = require('lodash');
const fs = require('fs');
const video = "https://www.youtube.com/watch?v=PWkNNqBF30w";
const channel = "https://www.youtube.com/feeds/videos.xml?channel_id=UC3uYvpJ3J6oNoNYRXfZXjEw";
const { exec } = require("child_process");
const htmlparser2 = require("htmlparser2");

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

    exec("ls -la", (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });

    // const feed = htmlparser2.parseFeed(content, options);
})();