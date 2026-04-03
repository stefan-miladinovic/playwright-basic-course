/**
 * This class contains all the elements for the login page.
 */

import { Locator, Page, expect } from "@playwright/test";

export class LoginPage {
    readonly page: Page;
    readonly usernameField: Locator;
    readonly passwordField: Locator;
    readonly logInButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.usernameField = page.getByTestId('login-username');
        this.passwordField = page.getByTestId('login-password');
        this.logInButton = page.getByTestId('login-submit');
    }

    // Open Login page
    async open() {
        await this.page.goto('/login');
    }

    // Enter username
    async enterUsername(username: string) {
        console.log(`Entering username ${username}`);
        await this.usernameField.fill(username);
    }

    // Enter password
    async enterPassword(password: string) {
        console.log(`Entering password ${password}`);
        await this.passwordField.fill(password);
    }

    // Click Log In button
    async clickLogInButton() {
        await this.logInButton.click();
    }

    // Login as admin
    async loginAsAdmin() {
        await this.open();
        await this.enterUsername(`${process.env.ADMIN_USERNAME}`);
        await this.enterPassword(`${process.env.ADMIN_PASSWORD}`);
        await this.clickLogInButton();
        await this.page.waitForURL('/home');
    }

    // Login as specific user
    async loginAsUser(username: string, password: string) {
        await this.open();
        await this.enterUsername(username);
        await this.enterPassword(password);
        await this.clickLogInButton();
        await this.page.waitForURL('/home');
    }

    async userIsLoggedOut() {
        expect(this.logInButton).toBeVisible();
    }

}