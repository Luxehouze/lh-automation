import { After, AfterAll, Before, BeforeAll, Status, World } from "@cucumber/cucumber";
import { Browser, BrowserType,  firefox, webkit } from "playwright";
import { pageFixture } from "./browserContextFixture";
import { config as loadEnv } from "dotenv"
import path from "path";
import { BasePage } from "../../page-objects/base/BasePage";
import { PageManager } from "../../page-objects/base/PageManager";

// const env = loadEnv({ path: './env/.env', override: true});
const ENV_NAME = process.env.NODE_ENV || "production";

loadEnv({
  path: path.join(process.cwd(), `../../env/.env.${ENV_NAME}`),
  override: true,
});
//Create a configuration object for easy access to env variables
const config = {
    headless: process.env.HEADLESS === 'true',
    browser: process.env.UI_AUTOMATION_BROWSER || 'firefox',
    width: parseInt(process.env.BROWSER_WIDTH || '1920'),
    height: parseInt(process.env.BROWSER_HEIGHT || '1080'),
}

//Create dictionary mapping browser names to their launch functions
const browsers: { [key: string]: BrowserType } = {
    'firefox': firefox,
    'webkit': webkit
};

let browserInstance: Browser | null = null;

async function initializeBrowserContext(selectedBrowser: string): Promise<Browser> {
    const launchBrowser = browsers[selectedBrowser];
    if(!launchBrowser) {
        throw new Error(`Invalid browser selected: ${selectedBrowser}`);
    }

    return await launchBrowser.launch({ headless: config.headless});
}

async function initializePage(): Promise<void> {
    if(!browserInstance) {
        throw new Error('Browser instance is null');
    }
    pageFixture.context = await browserInstance.newContext({
        ignoreHTTPSErrors: true
    });
    pageFixture.page = await pageFixture.context.newPage();
    await pageFixture.page.setViewportSize({width: 1920,height: 1080});
}

//BeforeAll hook: Runs once before all scenarios
BeforeAll(async function(){
    console.log("\nExecuting test suite...");
})

//AfterAll hook: Runs once after all scenarios
AfterAll(async function(){
    console.log("\nFinished execution of test suite!");
})
const browserType = process.env.UI_AUTOMATION_BROWSER?.trim().toLowerCase() || 'firefox';
// Before hook: Runs before each scenario
Before(async function () {
    try {
        browserInstance = await initializeBrowserContext(config.browser);
        // const browsers = await initializeBrowserContext([config.browser]);
        // browserInstance = browsers[0];
        console.log(`Browser context initialized for: ${config.browser}`);
        await initializePage();
        await this.basePage.zoomOut();

        // this.pageManager = new PageManager();
        // this.basePage = this.pageManager.createBasePage();
        // this.homePage = this.pageManager.createHomePage();
        // this.watchPage = this.pageManager.createWatchPage();
        // this.beautyPage = this.pageManager.createBeautyPage();
        // this.fashionPage = this.pageManager.createFashionPage();

    } catch (error) {
        console.error('Browser context initialization failed:', error);
    }
})

// After hook: Runs after each scenario
After(async function({pickle, result}) {
    if(result?.status === Status.FAILED){
        if(pageFixture.page) {
            // 🔥 1. FORCE scroll ke TOP page (agar screenshot tidak dibawah)
        await pageFixture.page.evaluate(() => {
            window.scrollTo(0, 0);
        });

        // 🔥 2. Kasih sedikit delay biar render stabil
        await pageFixture.page.waitForTimeout(300);
            const screenshotPath = `./reports/screenshots/${pickle.name}-${Date.now()}.png`;
            const image = await pageFixture.page.screenshot({ 
                path: screenshotPath, 
                type: 'png',
                // timeout: 60000,
                });
                await this.attach(image, 'image/png');
        } else {
            console.log("pageFixture.page is undefined. Cannot capture screenshot.");
        }
    }
    try { await pageFixture.page.close(); } catch {}
    try { 
        if (browserInstance) {
            await pageFixture.page?.close();
            await browserInstance.close();
        }
    } catch {}
})