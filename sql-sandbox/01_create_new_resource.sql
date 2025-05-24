-- All queries needed to create a resource card
-- Includes tables: resources, resource_links, resource_topics

-- Insert resources
INSERT INTO resources (title, description, author_id)
VALUES ('Intro to Async/Await', 'A simple explanation of async functions in JS.', 1)
RETURNING id;


-- Insert resource_links
INSERT INTO resource_links (name, url, description, resource_id)
VALUES (
  'MDN Async Guide',
  'https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous',
  'Official documentation and explanation',
  16
);

-- Insert resource topics
INSERT INTO resource_topics (resource_id, topic_id)
VALUES (16, 2);
