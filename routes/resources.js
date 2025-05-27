const express = require('express');
const router = express.Router();
const db = require('../db/connection');

/**
 * GET /resources
 * Renders the My resources page (placeholder for now).
 * Will later be updated to display all saved and liked resources.
 */


router.get('/', async (req, res) => {

  // TO DO: REMOVE '|| 1' DEFAULT TO 1 FOR TESTING
  const userId = req.session.user_id || 1;
try {
  const userResourcesQuery = `
  SELECT
      resources.id,
      resources.title,
      resources.description,
      resource_links.name AS link_name,
      resource_links.url AS link_url,
      topics.name AS topic,
      users.name AS author
      FROM resources
      JOIN users ON users.id = resources.author_id
      LEFT JOIN resource_links ON resource_links.resource_id = resources.id
      LEFT JOIN resource_topics ON resource_topics.resource_id = resources.id
      LEFT JOIN topics ON topics.id = resource_topics.topic_id
      WHERE resources.author_id = $1;
  `;

  const likedResourcesQuery = `
  SELECT
      resources.id,
      resources.title,
      resources.description,
      resource_links.name AS link_name,
      resource_links.url AS link_url,
      topics.name AS topic,
      users.name AS author
      FROM resources
      JOIN users ON users.id = resources.author_id
      JOIN resource_likes ON resources.id = resource_likes.resource_id
      LEFT JOIN resource_links ON resource_links.resource_id = resources.id
      LEFT JOIN resource_topics ON resource_topics.resource_id = resources.id
      LEFT JOIN topics ON topics.id = resource_topics.topic_id
      WHERE resource_likes.user_id = $1;
  `

  const likesQuery =
  `
  SELECT resource_id FROM resource_likes
  WHERE user_id = $1;
  `;


    const [userResourcesResult, likedResourcesResult, likesIdResult] = await Promise.all([
      db.query(userResourcesQuery, [userId]),
      db.query(likedResourcesQuery, [userId]),
      db.query(likesQuery, [userId])
    ]);

    let likedResourceIds = [];
    if(userId) {
      const likesResult = await db.query(likesQuery, [userId]);
      likedResourceIds = likesResult.rows.map(row => row.resource_id);
    }

    const likedResourcesMap = {};
    for (const resourceId of likedResourceIds) {
      likedResourcesMap[resourceId] = true;
    }
    res.render('resources', {
      userResources: userResourcesResult.rows,
      likedResources: likedResourcesResult.rows,
      likedResourceIds,
      likedResourcesMap,
      user: req.session.user_id
    });
  } catch (error) {
    console.error('Error loading My resource page:', error);
    res.status(500).send('Internal Server Error');
  }
});




module.exports = router;
