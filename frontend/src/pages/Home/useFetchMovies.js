import { useEffect, useState } from 'react';
import axios from 'axios';

export function useFetchMovies() {
  const [movies, setMovies] = useState({});
  const [moviesLoadingError, setUsersLoadingError] = useState(null);

  const fetchMovies = (page, sort, order) => {
    setUsersLoadingError(null);

    axios
      .get(
        `http://localhost:8000/movies?page=${page}&limit=100&sort=${sort}&order=${order}`
      )
      .then((response) => {
        setMovies(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        setUsersLoadingError('An error occured while fetching movies.');
        console.error(error);
      });
  };

  useEffect(() => {
    fetchMovies(1, 'id', 'ASC');
  }, []);

  return { movies, moviesLoadingError, fetchMovies };
}
