import { defineConfig } from 'drizzle-kit'

export default defineConfig({
    schema: './src/schema.js',
    dialect: 'sqlite',
    dbCredentials: {
        url: 'file:db.sqlite',
    },
})