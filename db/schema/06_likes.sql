-- LIKES
DROP TABLE IF EXISTS resource_likes CASCADE;
CREATE TABLE resource_likes (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  resource_id INTEGER REFERENCES resources(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, resource_id) -- ensures a user can like this resource only once
)
