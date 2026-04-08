/**
 * This class contains all the elements that are common for all logged in pages.
 * 
 * Example: top navigation bar, it is visible only after login, on all pages.
 */

import { Locator, Page, expect } from "@playwright/test";

export class CommonLoggedInPage {
    protected page: Page;
    protected usersTab: Locator;
    protected heroesTab: Locator;
    protected profileButton: Locator;
    protected logOutButton: Locator;


    constructor(page: Page) {
        this.page = page;
        this.usersTab = page.getByTestId('nav-users');
        this.heroesTab = page.getByTestId('nav-heroes');
        this.profileButton = page.getByTestId('nav-profile');
        this.logOutButton = page.getByTestId('nav-logout');
    }

    // Click Users tab
    async clickUsersTab() {
        await this.usersTab.click();
        await this.page.waitForURL('/users');
    }

    async clickHeroesTab() {
        await this.heroesTab.click();
        await this.page.waitForURL('/heroes');
    }

    async logout() {
        await this.logOutButton.click();
        await this.page.waitForURL('/login');
    }

    async userIsLoggedIn() {
        expect(this.profileButton).toBeVisible();
    }

    async getUsersTabText() {
        return await this.usersTab.textContent();
    }
}