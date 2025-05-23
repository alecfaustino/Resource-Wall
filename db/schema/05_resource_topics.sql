-- CARD(resource) TOPIC (many to many)
DROP TABLE IF EXISTS resource_topics CASCADE;
CREATE TABLE resource_topics (
  id SERIAL PRIMARY KEY NOT NULL,
  resource_id INTEGER REFERENCES resources(id) ON DELETE CASCADE,
  topic_id INTEGER REFERENCES topics(id) ON DELETE CASCADE
)
