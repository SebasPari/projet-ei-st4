import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

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
    return <p>{loadingError}</p>;
  }

  if (movie === null) {
    return <p>Loading movie details...</p>;
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
    // Cette fonction permet de mettre une note sur un film selon l'utilisateur connecté
    axios
      .post('http://localhost:8000/ratings/new', {
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
      <div>
        <h3>Donner une note à ce film</h3>
        <p>
          Connecté en tant que : {selectedUser.firstname}{' '}
          {selectedUser.lastname}
        </p>
        <input
          type="number"
          min="1"
          max="10"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          placeholder="Note de 1 à 10"
        />
        <button onClick={handleRatingSubmit}>Envoyer</button>
        {ratingMessage && <p>{ratingMessage}</p>}
      </div>
    </main>
  );
}

export default MovieDetails;
