-- Query for this req:
-- users should be able to view all their own and all liked resources on one page ("My resources")

-- Select resources created by user

SELECT *
FROM resources
WHERE author_id = 1
LIMIT 5;
