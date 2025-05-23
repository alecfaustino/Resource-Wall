-- LINKS associated with resources
DROP TABLE IF EXISTS resource_links CASCADE;
CREATE TABLE resource_links (
  id SERIAL PRIMARY KEY NOT NULL,
  resource_id INTEGER REFERENCES resources(id) ON DELETE CASCADE,
  url VARCHAR(255) NOT NULL,
  description TEXT
)
