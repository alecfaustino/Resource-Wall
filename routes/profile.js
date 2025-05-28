const express = require("express");
const router = express.Router();
const db = require("../db/connection");

router.get("/", async (req, res) => {
  // Hard-coded user data for now

  // TODO: remove the || 1 after testing
  const userId = req.session.user_id || 1;

  const userInfoQuery = `
    SELECT *
    FROM users
    WHERE id = $1
  `;

  try {
    const userInfoResult = await db.query(userInfoQuery, [userId]);

    if (userInfoResult.rows.length === 0) {
      return res.status(404).send("User not found!");
    }
    const user = userInfoResult.rows[0];
    res.render("profile", { user });
  } catch (error) {
    console.error("Error loading user data");
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

module.exports = router;
