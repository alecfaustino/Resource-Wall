-- Query for this req:
-- users should be able to rate any resource

-- Ratings for Resource 5
INSERT INTO resource_ratings (user_id, resource_id, rating) VALUES (3, 5, 3);
INSERT INTO resource_ratings (user_id, resource_id, rating) VALUES (4, 5, 3);


/* Verify rating was added and change average rating

SELECT resources.title, AVG(rating) AS average_rating
FROM resource_ratings
JOIN resources ON resources.id = resource_ratings.resource_id
WHERE resource_ratings.resource_id = 5
GROUP BY resources.title;
*/

