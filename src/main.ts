import _ from 'lodash';
import { load as cheerio } from 'cheerio';
import * as puppeteer from 'puppeteer';

async function transcription(): Promise<void> {
  console.time('get-data');

  const id: string[] = process.argv.slice(2);
  const browser: puppeteer.Browser = await puppeteer.launch({ headless: true });
  const page: puppeteer.Page = await browser.newPage();

  await page.goto(`https://www.youtube.com/watch?v=${id}`, {
    waitUntil: 'networkidle0',
  });

  const awaitOnButtonMoreActions: puppeteer.ElementHandle<Element>[] =
    await page.$$('button[aria-label="More actions"]');

  for (const buttonMoreActions of awaitOnButtonMoreActions) {
    await buttonMoreActions.evaluate((i: HTMLElement) => {
      i.click();
    });
  }

  const items: puppeteer.ElementHandle<Element>[] = await page.$$(
    '#items > ytd-menu-service-item-renderer > tp-yt-paper-item',
  );

  for (const item of items) {
    await item.evaluate((i: HTMLElement) => {
      i.click();
    });
  }

  await page.waitForSelector(
    '#segments-container > ytd-transcript-segment-renderer',
  );

  const $ = cheerio(await page.content());

  $('.style-scope ytd-transcript-segment-renderer > div').each(
    (index, element) => {
      console.log(
        index,
        _.trim($(element).find('.segment-timestamp').text()),
        _.trim($(element).find('.segment-text').text()),
      );
    },
  );

  await browser.close();

  console.timeEnd('get-data');
}

transcription();
