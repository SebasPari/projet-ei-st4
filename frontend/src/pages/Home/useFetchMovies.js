import { useEffect, useState } from 'react';
import axios from 'axios';

export function useFetchMovies() {
  const [movies, setMovies] = useState({});
  const [moviesLoadingError, setUsersLoadingError] = useState(null);

  const fetchMovies = (page, sort, order, search = '') => {
    setUsersLoadingError(null);

    axios
      .get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/movies?page=${page}&limit=100&sort=${sort}&order=${order}&search=${search}`
      )
      .then((response) => {
        setMovies(response.data);
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
