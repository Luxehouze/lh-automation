import { When, Given, Then } from "@cucumber/cucumber";
import { pageFixture } from "./hooks/browserContextFixture";
import { CucumberWorld } from "./world/CucumberWorld";
import { time } from "console";
import { expect } from "@playwright/test";

Given('user navigate to the Luxehouze fashion page', async function (this: CucumberWorld) {
     if (!process.env.BASE_URL) {
    throw new Error("BASE_URL is not defined. Please check environment file.");
  }

  const baseUrl = process.env.BASE_URL.replace(/\/$/, "");

  await this.basePage.page.goto(`${baseUrl}/fashion`, {
    waitUntil: "domcontentloaded"
  });
  console.log('DEBUG URL =', this.basePage.page.url());
  
})

When('user click clothes in fashion page', async function (this: CucumberWorld) {
    await this.basePage.zoomOut();
    await pageFixture.page.waitForTimeout(3000);
    await this.fashionPage.clickClothes();
})

When('user select the first suggestion of clothes', async function (this: CucumberWorld) {
    await this.basePage.zoomOut();
    await this.basePage.closeNewsletterPopupIfVisible();
    await this.fashionPage.selectFirstProductClothes();
})

Then('user should verify price in product detail page of clothes', async function (this: CucumberWorld) {
    await this.basePage.zoomOut();
    await this.fashionPage.verifyClothesPrice();
})

When('user click Prada in fashion page', async function (this: CucumberWorld) {
    await this.basePage.zoomOut();
    await pageFixture.page.waitForTimeout(3000);
    await this.basePage.closeNewsletterPopupIfVisible();
    await this.fashionPage.clickPrada();
})

When('user select filter fashion', async function (this: CucumberWorld) {
    await this.basePage.zoomOut();
    await pageFixture.page.waitForTimeout(4000);
    await this.fashionPage.selectFilterfashion();
})

Then('user should verify result filter fashion in product detail page of Prada', async function (this: CucumberWorld) {
    await this.fashionPage.clickResultFilterfashion();
    await this.basePage.zoomOut();
    await this.fashionPage.verifyResultFilterfashion();
})