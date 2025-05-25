const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
  // Hard-coded user data for now
  const user = {
    name: 'Vika',
    email: 'vika@example.com'
  };
  res.render('profile', {user});
});

module.exports = router;
