const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const fs = require('fs');

(async() => {
    const video = "https://www.youtube.com/watch?v=jNQXAC9IVRw"
    const browser = await puppeteer.launch(
        { headless: false, executablePath: process.env.CHROME_BIN || null, args: [
            '--no-sandbox', '--disable-setuid-sandbox',
        ], ignoreHTTPSErrors: true, dumpio: false}
    );

    const page = await browser.newPage();
    await page.setJavaScriptEnabled(true);
    await page.setDefaultNavigationTimeout(0);
    await page.goto(video, { waitUntil: 'networkidle0' });

    await page.waitForSelector('body > ytd-app:nth-child(9) > div#content.style-scope.ytd-app:nth-child(10) > ytd-page-manager#page-manager.style-scope.ytd-app:nth-child(4) > ytd-watch-flexy.style-scope.ytd-page-manager.hide-skeleton > div#columns.style-scope.ytd-watch-flexy:nth-child(8) > div#primary.style-scope.ytd-watch-flexy:nth-child(1) > div#primary-inner.style-scope.ytd-watch-flexy > div.watch-active-metadata.style-scope.ytd-watch-flexy:nth-child(7) > div#info.style-scope.ytd-watch-flexy:nth-child(1) > div#info-contents.style-scope.ytd-watch-flexy:nth-child(2) > ytd-video-primary-info-renderer.style-scope.ytd-watch-flexy > div#container.style-scope.ytd-video-primary-info-renderer > div#info.style-scope.ytd-video-primary-info-renderer:nth-child(6) > div#menu-container.style-scope.ytd-video-primary-info-renderer:nth-child(3) > div#menu.style-scope.ytd-video-primary-info-renderer:nth-child(1) > ytd-menu-renderer.style-scope.ytd-video-primary-info-renderer > yt-icon-button#button.dropdown-trigger.style-scope.ytd-menu-renderer:nth-child(3) > button#button.style-scope.yt-icon-button:nth-child(1)', {
    visible: true,
    });

    await page.click('body > ytd-app:nth-child(9) > div#content.style-scope.ytd-app:nth-child(10) > ytd-page-manager#page-manager.style-scope.ytd-app:nth-child(4) > ytd-watch-flexy.style-scope.ytd-page-manager.hide-skeleton > div#columns.style-scope.ytd-watch-flexy:nth-child(8) > div#primary.style-scope.ytd-watch-flexy:nth-child(1) > div#primary-inner.style-scope.ytd-watch-flexy > div.watch-active-metadata.style-scope.ytd-watch-flexy:nth-child(7) > div#info.style-scope.ytd-watch-flexy:nth-child(1) > div#info-contents.style-scope.ytd-watch-flexy:nth-child(2) > ytd-video-primary-info-renderer.style-scope.ytd-watch-flexy > div#container.style-scope.ytd-video-primary-info-renderer > div#info.style-scope.ytd-video-primary-info-renderer:nth-child(6) > div#menu-container.style-scope.ytd-video-primary-info-renderer:nth-child(3) > div#menu.style-scope.ytd-video-primary-info-renderer:nth-child(1) > ytd-menu-renderer.style-scope.ytd-video-primary-info-renderer > yt-icon-button#button.dropdown-trigger.style-scope.ytd-menu-renderer:nth-child(3) > button#button.style-scope.yt-icon-button:nth-child(1)');

    const html = await page.content();

    fs.writeFile('result.html', html, function () {
        console.log(null);
    });

    const $ = cheerio.load(html);

    // $('.style-scope ytd-transcript-segment-list-renderer').each((i, row) => {
    //     console.log(i, $(row).find('yt-formatted-string').text());
    // });

    await browser.close();
})();