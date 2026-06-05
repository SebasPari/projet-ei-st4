import { Link } from 'react-router-dom';
import { useState } from 'react';
import './Home.css';
import { useFetchMovies } from './useFetchMovies';
import { Movie } from '../../components/Movie/Movie';
import { Pagination } from '../../components/Pagination/Pagination';
import { useFetchUsers } from '../Users/useFetchUsers';

function Home() {
  const [movieName, setMovieName] = useState('');
  const [sortType, setSortType] = useState('');
  const [dateOrder, setDateOrder] = useState('recent');
  const [currentPage, setCurrentPage] = useState(1);
  const { movies, moviesLoadingError, fetchMovies } = useFetchMovies();
  const savedUser = JSON.parse(localStorage.getItem('selectedUser'));
  const [selectedUser, setSelectedUser] = useState(savedUser);
  const { users } = useFetchUsers();

  function handleChange(e) {
    setMovieName(e.target.value);
  }

  function getSortOrder(selectedSortType, selectedDateOrder) {
    if (selectedSortType === 'release_date') {
      if (selectedDateOrder === 'old') {
        return 'ASC';
      }

      return 'DESC';
    }
    if (
      selectedSortType === 'vote_average' ||
      selectedSortType === 'vote_count'
    ) {
      return 'DESC';
    }

    return 'ASC';
  }

  function handleSortChange(e) {
    const newSortType = e.target.value;
    const sort = newSortType || 'id';
    const order = getSortOrder(newSortType, dateOrder);
    setSortType(newSortType);
    setCurrentPage(1);
    fetchMovies(1, sort, order);
  }

  function handleDateOrderClick() {
    let newDateOrder = 'recent';
    if (dateOrder === 'recent') {
      newDateOrder = 'old';
    }
    setDateOrder(newDateOrder);
    setCurrentPage(1);
    fetchMovies(1, 'release_date', getSortOrder('release_date', newDateOrder));
  }

  function handlePageClick(page) {
    const sort = sortType || 'id';
    const order = getSortOrder(sortType, dateOrder);
    setCurrentPage(page);
    fetchMovies(page, sort, order);
  }

  const filteredMovies = movies.movies?.filter((film) => {
    return film.title.toLowerCase().includes(movieName.toLowerCase());
  });

  const listItems = filteredMovies?.map((movie) => (
    <Movie key={movie.id} movie={movie}></Movie>
  ));

  // Si aucun utilisateur n'est choisi, on affiche la liste
  if (selectedUser === null) {
    return (
      <main className="user-selection-page">
        <h1>Qui êtes-vous ?</h1>
        <p>Choisis un utilisateur pour afficher les films et personnaliser les recommandations.</p>
        <div className="user-list">
          {users.map((user) => (
            <button
              key={user.id}
              onClick={() => {
                setSelectedUser(user);
                localStorage.setItem('selectedUser', JSON.stringify(user));
              }}
            >
              {user.firstname} {user.lastname}
            </button>
          ))}
        </div>
      </main>
    );
  }

  return (
    <div className="App">
      <main className="Home-page">
        <h1>Filmorama</h1>
        <div className="home-user-panel">
          <p>
            Connecté en tant que : <strong>{selectedUser.firstname}{' '}
            {selectedUser.lastname}</strong>
          </p>
          <div className="home-actions">
            <Link className="primary-action" to="/recommendations">
              Voir mes recommandations
            </Link>
            <button
              className="secondary-action"
              onClick={() => {
                localStorage.removeItem('selectedUser');
                setSelectedUser(null);
              }}
            >
              Changer d'utilisateur
            </button>
          </div>
        </div>
        <div className="search-bar">
          <input
            value={movieName}
            onChange={handleChange}
            placeholder="Rechercher un film"
          />
          <select value={sortType} onChange={handleSortChange}>
            <option value="">Trier par</option>
            <option value="title">Titre</option>
            <option value="release_date">Date de sortie</option>
            <option value="vote_average">Note moyenne</option>
            <option value="vote_count">Nombre de votes</option>
          </select>
          {sortType === 'release_date' && (
            <button onClick={handleDateOrderClick}>
              {dateOrder === 'recent' ? 'Plus récent' : 'Plus ancien'}
            </button>
          )}
        </div>
        {moviesLoadingError && (
          <p className="error-message">{moviesLoadingError}</p>
        )}
        <section className="movies-grid">{listItems}</section>
        <Pagination
          currentPage={currentPage}
          totalPages={movies.totalPages || 0}
          onPageClick={handlePageClick}
        />
      </main>
    </div>
  );
}

export default Home;
