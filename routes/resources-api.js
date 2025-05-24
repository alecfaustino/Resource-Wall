const express = require('express');
const router = express.Router();
const db = require('../db/connection')
// we can create a queries file later in the db folder to clean up these routes.

// get all the resources - main page?
router.get('/', async (req, res) => {
  // Order by Newest at the top
  const queryString =
  `
    SELECT *
    FROM resources
    ORDER BY created_at DESC
  `
  try {
    const result = await db.query(queryString);
    res.json(result.rows);
  } catch (error) {
    // backend console message
    console.error('Error fetching resources: ', error);
    // send a message to the client
    // Server error
    // This will just send JSON for error handling at this point - we can (if we have time) send a better looking error message in the future)
    // will be useful to test with postman, too.
    res.status(500).json({error: 'Internal Server Error'});
  }
});

module.exports = router;
