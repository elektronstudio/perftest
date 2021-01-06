const { Cluster } = require("puppeteer-cluster");

const siteUrl = "https://elektron.live/perftest";
const count = 5;
const delay = 1000 * 30;

(async () => {
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: count,
    monitor: true,
    puppeteerOptions: {
      headless: false,
      args: [
        "--use-fake-ui-for-media-stream",
        "--use-fake-device-for-media-stream",
        "--use-file-for-fake-video-capture=./test_audience.y4m",
      ],
    },
  });

  await cluster.task(async ({ page, data: url, worker }) => {
    await page.goto(url, { waitUntil: "networkidle0" });
    await page.setViewport({ width: 1600, height: 1200 });
    const [button] = await page.$x("//button[contains(., 'Start camera')]");
    if (button) {
      await button.click();
    }
    await new Promise((t) => setTimeout(t, delay));
    await page.screenshot({
      path: `./screenshots/screenshot-${worker.id}.jpg`,
    });
  });

  Array.from({ length: count }).forEach(() => cluster.queue(siteUrl));

  //cluster.queue(siteUrl);

  await cluster.idle();
  await cluster.close();
})();
