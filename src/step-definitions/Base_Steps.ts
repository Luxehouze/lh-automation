import { When, Given } from "@cucumber/cucumber";
import { pageFixture } from "./hooks/browserContextFixture";
import { CucumberWorld } from "./world/CucumberWorld";
import { time } from "console";

When(
  "user switches to new tab from {string}", 
  async function (this: CucumberWorld, elementName: string) {
    
    let locator;

    switch (elementName) {
      case "third-banner":
        locator = this.homePage.thirdBannerBtn;
        break;
    //   case "sell-with-us":
    //     locator = this.homePage.ctaSellWithUs;
    //     break;
    //   case "promo-banner":
    //     locator = this.homePage.promoBanner;
    //     break;
      default:
        throw new Error(`Unknown element: ${elementName}`);
    }

    await this.basePage.switchToNewTab(locator);
  }
);


Given('I wait for {int} seconds', async (seconds: number) => {
    await pageFixture.page.waitForTimeout(seconds * 1000);
})