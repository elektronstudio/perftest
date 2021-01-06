const { Cluster } = require("puppeteer-cluster");

const waitFor = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const siteUrl = "https://elektron.live/perftest";
//const siteUrl = "http://127.0.0.1:5501/perftest";

const count = 5;

(async () => {
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: count,
    monitor: true,
    puppeteerOptions: {
      // headless: false,
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
    await waitFor(5000);
    await page.screenshot({
      path: `./screenshots/screenshot-${worker.id}.jpg`,
    });
    await waitFor(1000);
    await page.close({ runBeforeUnload: true });
  });

  Array.from({ length: count }).forEach(() => cluster.queue(siteUrl));

  await cluster.idle();
  await cluster.close();
})();
