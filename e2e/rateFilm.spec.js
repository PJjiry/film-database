import {test, expect} from '@playwright/test';
import {login} from "./utils.js";

test.describe.serial("Rate film", () => {
    let page;
    test.beforeEach(async ({browser}) => {
        page = await browser.newPage();
    });

    test.afterEach(async () => {
        await page.close();
    });

    test("rate the film with 5 stars", async () => {
        await login(page, 'petr', 'petr123')
        await page.getByRole('link', {name: 'The Godfather The Godfather'}).click();
        await page.getByRole('combobox').selectOption('5');
        await page.getByRole('button', {name: 'Rate'}).click();
        await page.getByRole('link', {name: 'The Godfather The Godfather'}).click();
        await expect(page.getByText('Average rating: 5.00')).toBeVisible()
    })
})

