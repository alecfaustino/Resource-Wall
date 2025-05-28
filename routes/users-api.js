/*
 * All routes for User Data are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /api/users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();
const userQueries = require("../db/queries/users");
const db = require("../db/connection");

router.get("/", (req, res) => {
  userQueries
    .getUsers()
    .then((users) => {
      res.json({ users });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

router.patch("/edit/:user_id", async (req, res) => {
  // TODO remove || 1 after testing
  const userId = req.session.user_id || 1;

  const { name, email } = req.body;
  const editUserQuery = `
  UPDATE users
  SET name = $1,
  email = $2
  WHERE id = $3
  RETURNING *;
  `;

  try {
    if (!userId) {
      return res.status(403).json({
        error: "Not authorized",
      });
    }

    if (!name || !email) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }
    const editResult = await db.query(editUserQuery, [name, email, userId]);
    const updatedUser = editResult.rows[0];
    res.status(200).json({ user: updatedUser });
  } catch (error) {
    console.error("Error updating user info: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// when the user clicks 'login' button
// for now, hard coded and will just be used to set req.session.user_id
// for instance, if we route to /login/3 it would set the req.session.user_id to 3.
router.get("/login/:user_id", (req, res) => {
  const { user_id } = req.params;
  // set the cookie.user_id
  req.session.user_id = user_id;
  res.json({ message: `Logged in as user ${user_id}` });
});

// mock logout
// clear cookie session
router.get("/logout", (req, res) => {
  req.session = null;
  res.json({ message: "Logged out" });
});

module.exports = router;
