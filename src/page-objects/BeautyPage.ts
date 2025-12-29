import { BasePage } from "./base/BasePage";
import {expect, Page} from "@playwright/test";


export class BeautyPage extends BasePage {

    get charlotteTilburyBtn() { return this.page.locator("//body/div/div/main/div/div/div/button[3]/img[1]"); }
    get makeupBtn() { return this.page.locator('.black-9.medium.subtitle-3.work-sans.svelte-1j3rafz').first(); }
    get firstProductCT() { return this.page.getByText(/Airbrush Flawless Finish Complexion/i).nth(1); }
    get priceCT() { return this.page.locator('.red-5.semibold.subtitle-2.work-sans.svelte-1j3rafz') }
    get filterDior()      { return this.page.locator('#category-Dior'); }
    get filterHotRightNow()      { return this.page.getByLabel('Hot Right Now'); }
    get filterFace()      { return this.page.getByRole('checkbox', { name: 'Face', exact: true }); }
    get firstProductDior()      { return this.page.locator('.product-card__content.text-balance.z-10.relative').first(); }
    get resultDior() { return this.page.locator('//span/div/p'); }
    get resultHotRightNow() { return this.page.locator('p:text("HOT RIGHT NOW")');
 }
    
    public async clickCharlotteTilbury(): Promise<void> {
        await this.charlotteTilburyBtn.click();
    }

    public async selectFirstProductCT(): Promise<void> {
        await this.page.waitForTimeout(6000);
        await this.firstProductCT.click();
    }

    public async verifyCharlotteTilburyPrice(): Promise<void> {
        await this.page.waitForSelector('text=Charlotte', { timeout: 10000 });
        await this.priceCT.waitFor();
        await expect(this.priceCT).toContainText('Rp');
    }

    public async clickMakeup(): Promise<void> {
        await this.page.waitForTimeout(6000);
        await this.makeupBtn.scrollIntoViewIfNeeded();
        await this.makeupBtn.click();
    }

    public async selectFilterBeauty(): Promise<void> {
        await this.page.waitForTimeout(6000);
        await this.filterDior.scrollIntoViewIfNeeded();
        await this.filterDior.click();
        await this.page.waitForTimeout(6000);
        await this.filterHotRightNow.scrollIntoViewIfNeeded();
        await this.filterHotRightNow.click();
        await this.page.waitForTimeout(6000);
        await this.filterFace.scrollIntoViewIfNeeded();
        await this.filterFace.click();
    }

    public async clickResultFilterBeauty(): Promise<void> {
        await this.page.waitForTimeout(6000);
        await this.firstProductDior.scrollIntoViewIfNeeded();
        await this.firstProductDior.click();
    }

    public async verifyResultFilterBeauty(): Promise<void> {
        await this.page.waitForTimeout(8000);
        expect (this.resultDior).toContainText('Dior');
    }
}