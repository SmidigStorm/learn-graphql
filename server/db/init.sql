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

