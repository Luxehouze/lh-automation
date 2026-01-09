import { BasePage } from "../page-objects/base/BasePage";
import {expect, Page} from "@playwright/test";

export class HomePage extends BasePage {

    get thirdBannerBtn() { return this.page.getByRole('img', { name: 'Sell With Us' }); }
    get nextBannerBtn() { return this.page.getByRole('button', { name: /Next/i }); }
    get searchInput() { return this.page.locator('#search-navbar'); }
    get searchResult() { return this.page.locator('.black-10.semibold.subtitle-1.work-sans.svelte-1j3rafz'); }
    get buyAWatchBtn() { return this.page.locator('span').filter({ hasText: 'BUY A WATCH' }).first(); }
    get sellAWatchBtn() { return this.page.locator('span').filter({ hasText: 'SELL A WATCH' }).first(); }
    get viewAllWatchesBtn()      { return this.page.getByRole('button', { name: 'VIEW ALL WATCHES' }).first(); }
    
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
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(3000);
        await this.searchInput.click();
        await this.searchInput.fill(query);
        await this.searchInput.press("Enter");
        await this.page.waitForTimeout(2000); // Wait for suggestions to load
    }

    public async verifySearchResult(keyword: string): Promise<void> {
        await this.page.waitForLoadState('domcontentloaded');
        await expect(this.page).toHaveURL(/\/search\?keyword=/, { timeout: 60_000 });

    // heading result (contoh: 1106 Results for "rolex")
    const heading = this.page.getByText(new RegExp(`Results for\\s+"${keyword}"`, 'i'));

    await expect(heading).toBeVisible({ timeout: 60_000 });
    await expect(heading).toContainText(new RegExp(keyword, 'i'), { timeout: 60_000 });
    }

    public async clickBuyAWatch(): Promise<void> {
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(2000);
        await this.buyAWatchBtn.click();
    }

    public async clickSellAWatch(): Promise<void> {
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(2000);
        await this.sellAWatchBtn.click();
    }

    public async verifyAllWatchesPage(): Promise<void> {
        await this.page.waitForLoadState('domcontentloaded');
        await expect(this.page).toHaveURL(/\/all-watches/, { timeout: 25000 });
        console.log("Current URL after click:", this.page.url());
    }

    public async verifySellWithUsPage(): Promise<void> {
        await this.page.waitForLoadState('domcontentloaded');
        await expect(this.page).toHaveURL(/\/sell-with-us/, { timeout: 25000 });
        console.log("Current URL after click:", this.page.url());
    }

    
}