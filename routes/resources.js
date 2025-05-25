const express = require('express');
const router  = express.Router();

/**
 * GET /resources
 * Renders the main resources page (placeholder for now).
 * Will later be updated to display all saved and liked resources.
 */


router.get('/', (req, res) => {

  // Temporary hardcoded data
  const userResources = [
    { id: 1, title: 'Titile', description: 'Description', url: 'Url here', topic: 'topic', author: 'Vika' },
    { id: 2, title: 'Titile', description: 'Description', url: 'Url here',
    topic: 'topic',  author: 'Vika' }
  ];

  const likedResources = [
    { id: 3, title: 'Titile', description: 'Description', url: 'Url here',
    topic: 'topic',  author: 'Vika' },
    { id: 4, title: 'Titile', description: 'Description', url: 'Url here', topic: 'topic', author: 'Vika' }
  ];

  res.render('resources', { userResources, likedResources });
});




module.exports = router;
