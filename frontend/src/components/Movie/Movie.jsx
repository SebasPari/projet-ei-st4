import { Link } from 'react-router-dom';
import './Movie.css';

export function Movie({ movie }) {
  const baseURL = 'https://image.tmdb.org/t/p/w500';
  const posterURL = movie.poster_path
    ? `${baseURL}${movie.poster_path}`
    : '/vite.svg';

  return (
    <Link className="movie-card" to={`/movies/${movie.id}`}>
      <img className="movie-poster" src={posterURL} alt={movie.title} />
      <div className="movie-info">
        <h2>{movie.title}</h2>
        <p>{movie.release_date || 'Date inconnue'}</p>
        <span>{movie.vote_average ? `${movie.vote_average}/10` : 'Non note'}</span>
      </div>
    </Link>
  );
}
