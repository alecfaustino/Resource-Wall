const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// POST: Rate a resource (create or update)
router.post('/:resource_id', async (req, res) => {
  const userId = req.session.user_id || 1;
  const resourceId = req.params.resource_id;
  const { rating } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Invalid rating value' });
  }

  const ratingQueryString = `
    INSERT INTO resource_ratings (user_id, resource_id, rating)
    VALUES ($1, $2, $3)
    ON CONFLICT (user_id, resource_id)
    DO UPDATE SET rating = EXCLUDED.rating
    RETURNING *;
  `;

  const ratingQueryValues = [userId, resourceId, rating];

  try {

    // validate if logged in
    if (!userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    // if the resource doesn't exist error handling
    if (!resourceId) return res.status(404).json({error: 'Resource not found'});

    const ratingResult = await db.query(ratingQueryString, ratingQueryValues);
    res.status(201).json({
      message: `Resource rated by user: ${userId}`,
      rating: ratingResult.rows[0]
    });
  } catch (error) {
    console.error('Error rating resource:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// GET: Check if the user has rated a resource
router.get('/:resource_id', async (req, res) => {
  const userId = req.session.user_id || 1;
  const resourceId = req.params.resource_id;

  const checkRatingQueryString = `
    SELECT rating
    FROM resource_ratings
    WHERE user_id = $1 AND resource_id = $2
  `;
  const checkRatingQueryValues = [userId, resourceId];

  try {
    if (!userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const result = await db.query(checkRatingQueryString, checkRatingQueryValues);
    const userRating = result.rows.length > 0 ? result.rows[0].rating : null;

    res.status(200).json({ userRating });
  } catch (error) {
    console.error('Error checking user rating:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
