-- Test queries for development
-- Connect to postgresql://jedi:force_awakens@localhost:5432/starwars

-- Test JOIN: Characters with their home planets
SELECT 
    c.name AS character_name,
    c.species,
    p.name AS planet_name,
    p.climate
FROM characters c
LEFT JOIN planets p ON c.homeworld_id = p.id
ORDER BY c.name;

-- Test aggregation: Count characters per planet
SELECT 
    p.name AS planet,
    COUNT(c.id) AS character_count
FROM planets p
LEFT JOIN characters c ON p.id = c.homeworld_id
GROUP BY p.id, p.name
HAVING COUNT(c.id) > 0
ORDER BY character_count DESC;

-- Test many-to-many: Ships and their pilots
SELECT 
    s.name AS starship,
    s.model,
    STRING_AGG(c.name, ', ') AS pilots
FROM starships s
JOIN character_starships cs ON s.id = cs.starship_id
JOIN characters c ON cs.character_id = c.id
GROUP BY s.id, s.name, s.model;

-- Insert test data
INSERT INTO characters (name, species, homeworld_id, birth_year)
VALUES ('Test Character', 'Human', 1, '19BBY')
RETURNING *;

-- Update example
UPDATE planets 
SET population = population * 1.1
WHERE name = 'Tatooine'
RETURNING *;

-- Complex JOIN: Films with characters and their planets
SELECT 
    f.title,
    f.release_date,
    c.name AS character,
    p.name AS homeworld
FROM films f
JOIN character_films cf ON f.id = cf.film_id
JOIN characters c ON cf.character_id = c.id
LEFT JOIN planets p ON c.homeworld_id = p.id
WHERE f.episode_id = 4
ORDER BY c.name;