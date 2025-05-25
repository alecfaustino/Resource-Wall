const express = require('express');
const router = express.Router();

// Will render view for create a resource page

router.get('/', (req, res) => {
  res.render('create');
});

module.exports = router;
