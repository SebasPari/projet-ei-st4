import express from 'express';
import { ILike } from 'typeorm';
import { appDataSource } from '../datasource.js';
import Movie from '../entities/movies.js';

const router = express.Router();

// Route pour get les movies de la base de données pour les afficher dans la page d'acueil
router.get('/', async (req, res) => {
  const movieRepository = appDataSource.getRepository(Movie);
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 100;
  const skip = (page - 1) * limit;
  const sort = req.query.sort || 'id';
  const order = req.query.order || 'ASC';
  const sortColumns = [
    'id',
    'title',
    'release_date',
    'vote_average',
    'vote_count',
  ];
  const sortColumn = sortColumns.includes(sort) ? sort : 'id';
  const sortOrder = order === 'DESC' ? 'DESC' : 'ASC';

  const search = req.query.search || '';

  const [movies, totalMovies] = await movieRepository.findAndCount({
    skip: skip,
    take: limit,
    order: {
      [sortColumn]: sortOrder,
    },
    where: search ? { title: ILike(`%${search}%`) } : {},
  });

  res.json({
    movies: movies,
    totalMovies: totalMovies,
    totalPages: Math.ceil(totalMovies / limit),
    currentPage: page,
  });
});

// Route pour créer un nouveau film dans la base de données
router.post('/new', function (req, res) {
  const movieRepository = appDataSource.getRepository(Movie);
  const newMovie = movieRepository.create({
    title: req.body.title,
    release_date: req.body.release_date,
  });
  movieRepository.insert(newMovie).then(console.log('New movie saved'));
});

// Route pour get un film selon son id
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

// Route pour enlever un film
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
