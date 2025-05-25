const express = require('express');
const router = express.Router();
const db = require('../db/connection')
// we can create a queries file later in the db folder to clean up these routes.

// like a resource
router.post('/:resource_id', async (req, res) => {
  const userId = req.query.user_id || 1;
  const resourceId = req.params.resource_id;
  const likeQueryString =
  `INSERT INTO likes (user_id, resource_id, created_at)
  VALUES ($1, $2, NOW())
  RETURNING *;
  `;

  const likeQueryValues = [userId, resourceId];
  try {

    if (!resourceId) return res.status(404).json({error: 'Resource not found'});

    const likeQueryResult = await db.query(likeQueryString, likeQueryValues);
    const likeQueryResultRow = likeQueryResult.rows[0]

    res.status(201).json({
      message: 'Resource Liked',
      liked: likeQueryResultRow
    })

  } catch (error) {
    console.error(`Error liking resource: `, error);
    res.status(500).json({message: `Internal Server Error`});
  }
})


module.exports = router;
