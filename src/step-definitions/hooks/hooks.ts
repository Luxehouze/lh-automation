import { After, Before, Status, World } from "@cucumber/cucumber";
import { Browser, BrowserContext, BrowserType, Page, chromium, firefox, webkit } from "playwright";
import { pageFixture } from "./browserContextFixture";
import { config as loadEnv } from "dotenv"
import path from "path";
import { BasePage } from "../../page-objects/base/BasePage";
import { PageManager } from "../../page-objects/base/PageManager";
import dotenv from "dotenv";
import "../../config/load-env";

// const env = loadEnv({ path: './env/.env', override: true});
const ENV_NAME = process.env.NODE_ENV || "production";

// loadEnv({
//   path: path.join(process.cwd(), `../../env/.env.${ENV_NAME}`),
//   override: true,
// });
dotenv.config({ path: path.resolve(__dirname, "../../env/.env." + ENV_NAME), });
//Create a configuration object for easy access to env variables
const config = {
    headless: process.env.HEADLESS === 'true',
    browser: process.env.UI_AUTOMATION_BROWSER || 'firefox',
    width: parseInt(process.env.BROWSER_WIDTH || '1920'),
    height: parseInt(process.env.BROWSER_HEIGHT || '1080'),
}

Before(async function () {
  const browserName = process.env.UI_AUTOMATION_BROWSER || 'firefox';
  const headless = process.env.HEADLESS === 'true';

  let browser: Browser;

  if (browserName === 'chromium') {
    browser = await chromium.launch({ headless });
  } else if (browserName === 'webkit') {
    browser = await webkit.launch({ headless });
  } else {
    browser = await firefox.launch({ headless });
  }

  const context: BrowserContext = await browser.newContext({ viewport: { width: config.width, height: config.height }, ignoreHTTPSErrors: true, extraHTTPHeaders: { "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7", }, });

  const page: Page = await context.newPage();

  // simpan ke world (AMAN PER WORKER)
  this.browser = browser;
  this.context = context;
  this.page = page;

  pageFixture.context = context;
  pageFixture.page = page; // kalau masih dipakai Page Object
});


// After hook: Runs after each scenario
After(async function ({ pickle, result }) {
  if (result?.status === Status.FAILED && this.page) {
    try {
      // 🔝 Scroll ke atas biar screenshot rapi
      await this.page.evaluate(() => window.scrollTo(0, 0));
      await this.page.waitForTimeout(300);

      const screenshotPath = `./reports/screenshots/${pickle.name}-${Date.now()}.png`;
      const image = await this.page.screenshot({
        path: screenshotPath,
        type: 'png',
      });

      await this.attach(image, 'image/png');
    } catch (e) {
      console.error('Failed to capture screenshot:', e);
    }
  }

  // 🔥 Tutup resource PER SCENARIO (AMAN)
  try { await this.page?.close(); } catch {}
  try { await this.context?.close(); } catch {}
  try { await this.browser?.close(); } catch {}

  pageFixture.page = undefined as any;
  pageFixture.context = undefined as any;
});
