import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import './MovieDetails.css';

function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loadingError, setLoadingError] = useState(null);
  const [rating, setRating] = useState('');
  const [ratingMessage, setRatingMessage] = useState('');
  const selectedUser = JSON.parse(localStorage.getItem('selectedUser'));
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

  if (selectedUser === null) {
    return (
      <p>
        Veuillez d'abord choisir un utilisateur sur la{' '}
        <a href="/">page d'accueil</a>.
      </p>
    );
  }

  function handleRatingSubmit() {
    if (rating === '') {
      setRatingMessage('Choisis une note avant d’envoyer.');
      return;
    }

    axios
      .post(`${import.meta.env.VITE_BACKEND_URL}/ratings/new`, {
        userId: selectedUser.id,
        movieId: movie.id,
        rating: Number(rating),
      })
      .then(() => {
        setRatingMessage('Note sauvegardée !');
      })
      .catch(() => {
        setRatingMessage('Erreur lors de la sauvegarde.');
      });
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
            <span>
              {movie.vote_average ? `${movie.vote_average}/10` : 'Non noté'}
            </span>
            <span>{movie.vote_count || 0} votes</span>
          </div>
          <p>{movie.overview || 'Aucun résumé disponible.'}</p>

          <div className="rating-panel">
            <h3>Donner une note à ce film</h3>
            <p>
              Connecté en tant que : {selectedUser.firstname}{' '}
              {selectedUser.lastname}
            </p>
            <div className="rating-options">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((note) => (
                <button
                  className={Number(rating) === note ? 'selected-rating' : ''}
                  key={note}
                  onClick={() => setRating(String(note))}
                  type="button"
                >
                  {note}
                </button>
              ))}
            </div>
            <button className="rating-submit" onClick={handleRatingSubmit}>
              Enregistrer ma note
            </button>
            {ratingMessage && (
              <p className="rating-message">
                {ratingMessage}{' '}
                {ratingMessage === 'Note sauvegardée !' && (
                  <Link to="/recommendations">Voir mes recommandations</Link>
                )}
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default MovieDetails;
