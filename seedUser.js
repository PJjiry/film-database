import { db } from './src/app.js';
import { usersTable } from './src/schema.js';

async function seedUser() {
    await db.insert(usersTable).values({
        username: "New admin user",
        role: "admin",
    });

    console.log('User added!');
    process.exit(0);
}

seedUser();