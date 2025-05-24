-- Query for this req - users should be able to search for already-saved resources created by any user

-- Select all resources using title. Use %java% for now. Limit by 10

SELECT *
FROM resources
WHERE title ILIKE '%java%'
LIMIT 10;
