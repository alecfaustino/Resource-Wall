/*
 * All routes for User Data are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /api/users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const userQueries = require('../db/queries/users');

router.get('/', (req, res) => {
  userQueries.getUsers()
    .then(users => {
      res.json({ users });
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });
});

// when the user clicks 'login' button
// for now, hard coded and will just be used to set req.session.user_id
// for instance, if we route to /login/3 it would set the req.session.user_id to 3.
router.post('/login/:user_id', (req, res) => {
  const { user_id } = req.params;
  // set the cookie.user_id
  req.session.user_id = user_id;
  res.json({ message: `Logged in as user ${user_id}`});

});

// mock logout
// clear cookie session
router.post('/logout', (req, res) => {
  req.session = null;
  res.json({ message: 'Logged out'});
})

module.exports = router;
