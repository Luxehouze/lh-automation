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
  console.log("Navigating to:", `${baseUrl}/beauty?noredirect=true`);
  await this.basePage.page.goto(`${baseUrl}/beauty?noredirect=true`, {
   waitUntil: "domcontentloaded", timeout: 15000,
  });
  console.log("Navigation finished");
  console.log('DEBUG URL =', this.basePage.page.url());
})

When('user click Rhode in beauty page', async function (this: CucumberWorld) {
    await this.basePage.zoomOut();
    await pageFixture.page.waitForTimeout(8000);
    await this.basePage.closeNewsletterPopupIfVisible();
    console.log("STEP: popup newsletter closed, calling clickRhodeBrand()");
    await this.beautyPage.clickRhode();
    console.log("STEP: clickRhodeBrand finished");
})

When('user select the first suggestion Rhode', async function (this: CucumberWorld) {
    await this.basePage.zoomOut();
    await this.basePage.closeNewsletterPopupIfVisible();
    await this.beautyPage.selectFirstProductRhode();
})

Then('user should verify price in product detail page of Rhode', async function (this: CucumberWorld) {
    await this.basePage.zoomOut();
    await this.beautyPage.verifyRhodePrice();
})

When('user click category makeup in beauty page', async function (this: CucumberWorld) {
    await this.basePage.zoomOut();
    await this.basePage.closeNewsletterPopupIfVisible();
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