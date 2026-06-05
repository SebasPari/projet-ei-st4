import express from 'express';
import { appDataSource } from '../datasource.js';
import Rating from '../entities/rating.js';

const router = express.Router();

// Route pour sauvegarder une note
router.post('/new', async function (req, res) {
  const ratingRepository = appDataSource.getRepository(Rating);

  // On vérifie si l'utilisateur a déjà noté ce film
  const existingRating = await ratingRepository.findOneBy({
    userId: req.body.userId,
    movieId: req.body.movieId,
  });

  // Si une note existe déjà, on la met à jour
  if (existingRating) {
    existingRating.rating = req.body.rating;
    await ratingRepository.save(existingRating);

    return res.status(200).json({ message: 'Note mise à jour' });
  }

  // Sinon on crée une nouvelle note
  const newRating = ratingRepository.create({
    userId: req.body.userId,
    movieId: req.body.movieId,
    rating: req.body.rating,
  });

  await ratingRepository.save(newRating);
  res.status(201).json({ message: 'Note sauvegardée' });
});

export default router;
