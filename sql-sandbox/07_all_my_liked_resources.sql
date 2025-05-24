-- Query for this req:
-- users should be able to view all their own and all liked resources on one page ("My resources")

-- Select resources liked by user

SELECT r.*
FROM resources r
JOIN resource_likes rl ON r.id = rl.resource_id
WHERE rl.user_id = 1
LIMIT 5;
