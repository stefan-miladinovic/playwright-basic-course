import { test } from "../src/fixtures/user.fixture"
import { LoginPage } from "../src/pages/login.page";
import { CommonLoggedInPage } from "../src/pages/commonLoggedIn.page";

test.describe('Login and logout tests @Login @Logout @Local', () => {

    test.beforeAll(async ({ newUser }) => {
        console.log(`Running the tests with user: ${newUser.username}`);
    });

    test('Login as user', async ({ page, newUser }) => {
        const loginPage = new LoginPage(page);
        await loginPage.loginAsUser(newUser.username, newUser.password);
        const commonLoggedInPage = new CommonLoggedInPage(page);
        await commonLoggedInPage.userIsLoggedIn();
    });

    test('Login and logout as user', async ({ page, newUser }) => {
        const loginPage = new LoginPage(page);
        await loginPage.loginAsUser(newUser.username, newUser.password);
        const commonLoggedInPage = new CommonLoggedInPage(page);
        await commonLoggedInPage.userIsLoggedIn();
        await commonLoggedInPage.logout();
        await loginPage.userIsLoggedOut();
    });
});