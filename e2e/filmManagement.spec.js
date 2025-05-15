import {test, expect} from '@playwright/test';
import {fillInTheMovieForm, login} from "./utils.js";

test.describe.serial("Film management", () => {
    let page;
    test.beforeEach(async ({browser}) => {
        page = await browser.newPage();
    });

    test.afterEach(async () => {
        await page.close();
    });

    test("add new film", async () => {
        await login(page, 'admin', 'admin123')
        await page.getByRole('button', {name: 'Add new film'}).click();
        await fillInTheMovieForm(page, 'Spiderman', 'Movie about the super-hero', 'https://image.pmgstatic.com/cache/resized/w420/files/images/film/posters/163/453/163453070_5eb51a.jpg')
        await page.getByRole('link', {name: 'Spiderman Spiderman Average'}).first().click();
        await expect(page.getByRole('heading', {name: 'Spiderman'})).toBeVisible()
        await expect(page.getByText('Movie about the super-hero')).toBeVisible()
    })

    test("edit film description", async () => {
        await login(page, 'admin', 'admin123')
        await page.getByRole('link', {name: 'Spiderman Spiderman Average'}).first().click();
        await page.getByRole('button', {name: 'Edit'}).click();
        await page.getByRole('textbox', {name: 'Description'}).fill('Second movie about the super-hero');
        await page.getByRole('button', {name: 'Save changes'}).click();
        await expect(page.getByText('Second movie about the super-hero')).toBeVisible();
    })

    test("delete film", async () => {
        await login(page, 'admin', 'admin123')
        await page.getByRole('link', {name: 'Spiderman Spiderman Average'}).first().click();
        await page.getByRole('button', {name: 'Delete'}).click();
        await page.once('dialog', dialog => {
            expect(dialog.type()).toBe('confirm');
            dialog.accept();
        });
        await expect(page.getByRole('link', {name: 'Spiderman Spiderman Average'})).not.toBeVisible()
    })
})

