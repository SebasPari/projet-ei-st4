import { useParams } from 'react-router-dom';

function MovieDetails() {
  const { id } = useParams();

  return (
    <main>
      <h1>Movie details</h1>
      <p>Movie id: {id}</p>
    </main>
  );
}

export default MovieDetails;
