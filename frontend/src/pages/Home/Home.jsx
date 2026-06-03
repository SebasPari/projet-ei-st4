import { useState } from 'react';
import logo from './logo.svg';
import './Home.css';
import { useFetchMovies } from './useFetchMovies';
import { Movie } from '../../components/Movie/Movie';

function Home() {
  const [movieName, setMovieName] = useState('');
  const { movies, moviesLoadingError, fetchMovies } = useFetchMovies();
  function handleChange(e) {
    setMovieName(e.target.value);
  }

  const listItems = movies.results?.map((m) => <Movie movie={m}></Movie>);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Filmorama</h1>
        <input value={movieName} onChange={handleChange} />
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
