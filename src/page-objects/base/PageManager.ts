import { Page } from "@playwright/test";
import { BasePage } from "./BasePage";
import { pageFixture } from "../../step-definitions/hooks/browserContextFixture";
import { HomePage } from "../HomePage";
import { BeautyPage } from "../BeautyPage";
import { WatchPage } from "../WatchPage";
import { FashionPage } from "../FashionPage";

export class PageManager {
    // constructor(private page: Page) {}
    get page(): Page {
        return pageFixture.page;
    }

    createBasePage(): BasePage {
        return new BasePage();
    }

    createHomePage() {
        return new HomePage();
    }

    createBeautyPage() {
        return new BeautyPage();
    }

    createFashionPage() {
        return new FashionPage();
    }

    createWatchPage() {
        return new WatchPage();
    }
}