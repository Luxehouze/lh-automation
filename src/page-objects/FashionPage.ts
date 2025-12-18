import { BasePage } from "./base/BasePage";
import {expect, Page} from "@playwright/test";
import { normalizePrice } from "../utils/price-utils";



export class FashionPage extends BasePage {

  // --- state internal untuk nyimpen harga ---
    // private listingPriceText?: string;
    // private detailPriceText?: string;

    get clothesBtn() { return this.page.getByText('Clothes').first(); }
    get firstProductClothes()      { return this.page.getByText('Sweater Poodle Stripe Crewneck Multicolour').last(); }
    get firstProductpriceClothes() { return this.page.locator('.black-10.semibold.title-3.work-sans.svelte-1j3rafz') }
    get priceClothesPDP() { return this.page.locator('span.title-3', { hasText: 'Rp' }) }
    get pradaBtn() { return this.page.locator("//div[3]//button[5]"); }
    get filterBag()      { return this.page.getByLabel('Bag'); }
    get filterColor()      { return this.page.getByLabel('Black'); }
    get filterWomen()      { return this.page.getByLabel('Women'); }
    get resultFilterfashion()    { return this.page.locator('.product-card__header.relative').first(); }
    get resultBag() { return this.page.locator(`span:has-text("Bag")`).nth(1); }
    get resultColor() { return this.page.getByText(/^Black$/).first();}
    get resultWomen() { return this.page.getByText('Women').first();}

    public async clickClothes(): Promise<void> {
        await this.clothesBtn.click();
    }

    public async selectFirstProductClothes(): Promise<void> {
        await this.page.waitForTimeout(3000);
        await this.firstProductClothes.click();
    }

    public async getPriceFromProductList(): Promise<string> {
    const raw = await this.firstProductpriceClothes.innerText();
    console.log("Price from product list:", raw);
    return raw.trim();
  }

    public async getPriceFromDetail(): Promise<string> {
    const raw = await this.priceClothesPDP.innerText();
    console.log("Price from pdp:", raw);
    return raw.trim();
  }
    
    public async verifyClothesPrice(): Promise<void> {
        await this.page.waitForSelector('text=Sweater Poodle', { timeout: 10000 });
        await this.firstProductpriceClothes.waitFor();
        await expect(this.firstProductpriceClothes).toContainText('Rp');
        // console.log("VERIFY listPrice:", this.listingPriceText);
        // console.log("VERIFY pdpPrice:", this.detailPriceText);
        // if (!this.listingPriceText || !this.detailPriceText) {
        //     throw new Error('Missing price values. Ensure capture methods executed.');
        // }

        // const listing = normalizePrice(this.listingPriceText);
        // const detail = normalizePrice(this.detailPriceText);

        // expect(detail).toBe(listing);
    }

    public async clickPrada(): Promise<void> {
        await this.page.waitForTimeout(3000);
        await this.pradaBtn.scrollIntoViewIfNeeded();
        await this.pradaBtn.click();
    }

    public async selectFilterfashion(): Promise<void> {
        await this.page.waitForTimeout(3000);
        await this.filterBag.scrollIntoViewIfNeeded();
        await this.filterBag.click();
        await this.page.waitForTimeout(3000);
        await this.filterColor.scrollIntoViewIfNeeded();
        await this.filterColor.click();
        await this.page.waitForTimeout(3000);
        await this.filterWomen.scrollIntoViewIfNeeded();
        await this.filterWomen.click();
    }

    public async clickResultFilterfashion(): Promise<void> {
        await this.page.waitForTimeout(2000);
        await this.resultFilterfashion.scrollIntoViewIfNeeded();
        await this.resultFilterfashion.click();
    }

    public async verifyResultFilterfashion(): Promise<void> {
        await this.page.waitForTimeout(4000);
        expect (this.resultBag).toContainText('Bag');
        await this.page.waitForTimeout(4000);
        expect (this.resultColor).toContainText('Black');
        await this.page.waitForTimeout(4000);
        expect (this.resultWomen).toBeVisible();
    }    


    
}