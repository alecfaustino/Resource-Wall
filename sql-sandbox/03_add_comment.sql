-- Query for this req:
-- users should be able to comment on any resource

-- add comment. Implementing in function change values for $ placeholders
INSERT INTO resource_comments (user_id, resource_id, comment)
VALUES (1, 12, 'This resource was super helpful!');

-- Verify comment was saved:
-- SELECT * FROM resource_comments WHERE resource_id = 12;
