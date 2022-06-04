const cheerio = require('cheerio');
const puppeteer = require('puppeteer-extra');

(async() => {
    const video = "https://www.youtube.com/watch?v=jNQXAC9IVRw"
    const browser = await puppeteer.launch(
        { headless: true, executablePath: process.env.CHROME_BIN || null, args: [
            '--no-sandbox', '--disable-setuid-sandbox',
        ], ignoreHTTPSErrors: true, dumpio: false}
    );

    const page = await browser.newPage();
    await page.setJavaScriptEnabled(true);
    await page.setDefaultNavigationTimeout(0);
    await page.goto(video, { waitUntil: 'networkidle0' });
    const html = await page.content();

    const $ = cheerio.load(html);

    $('.style-scope ytd-transcript-segment-list-renderer').each((i, row) => {
        console.log(i, $(row).find('yt-formatted-string').text());
    });

    await browser.close();
})();