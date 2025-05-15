import { Hono } from 'hono'
import { serveStatic } from '@hono/node-server/serve-static'
import { renderFile } from 'ejs'
import { drizzle } from 'drizzle-orm/libsql'
import { eq } from 'drizzle-orm'
import { getCookie } from "hono/cookie";
import {moviesTable} from "./schema.js";
import {getUserByToken, usersRouter} from "./users.js";

export const db = drizzle({
    connection: "file:db.sqlite",
    logger: true,
})

export const app = new Hono()

app.use(serveStatic({ root: './public' }))

app.use(async (c, next) => {
    const token = getCookie(c, "token");
    const currentUser = await getUserByToken(token);
    if (currentUser) {
        c.set("currentUser", currentUser);
    }

    await next();
});

app.route("/", usersRouter)

app.get('/', async (c) => {
    const movies = await db.select().from(moviesTable).all()
    const currentUser = c.get('currentUser')
    const html = await renderFile('views/index.html', { movies, currentUser })

    return c.html(html)
})

app.get('/movie/:id', async (c) => {
    const id = Number(c.req.param('id'))
    const movie = await db.select().from(moviesTable).where(eq(moviesTable.id, id)).get()
    if (!movie) return c.notFound()

    const currentUser = c.get('currentUser')
    const html = await renderFile('views/detail.html', { movie, currentUser })

    return c.html(html)
})

app.post('/movie/:id/rate', async (c) => {
    const currentUser = c.get('currentUser')
    if (!currentUser) return c.text('Forbidden', 403)

    const id = Number(c.req.param('id'))
    const form = await c.req.formData()
    const rating = Number(form.get('rating'))

    const movie = await db.select().from(moviesTable).where(eq(moviesTable.id, id)).get()
    if (!movie) return c.notFound()

    await db.update(moviesTable)
        .set({
            ratingSum: movie.ratingSum + rating,
            ratingCount: movie.ratingCount + 1,
        })
        .where(eq(moviesTable.id, id))

    return c.redirect(`/`)
})

app.get('/add', async (c) => {
    const currentUser = c.get('currentUser');
    if (!currentUser) return c.text('Unauthorized', 401);
    if (currentUser.role !== 'admin') return c.text('Forbidden', 403)

    const html = await renderFile('views/add.html')

    return c.html(html)
})

app.post('/add', async (c) => {
    const currentUser = c.get('currentUser')
    if (currentUser.role !== 'admin') return c.text('Forbidden', 403)

    const form = await c.req.formData()
    const title = form.get('title')
    const description = form.get('description')
    const imageUrl = form.get('imageUrl')

    await db.insert(moviesTable).values({
        title,
        description,
        imageUrl,
        ratingSum: 0,
        ratingCount: 0,
    })

    return c.redirect('/')
})

app.get('/movie/:id/edit', async (c) => {
    const currentUser = c.get('currentUser');
    if (!currentUser) return c.text('Unauthorized', 401);
    if (currentUser.role !== 'admin') return c.text('Forbidden', 403)

    const id = Number(c.req.param('id'))
    const movie = await db.select().from(moviesTable).where(eq(moviesTable.id, id)).get()
    if (!movie) return c.notFound()

    const html = await renderFile('views/edit.html', { movie })

    return c.html(html)
})

app.post('/movie/:id/edit', async (c) => {
    const currentUser = c.get('currentUser')
    if (currentUser.role !== 'admin') return c.text('Forbidden', 403)

    const id = Number(c.req.param('id'))
    const form = await c.req.formData()
    const title = form.get('title')
    const description = form.get('description')
    const imageUrl = form.get('imageUrl')

    await db.update(moviesTable)
        .set({ title, description, imageUrl })
        .where(eq(moviesTable.id, id))

    return c.redirect(`/movie/${id}`)
})

app.post('/movie/:id/delete', async (c) => {
    const currentUser = c.get('currentUser')
    if (currentUser.role !== 'admin') return c.text('Forbidden', 403)

    const id = Number(c.req.param('id'))

    await db.delete(moviesTable).where(eq(moviesTable.id, id))

    return c.redirect('/')
})

