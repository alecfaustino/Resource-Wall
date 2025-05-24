-- RATINGS
DROP TABLE IF EXISTS resource_ratings CASCADE;
CREATE TABLE resource_ratings (
  id SERIAL PRIMARY KEY NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  resource_id INTEGER REFERENCES resources(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5), -- star rating from 1 to 5
  -- to support half-star in the future, use:
  -- rating NUMERIC(2,1) CHECK (rating >= 1 AND rating <= 5)
  UNIQUE(user_id, resource_id) -- ensures a user can rate this resource only once
)
