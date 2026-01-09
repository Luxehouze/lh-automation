import { When, Given, Then } from "@cucumber/cucumber";
import { pageFixture } from "./hooks/browserContextFixture";
import { CucumberWorld } from "./world/CucumberWorld";
import { time } from "console";
import { expect } from "@playwright/test";

Given('user navigate to the Luxehouze watch page', async function (this: CucumberWorld) {
    if (!process.env.BASE_URL) {
    throw new Error("BASE_URL is not defined. Please check environment file.");
  }

  const baseUrl = process.env.BASE_URL.replace(/\/$/, "");

  await this.basePage.page.goto(`${baseUrl}/watch?noredirect=true`, {
    waitUntil: "domcontentloaded", timeout: 15000,
  });
  console.log('DEBUG URL =', this.basePage.page.url());
})

When('user click patek phillippe in watch page', async function (this: CucumberWorld) {
    await this.basePage.zoomOut();
    await pageFixture.page.waitForTimeout(3000);
    await this.basePage.closeNewsletterPopupIfVisible();
    await this.watchPage.clickPatekPhillippe();
})

When('user select the first suggestion', async function (this: CucumberWorld) {
    await this.basePage.zoomOut();
    await this.watchPage.selectFirstProductPP();
})

Then('user should verify price in product detail page of Patek Phillippe', async function (this: CucumberWorld) {
    await this.basePage.zoomOut();
    await this.watchPage.verifyPatekPhilippePrice();
})

When('user click Omega in watch page', async function (this: CucumberWorld) {
    await pageFixture.page.waitForTimeout(3000);
    await this.basePage.closeNewsletterPopupIfVisible();
    await this.watchPage.clickOmega();
})

When('user select filter', async function (this: CucumberWorld) {
    // await this.watchPage.zoomOut();
    await this.basePage.zoomOut();
    await pageFixture.page.waitForTimeout(4000);
    await this.watchPage.selectFilter();
})

Then('user should verify result filter in product detail page of Omega', async function (this: CucumberWorld) {
    // await this.watchPage.zoomOut();
    await this.watchPage.clickResultFilter();
    await this.basePage.zoomOut();
    await this.watchPage.verifyResultFilter();
})

When('user click Richard Mille in watch page', async function (this: CucumberWorld) {
    // await this.watchPage.zoomOut();
    await pageFixture.page.waitForTimeout(3000);
    await this.watchPage.clickRichardMille();
})

When('user select {string}', async function (this: CucumberWorld, sortType: string) {
    if (sortType === 'high to low') {
        await this.basePage.clickSort();
        await this.basePage.clickSortHighToLow();
    } else if (sortType === 'low to high') {
        await this.basePage.clickSort();
        await this.basePage.clickSortLowToHigh();
    } else if (sortType === 'a-z') {
        await this.basePage.clickSort();
        await this.basePage.clickSortAtoZ();
    } else if (sortType === 'z-a') {
        await this.basePage.clickSort();
        await this.basePage.clickSortZtoA();
    } else {
        await this.basePage.clickSort();
        await this.basePage.clickSortLatest();
    }
})

// Then('user should verify {string}', async function (this: CucumberWorld, expectedResult: string) {
//     await this.watchPage.verifySortResult(expectedResult);
// })
