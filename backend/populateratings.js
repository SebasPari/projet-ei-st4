import 'dotenv/config';
import { appDataSource } from './datasource.js';
import Rating from './entities/rating.js';
import User from './entities/user.js';
import Movie from './entities/movies.js';

appDataSource.initialize().then(async () => {
  const ratingRepository = appDataSource.getRepository(Rating);
  const userRepository = appDataSource.getRepository(User);
  const movieRepository = appDataSource.getRepository(Movie);

  // On récupère tous les utilisateurs et tous les films
  const users = await userRepository.find();
  const movies = await movieRepository.find();

  console.log(`${users.length} utilisateurs trouvés`);
  console.log(`${movies.length} films trouvés`);

  for (const user of users) {
    // On mélange les films au hasard
    const shuffledMovies = movies.sort(() => Math.random() - 0.5);

    // On prend les 100 premiers
    const moviesToRate = shuffledMovies.slice(0, 100);

    for (const movie of moviesToRate) {
      // On génère une note aléatoire entre 1 et 10
      const randomRating = Math.floor(Math.random() * 10) + 1;

      const newRating = ratingRepository.create({
        userId: user.id,
        movieId: movie.id,
        rating: randomRating,
      });

      await ratingRepository.save(newRating);
    }

    console.log(`Notes créées pour ${user.firstname} ${user.lastname}`);
  }

  console.log('Toutes les notes ont été créées !');
  process.exit(0);
});
