import { useState } from 'react';
import logo from './logo.svg';
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
  const [selectedUser, setSelectedUser] = useState(null);
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

  // On crée la liste des films à afficher
  const listItems = filteredMovies?.map((movie) => (
    <Movie key={movie.id} movie={movie}></Movie>
  ));

  // Dans le cas ou l'utilisateur n'est pas connecté, il se connecte
  if (selectedUser === null) {
    return (
      <div className="App">
        <h1>Qui êtes-vous ?</h1>
        <ul>
          {users.map((user) => (
            <li key={user.id}>
              <button
                onClick={() => {
                  setSelectedUser(user);
                  localStorage.setItem('selectedUser', JSON.stringify(user));
                  // Local storage permet de stocker les infos sur l'utilisateur pour ensuite les utiliser dans l'algo de recommedation
                }}
              >
                {user.firstname} {user.lastname}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // On montre des films à l'aceuil une fois que l'utilisateur est connectée
  return (
    <div className="App">
      <header className="App-header">
        <h1>Filmorama</h1>
        <p>
          Connecté en tant que : {selectedUser.firstname}{' '}
          {selectedUser.lastname}
        </p>
        <div className="search-bar">
          <input value={movieName} onChange={handleChange} />
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
        <p>{movieName}</p>
        {moviesLoadingError && <p>{moviesLoadingError}</p>}
        {listItems}
        <Pagination
          currentPage={currentPage}
          totalPages={movies.totalPages || 0}
          onPageClick={handlePageClick}
        />
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.jsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://react.dev"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default Home;
