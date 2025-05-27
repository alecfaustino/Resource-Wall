const express = require('express');
const router = express.Router();
const db = require('../db/connection');


/**
 * GET '/index'
 * Renders Home page.
 * Should dispaly all recently added resources by all users. currently limited by 10 resources
 */

router.get('/', async (req, res) => {
  const query = `
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
    ORDER BY resources.created_at ASC
    LIMIT 10;
  `;

  try {
    const result = await db.query(query);
    res.render('index', { resources: result.rows });
  } catch (error) {
    console.error('Error loading home page:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
