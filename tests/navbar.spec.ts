import { test, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/login.page';
import { getTranslations } from '../src/utils/localization.util';
import { CommonLoggedInPage } from '../src/pages/commonLoggedIn.page';

test('Check the Nav Bar - localization demo', async ({ page }, testInfo) => {

    const locale = testInfo.project.name;
    const t = getTranslations(locale);

    const loginPage = new LoginPage(page);
    await loginPage.loginAsAdmin();
    const commonLoggedInPage = new CommonLoggedInPage(page);

    const actualText = await commonLoggedInPage.getUsersTabText();

    expect(actualText).toBe(t['users.navbar']);
});
