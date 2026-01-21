import { BasePage } from "../page-objects/base/BasePage";
import { expect, Page } from "@playwright/test";

export class HomePage extends BasePage {
  get thirdBannerBtn() {
    return this.page.getByRole("img", { name: "Sell With Us" });
  }
  get nextBannerBtn() {
    return this.page.getByRole("button", { name: /Next/i });
  }
  get searchInput() {
    return this.page.locator("#search-navbar");
  }
  get searchResult() {
    return this.page.locator(
      ".black-10.semibold.subtitle-1.work-sans.svelte-1j3rafz"
    );
  }
  get buyAWatchBtn() {
    return this.page
      .locator('[data-testid="leading-marketplace-buy-a-watch-button"]')
      .first();
  }
  get sellAWatchBtn() {
    return this.page
      .locator('[data-testid="leading-marketplace-sell-a-watch-button"]')
      .first();
  }
  get viewAllWatchesBtn() {
    return this.page.getByRole("button", { name: "VIEW ALL WATCHES" }).first();
  }

  public async clickThirdBanner(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo(0, 0));
    await this.page.waitForTimeout(3000);
    await this.nextBannerBtn.click();
    await this.thirdBannerBtn.click();
  }

  public async verifyUTMParametersInURL(): Promise<void> {
    await this.page.waitForLoadState("domcontentloaded");
    await this.page.waitForURL(
      (url) => {
        const u = new URL(url);
        const search =
          u.search || (u.hash.startsWith("#") ? u.hash.slice(1) : "");
        const params = new URLSearchParams(search);
        return (
          params.has("utm_source") &&
          params.has("utm_medium") &&
          params.has("utm_campaign")
        );
      },
      { timeout: 15000 }
    );

    const u = new URL(this.page.url());
    const search = u.search || (u.hash.startsWith("#") ? u.hash.slice(1) : "");
    const params = new URLSearchParams(search);

    expect(params.get("utm_source")).toBeTruthy();
    expect(params.get("utm_medium")).toBeTruthy();
    expect(params.get("utm_campaign")).toBeTruthy();
  }

  public async enterSearchQuery(query: string): Promise<void> {
    await this.page.waitForLoadState("domcontentloaded");
    await this.page.waitForTimeout(1000);

    // Guard: tutup popup sebelum interaksi
    await this.closeNewsletterPopupIfVisible();
    await this.closeCSATPopupIfVisible();

    // Debug logs 
    console.log("DEBUG: searchInput count =", await this.searchInput.count()); 
    console.log("DEBUG: searchInput visible =", await this.searchInput.isVisible().catch(() => false)); 
    console.log("DEBUG: searchInput boundingBox =", await this.searchInput.boundingBox());
    console.log("DEBUG: searchInput disabled =", await this.searchInput.isDisabled().catch(() => false)); 
    console.log("DEBUG: searchInput attr disabled =", await this.searchInput.getAttribute("disabled"));

    const searchInput = this.searchInput;
    await expect(searchInput).toBeVisible({ timeout: 10000 });

    // Just-in-time guard
    await this.closeNewsletterPopupIfVisible();
    await this.closeCSATPopupIfVisible();
    await this.page
      .waitForSelector('div[role="presentation"]', {
        state: "detached",
        timeout: 3000,
      })
      .catch(() => {});

    console.log("Search input bounding box =", await searchInput.boundingBox());
    
    await searchInput.focus();
    const beforeClickHandle = await this.searchInput.evaluateHandle(el => el);
    // await searchInput.click({ force: true, timeout: 15000 });
    // await this.page.waitForTimeout(500); const afterClickHandle = await this.page.locator("#search-navbar").evaluateHandle(el => el); console.log("Input element changed =", beforeClickHandle !== afterClickHandle);
    // console.log("Clicked search input");


    // await searchInput.fill(query);
    // console.log(`Filled search input with: ${query}`);
    // await searchInput.press("Enter");
    // console.log("Pressed Enter on search input");
    // //Tunggu navigasi atau suggestions muncul 
    // await Promise.race([ 
    //   this.page.waitForURL(/.*Rolex.*/, { timeout: 10000 }).catch(() => {}),
    //   this.page.waitForSelector('#search-navbar', { timeout: 10000 }).catch(() => {}) ]); 
    //   console.log("STEP: enterSearchQuery finished");
    console.log(`Starting search for: ${query}`);

    try {
        // 1. Pastikan elemen ada di DOM (tapi jangan nunggu kelamaan)
        await searchInput.waitFor({ state: 'attached', timeout: 5000 });

        // 2. Klik dengan force agar menembus sisa-sisa overlay transparan
        // Ini sekaligus memicu elemen placeholder berubah jadi elemen searchInput aktif
        await searchInput.click({ force: true, timeout: 5000 });

        // 3. Tambahkan sedikit delay untuk animasi transisi Luxehouze (biasanya sangat cepat)
        await this.page.waitForTimeout(500);

        // 4. Langsung fill. Fill Playwright otomatis nunggu elemen visible & enabled
        await searchInput.fill(query);
        console.log(`Filled searchInput with: ${query}`);

        // 5. Tekan Enter
        await searchInput.press("Enter");
        
        // 6. Tunggu navigasi ke halaman hasil
        await this.page.waitForURL(/.*search.*/, { timeout: 10000 });
        console.log("Search submitted successfully");

    } catch (error) {
        console.log("Normal flow failed, trying Emergency Recovery...");
        
        // RECOVERY: Jika stuck, tekan ESC untuk tutup semua pop-up yang mungkin muncul mendadak
        await this.page.keyboard.press('Escape');
        await this.page.waitForTimeout(500);
        
        // Coba lagi sekali saja dengan force yang lebih kuat
        await searchInput.click({ force: true });
        await searchInput.fill(query);
        await this.page.keyboard.press('Enter');
    }
  }

  public async verifySearchResult(keyword: string): Promise<void> {
    // await this.page.waitForLoadState('domcontentloaded');
    console.log(`Verifying search results for: ${keyword}`);
    await expect(this.page).toHaveURL(/\/search\?keyword=/, {
      timeout: 60_000,
    });

    // heading result (contoh: 1106 Results for "rolex")
    const heading = this.page.getByText(
      new RegExp(`Results for\\s+"${keyword}"`, "i")
    );

    await expect(heading).toBeVisible({ timeout: 60_000 });
    await expect(heading).toContainText(new RegExp(keyword, "i"), {
      timeout: 60_000,
    });
    const headingText = await heading.innerText();
    console.log(`Heading found: ${headingText}`);
  }

  public async clickBuyAWatch(): Promise<void> {
    await this.page.waitForLoadState("domcontentloaded");
    await this.page.waitForTimeout(6000);
    // Guard: tutup popup sebelum interaksi
    await this.closeNewsletterPopupIfVisible();
    await this.closeCSATPopupIfVisible();
    await expect(this.buyAWatchBtn).toBeVisible();
    await expect(this.buyAWatchBtn).toBeEnabled();
    console.log("DEBUG buy btn count =", await this.buyAWatchBtn.count());
    console.log("Clicking Buy a Watch...");
    // Just-in-time guard
    await this.closeNewsletterPopupIfVisible();
    await this.closeCSATPopupIfVisible();
    await this.page
      .waitForSelector('div[role="presentation"]', {
        state: "detached",
        timeout: 3000,
      })
      .catch(() => {});
    console.log(
      "Is buyAWatchBtn visible =",
      await this.buyAWatchBtn.isVisible()
    );
    console.log(
      "Is buyAWatchBtn enabled =",
      await this.buyAWatchBtn.isEnabled()
    );
    // Removed isStable check as it does not exist on Locator
    await this.buyAWatchBtn.click({ timeout: 15000 });
    await this.page
      .waitForLoadState("networkidle", { timeout: 10000 })
      .catch(() => {});
    console.log("Clicked buy a watch. Current URL:", this.page.url());
    console.log("URL after click buy a watch =", this.page.url());
  }

  public async clickSellAWatch(): Promise<void> {
    await this.page.waitForLoadState("domcontentloaded");
    await this.page.waitForTimeout(6000);
    // Guard: tutup popup sebelum interaksi
    await this.closeNewsletterPopupIfVisible();
    await this.closeCSATPopupIfVisible();
    await expect(this.sellAWatchBtn).toBeVisible();
    await expect(this.sellAWatchBtn).toBeEnabled();
    console.log("DEBUG sell btn count =", await this.sellAWatchBtn.count());
    console.log("Clicking Sell a Watch...");
    // Just-in-time guard
    await this.closeNewsletterPopupIfVisible();
    await this.closeCSATPopupIfVisible();
    await this.page
      .waitForSelector('div[role="presentation"]', {
        state: "detached",
        timeout: 2000,
      })
      .catch(() => {});
    await this.sellAWatchBtn.click({ timeout: 15000 });
    console.log("Clicked sell a watch. Current URL:", this.page.url());
  }

  public async verifyAllWatchesPage(): Promise<void> {
    await this.page.waitForLoadState("domcontentloaded");
    await expect(this.page).toHaveURL(/\/all-watches/, { timeout: 25000 });
    console.log("Current URL after click buy a watch:", this.page.url());
  }

  public async verifySellWithUsPage(): Promise<void> {
    await this.page.waitForLoadState("domcontentloaded");
    await expect(this.page).toHaveURL(/\/sell-with-us/, { timeout: 25000 });
    console.log("Current URL after click sell a watch:", this.page.url());
  }
}
