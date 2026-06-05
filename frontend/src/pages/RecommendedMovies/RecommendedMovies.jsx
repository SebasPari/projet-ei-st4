import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Movie } from '../../components/Movie/Movie';
import './RecommendedMovies.css';

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
      .get(`${import.meta.env.VITE_BACKEND_URL}/recommendations/${selectedUser.id}`)
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
      <main className="recommendations-empty">
        <h1>Choisis d'abord un utilisateur</h1>
        <p>
          Les recommandations sont personnalisées. Retourne sur l'accueil pour
          choisir ton profil.
        </p>
        <Link className="recommendations-link" to="/">
          Choisir un utilisateur
        </Link>
      </main>
    );
  }

  if (loadingError) {
    return <p className="recommendations-error">{loadingError}</p>;
  }

  if (recommendedMovies.length === 0) {
    return (
      <main className="recommendations-empty">
        <h1>Pas encore de recommandations</h1>
        <p>
          Note quelques films pour aider l'algorithme à comprendre tes goûts.
        </p>
        <Link className="recommendations-link" to="/">
          Découvrir des films à noter
        </Link>
      </main>
    );
  }

  return (
    <main className="recommendations-page">
      <section className="recommendations-header">
        <div>
          <h1>Films recommandés pour {selectedUser.firstname}</h1>
          <p>
            Ces films sont proposés à partir des notes données par des
            utilisateurs aux goûts proches.
          </p>
        </div>
        <div className="recommendations-actions">
          <Link className="recommendations-secondary-link" to="/">
            Retour aux films
          </Link>
          <Link className="recommendations-link" to="/users">
            Gérer les utilisateurs
          </Link>
        </div>
      </section>

      <section className="recommendations-grid">
        {recommendedMovies.map((movie) => (
          <Movie key={movie.id} movie={movie} />
        ))}
      </section>
    </main>
  );
}

export default RecommendedMovies;
