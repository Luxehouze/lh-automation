import { BasePage } from "./base/BasePage";
import {expect, Page} from "@playwright/test";


export class BeautyPage extends BasePage {

    get RhodeBtn() { return this.page.locator("//body/div/div/main/div/div/div/button[2]/img[1]"); }
    get makeupBtn() { return this.page.locator('//button[.//span[contains(text(),"Makeup")]]'); }
    get firstProductRhode() { return this.page.getByTitle('Peptide Lip Tint 10ml'); }
    get priceRhode() { return this.page.locator('.black-10.semibold.title-3.work-sans.svelte-1j3rafz') }
    get filterDior()      { return this.page.locator('label:has-text("Dior")'); }
    get filterHotRightNow()      { return this.page.getByLabel('Hot Right Now'); }
    get filterFace()      { return this.page.getByRole('checkbox', { name: 'Face', exact: true }); }
    get firstProductDior()      { return this.page.locator('.product-card__content.text-balance.z-10.relative').first(); }
    get resultDior() { return this.page.locator('//span/div/p'); }
    get resultHotRightNow() { return this.page.locator('p:text("HOT RIGHT NOW")'); }
    get resultRhode() { return this.page.locator('//h1[contains(text(), "Rhode")]'); }
    get resultLip() { return this.page.locator('//div[contains(text(), "Lip")]'); }
    
    public async clickRhode(): Promise<void> {
        await this.page.waitForLoadState('domcontentloaded');
        await this.RhodeBtn.click();
    }

    public async selectFirstProductRhode(): Promise<void> {
        await this.page.waitForLoadState('domcontentloaded');
        console.log('DEBUG URL =', this.page.url());
         // tunggu sampai suggestion muncul
        await this.firstProductRhode.waitFor({ state: 'visible', timeout: 15000 });

        const count = await this.firstProductRhode.count();
        console.log('DEBUG Rhode suggestions count =', count);

        const target =
        count > 1
        ? this.firstProductRhode.nth(1)   // kalau memang selalu mau click yang kedua
        : this.firstProductRhode.first(); // fallback kalau cuma 1
        // await this.page.waitForTimeout(6000);
        await this.firstProductRhode.click();
    }

    public async verifyRhodePrice(): Promise<void> {
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForSelector('text=Rhode', { timeout: 10000 });
        await this.priceRhode.waitFor();
        const expectedCurrency = process.env.DEFAULT_CURRENCY_SYMBOL ?? 'Rp';
        await expect(this.priceRhode).toContainText(expectedCurrency);
    }

    public async clickMakeup(): Promise<void> {
        console.log('DEBUG Before makeup URL =', await this.page.url());
        try {
        await this.page.screenshot({ path: 'debug-before-makeup-click.png', fullPage: true });
        console.log("Screenshot taken successfully"); } catch (error) { console.error("Screenshot failed:", error); }
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(6000);
        const makeupBtn = this.makeupBtn; 
        console.log("Makeup button count =", await makeupBtn.count()); 
        console.log("Makeup button visible =", await makeupBtn.isVisible().catch(() => false));
        await expect(makeupBtn).toBeVisible({ timeout: 10000 });
        await this.makeupBtn.scrollIntoViewIfNeeded();
        await this.makeupBtn.click();
        console.log("STEP: clickMakeupCategory finished");
        await this.page.waitForSelector('text=Makeup', { timeout: 10000 }); console.log("STEP: clickMakeupCategory finished");
    }

    public async selectFilterBeauty(): Promise<void> {
        console.log('DEBUG Before filter URL =', await this.page.url());
        await this.page.screenshot({ path: 'debug-before-filter-beauty.png', fullPage: true });
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(6000);
        const dior = this.filterDior;
        console.log('DEBUG URL =', this.page.url());
        console.log('DEBUG Dior count =', await dior.count());
        await dior.scrollIntoViewIfNeeded();
        await expect(dior).toBeVisible({ timeout: 15000 });
        const html = await this.page.content();
        console.log('DEBUG HTML has "Dior"?', html.includes('Dior'));
        await dior.check({ force: true });
        // await this.filterDior.click();
        await this.page.waitForTimeout(6000);
        await this.filterHotRightNow.scrollIntoViewIfNeeded();
        await this.filterHotRightNow.click();
        await this.page.waitForTimeout(6000);
        await this.filterFace.scrollIntoViewIfNeeded();
        await this.filterFace.click();
    }

    public async clickResultFilterBeauty(): Promise<void> {
        console.log('DEBUG Before result filter URL =', await this.page.url());
        await this.page.screenshot({ path: 'debug-before-result-filter-beauty.png', fullPage: true });
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(6000);
        await this.firstProductDior.scrollIntoViewIfNeeded();
        await this.firstProductDior.click();
    }

    public async verifyResultFilterBeauty(): Promise<void> {
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForTimeout(8000);
        expect (this.resultHotRightNow).toContainText('HOT RIGHT NOW');
        await this.page.waitForTimeout(8000);
        expect (this.resultDior).toContainText('Dior');
    }
}