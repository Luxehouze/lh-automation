import { World, setWorldConstructor, IWorldOptions } from "@cucumber/cucumber";
import { PageManager } from "../../page-objects/base/PageManager";
import { Browser, Page } from "@playwright/test";
import { BasePage } from "../../page-objects/base/BasePage";
import { HomePage } from "../../page-objects/HomePage";
import { BeautyPage } from "../../page-objects/BeautyPage";
import { WatchPage } from "../../page-objects/WatchPage";
import { FashionPage } from "../../page-objects/FashionPage";

export class CucumberWorld extends World {
    public pageManager: PageManager;
    public basePage: BasePage;
    public homePage: HomePage;
    public beautyPage: BeautyPage;
    public watchPage: WatchPage;
    public fashionPage: FashionPage;

    //Base URL
    private url?: string;

    //Person
    private firstName?: string;
    private lastName?: string;
    private emailAddress?: string;

    //{ attach, log, parameters }: IWorldOptions are required in the constructor of your CucumberWorld class to 
    //inherit functionalities from the base World class and to initialize your PageManager and BasePage.
    constructor({ attach, log, parameters }: IWorldOptions) {
        super({ attach, log, parameters, link: () => {} }); //Pass the options to the world constructor
        this.pageManager = new PageManager(); // Initialize PageManager
        this.basePage = this.pageManager.createBasePage();
        this.homePage = this.pageManager.createHomePage();
        this.beautyPage = this.pageManager.createBeautyPage();
        this.watchPage = this.pageManager.createWatchPage();
        this.fashionPage = this.pageManager.createFashionPage();
    }

    //Setter methods for URL, first name etc:
    setUrl(url: string) {
        this.url = url;
    }

    setFirstName(firstName: string) {
        this.firstName = firstName;
    }

    setLastName(lastName: string) {
        this.lastName = lastName;
    }

    setEmailAddress(emailAddress: string) {
        this.emailAddress = emailAddress;
    }

    //Getter methods for URL, first name etc:
    getURL() {
        return this.url;
    }

    getFirstName() {
        return this.firstName;
    }

    getLastName() {
        return this.lastName;
    }

    getEmailAddress() {
        return this.emailAddress;
    }
}

//Tells Cucumber World to use our Custom World
setWorldConstructor(CucumberWorld);