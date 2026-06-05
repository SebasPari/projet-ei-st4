import { useEffect, useState } from 'react';
import axios from 'axios';
import { Movie } from '../../components/Movie/Movie';

function RecommendedMovies() {
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [loadingError, setLoadingError] = useState(null);

  // On récupère l'utilisateur connecté
  const selectedUser = JSON.parse(localStorage.getItem('selectedUser'));

  useEffect(() => {
    if (selectedUser === null) {
      return;
    }

    axios
      .get(`http://localhost:8000/recommendations/${selectedUser.id}`)
      .then((response) => {
        setRecommendedMovies(response.data.movies);
      })
      .catch((error) => {
        setLoadingError('Erreur lors du chargement des recommandations.');
        console.error(error);
      });
  }, []);

  if (selectedUser === null) {
    return (
      <p>
        Veuillez d'abord choisir un utilisateur sur la{' '}
        <a href="/">page d'accueil</a>.
      </p>
    );
  }

  if (loadingError) {
    return <p>{loadingError}</p>;
  }

  if (recommendedMovies.length === 0) {
    return <p>Pas encore de recommandations. Note quelques films d'abord !</p>;
  }

  return (
    <div>
      <h1>Films recommandés pour {selectedUser.firstname}</h1>
      {recommendedMovies.map((movie) => (
        <Movie key={movie.id} movie={movie} />
      ))}
    </div>
  );
}

export default RecommendedMovies;
