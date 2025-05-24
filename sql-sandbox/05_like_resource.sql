-- Query for this req:
-- users should be able to like any resource


INSERT INTO resource_likes (user_id, resource_id) VALUES (1, 8);
INSERT INTO resource_likes (user_id, resource_id) VALUES (2, 8);
INSERT INTO resource_likes (user_id, resource_id) VALUES (3, 8);
INSERT INTO resource_likes (user_id, resource_id) VALUES (4, 8);
INSERT INTO resource_likes (user_id, resource_id) VALUES (5, 8);
INSERT INTO resource_likes (user_id, resource_id) VALUES (6, 8);
INSERT INTO resource_likes (user_id, resource_id) VALUES (7, 8);

/* Verify added likes

SELECT COUNT(*) AS like_count
FROM resource_likes
WHERE resource_id = 8;
*/
