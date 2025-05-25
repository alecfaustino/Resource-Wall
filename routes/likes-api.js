const express = require('express');
const router = express.Router();
const db = require('../db/connection')
// we can create a queries file later in the db folder to clean up these routes.

// like a resource
router.post('/:resource_id', async (req, res) => {
  // TODO: REMOVE || 1 after development -- this is for postman testing
  const userId = req.session.user_id || 1;
  const resourceId = req.params.resource_id;
  const likeQueryString =
  `INSERT INTO resource_likes (user_id, resource_id, created_at)
  VALUES ($1, $2, NOW())
  RETURNING *;
  `;

  const likeQueryValues = [userId, resourceId];
  try {

    // if the resource doesn't exist error handling
    if (!resourceId) return res.status(404).json({error: 'Resource not found'});

    const likeQueryResult = await db.query(likeQueryString, likeQueryValues);
    const likeQueryResultRow = likeQueryResult.rows[0];

    // returning json for now ... not sure how to handle this yet in final app
    res.status(201).json({
      message: 'Resource Liked',
      liked: likeQueryResultRow
    })

  } catch (error) {
    console.error(`Error liking resource: `, error);
    // returning json for now ... not sure how to handle this yet in final app
    res.status(500).json({message: `Internal Server Error`});
  }
});

// unliking a resources
router.delete('/:resource_id', async (req, res) => {
  const userId = req.session.user_id || 1;
  const resourceId = req.params.resource_id;
  const unlikeQueryString =
  `DELETE FROM resource_likes
  WHERE user_id = $1 AND resource_id = $2
  RETURNING *`;

  const unlikeQueryValues = [userId, resourceId];


  try {
    if (!resourceId) return res.status(404).json({error: 'Resource not found'});
    const unlikeQueryResult = await db.query(unlikeQueryString, unlikeQueryValues);

    // returning json for now ... not sure how to handle this yet in final app
    res.status(200).json({
      message: 'Successfully Deleted!',
      deleted: unlikeQueryResult.rows[0]
    });
  } catch (error) {
    console.error(`Error unliking resource: `, error);
    // returning json for now ... not sure how to handle this yet in final app
    res.status(500).json({message: `Internal Server Error`});
  }
});

// get all of a users likes
router.get('/', async (req, res) => {
  // TODO: REMOVE || 1 after development -- this is for postman testing
  const userId = req.session.user_id || 1;
  const userLikesQueryString =
  `
  SELECT *
  FROM resource_likes
  WHERE user_id = $1
  `;

  try {
    const userLikesResult = await db.query(userLikesQueryString, [userId]);
    // show all the rows
    res.status(200).json(userLikesResult.rows);
  } catch (error) {
    console.error('Error getting all user likes: ', error);
    res.status(500).json({error: `Internal Server Error`});
  }
});

// check to see if a user liked a resource (to be used for toggling a filled heart/unfilled heart for a specific user's view

router.get('/:resource_id', async (req, res) => {
  // TODO: REMOVE || 1 after development -- this is for postman testing
  const userId = req.session.user_id || 1;
  const resourceId = req.params.resource_id;

  const checkUserLikedQueryString =
  `
  SELECT *
  FROM resource_likes
  WHERE user_id = $1 AND resource_id = $2
  `;
  const checkUserLikedQueryValues = [userId, resourceId];

  try {
    const checkResults = await db.query(checkUserLikedQueryString, checkUserLikedQueryValues);
    // if something is returned, then the resource_likes table has record of user_id liking a specific resource_id
    const liked = checkResults.rows.length > 0;
    //boolean if liked.
    res.status(200).json({userLiked: liked});

  } catch (error) {
    console.error('Error checking if user liked this resource: ', error);
    res.status(500).json({error: `Internal Server Error`});
  }
});


module.exports = router;
