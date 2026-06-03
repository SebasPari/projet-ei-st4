export function Movie({ movie }) {
  const baseURL = 'https://image.tmdb.org/t/p/w500';

  return (
    <div>
      <table className="movie">
        <tbody>
          <tr key={movie?.id}>
            <td>{movie?.title}</td>
            <td> {movie?.release_date}</td>
            <img
              src={`${baseURL}${movie.poster_path}`}
              alt={movie.name}
              width="100"
              height="150"
            ></img>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
