-- Star Wars Database Schema

-- Create tables
CREATE TABLE planets (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    population BIGINT,
    climate VARCHAR(255),
    terrain TEXT
);

CREATE TABLE characters (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    height INTEGER,
    mass INTEGER,
    homeworld_id INTEGER REFERENCES planets(id)
);

CREATE TABLE starships (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    model VARCHAR(255),
    manufacturer VARCHAR(255),
    length DECIMAL(10, 2),
    crew INTEGER,
    passengers INTEGER
);


-- Junction tables for many-to-many relationships
CREATE TABLE character_starships (
    character_id INTEGER REFERENCES characters(id) ON DELETE CASCADE,
    starship_id INTEGER REFERENCES starships(id) ON DELETE CASCADE,
    PRIMARY KEY (character_id, starship_id)
);

-- Character kills junction table
CREATE TABLE character_kills (
    id SERIAL PRIMARY KEY,
    killer_id INTEGER REFERENCES characters(id) ON DELETE CASCADE,
    victim_id INTEGER REFERENCES characters(id) ON DELETE CASCADE,
    method VARCHAR(255),
    location VARCHAR(255),
    description TEXT,
    occurred_at TIMESTAMP DEFAULT NOW(),
    
    -- Prevent self-kills
    CONSTRAINT no_suicide CHECK (killer_id != victim_id),
    
    -- Prevent duplicate kills (same victim can't be killed twice)
    UNIQUE(victim_id)
);


-- Indexes for better query performance
CREATE INDEX idx_characters_homeworld ON characters(homeworld_id);
CREATE INDEX idx_character_starships_character ON character_starships(character_id);
CREATE INDEX idx_character_starships_starship ON character_starships(starship_id);
CREATE INDEX idx_kills_killer ON character_kills(killer_id);
CREATE INDEX idx_kills_victim ON character_kills(victim_id);
CREATE INDEX idx_kills_occurred_at ON character_kills(occurred_at);

-- Insert initial data
-- Planets
INSERT INTO planets (name, population, climate, terrain) VALUES
('Tatooine', 200000, 'arid', 'desert'),
('Alderaan', 2000000000, 'temperate', 'grasslands, mountains'),
('Corellia', 3000000000, 'temperate', 'plains, urban, hills, forests'),
('Hoth', 0, 'frozen', 'tundra, ice caves, mountain ranges'),
('Dagobah', 0, 'murky', 'swamp, jungles');

-- Characters (we need to insert after planets due to foreign key)
INSERT INTO characters (name, height, mass, homeworld_id) VALUES
('Luke Skywalker', 172, 77, 1),
('Darth Vader', 202, 136, 1),
('Leia Organa', 150, 49, 2),
('Han Solo', 180, 80, 3),
('Yoda', 66, 17, NULL);

-- Starships
INSERT INTO starships (name, model, manufacturer, length, crew, passengers) VALUES
('X-wing', 'T-65 X-wing', 'Incom Corporation', 12.5, 1, 0),
('Imperial shuttle', 'Lambda-class T-4a shuttle', 'Sienar Fleet Systems', 20, 6, 20),
('TIE Advanced x1', 'Twin Ion Engine Advanced x1', 'Sienar Fleet Systems', 9.2, 1, 0),
('Millennium Falcon', 'YT-1300 light freighter', 'Corellian Engineering Corporation', 34.37, 4, 6),
('Slave 1', 'Firespray-31-class patrol and attack', 'Kuat Systems Engineering', 21.5, 1, 6);


-- Character-Starship relationships
INSERT INTO character_starships (character_id, starship_id) VALUES
(1, 1), -- Luke - X-wing
(1, 2), -- Luke - Imperial shuttle
(2, 2), -- Vader - Imperial shuttle
(2, 3), -- Vader - TIE Advanced
(4, 4), -- Han - Millennium Falcon
(4, 5), -- Han - Slave 1
(1, 4); -- Luke - Millennium Falcon

-- Add more characters for kill events
INSERT INTO characters (name, height, mass, homeworld_id) VALUES
('Obi-Wan Kenobi', 182, 77, 1),
('Emperor Palpatine', 170, 75, NULL),
('Boba Fett', 183, 78, NULL),
('Jabba the Hutt', 175, 1358, 1),
('Greedo', 173, 74, NULL),
('Count Dooku', 193, 80, NULL),
('Anakin Skywalker', 188, 84, 1),
('Mace Windu', 188, 84, NULL),
('Qui-Gon Jinn', 193, 89, NULL),
('Darth Maul', 175, 80, NULL);

-- Famous Star Wars kills
INSERT INTO character_kills (killer_id, victim_id, method, location, description, occurred_at) VALUES
-- Darth Vader kills Obi-Wan
(2, 6, 'Lightsaber', 'Death Star I', 'Obi-Wan sacrifices himself during lightsaber duel, becoming one with the Force', '1977-05-25 12:00:00'),
-- Darth Vader kills Emperor Palpatine
(2, 7, 'Thrown down reactor shaft', 'Death Star II', 'Vader redeems himself by saving Luke and destroying the Emperor', '1983-05-25 14:00:00'),
-- Han Solo kills Greedo
(4, 10, 'Blaster', 'Mos Eisley Cantina', 'Han shoots first (or simultaneously) in cantina confrontation', '1977-05-25 10:00:00'),
-- Leia kills Jabba
(3, 9, 'Chain strangulation', 'Jabba''s Sail Barge', 'Leia strangles Jabba with her slave chain during the Sarlacc execution', '1983-05-25 11:00:00'),
-- Anakin kills Count Dooku
(12, 11, 'Dual lightsaber decapitation', 'The Invisible Hand', 'Anakin executes Dooku on Palpatine''s orders', '2005-05-19 09:00:00'),
-- Anakin kills Mace Windu
(12, 13, 'Lightsaber/Force Lightning', 'Chancellor''s Office', 'Anakin assists Palpatine, leading to Windu''s death', '2005-05-19 18:00:00'),
-- Darth Maul kills Qui-Gon
(15, 14, 'Lightsaber', 'Naboo Power Generator', 'Maul defeats Qui-Gon in intense duel', '1999-05-19 15:00:00'),
-- Obi-Wan kills Darth Maul
(6, 15, 'Lightsaber bisection', 'Naboo Power Generator', 'Obi-Wan avenges his master by cutting Maul in half', '1999-05-19 15:30:00');

