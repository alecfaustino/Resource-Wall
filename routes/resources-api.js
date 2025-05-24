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

// adding a resources
router.post('/', async (req, res) => {
  // This line makes the user_id equal to whatever we put in the url params (we are hard coding this for this project)
  const user_id = req.query.user_id || 1;

  // values from the form (front end)
  const {title, description, link} = req.body;

  // validation if any of these required fields are not filled
  // send error message for testing in postman/seeing in client JSON
  if (!title || !link || !link.name || !link.url) return res.status(400).json({error: 'Missing required fields'});

  // INSERT into the resources table
  const resourceQueryString =
  `INSERT INTO resources (author_id, title, description, created_at)
  VALUES ($1, $2, $3, NOW())
  RETURNING *;
  `;

  // INSERT into the resource_links table
  const linkQueryString =
  `INSERT INTO resource_links (resource_id, name, url, description)
  VALUES ($1, $2, $3, $4)
  RETURNING *;
  `;

  try {
    // insert into resources
    const resourceQueryValues = [ user_id , title, description];
    const resourceResult = await db.query(resourceQueryString, resourceQueryValues);
    const resource = resourceResult.rows[0];
    // insert into resource_links
    const linkQueryValues = [resource.id, link.name, link.url, link.description];
    const linkResult = await db.query(linkQueryString, linkQueryValues);
    const linkResultRow = linkResult.rows[0];

    // sending json just for testing -- eventually this will be a redirect back to the home page when we have it set up
    res.status(201).json({
      resource,
      link
    })
  } catch (error) {
    console.error('Error creating resource with link: ', error);
    res.status(500).json({
      error: 'Internal Server Error'
    });

  }



});

module.exports = router;
