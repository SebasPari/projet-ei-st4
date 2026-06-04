import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import './MovieDetails.css';

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
    return <p className="movie-details-message">{loadingError}</p>;
  }

  if (movie === null) {
    return <p className="movie-details-message">Loading movie details...</p>;
  }

  return (
    <main className="movie-details-page">
      <Link className="back-link" to="/">
        Retour aux films
      </Link>

      <section className="movie-details">
        {movie.poster_path && (
          <img
            className="movie-details-poster"
            src={`${baseURL}${movie.poster_path}`}
            alt={movie.title}
          />
        )}

        <div className="movie-details-content">
          <h1>{movie.title}</h1>
          <div className="movie-details-meta">
            <span>{movie.release_date || 'Date inconnue'}</span>
            <span>{movie.original_language || 'Langue inconnue'}</span>
            <span>{movie.vote_average ? `${movie.vote_average}/10` : 'Non note'}</span>
            <span>{movie.vote_count || 0} votes</span>
          </div>
          <p>{movie.overview || 'Aucun resume disponible pour ce film.'}</p>
        </div>
      </section>
    </main>
  );
}

export default MovieDetails;
