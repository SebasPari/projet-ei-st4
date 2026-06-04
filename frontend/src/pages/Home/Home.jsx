import { useState } from 'react';
import logo from './logo.svg';
import './Home.css';
import { useFetchMovies } from './useFetchMovies';
import { Movie } from '../../components/Movie/Movie';
import { Pagination } from '../../components/Pagination/Pagination';

function Home() {
  const [movieName, setMovieName] = useState('');
  const [sortType, setSortType] = useState('');
  const [dateOrder, setDateOrder] = useState('recent');
  const [currentPage, setCurrentPage] = useState(1);
  const { movies, moviesLoadingError, fetchMovies } = useFetchMovies();
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

  return (
    <div className="App">
      <header className="App-header">
        <h1>Filmorama</h1>
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
