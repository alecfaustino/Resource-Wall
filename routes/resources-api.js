const express = require('express');
const router = express.Router();
const db = require('../db/connection')
// we can create a queries file later in the db folder to clean up these routes.

// get all the resources
router.get('/', async (req, res) => {
  // Order by Newest at the top
  const search = req.query.search;
  const queryParams = [];
  let queryString =
  `
    SELECT
      resources.id,
      resources.title,
      resources.description,
      resource_links.name AS link_name,
      resource_links.url AS link_url,
      topics.name AS topic,
      users.name AS author
    FROM resources
    JOIN users ON users.id = resources.author_id
    LEFT JOIN resource_links ON resource_links.resource_id = resources.id
    LEFT JOIN resource_topics ON resource_topics.resource_id = resources.id
    LEFT JOIN topics ON topics.id = resource_topics.topic_id
  `;

  if (search) {
    queryString += `
      WHERE
        resources.title ILIKE $1 OR
        resources.description ILIKE $1 OR
        topics.name ILIKE $1
    `;
    queryParams.push(`%${search}%`);
  }
  queryString += ` ORDER BY resources.created_at DESC LIMIT 10;`;


  try {
    const result = await db.query(queryString, queryParams);
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

//get a single resource
//some comments from above apply here
router.get('/:id', async (req, res) => {
  const resource_id = req.params.id;

  const queryString =
  `
  SELECT *
  FROM resources
  WHERE id = $1
  `

  try {
    const result = await db.query(queryString, [resource_id]);

    // if the targetted resource is not found
    if (result.rows.length === 0) return res.status(404).json({error: 'Resource not found'});
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching resources: ', error);
    res.status(500).json({error: 'Internal Server Error'});
  }
});

// adding a resources
router.post('/', async (req, res) => {
  // This line makes the user_id equal to whatever we put in the url params (we are hard coding this for this project)
  // TODO: REMOVE || 1 after development -- this is for postman testing
  const userId = req.session.user_id || 1;

  // values from the form (front end)
  const {title, description, link, topic} = req.body;

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

  // INSERT into resource_topics table
  const topicQueryString =
  ` INSERT INTO resource_topics (resource_id, topic_id)
  VALUES ($1, $2)
  RETURNING *;
  `


  try {
    // validate if logged in
    if (!userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    // insert into resources
    const resourceQueryValues = [ userId , title, description];
    const resourceResult = await db.query(resourceQueryString, resourceQueryValues);
    const resource = resourceResult.rows[0];
    // insert into resource_links
    const linkQueryValues = [resource.id, link.name, link.url, link.description];
    const linkResult = await db.query(linkQueryString, linkQueryValues);
    const linkResultRow = linkResult.rows[0];

    // insert topic
    const topicsQueryValues = [resource.id, Number(topic)];
    const topicsResult = await db.query(topicQueryString, topicsQueryValues);
    // only a single topic (for now)
    const insertedTopic = topicsResult.rows[0];
    // sending json
    res.status(201).json({
      resource,
      link: linkResultRow,
      topic: insertedTopic
    })

  } catch (error) {
    console.error('Error creating resource with link: ', error);
    res.status(500).json({
      error: 'Internal Server Error'
    });

  }
});

//edit a resource
//using patch as we'd only be updating a part of the resource
router.patch('/:id', async (req, res) => {
  const resource_id = req.params.id;
  // TODO: REMOVE || 1 after development -- this is for postman testing
  const userId = req.session.user_id || 1;
  const { title, description, link } = req.body;
  const editResourceQueryString =
  `UPDATE resources
  SET title = $1,
  description = $2
  WHERE id = $3
  RETURNING *;
  `;

  const editResourceLinksQueryString =
  `UPDATE resource_links
  SET name = $1,
  url = $2,
  description = $3
  WHERE resource_id = $4
  RETURNING *;
  `;

  // to check if the user owns the resource
  const resourceOwnerQueryString =
  ` SELECT *
  FROM resources
  WHERE id = $1 AND author_id = $2
  `;
  // values to see if the resource_id = the one in the req.params and the user id, too.
  const resourceOwnerQueryStringValues = [resource_id, userId];

  try {

    // validate if logged in
    if (!userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    if (!title || !link || !link.name || !link.url) return res.status(400).json({error: 'Missing required fields'});

    const resourceOwnerQueryResult = await db.query(resourceOwnerQueryString, resourceOwnerQueryStringValues);

    // if the query returns something, then there would be a atleast one row. If 0 come back, the user is not the owner of the resource.
    if (resourceOwnerQueryResult.rows.length === 0) return res.status(403).json({error: 'Unauthorized access to edit this resource'});

    // if it's successful, proceed to update.
    const editResourceQueryValues = [title, description, resource_id];
    const updateResourceResult = await db.query(editResourceQueryString, editResourceQueryValues);

    // update the link, too.
    const editResourceLinksQueryValues = [link.name, link.url, link.description, resource_id]
    const updateLinkResult = await db.query(editResourceLinksQueryString, editResourceLinksQueryValues);

    // if all is successful,
    res.status(200).json({
      resource: updateResourceResult.rows[0],
      link: updateLinkResult.rows[0]
    });
  } catch (error) {
    console.error('Error updating resource: ', error);
    res.status(500).json({ error: 'Internal Server Error'});
  }
});

//delete
// Same as explained above - sending back JSON for now while no front end.
// Will redirect when views are created.
router.delete('/:id', async (req, res) => {
  const resource_id = req.params.id;
  // TODO: REMOVE || 1 after development -- this is for postman testing
  const userId = req.session.user_id || 1;

  // to check if the user owns the resource
  const resourceOwnerQueryString =
  ` SELECT *
  FROM resources
  WHERE id = $1 AND author_id = $2
  `;
  const deleteResourceQueryString =
  `DELETE FROM resources
  WHERE id = $1
  RETURNING *
  `;

  const resourceOwnerQueryValues = [resource_id, userId];

  try {
    // validate if logged in
    if (!userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    const resourceOwnerQueryResult = await db.query(resourceOwnerQueryString, resourceOwnerQueryValues);

    if (resourceOwnerQueryResult.rows.length === 0) return res.status(403).json({ error: 'Unauthorized access to delete this resource'});

    // if owner
    const deletedResource = await db.query(deleteResourceQueryString, [resource_id]);

    res.status(200).json(deletedResource.rows[0])
  } catch (error) {
    console.error('Error deleting resource: ', error);
    res.status(500).json({ error: 'Internal Server Error'});
  }

});

module.exports = router;
