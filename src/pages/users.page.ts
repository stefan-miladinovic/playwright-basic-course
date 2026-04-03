/**
 * This class contains all the elements for the Users page.
 */

import { Locator, Page, expect } from "@playwright/test";
import { CommonLoggedInPage } from "./commonLoggedIn.page";

export class UsersPage extends CommonLoggedInPage {
    readonly page: Page;
    readonly usersTable: Locator;
    readonly searchBox: Locator;
    readonly addNewUserButton: Locator;
    readonly userNameField: Locator;
    readonly tableRow: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.usersTable = page.getByTestId('users-table');
        this.searchBox = page.getByTestId('users-search');
        this.addNewUserButton = page.getByTestId('users-add');
        this.userNameField = page.getByTestId('users-cell-name');
        this.tableRow = page.getByTestId('users-table-row');
    }

    // Open Users page directly
    async open() {
        await this.page.goto('/users');
        await expect(this.usersTable).toBeVisible();
    }

    async goToPageFromUi() {
        await this.clickUsersTab();
        await expect(this.usersTable).toBeVisible();
    }

    /**
     * Finds a User in the Users table, based on it's name.
     * @param userName 
     * @returns row Locator or null if not found.
     */
    async findUserInTable(userName: string): Promise<Locator | null> {

        await this.tableRow.first().waitFor();  // This just waits for table to populate

        const userRow = this.tableRow.filter({
            has: this.userNameField.getByText(userName, { exact: true }
            )
        });

        if (await userRow.count() == 1) {
            return userRow;
        }

        console.log(`User ${userName} not found in table!`);
        return null;
    };
}