import axios from 'axios';
import 'dotenv/config'; // Pour avoir accès au .env problème qu'on a eu
import typeorm from 'typeorm';
import Movie from './entities/movies.js';
import { appDataSource } from './datasource.js';

let movieRepository;

function addMovies(movieList) {
  // J'ai essayé de faire une liste puis save la liste de movies dans la db mais il y avait de problemes avec les doublons, des qu'il y avait un doublon on laissé tomber toute la liste
  movieList.forEach((movie) => {
    const newMovie = movieRepository.create({
      title: movie.title,
      release_date: movie.release_date,
      original_language: movie.original_language,
      overview: movie.overview,
      poster_path: movie.poster_path,
      vote_average: movie.vote_average,
      vote_count: movie.vote_count,
    });
    movieRepository
      .save(newMovie)
      .then(() => {
        // On ne met pas de console.log ici pour ne pas avoir 400 messages
      })
      .catch((error) => {
        console.log('Doublon ignoré : ' + movie.title);
      });
  });
}

function populateMovies() {
  //The API only gives you the films on a page, each page has 20 films. So to add lots of films we have to look at many pages
  for (let pageNumber = 1; pageNumber <= 150; pageNumber++) {
    axios
      .get(
        `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${pageNumber}&sort_by=popularity.desc`,

        {
          headers: {
            Authorization:
              'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxZjlmNjAwMzY4MzMzODNkNGIwYjNhNzJiODA3MzdjNCIsInN1YiI6IjY0NzA5YmE4YzVhZGE1MDBkZWU2ZTMxMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Em7Y9fSW94J91rbuKFjDWxmpWaQzTitxRKNdQ5Lh2Eo',
            accept: 'application/json',
          },
        }
      )
      .then((response) => {
        const movieList = response.data.results;

        if (movieList) {
          addMovies(movieList);
          console.log(
            "Les demandes d'ajout ont été envoyées à la base de données !"
          );
        }
      })
      .catch((error) => {
        console.error(
          'Erreur lors du téléchargement depuis TMDB :',
          error.message
        );
      });
  }
}

appDataSource
  .initialize()
  .then(() => {
    console.log('🔌 Base de données connectée avec succès !');

    movieRepository = appDataSource.getRepository(Movie);

    populateMovies();
  })
  .catch((error) => {
    console.error('Impossible de se connecter à la base de données :', error);
  });
