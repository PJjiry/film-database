import { db } from './src/app.js';
import { moviesTable } from './src/schema.js';

async function seedMovies() {
    await db.insert(moviesTable).values([
        {
            title: "The Matrix",
            description: "A computer hacker learns about the true nature of his reality and his role in the war against its controllers.",
            rating_sum: 45,
            rating_count: 10,
        },
        {
            title: "Inception",
            description: "A thief who steals corporate secrets through use of dream-sharing technology is given the inverse task of planting an idea.",
            rating_sum: 50,
            rating_count: 12,
        },
        {
            title: "The Godfather",
            description: "The aging patriarch of an organized crime dynasty transfers control to his reluctant son.",
            rating_sum: 100,
            rating_count: 20,
        },
        {
            title: "Pulp Fiction",
            description: "The lives of two mob hitmen, a boxer, a gangster's wife, and a pair of diner bandits intertwine.",
            rating_sum: 70,
            rating_count: 15,
        },
    ]);

    console.log('Movies added!');
    process.exit(0);
}

seedMovies();