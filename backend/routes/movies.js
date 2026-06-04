import express from 'express';
import { appDataSource } from '../datasource.js';
import Movie from '../entities/movies.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const movieRepository = appDataSource.getRepository(Movie);
  const allMovies = await movieRepository.find();
  console.log(allMovies);
  res.json({ allMovies });
});

router.post('/new', function (req, res) {
  const movieRepository = appDataSource.getRepository(Movie);
  const newMovie = movieRepository.create({
    title: req.body.title,
    release_date: req.body.release_date,
  });
  movieRepository.insert(newMovie).then(console.log('New movie saved'));
});

router.get('/:id', (req, res) => {
  const movieId = Number(req.params.id);

  if (Number.isNaN(movieId)) {
    res.status(400).json({ message: 'Invalid movie id' });
    return;
  }

  appDataSource
    .getRepository(Movie)
    .findOneBy({ id: movieId })
    .then(function (movie) {
      if (movie == null) {
        res.status(404).json({ message: 'Movie not found' });
      } else {
        res.status(200).json({ movie: movie });
        console.log('movie found');
      }
    })
    .catch(function () {
      res.status(500).json({ message: 'Movie not found' });
      console.log('movie not found');
    });
});

router.delete('/delete/:id', function (req, res) {
  appDataSource
    .getRepository(Movie)
    .delete({ id: req.params.id })
    .then(function (movie) {
      if (movie == null) {
        res.status(404).json({ message: 'Movie does not exist' });
      } else {
        res.status(200).json({ message: 'Movie deleted' });
        console.log('movie deleted');
      }
    })
    .catch(function () {
      res.status(500).json({ message: 'Error while deleting the user' });
    });
});

export default router;
