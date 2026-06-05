import express from 'express';
import { appDataSource } from '../datasource.js';
import Rating from '../entities/rating.js';

const router = express.Router();

router.get('/:userId', async function (req, res) {
  const ratingRepository = appDataSource.getRepository(Rating);
  const userId = Number(req.params.userId);

  // On récupére toutes les notes de l'utilisateur connecté
  const myRatingsRaw = await ratingRepository.findBy({ userId: userId });

  if (myRatingsRaw.length === 0) {
    return res.json({ movies: [] });
  }

  // On transforme les notes en un objet facile à lire : un dictinonnaire qui prend pour clé movieId et valeur le rating
  const myRatings = {};
  for (const r of myRatingsRaw) {
    myRatings[r.movieId] = r.rating;
  }

  // Récupérer les notes de tous les autres utilisateurs
  const allRatings = await ratingRepository.find();

  // On groupe les notes par utilisateur en créant un dictionnaire qui prend en clé userId et valeur son dictionnaire de ratings
  const otherUsersRatings = {};
  for (const r of allRatings) {
    if (r.userId === userId) {
      continue;
    } // on saute l'utilisateur actuellement connecté

    if (!otherUsersRatings[r.userId]) {
      otherUsersRatings[r.userId] = {};
    }
    otherUsersRatings[r.userId][r.movieId] = r.rating;
  }

  // On calcule la similarité avec chaque autre utilisateur
  // On compte combien de films en commun et si les notes sont proches
  const similarityScores = {};

  for (const otherUserId in otherUsersRatings) {
    const otherRatings = otherUsersRatings[otherUserId];

    // On trouve les films notés par les 2 utilisateurs
    const commonMovieIds = Object.keys(myRatings).filter(
      (movieId) => otherRatings[movieId] !== undefined
    );

    // Pas assez de films en commun, on ignore cet utilisateur
    if (commonMovieIds.length < 2) {
      continue;
    }

    // On calcule la note moyenne de chaque utilisateur sur les films en commun
    const myAverage =
      commonMovieIds.reduce((sum, id) => sum + myRatings[id], 0) /
      commonMovieIds.length;

    const otherAverage =
      commonMovieIds.reduce((sum, id) => sum + otherRatings[id], 0) /
      commonMovieIds.length;

    // On calcule le numérateur : somme de (ma note - ma moyenne) * (sa note - sa moyenne)
    let numerator = 0;
    for (const movieId of commonMovieIds) {
      numerator +=
        (myRatings[movieId] - myAverage) *
        (otherRatings[movieId] - otherAverage);
    }

    // On calcule le dénominateur : racine( somme des écarts² de moi ) * racine( somme des écarts² de lui )
    let mySquaredDiffs = 0;
    let otherSquaredDiffs = 0;
    for (const movieId of commonMovieIds) {
      mySquaredDiffs += Math.pow(myRatings[movieId] - myAverage, 2);
      otherSquaredDiffs += Math.pow(otherRatings[movieId] - otherAverage, 2);
    }

    const denominator =
      Math.sqrt(mySquaredDiffs) * Math.sqrt(otherSquaredDiffs);

    // Si le dénominateur est 0, on ne peut pas diviser, on ignore
    if (denominator === 0) {
      continue;
    }

    // Le score Pearson est entre -1 et 1
    // 1 = goûts identiques, -1 = goûts opposés, 0 = aucun lien
    const pearsonScore = numerator / denominator;

    // On garde seulement les utilisateurs avec un score positif (goûts similaires)
    if (pearsonScore > 0) {
      similarityScores[otherUserId] = pearsonScore;
    }
  }
  // Étape D — Trouver les films bien notés par les utilisateurs similaires
  // qu'on n'a pas encore vu
  const myMovieIds = Object.keys(myRatings).map(Number);
  const recommendedMovieIds = {};

  for (const otherUserId in similarityScores) {
    const similarity = similarityScores[otherUserId];
    const otherRatings = otherUsersRatings[otherUserId];

    for (const movieId in otherRatings) {
      // On saute les films qu'on a déjà notés
      if (myMovieIds.includes(Number(movieId))) {
        continue;
      }

      // On saute les films mal notés (moins de 7)
      if (otherRatings[movieId] < 7) {
        continue;
      }

      if (!recommendedMovieIds[movieId]) {
        recommendedMovieIds[movieId] = 0;
      }
      // Plus l'utilisateur est similaire, plus son vote compte
      recommendedMovieIds[movieId] += similarity * otherRatings[movieId];
    }
  }

  // On trie les films par score de recommandation
  const sortedMovieIds = Object.keys(recommendedMovieIds)
    .sort((a, b) => recommendedMovieIds[b] - recommendedMovieIds[a])
    .slice(0, 10) // On garde les 10 meilleurs
    .map(Number);

  if (sortedMovieIds.length === 0) {
    return res.json({ movies: [] });
  }

  // Étape E — Récupérer les détails des films recommandés
  const Movie = (await import('../entities/movies.js')).default;
  const movieRepository = appDataSource.getRepository(Movie);
  const recommendedMovies = await movieRepository.findByIds(sortedMovieIds);

  res.json({ movies: recommendedMovies });
});

export default router;
