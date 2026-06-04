import typeorm from 'typeorm';

const Movie = new typeorm.EntitySchema({
  name: 'Movie',
  columns: {
    id: {
      primary: true,
      type: Number,
      generated: true,
    },
    release_date: { type: String },
    title: { type: String, unique: true },
    original_language: { type: String, nullable: true },
    overview: { type: String, nullable: true },
    poster_path: { type: String, nullable: true },
    vote_average: { type: 'float', nullable: true },
    vote_count: { type: Number, nullable: true },
  },
});

export default Movie;
