import { useState } from 'react';
import logo from './logo.svg';
import './Home.css';
import { useFetchMovies } from './useFetchMovies';
import { Movie } from '../../components/Movie/Movie';

function Home() {
  const [movieName, setMovieName] = useState('');
  const [sortType, setSortType] = useState('');
  const [dateOrder, setDateOrder] = useState('recent');
  const { movies, moviesLoadingError, fetchMovies } = useFetchMovies();
  function handleChange(e) {
    setMovieName(e.target.value);
  }

  function handleSortChange(e) {
    setSortType(e.target.value);
  }

  function handleDateOrderClick() {
    if (dateOrder === 'recent') {
      setDateOrder('old');
    } else {
      setDateOrder('recent');
    }
  }

  const sortedMovies = movies.results?.sort((movieA, movieB) => {
    if (sortType === 'title') {
      return movieA.title.localeCompare(movieB.title);
    }

    if (sortType === 'release_date') {
      if (dateOrder === 'old') {
        return movieA.release_date.localeCompare(movieB.release_date);
      }

      return movieB.release_date.localeCompare(movieA.release_date);
    }

    if (sortType === 'vote_average') {
      return movieB.vote_average - movieA.vote_average;
    }

    if (sortType === 'vote_count') {
      return movieB.vote_count - movieA.vote_count;
    }

    return 0;
  });

  const listItems = sortedMovies?.map((m) => <Movie movie={m}></Movie>);

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
        {listItems}
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
