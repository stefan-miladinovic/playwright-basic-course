/**
 * This class contains all the elements for the Heroes page.
 */

import { Locator, Page, expect } from "@playwright/test";
import { CommonLoggedInPage } from "./commonLoggedIn.page";

export class HeroesPage extends CommonLoggedInPage {
    readonly page: Page;
    readonly heroesTable: Locator;
    readonly searchBox: Locator;
    readonly addNewHeroButton: Locator;
    readonly heroNameField: Locator;
    readonly tableRow: Locator;

    constructor(page: Page) {
        super(page);
        this.page = page;
        this.heroesTable = page.getByTestId('heroes-table');
        this.searchBox = page.getByTestId('heroes-search');
        this.addNewHeroButton = page.getByTestId('heroes-add');
        this.heroNameField = page.getByTestId('heroes-cell-name');
        this.tableRow = page.getByTestId('heroes-table-row');
    }

    // Open Heroes page directly
    async open() {
        await this.page.goto('/heroes');
        await expect(this.heroesTable).toBeVisible();
    }

    async goToPageFromUi() {
        await this.clickHeroesTab();
        await expect(this.heroesTable).toBeVisible();
    }

    /**
     * Finds a Hero in the Heroes table, based on it's name.
     * @param heroName 
     * @returns row Locator or null if not found.
     */
    async findHeroInTable(heroName: string): Promise<Locator | null> {

        await this.tableRow.first().waitFor();  // This just waits for table to populate

        // Here we filter all found table rows by the query we passed as parameter: heroName.
        // Since Hero names are unique in our application, we expect the result to be
        // either one row or none.
        const heroRow = this.tableRow.filter({
            has: this.heroNameField.getByText(heroName, { exact: true }
            )
        });

        // We check this by counting the elements in heroRow. Return the row if there is one.
        if (await heroRow.count() == 1) {
            console.log(`Hero ${heroName} found in table!`);
            return heroRow;
        }

        // ... and return null if no Heroes by this name were found.
        console.log(`Hero ${heroName} not found in table!`);
        return null;
    };

    /**
     * Deletes the hero from the Heroes table.
     * @param heroName 
     */
    async deleteHeroFromTable(heroName: string) {
        const heroRow: Locator | null = await this.findHeroInTable(heroName);
        if (heroRow !== null) {
            await heroRow.getByTestId('heroes-btn-delete').click();
            const modal = this.page.getByTestId('delete-hero-modal');
            await modal.getByRole("button", { name: "Delete "}).click();
            await expect(modal).not.toBeVisible();
        } else {
            console.log(`Hero ${heroName} not found in table!`);
        }
    };

    async verifyDeleteButtonIsDisabled(heroName: string) {
        const heroRow: Locator | null = await this.findHeroInTable(heroName);
        if (heroRow !== null) {
            expect(heroRow.getByTestId('heroes-btn-delete')).toBeDisabled();
        } else {
            console.log(`Hero ${heroName} not found in table!`);
            expect(false).toBeTruthy();
        }
    };

}