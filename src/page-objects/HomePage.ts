import { BasePage } from "../page-objects/base/BasePage";
import {expect, Page} from "@playwright/test";

export class HomePage extends BasePage {

    get thirdBannerBtn() { return this.page.getByRole('img', { name: 'Sell With Us' }); }
    get nextBannerBtn() { return this.page.getByRole('button', { name: /Next/i }); }
    get searchInput() { return this.page.locator("#search-navbar"); }
    get searchResult() { return this.page.locator('.black-10.semibold.subtitle-1.work-sans.svelte-1j3rafz'); }
    get unlockMoreLuxefestBtn() { return this.page.getByRole('button', { name: 'UNLOCK MORE ON LUXEFEST' }); }
    get buyAWatchBtn() { return this.page.locator('//body/div/div/main/div[2]/div[1]/div[1]/button[1]/span[1]'); }
    get sellAWatchBtn() { return this.page.locator('//div//div//div[2]//div[1]//div[1]//button[2]//span[1]'); }
    get viewAllWatchesBtn()      { return this.page.getByRole('button', { name: 'VIEW ALL WATCHES' }).first(); }
    

    public async navigateToHomePage(): Promise<void> {
        const baseUrl = process.env.BASE_URL || "https://www.luxehouze.com/id/en/";
        await this.page.goto(baseUrl, { waitUntil: "domcontentloaded" });
        await expect(this.page).toHaveURL(/luxehouze\.com/);
    }
    
    public async clickThirdBanner(): Promise<void> {
        await this.page.evaluate(() => window.scrollTo(0, 0));
        await this.page.waitForTimeout(3000);
        await this.nextBannerBtn.click();
        await this.thirdBannerBtn.click();
    }

    public async verifyUTMParametersInURL(): Promise<void> {
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForURL(url => {
    const u = new URL(url);
    const search = u.search || (u.hash.startsWith('#') ? u.hash.slice(1) : '');
    const params = new URLSearchParams(search);
    return params.has('utm_source') && params.has('utm_medium') && params.has('utm_campaign');
  }, { timeout: 15000 });

  const u = new URL(this.page.url());
  const search = u.search || (u.hash.startsWith('#') ? u.hash.slice(1) : '');
  const params = new URLSearchParams(search);

  expect(params.get('utm_source')).toBeTruthy();
  expect(params.get('utm_medium')).toBeTruthy();
  expect(params.get('utm_campaign')).toBeTruthy();
    }

    public async enterSearchQuery(query: string): Promise<void> {
        await this.page.waitForTimeout(3000);
        await this.searchInput.click();
        await this.searchInput.fill(query);
        await this.searchInput.press("Enter");
        await this.page.waitForTimeout(2000); // Wait for suggestions to load
    }

    public async verifySearchResult(): Promise<void> {
        await this.page.waitForTimeout(2000);
        await expect(this.searchResult).toContainText('Rolex');
    }

    public async clickUnlockMoreOnLuxefest(): Promise<void> {
        await this.unlockMoreLuxefestBtn.scrollIntoViewIfNeeded();
        await this.unlockMoreLuxefestBtn.click();
    }

    public async verifyLuxefestPage(): Promise<void> {
        await expect(this.page).toHaveURL(/luxefest/);
    }

    public async clickBuyAWatch(): Promise<void> {
        await this.page.waitForTimeout(2000);
        await this.buyAWatchBtn.click();
    }

    public async clickSellAWatch(): Promise<void> {
        await this.page.waitForTimeout(2000);
        await this.sellAWatchBtn.click();
    }

    public async verifyAllWatchesPage(): Promise<void> {
        await expect(this.page).toHaveURL(/\/all-watches/);
    }

    public async verifySellWithUsPage(): Promise<void> {
        await expect(this.page).toHaveURL(/\/sell-with-us/);
    }

    
}