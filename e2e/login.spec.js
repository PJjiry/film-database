import {test, expect} from '@playwright/test';
import {login} from "./utils.js";

test.describe("Login", () => {
    let page;
    test.beforeEach(async ({browser}) => {
        page = await browser.newPage();
    });
    test.afterEach(async () => {
        await page.close();
    });

    test("login to the app as admin", async () => {
        await login(page, 'admin', 'admin123')
        await expect(page.getByText('Logged in as admin')).toBeVisible();
    })

    test("logout from the app", async () => {
        await login(page, 'admin', 'admin123')
        await page.getByRole('button', {name: 'Logout'}).click();
        await expect(page.getByRole('heading', {name: 'Login'})).toBeVisible()
    })
})

