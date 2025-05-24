-- Resource 1: Rated by users 1, 2, 3
INSERT INTO resource_comments (user_id, resource_id, comment) VALUES
(1, 1, 'Loved this JavaScript guide — super comprehensive!');

INSERT INTO resource_comments (user_id, resource_id, comment) VALUES
(2, 1, 'Great resource. Some examples could be clearer.');

INSERT INTO resource_comments (user_id, resource_id, comment) VALUES
(3, 1, 'Helpful, but a bit long for beginners.');

-- Resource 2: Rated by users 1, 4
INSERT INTO resource_comments (user_id, resource_id, comment) VALUES
(1, 2, 'Visual Flexbox explanation helped a lot, thanks!');

INSERT INTO resource_comments (user_id, resource_id, comment) VALUES
(4, 2, 'Good starter, but missing grid comparison.');

-- Resource 3: Rated by user 2
INSERT INTO resource_comments (user_id, resource_id, comment) VALUES
(2, 3, 'PostgreSQL basics well covered!');

-- Resource 4: Rated by users 3, 5
INSERT INTO resource_comments (user_id, resource_id, comment) VALUES
(3, 4, 'Nice Node.js crash course — fast and effective.');

INSERT INTO resource_comments (user_id, resource_id, comment) VALUES
(5, 4, 'Covered routing well, but missed error handling.');

-- Resource 5: Rated by users 1, 5
INSERT INTO resource_comments (user_id, resource_id, comment) VALUES
(1, 5, 'Great React intro — very friendly for beginners.');

INSERT INTO resource_comments (user_id, resource_id, comment) VALUES
(5, 5, 'Loved the hook examples. Very helpful!');
