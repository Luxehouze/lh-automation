import { When, Given, Then } from "@cucumber/cucumber";
import { pageFixture } from "./hooks/browserContextFixture";
import { CucumberWorld } from "./world/CucumberWorld";
import { time } from "console";
import { expect } from "@playwright/test";

Given('user navigate to the Luxehouze beauty page', async function (this: CucumberWorld) {
     if (!process.env.BASE_URL) {
    throw new Error("BASE_URL is not defined. Please check environment file.");
  }

  const baseUrl = process.env.BASE_URL.replace(/\/$/, "");

  await this.basePage.page.goto(`${baseUrl}/beauty`, {
    waitUntil: "domcontentloaded"
  });
  console.log('DEBUG URL =', this.basePage.page.url());
})

When('user click Charlotte Tilbury in beauty page', async function (this: CucumberWorld) {
    await this.basePage.zoomOut();
    await pageFixture.page.waitForTimeout(8000);
    await this.beautyPage.clickCharlotteTilbury();
})

When('user select the first suggestion Charlotte Tilbury', async function (this: CucumberWorld) {
    await this.basePage.zoomOut();
    await this.basePage.closeNewsletterPopupIfVisible();
    await this.beautyPage.selectFirstProductCT();
})

Then('user should verify price in product detail page of Charlotte Tilbury', async function (this: CucumberWorld) {
    await this.basePage.zoomOut();
    await this.beautyPage.verifyCharlotteTilburyPrice();
})

When('user click category makeup in beauty page', async function (this: CucumberWorld) {
    await this.basePage.zoomOut();
    await pageFixture.page.waitForTimeout(3000);
    await this.beautyPage.clickMakeup();
})

When('user select filter beauty', async function (this: CucumberWorld) {
    await this.basePage.zoomOut();
    await pageFixture.page.waitForTimeout(4000);
    await this.basePage.closeNewsletterPopupIfVisible();
    await this.beautyPage.selectFilterBeauty();
})

Then('user should verify result filter beauty in product detail page of makeup', async function (this: CucumberWorld) {
    await this.beautyPage.clickResultFilterBeauty();
    await this.basePage.zoomOut();
    await this.beautyPage.verifyResultFilterBeauty();
})