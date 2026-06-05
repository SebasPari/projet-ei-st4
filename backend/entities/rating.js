import typeorm from 'typeorm';

const Rating = new typeorm.EntitySchema({
  name: 'Rating',
  columns: {
    id: {
      primary: true,
      type: Number,
      generated: true,
    },
    userId: { type: Number },
    movieId: { type: Number },
    rating: { type: Number },
  },
});

export default Rating;
