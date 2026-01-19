import { Page, Locator } from "@playwright/test";
import { pageFixture } from "../../step-definitions/hooks/browserContextFixture";

//Load env variables from .env file
import { config as loadEnv } from "dotenv"
import { time } from "console";
import { TIMEOUT } from "dns";
const env = loadEnv({ path: './env/.env', override: true });

//Create a configuration object for easy access to env variables
const config = {
    width: parseInt(env.parsed?.BROWSER_WIDTH || '1920'),
    height: parseInt(env.parsed?.BROWSER_HEIGHT || '1080'),
}

export class BasePage {

    get page(): Page {
        return pageFixture.page;
    }

    get newsLetterPopup() { return this.page.getByText(/Never Miss An Update/i); }
    get closeNewsletterBtn() { return this.page.locator('[data-testid="newsletter-modal-close-button"]').nth(1); }
    get CSATPopup() { return this.page.getByText("We'd love your"); }
    get closeCSATBtn() { return this.page.locator('[data-test-id="csat-modal-no-thanks-button"]'); }
    get sortDropdown() { return this.page.getByText('Sort by'); }
    get sortHighToLow() { return this.page.getByText('Price: High to Low'); }
    get sortLowToHigh() { return this.page.getByText('Price: Low to High'); }
    get sortAtoZ() { return this.page.getByText('Alphabetical, A - Z'); }
    get sortZtoA() { return this.page.getByText('Alphabetical, Z - A'); }
    get sortLatest() { return this.page.getByText('Latest'); }

    public async closeNewsletterPopupIfVisible(maxWaitMs = 12000, intervalMs = 1000): Promise<void> {
  if (this.page.url() === "about:blank") return;

  const titleLocator = this.newsLetterPopup;          // e.g. modal title/container
  const closeBtn = this.closeNewsletterBtn;           // e.g. [data-testid="newsletter-modal-close-button"]
  const overlay = this.page.locator('div[role="presentation"]'); // gray backdrop

  const deadline = Date.now() + maxWaitMs;

  while (Date.now() < deadline) {
    const hasTitle = (await titleLocator.count().catch(() => 0)) > 0;
    const titleVisible = hasTitle && await titleLocator.first().isVisible().catch(() => false);
    const overlayVisible = await overlay.isVisible().catch(() => false);

    console.log(`Blocking check: titleVisible=${titleVisible}, overlayVisible=${overlayVisible}`);

    if (titleVisible || overlayVisible) {
      // Try close button first
      const closeVisible = await closeBtn.isVisible().catch(() => false);
      if (closeVisible) {
        await closeBtn.click().catch(async () => {
          console.log("Close button click failed, pressing Escape...");
          await this.page.keyboard.press("Escape");
          console.log("sukses close newsletter with escape");
        });
      } else {
        console.log("Close button not found/visible, pressing Escape...");
        await this.page.keyboard.press("Escape");
        console.log("sukses close newsletter with escape");
      }

      // Wait for overlay to truly detach
      await this.page.waitForSelector('div[role="presentation"]', { state: 'detached', timeout: 3000 }).catch(() => {});
      // Small settle
      await this.page.waitForTimeout(300);
      // Re-check quickly; if gone, we’re done
      const stillVisible = await overlay.isVisible().catch(() => false) ||
                           (await titleLocator.first().isVisible().catch(() => false));
      if (!stillVisible) {
        console.log("Blocking layers closed.");
        return;
      }
    }

    await this.page.waitForTimeout(intervalMs);
  }

  console.log("No blocking layers detected within 12s, proceeding.");
}



    public async closeCSATPopupIfVisible(): Promise<void> {
    if (this.page.url() === "about:blank") return;

    // Beri waktu popup muncul
    await this.page.waitForTimeout(1500);

    const titleLocator = this.CSATPopup;
    const count = await titleLocator.count().catch(() => 0);
    console.log("CSAT title count =", count);

    if (count === 0) {
    console.log("CSAT popup not present.");
    return;
    }

    const title = titleLocator.first();
    const visible = await title.isVisible().catch(() => false);
    if (!visible) {
    console.log("Popup CSAT in DOM but not visible.");
    return;
    }

    console.log("Popup CSAT visible. Trying to close...");

    await this.page.waitForSelector('[data-test-id="csat-modal-no-thanks-button"]', {
      state: 'attached',
      timeout: 12000
    });

    const closeBtn = this.closeCSATBtn;
    const closeVisible = await closeBtn.isVisible().catch(() => false);
    console.log("Close button CSAT count =", await closeBtn.count());
    console.log("Close button CSAT visible =", await closeBtn.isVisible().catch(() => false));
    
    if (closeVisible) {
    await this.closeCSATBtn.click({ force: true });
    } else {
    console.log("Close button not found, pressing Escape...");
    await this.page.keyboard.press("Escape");
    }

    await this.page.waitForTimeout(500);
    }


    //Promise<void> in TypeScript when you’re defining an async function that doesn’t explicitly return a value.
    public async navigate(url: string): Promise<void> {
        await this.page.goto(url, { waitUntil: 'domcontentloaded' });
        console.log('Page is:', this.page);
    }

    public async waitAndClickByRole(role: string, name: string): Promise<void> {
        const element = await this.page.getByRole(role as any, { name: name });
        await element.click();
    }

    // Wait for the locator to be visible and then click on it
    public async waitAndClick(locator: Locator): Promise<void> {
        await locator.isVisible();
        await locator.click();
    }

    // Wait for the selector to be visible and then click on it
    public async switchToNewTab(link: Locator): Promise<void> {
    console.log("Clicked link, waiting for new tab...");

    // Tunggu tab baru sambil klik link
    const [newPage] = await Promise.all([
        this.page.context().waitForEvent('page'),
        link.click(),
        // this.page.click(locator),
    ]);

    // Tunggu semua resource tab baru dimuat
    await newPage.waitForLoadState('domcontentloaded');

    // Update pageFixture agar this.page mengarah ke tab baru
    pageFixture.page = newPage;
    
        //Bring the newly assigned tab to the front (Make it active)
        await this.page.bringToFront();
    
        //Ensure the newly assigned tab is also fully maximised 
        await this.page.setViewportSize({ width: config.width, height: config.height });
        console.log("Switched to new tab");
    } 

    public async zoomOut() {
        await this.page.waitForSelector("body", { state: "attached", timeout: 30000 });
        await this.page.evaluate(() => {
        document.body.style.zoom = "0.5"; // 50% zoom out
        });
    }

    public async clickSort(): Promise<void> {
        await this.sortDropdown.click();
    }
    public async clickSortHighToLow(): Promise<void> {
        await this.sortHighToLow.click();
    }
    public async clickSortLowToHigh(): Promise<void> {
        await this.sortLowToHigh.click();
    }
    public async clickSortAtoZ(): Promise<void> {
        await this.sortAtoZ.click();
    }
    public async clickSortZtoA(): Promise<void> {
        await this.sortZtoA.click();
    }

    public async clickSortLatest(): Promise<void> {
        await this.sortLatest.click();
    }
}