import { useEffect, useState } from 'react';
import axios from 'axios';

export function useFetchMovies() {
  const [movies, setMovies] = useState([]);
  const [moviesLoadingError, setUsersLoadingError] = useState(null);

  const fetchMovies = () => {
    setUsersLoadingError(null);

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/movies`)
      .then((response) => {
        setMovies({ results: response.data.allMovies });
      })
      .catch((error) => {
        setUsersLoadingError('An error occured while fetching movies.');
        console.error(error);
      });
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  return { movies, moviesLoadingError, fetchMovies };
}
