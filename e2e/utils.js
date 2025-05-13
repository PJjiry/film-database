export async function login(page, username, password) {
    await page.goto('/login');
    await page.getByRole('textbox', {name: 'Username'}).fill(username);
    await page.getByRole('textbox', {name: 'Password'}).fill(password);
    await page.getByRole('button', {name: 'Login'}).click();
}

export async function fillInTheMovieForm(page, title, description, imageUrl) {
    await page.getByRole('textbox', {name: 'Movie title'}).fill(title);
    await page.getByRole('textbox', {name: 'Description'}).fill(description);
    await page.getByRole('textbox', {name: 'Image URL'}).fill(imageUrl);
    await page.getByRole('button', {name: 'Submit'}).click();
}