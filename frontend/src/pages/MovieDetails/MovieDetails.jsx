import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loadingError, setLoadingError] = useState(null);
  const baseURL = 'https://image.tmdb.org/t/p/w500';

  useEffect(() => {
    setLoadingError(null);

    axios
      .get(`${import.meta.env.VITE_BACKEND_URL}/movies/${id}`)
      .then((response) => {
        setMovie(response.data.movie);
      })
      .catch((error) => {
        setLoadingError('An error occured while fetching movie details.');
        console.error(error);
      });
  }, [id]);

  if (loadingError) {
    return <p>{loadingError}</p>;
  }

  if (movie === null) {
    return <p>Loading movie details...</p>;
  }

  return (
    <main>
      <h1>{movie.title}</h1>

      {movie.poster_path && (
        <img
          src={`${baseURL}${movie.poster_path}`}
          alt={movie.title}
          width="200"
        />
      )}

      <p>Release date: {movie.release_date}</p>
      <p>Original language: {movie.original_language}</p>
      <p>Average vote: {movie.vote_average}</p>
      <p>Vote count: {movie.vote_count}</p>
      <p>{movie.overview}</p>
    </main>
  );
}

export default MovieDetails;
