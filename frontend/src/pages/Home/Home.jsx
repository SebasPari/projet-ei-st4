import { useState } from 'react';
import logo from './logo.svg';
import './Home.css';
import { useFetchMovies } from './useFetchMovies';
import { Movie } from '../../components/Movie/Movie';

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

    if (selectedSortType === 'vote_average' || selectedSortType === 'vote_count') {
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

  const listItems = movies.movies?.map((m) => <Movie key={m.id} movie={m}></Movie>);
  const pages = [];
  const totalPages = movies.totalPages || 0;
  const firstPage = Math.max(currentPage - 2, 1);
  const lastPage = Math.min(currentPage + 2, totalPages);

  if (totalPages > 0) {
    pages.push(
      <button
        key="previous"
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1}
      >
        &lt;
      </button>
    );
  }

  for (let i = firstPage; i <= lastPage; i++) {
    pages.push(
      <button
        key={i}
        onClick={() => handlePageClick(i)}
        disabled={i === currentPage}
      >
        {i}
      </button>
    );
  }

  if (lastPage < totalPages) {
    pages.push(<button key="dots" disabled>...</button>);
    pages.push(
      <button key="last-page" disabled>
        {totalPages}
      </button>
    );
  }

  const filteredMovies = sortedMovies?.filter((film) => {
    return film.title.toLowerCase().includes(movieName.toLowerCase());
  });

  const listItems = filteredMovies?.map((m) => <Movie movie={m}></Movie>);
  if (totalPages > 0) {
    pages.push(
      <button
        key="next"
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        &gt;
      </button>
    );
  }

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
        <div className="pagination">{pages}</div>
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
