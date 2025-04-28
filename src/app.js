import { Hono } from 'hono'
import { serveStatic } from '@hono/node-server/serve-static'
import { logger } from 'hono/logger'
import { renderFile } from 'ejs'
import { drizzle } from 'drizzle-orm/libsql'
import { eq } from 'drizzle-orm'
import {moviesTable, usersTable} from "./schema.js";


export const db = drizzle({
    connection: "file:db.sqlite",
    logger: true,
})

export const app = new Hono()

app.use(logger())
app.use(serveStatic({ root: './public' }))

app.use(async (c, next) => {
    const currentUser = await db.select().from(usersTable).where(eq(usersTable.id, 1)).get()
    c.set('currentUser', currentUser)
    await next()
})

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

    return c.redirect(`/movie/${id}`)
})

app.get('/movie/add', async (c) => {
    const currentUser = c.get('currentUser')
    if (currentUser.role !== 'admin') return c.text('Forbidden', 403)

    const html = await renderFile('views/add.html')
    return c.html(html)
})

app.post('/movie/add', async (c) => {
    const currentUser = c.get('currentUser')
    if (currentUser.role !== 'admin') return c.text('Forbidden', 403)

    const form = await c.req.formData()
    const title = form.get('title')
    const description = form.get('description')

    await db.insert(moviesTable).values({
        title,
        description,
        ratingSum: 0,
        ratingCount: 0,
    })

    return c.redirect('/')
})

app.get('/movie/:id/edit', async (c) => {
    const currentUser = c.get('currentUser')
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

    await db.update(moviesTable)
        .set({ title, description })
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

