const express = require("express");
const router = express.Router();
const db = require("../db/connection");

/**
 * GET '/index'
 * Renders Home page.
 * Should dispaly all recently added resources by all users. currently limited by 10 resources
 */

router.get("/", async (req, res) => {
  // this eventually needs to be changed because we have a route to get all resources (needs to be updated to be consistent with this)

  // TO DO: REMOVE '|| 1' DEFAULT TO 1 FOR TESTING
  const userId = req.session.user_id || 1;
  const resourceQuery = `
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
      ORDER BY resources.created_at DESC
      LIMIT 9;
  `; // Temporary have LEFT JOIN for testing if some of the information won't be added or displayed

  const likesQuery = `
  SELECT resource_id FROM resource_likes
  WHERE user_id = $1;
  `;

  const ratingsQuery = `
    SELECT resource_id, rating
    FROM resource_ratings
    WHERE user_id = $1;`;

  try {
    const resourceResult = await db.query(resourceQuery);

    // Likes
    let likedResourceIds = [];
    if (userId) {
      const likesResult = await db.query(likesQuery, [userId]);
      likedResourceIds = likesResult.rows.map((row) => row.resource_id);
    }

    const likedResourcesMap = {};
    for (const resourceId of likedResourceIds) {
      likedResourcesMap[resourceId] = true;
    }

    // Ratings
    const ratingsMap = {};
    if (userId) {
      const ratingsResult = await db.query(ratingsQuery, [userId]);
      for (const row of ratingsResult.rows) {
        ratingsMap[row.resource_id] = row.rating;
      }
    }

    res.render("index", {
      resources: resourceResult.rows,
      likedResourceIds,
      likedResourcesMap,
      ratingsMap,
      user: req.session.user_id,
    });
  } catch (error) {
    console.error("Error loading home page:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
