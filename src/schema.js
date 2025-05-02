import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core'

export const moviesTable = sqliteTable('movies', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    title: text('title').notNull(),
    description: text('description').notNull(),
    ratingSum: integer('rating_sum').default(0).notNull(),
    ratingCount: integer('rating_count').default(0).notNull(),
})

export const usersTable = sqliteTable('users', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    username: text('username').notNull().unique(),
    role: text('role').notNull(),
})