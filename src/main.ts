import puppeteer from 'puppeteer';

async function transcription() {
  console.time('get-data');

  const [videoId] = process.argv.slice(2);

  if (!videoId) {
    throw new Error('Usage: npm start -- <YouTube video ID>');
  }

  const browser = await puppeteer.launch({
    headless: false,
  });

  try {
    const page = await browser.newPage();

    await page.goto(`https://www.youtube.com/watch?v=${videoId}`, {
      waitUntil: 'networkidle0',
    });

    await page.$$eval('tp-yt-paper-button#expand', (buttons) => {
      buttons.forEach((button) => (button as HTMLElement).click());
    });

    await page.$$eval(
      '.ytd-video-description-transcript-section-renderer',
      (items) => {
        items.forEach((item) => (item as HTMLElement).click());
      },
    );

    await page.waitForSelector(
      '#segments-container > ytd-transcript-segment-renderer',
    );

    const segments = await page.$$eval(
      'ytd-transcript-segment-renderer',
      (elements) =>
        elements.map((element) => ({
          timestamp:
            element.querySelector('.segment-timestamp')?.textContent?.trim() ??
            '',
          text:
            element.querySelector('.segment-text')?.textContent?.trim() ?? '',
        })),
    );

    segments.forEach(({ timestamp, text }, index) => {
      console.log(index, timestamp, text);
    });
  } finally {
    await browser.close();
    console.timeEnd('get-data');
  }
}

await transcription();
