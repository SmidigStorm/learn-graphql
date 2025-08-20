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

CREATE TABLE films (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    episode_id INTEGER NOT NULL,
    release_date DATE,
    director VARCHAR(255)
);

-- Junction tables for many-to-many relationships
CREATE TABLE character_starships (
    character_id INTEGER REFERENCES characters(id) ON DELETE CASCADE,
    starship_id INTEGER REFERENCES starships(id) ON DELETE CASCADE,
    PRIMARY KEY (character_id, starship_id)
);

CREATE TABLE character_films (
    character_id INTEGER REFERENCES characters(id) ON DELETE CASCADE,
    film_id INTEGER REFERENCES films(id) ON DELETE CASCADE,
    PRIMARY KEY (character_id, film_id)
);

-- Indexes for better query performance
CREATE INDEX idx_characters_homeworld ON characters(homeworld_id);
CREATE INDEX idx_character_starships_character ON character_starships(character_id);
CREATE INDEX idx_character_starships_starship ON character_starships(starship_id);
CREATE INDEX idx_character_films_character ON character_films(character_id);
CREATE INDEX idx_character_films_film ON character_films(film_id);

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

-- Films
INSERT INTO films (title, episode_id, release_date, director) VALUES
('A New Hope', 4, '1977-05-25', 'George Lucas'),
('The Empire Strikes Back', 5, '1980-05-17', 'Irvin Kershner'),
('Return of the Jedi', 6, '1983-05-25', 'Richard Marquand'),
('The Force Awakens', 7, '2015-12-11', 'J.J. Abrams'),
('The Phantom Menace', 1, '1999-05-19', 'George Lucas'),
('Attack of the Clones', 2, '2002-05-16', 'George Lucas');

-- Character-Starship relationships
INSERT INTO character_starships (character_id, starship_id) VALUES
(1, 1), -- Luke - X-wing
(1, 2), -- Luke - Imperial shuttle
(2, 2), -- Vader - Imperial shuttle
(2, 3), -- Vader - TIE Advanced
(4, 4), -- Han - Millennium Falcon
(4, 5), -- Han - Slave 1
(1, 4); -- Luke - Millennium Falcon

-- Character-Film relationships
INSERT INTO character_films (character_id, film_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), -- Luke in episodes 4,5,6,7
(2, 1), (2, 2), (2, 3), (2, 5), -- Vader in episodes 4,5,6,1
(3, 1), (3, 2), (3, 3), (3, 4), -- Leia in episodes 4,5,6,7
(4, 1), (4, 2), (4, 3),         -- Han in episodes 4,5,6
(5, 2), (5, 3), (5, 5), (5, 6); -- Yoda in episodes 5,6,1,2