import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Layout from './components/Layout/Layout';
import Users from './pages/Users/Users';
import MovieDetails from './pages/MovieDetails/MovieDetails';
import RecommendedMovies from './pages/RecommendedMovies/RecommendedMovies';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="users" element={<Users />} />
        <Route path="movies/:id" element={<MovieDetails />} />
        <Route path="recommendations" element={<RecommendedMovies />} />
      </Routes>
    </Layout>
  );
}

export default App;
