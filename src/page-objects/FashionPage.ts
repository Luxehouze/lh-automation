import { BasePage } from "./base/BasePage";
import {expect, Page} from "@playwright/test";
import { normalizePrice } from "../utils/price-utils";



export class FashionPage extends BasePage {

  // --- state internal untuk nyimpen harga ---
    // private listingPriceText?: string;
    // private detailPriceText?: string;

    get clothesBtn() { return this.page.getByText('Clothes'); }
    get firstProductClothes()      { return this.page.getByText('Sweater Poodle Stripe Crewneck Multicolour').last(); }
    get firstProductpriceClothes() { return this.page.locator('.black-10.semibold.title-3.work-sans.svelte-1j3rafz') }
    get priceClothesPDP() { return this.page.locator('span.title-3', { hasText: 'Rp' }) }
    get pradaBtn() { return this.page.locator("//div[3]//button[5]"); }
    get filterBag()      { return this.page.locator('label:has-text("Bag")'); }
    get filterColor()      { return this.page.getByLabel('Black'); }
    get filterWomen()      { return this.page.locator('span.black-6.regular.body-1.work-sans.pl-2',{ hasText: 'Women' }); }
    get resultFilterfashion()    { return this.page.locator('.product-card__header.relative').first(); }
    get resultBag() { return this.page.locator('div.flex.justify-between.border-b.py-4 span.black-10.regular.body-1.work-sans',{ hasText: 'Bag' }); }
    get resultColor() { return this.page.locator('span:has-text("Black")').nth(1); }
    get resultWomen() { return this.page.locator('div.flex.justify-between.border-b.py-4 span.black-10.regular.body-1.work-sans',{ hasText: 'Women' }); }
    get specificationTab() { return this.page.getByText('SPECIFICATIONS', { exact: true })}

    public async clickClothes(): Promise<void> {
        console.log('DEBUG URL =', this.page.url());
    await this.page.waitForLoadState('domcontentloaded');

    const locator = this.clothesBtn;

    const count = await locator.count();
    console.log('DEBUG Clothes count =', count);

    if (count === 0) {
    console.log('DEBUG taking screenshot for Clothes not found');
    await this.page.screenshot({
      path: 'debug-clothes-not-found.png',
      fullPage: true,
    });
  }

  await locator.first().waitFor({ state: 'visible', timeout: 15000 });
  await locator.first().click();
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
        const expectedCurrency = process.env.DEFAULT_CURRENCY_SYMBOL ?? 'Rp';
        await expect(this.firstProductpriceClothes).toContainText(expectedCurrency);
        
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
        console.log('DEBUG Before Prada URL =', await this.page.url());
        await this.page.screenshot({ path: 'debug-before-prada-click.png', fullPage: true });
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(3000);
        await this.pradaBtn.scrollIntoViewIfNeeded();
        await this.pradaBtn.click();
    }

    public async selectFilterfashion(): Promise<void> {
        console.log('DEBUG Before filter URL =', await this.page.url());
        await this.page.screenshot({ path: 'debug-before-filter-fashion.png', fullPage: true });
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(6000);

        const label = this.filterBag;

        const count = await label.count();
        console.log('DEBUG Bag label count =', count);

        const html = await this.page.content();
        console.log('DEBUG HTML has "Bag"?', html.includes('Bag'));


        if (count === 0) {
        await this.page.screenshot({
        path: 'debug-bag-label-not-found.png',
        fullPage: true,
        });
        throw new Error('Bag label not found');
    }

        await label.first().scrollIntoViewIfNeeded();
        await expect(label.first()).toBeVisible({ timeout: 15000 });

        // klik label-nya (akan toggle checkbox di dalamnya)
        await label.first().click();
        await this.page.waitForTimeout(3000);
        await this.filterColor.scrollIntoViewIfNeeded();
        await this.filterColor.click();
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(1000);
        expect (this.filterWomen).toBeVisible();
        const womenCount = await this.filterWomen.count();
        console.log('DEBUG Women this.filterWomen count =', womenCount);

        // cek apakah string "Women" muncul di HTML sama sekali
        const htmlWomen = await this.page.content();
        console.log('DEBUG HTML has "Women"?', htmlWomen.includes('Women'));

        if (womenCount === 0) {
        // ambil screenshot kalau gak nemu
        await this.page.screenshot({
        path: 'debug-women-not-found.png',
        fullPage: true,
        });
        }

        await this.filterWomen.first().waitFor({ state: 'visible', timeout: 15000 });
        await expect(this.filterWomen.first()).toBeVisible();
    }

    public async clickResultFilterfashion(): Promise<void> {
        console.log('DEBUG Before result filter URL =', await this.page.url());
        await this.page.screenshot({ path: 'debug-before-result-filter-fashion.png', fullPage: true });
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(2000);
        await this.resultFilterfashion.scrollIntoViewIfNeeded();
        await this.resultFilterfashion.click();
    }

    public async verifyResultFilterfashion(): Promise<void> {
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(8000);
        await this.specificationTab.click();
        expect (this.resultColor).toBeVisible();
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(1000);
        expect (this.resultWomen).toBeVisible();
        expect (this.resultBag).toBeVisible();
    }    


    
}