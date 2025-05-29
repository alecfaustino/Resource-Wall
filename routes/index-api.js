const express = require('express');
const router = express.Router();
const db = require('../db/connection');
const ejs = require('ejs');
const path = require('path');

// GET /api/index?search=keyword
router.get('/', async (req, res) => {
// TODO: REMOVE || 1 after development
  const userId = req.session.user_id || 1;
  const search = req.query.search;

  let queryString = `
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
  `;

  const queryParams = [];
  if (search) {
    queryString += `
      WHERE
        resources.title ILIKE $1 OR
        resources.description ILIKE $1 OR
        topics.name ILIKE $1
    `;
    queryParams.push(`%${search}%`);
  }

  queryString += ` ORDER BY resources.created_at DESC LIMIT 10;`;

  try {
    const resourcesResult = await db.query(queryString, queryParams);
    const resources = resourcesResult.rows;

    // Get liked resources
    const likesResult = await db.query(
      `SELECT resource_id FROM resource_likes WHERE user_id = $1;`,
      [userId]
    );
    const likedMap = {};
    likesResult.rows.forEach(row => likedMap[row.resource_id] = true);

    // Get ratings
    const ratingsResult = await db.query(
      `SELECT resource_id, rating FROM resource_ratings WHERE user_id = $1;`,
      [userId]
    );
    const ratingsMap = {};
    ratingsResult.rows.forEach(row => ratingsMap[row.resource_id] = row.rating);

    // Render each card using the EJS partial
    const renderedCards = await Promise.all(
      resources.map(resource =>
        ejs.renderFile(
          path.join(__dirname, '../views/partials/resource_card.ejs'),
          {
            resource,
            likedResourceIds: Object.keys(likedMap).map(Number),
            likedResourcesMap: likedMap,
            ratingsMap,
            user: userId
          }
        )
      )
    );

    res.send(renderedCards.join(''));
  } catch (err) {
    console.error('Error in index search API:', err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
