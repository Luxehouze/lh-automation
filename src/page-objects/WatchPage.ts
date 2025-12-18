import { BasePage } from "./base/BasePage";
import {expect, Page} from "@playwright/test";


export class WatchPage extends BasePage {

    get patekPhillippeLink() { return this.page.locator("//a[@href='watch/patek-philippe']"); }
    get omegaLink() { return this.page.locator("//a[@href='watch/omega']"); }
    get richardMilleLink() { return this.page.locator("//a[@href='watch/richard-mille']"); }
    get firstProductPP() { return this.page.locator('div.product-card').first(); }
    get pricePP() { return this.page.locator('span.black-10.semibold.title-3.work-sans.svelte-1j3rafz'); }
    get filterMostPopular()      { return this.page.getByText('Most Popular', { exact: true }); }
    get filterBrandNew()      { return this.page.getByText('Brand New', { exact: true }); }
    get filterMen()      { return this.page.getByText('Men', { exact: true }); }
    get filterBlue()      { return this.page.getByText('Blue', { exact: true }); }
    get filterCaseSize()      { return this.page.getByText('40mm - 44mm', { exact: true }); }
    get resultFilter()    { return this.page.locator('.product-card__header.relative').first(); }
    get resultLabel() { return this.page.getByText('MOST POPULAR').first();}
    get resultNew() { return this.page.locator("div.flex.flex-col.gap-4").getByText(/New\s*\(100%\)/i).first();}
    get resultMen() { return this.page.getByText(/^Men$/).first();}
    get showMoreBtn() { return this.page.getByRole("button", { name: "SHOW MORE" }); }
    get resultCaseSize() { return this.page.getByText(/41\s*mm/i);}
    get resultDial() { return this.page.getByText(/Blue/i);}

    public async clickPatekPhillippe(): Promise<void> {
        await this.patekPhillippeLink.click();
    }

    public async selectFirstProductPP(): Promise<void> {
        await this.firstProductPP.click();
    }

    public async verifyPatekPhilippePrice(): Promise<void> {
        await this.page.waitForSelector('text=Patek Philippe', { timeout: 10000 });
        await this.pricePP.waitFor();
        await expect(this.pricePP).toContainText('Rp');
    }

    public async clickOmega(): Promise<void> {
        await this.omegaLink.click();
    }

    public async selectFilter(): Promise<void> {
        await this.page.waitForTimeout(3000);
        await this.filterMostPopular.scrollIntoViewIfNeeded();
        await this.filterMostPopular.click();
        await this.page.waitForTimeout(3000);
        await this.filterBrandNew.scrollIntoViewIfNeeded();
        await this.filterBrandNew.click();
        await this.page.waitForTimeout(3000);
        await this.filterMen.scrollIntoViewIfNeeded();
        await this.filterMen.click();
    }

    public async clickResultFilter(): Promise<void> {
        await this.page.waitForTimeout(2000);
        await this.resultFilter.scrollIntoViewIfNeeded();
        await this.resultFilter.click();
    }

    public async verifyResultFilter(): Promise<void> {
        await this.page.waitForTimeout(4000);
        expect (this.resultLabel).toContainText('MOST POPULAR');
        await this.page.waitForTimeout(4000);
        const textNew: string = await this.resultNew.innerText();
        expect(textNew).toMatch(/New\s*\(100%\)/i);
        const textMen: string = await this.resultMen.innerText();
        expect(textMen).toMatch(/^Men$/);
    }

    public async clickRichardMille(): Promise<void> {
        await this.richardMilleLink.click();
    }

    public async verifySortResult(): Promise<void> {
        // Implement verification logic for sorted results
        await this.page.waitForTimeout(4000);
    }



    
}