const express = require('express');
const router  = express.Router();

/**
 * GET /resources
 * Renders the main resources page (placeholder for now).
 * Will later be updated to display all saved and liked resources.
 */

router.get('/', (req, res) => {
  res.render('resources');
});




module.exports = router;
