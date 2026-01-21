import { When, Given, Then } from "@cucumber/cucumber";
import { pageFixture } from "./hooks/browserContextFixture";
import { CucumberWorld } from "./world/CucumberWorld";
import { time } from "console";
import { expect } from "@playwright/test";

Given('user navigate to the Luxehouze home page', async function (this: CucumberWorld) {
    if (!process.env.BASE_URL) {
    throw new Error("BASE_URL is not defined. Please check environment file.");
  }

  const baseUrl = process.env.BASE_URL.replace(/\/$/, "");

  await this.basePage.page.goto(`${baseUrl}?noredirect=true`, {
    waitUntil: "domcontentloaded", timeout: 15000,
  });
  console.log('DEBUG URL =', this.basePage.page.url());
})


When('user click the third banner', async function (this: CucumberWorld) {
    await this.basePage.zoomOut();
    await this.homePage.clickThirdBanner();
})

Then('user should see UTM parameters in the URL', async function (this: CucumberWorld) {
    console.time('switchToNewTab');
  console.timeEnd('switchToNewTab');

  console.time('verifyUTM');
  await this.homePage.verifyUTMParametersInURL();
  console.timeEnd('verifyUTM');

  console.log('Final URL:', this.homePage.page.url());
})

When('user enter {string} in search bar', async function (this: CucumberWorld, keyword: string) {
    await pageFixture.page.waitForLoadState('domcontentloaded'); 
    await pageFixture.page.waitForTimeout(4000);
    await this.basePage.closeNewsletterPopupIfVisible();
    await this.basePage.page.waitForTimeout(2000);
    // await this.basePage.closeCSATPopupIfVisible();
    await this.basePage.page.waitForSelector('div[role="presentation"]', { state: 'detached', timeout: 2000 }).catch(() => {});
    await this.homePage.enterSearchQuery("Rolex");
})

Then('user should verify search result contain {string}', async function (this: CucumberWorld, keyword: string) {
    // await this.basePage.closeNewsletterPopupIfVisible();
    await pageFixture.page.waitForLoadState('domcontentloaded'); 
    await this.homePage.verifySearchResult(keyword);
})

When('user click {string}', async function (this: CucumberWorld, buttonName: string) {
    await pageFixture.page.waitForLoadState('domcontentloaded'); 
    await pageFixture.page.waitForTimeout(4000);
    await this.basePage.closeNewsletterPopupIfVisible();
    // await this.basePage.closeCSATPopupIfVisible();
    if (buttonName === 'buy-a-watch') {
        await this.homePage.clickBuyAWatch();
        return;
    } else {
        await this.homePage.clickSellAWatch();
        return;
    }
    throw new Error(`Unknown buttonName: ${buttonName}`);
})

Then('user should be redirected to {string}', async function (this: CucumberWorld, expectedPage: string) {
    await pageFixture.page.waitForLoadState('domcontentloaded'); 
    await pageFixture.page.waitForTimeout(4000);
    if (expectedPage === 'all-watches') {
        await this.homePage.verifyAllWatchesPage();
    } else {
        await this.homePage.verifySellWithUsPage();
    }
})
