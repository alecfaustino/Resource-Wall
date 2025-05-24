-- Query for this req:
-- users should be able to update their profile


-- Update user profile(name, email)

UPDATE users
SET name = 'Updated Name',
    email = 'newemail@example.com'
WHERE id = 1;

