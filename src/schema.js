import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core'

export const moviesTable = sqliteTable('movies', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    title: text('title').notNull().default(""),
    description: text('description').notNull().default(""),
    imageUrl: text('image_url').notNull().default(""),
    ratingSum: integer('rating_sum').default(0).notNull(),
    ratingCount: integer('rating_count').default(0).notNull(),
})

export const usersTable = sqliteTable('users', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    role: text('role').notNull().default("user"),
    username: text().notNull().unique(),
    hashedPassword: text().notNull().default(""),
    salt: text().notNull().default(""),
    token: text().notNull().default(""),
})