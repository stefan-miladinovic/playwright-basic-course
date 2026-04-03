import { HeroesPage } from "../src/pages/heroes.page";
import { LoginPage } from "../src/pages/login.page";
import { test, expect, HeroResponse } from "../src/fixtures/hero.fixture";

let myHero: HeroResponse;
let userName: string;
let password: string;

test.describe('Heroes tests @Heroes @Local @Remote', () => {

    test.beforeAll(async ({ newUser, newCustomHero }) => {
        myHero = await newCustomHero({
            name: "Bilbo",
            type: "Necromancer",
            level: 60,
        });

        userName = newUser.username;
        password = newUser.password;
    });

    test('Verify the hero exists as admin @Admin', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.loginAsAdmin();

        const heroesPage = new HeroesPage(page);
        await heroesPage.goToPageFromUi();

        expect(await heroesPage.findHeroInTable(myHero.name)).not.toBeNull();
    });

    test('Delete the hero as admin @Admin', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.loginAsAdmin();

        const heroesPage = new HeroesPage(page);
        await heroesPage.goToPageFromUi();

        await heroesPage.deleteHeroFromTable(myHero.name);
        expect(await heroesPage.findHeroInTable(myHero.name)).toBeNull();
    });

    test(`Try to delete other Users's hero as user @User`, async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.loginAsUser(userName, password);

        const heroesPage = new HeroesPage(page);
        await heroesPage.goToPageFromUi();

        await heroesPage.verifyDeleteButtonIsDisabled("Frfljavi");
    })
});

