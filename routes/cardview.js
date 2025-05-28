const express = require("express");
const router = express.Router();
const db = require("../db/connection");

router.get("/resources/:id", async (req, res) => {
  // TODO: get remove the || 1 after testing
  const userId = req.session.user_id || 1;
  // from the clicked id
  const resourceId = req.params.id;

  // get info for that resource
  const getResourceQuery = `
    SELECT resources.*, users.name AS author
    FROM resources
    JOIN users ON resources.author_id = users.id
    WHERE resources.id = $1;
  `;

  // get the link information
  const getLinksQuery = `
    SELECT *
    FROM resource_links
    WHERE resource_id = $1
  `;

  // get topic information
  const getTopicsQuery = `
    SELECT topics.name AS topic_name
    FROM resource_topics
    JOIN topics ON resource_topics.topic_id = topics.id
    WHERE resource_topics.resource_id = $1;
  `;

  try {
    const getResourceQueryResult = await db.query(getResourceQuery, [
      resourceId,
    ]);

    if (getResourceQueryResult.rows.length === 0)
      return res.status(404).send("Resource not found!");

    const getLinksQueryResult = await db.query(getLinksQuery, [resourceId]);

    const getTopicsQueryResult = await db.query(getTopicsQuery, [resourceId]);

    const resource = getResourceQueryResult.rows[0];
    const links = getLinksQueryResult.rows;
    const topics = getTopicsQueryResult.rows;

    // getting the liked resource ID's
    let likedResourceIds = [];
    if (userId) {
      const likedResult = await db.query(
        `
        SELECT resource_id
        FROM resource_likes
        WHERE user_id = $1`,
        [userId]
      );

      likedResourceIds = likedResult.rows.map((row) => row.resource_id);
    }

    console.log("user:", req.session.user_id);
    console.log("resource.owner_id: ", resource.owner_id);
    res.render("card_view_full", {
      resource,
      links,
      topics,
      likedResourceIds,
      // TO DO Remove || 1 after testing
      user: req.session.user_id || 1,
    });
  } catch (error) {
    console.error("Error rendering full resource view: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
