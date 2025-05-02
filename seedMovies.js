import { db } from './src/app.js';
import { moviesTable } from './src/schema.js';

async function seedMovies() {
    await db.insert(moviesTable).values([
        {
            title: "The Matrix",
            description: "A computer hacker learns about the true nature of his reality and his role in the war against its controllers.",
            imageUrl:"https://image.pmgstatic.com/cache/resized/w420/files/images/film/posters/000/008/8959_164d69.jpg",
            rating_sum: 45,
            rating_count: 10,
        },
        {
            title: "Inception",
            description: "A thief who steals corporate secrets through use of dream-sharing technology is given the inverse task of planting an idea.",
            imageUrl:"https://refstatic.sk/movie/614f09b6c7ba9257d51b.jpg?is=400x600c&c=2w&s=2bac48a7441678fee73277b393efbc1e17b879917b6ee1b4de2dbd77c4331b05",
            rating_sum: 50,
            rating_count: 12,
        },
        {
            title: "The Godfather",
            description: "The aging patriarch of an organized crime dynasty transfers control to his reluctant son.",
            imageUrl:"https://m.media-amazon.com/images/M/MV5BNGEwYjgwOGQtYjg5ZS00Njc1LTk2ZGEtM2QwZWQ2NjdhZTE5XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
            rating_sum: 100,
            rating_count: 20,
        },
        {
            title: "Pulp Fiction",
            description: "The lives of two mob hitmen, a boxer, a gangster's wife, and a pair of diner bandits intertwine.",
            imageUrl:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQy66QXrTAXAx__JYPE1oFlKLK2l29el7T3Bw&s",
            rating_sum: 70,
            rating_count: 15,
        },
    ]);

    console.log('Movies added!');
    process.exit(0);
}

seedMovies();