import { __awaiter } from "tslib";
import * as puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import _ from 'lodash';
function transcription() {
    return __awaiter(this, void 0, void 0, function* () {
        console.time('get-data');
        const id = process.argv.slice(2);
        const browser = yield puppeteer.launch({ headless: true });
        const page = yield browser.newPage();
        yield page.goto(`https://www.youtube.com/watch?v=${id}`, { waitUntil: 'networkidle0' });
        const awaitOnButtonMoreActions = yield page.$$('button[aria-label="More actions"]');
        for (const buttonMoreActions of awaitOnButtonMoreActions) {
            yield buttonMoreActions.evaluate((i) => {
                i.click();
            });
        }
        const items = yield page.$$('#items > ytd-menu-service-item-renderer > tp-yt-paper-item');
        for (const item of items) {
            yield item.evaluate((i) => {
                i.click();
            });
        }
        yield page.waitForSelector('#segments-container > ytd-transcript-segment-renderer');
        const $ = cheerio.load(yield page.content());
        $('.style-scope ytd-transcript-segment-renderer > div').each((i, row) => {
            console.log(i, _.trim($(row).find('.segment-timestamp').text()), _.trim($(row).find('.segment-text').text()));
        });
        yield browser.close();
        console.timeEnd('get-data');
    });
}
transcription();
//# sourceMappingURL=main.js.map