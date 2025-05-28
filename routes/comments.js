const express = require("express");
const router = express.Router();
const db = require("../db/connection");

// post a comment
router.post("/", async (req, res) => {
  //TODO remove || 1 after testing
  const userId = req.session.user_id || 1;
  const { resource_id, comment } = req.body;

  if (!userId || !comment || !resource_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const postCommentQuery = `
  INSERT INTO resource_comments (user_id, resource_id, comment)
  VALUES ($1, $2, $3)
  RETURNING *;
  `;

  const postCommentValues = [userId, resource_id, comment];

  try {
    const postCommentResult = await db.query(
      postCommentQuery,
      postCommentValues
    );
    res.status(201).json(postCommentResult.rows[0]);
  } catch (error) {
    console.error("error adding comment: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
