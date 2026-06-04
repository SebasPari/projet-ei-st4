import express from 'express';
import { appDataSource } from '../datasource.js';
import Movie from '../entities/movies.js';
import { useFetchMovies } from '../frontend/src/pages/Home/useFetchMovies';

const router = express.Router();

router.get('/', async (req, res) => {
  const movieRepository = appDataSource.getRepository(Movie);
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 100;
  const skip = (page - 1) * limit;
  const sort = req.query.sort || 'id';
  const order = req.query.order || 'ASC';
  const sortColumns = ['id', 'title', 'release_date', 'vote_average', 'vote_count'];
  const sortColumn = sortColumns.includes(sort) ? sort : 'id';
  const sortOrder = order === 'DESC' ? 'DESC' : 'ASC';

  const [movies, totalMovies] = await movieRepository.findAndCount({
    skip: skip,
    take: limit,
    order: {
      [sortColumn]: sortOrder,
    },
  });

  res.json({
    movies: movies,
    totalMovies: totalMovies,
    totalPages: Math.ceil(totalMovies / limit),
    currentPage: page,
  });
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
  appDataSource
    .getRepository(Movie)
    .findOneBy({ id: req.params.id })
    .then(function (movie) {
      if (movie == null) {
        res.status(404).json({ message: 'Movie not found' });
      } else {
        res.status(200).json({ message: movie.title });
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

function ajoutfilm (movie){
const { movies, moviesLoadingError, fetchMovies } = useFetchMovies();

}

const listItems = movies.results?.map((m) => );
  

export default router;
