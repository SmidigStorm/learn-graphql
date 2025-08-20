const db = require('./db/connection');

const resolvers = {
  Query: {
    // Character queries
    character: async (_, { id }) => {
      const result = await db.query('SELECT * FROM characters WHERE id = $1', [id]);
      return result.rows[0];
    },
    
    characters: async () => {
      const result = await db.query('SELECT * FROM characters ORDER BY id');
      return result.rows;
    },
    
    searchCharacters: async (_, { name }) => {
      const result = await db.query(
        'SELECT * FROM characters WHERE LOWER(name) LIKE LOWER($1) ORDER BY name',
        [`%${name}%`]
      );
      return result.rows;
    },
    
    // Planet queries
    planet: async (_, { id }) => {
      const result = await db.query('SELECT * FROM planets WHERE id = $1', [id]);
      return result.rows[0];
    },
    
    planets: async () => {
      const result = await db.query('SELECT * FROM planets ORDER BY id');
      return result.rows;
    },
    
    // Starship queries
    starship: async (_, { id }) => {
      const result = await db.query('SELECT * FROM starships WHERE id = $1', [id]);
      return result.rows[0];
    },
    
    starships: async () => {
      const result = await db.query('SELECT * FROM starships ORDER BY id');
      return result.rows;
    },
    
    // Film queries
    film: async (_, { id }) => {
      const result = await db.query('SELECT *, episode_id as "episodeId" FROM films WHERE id = $1', [id]);
      return result.rows[0];
    },
    
    films: async () => {
      const result = await db.query('SELECT *, episode_id as "episodeId" FROM films ORDER BY id');
      return result.rows;
    },
    
    filmsByEpisode: async () => {
      const result = await db.query('SELECT *, episode_id as "episodeId" FROM films ORDER BY episode_id');
      return result.rows;
    },
  },
  
  Mutation: {
    addCharacter: async (_, { input }) => {
      const { name, height, mass, homeworldId, starshipIds, filmIds } = input;
      
      // Start a transaction
      const client = await db.pool.connect();
      try {
        await client.query('BEGIN');
        
        // Insert character
        const characterResult = await client.query(
          `INSERT INTO characters (name, height, mass, homeworld_id) 
           VALUES ($1, $2, $3, $4) RETURNING *`,
          [name, height, mass, homeworldId]
        );
        const character = characterResult.rows[0];
        
        // Insert starship relationships
        if (starshipIds && starshipIds.length > 0) {
          for (const starshipId of starshipIds) {
            await client.query(
              'INSERT INTO character_starships (character_id, starship_id) VALUES ($1, $2)',
              [character.id, starshipId]
            );
          }
        }
        
        // Insert film relationships
        if (filmIds && filmIds.length > 0) {
          for (const filmId of filmIds) {
            await client.query(
              'INSERT INTO character_films (character_id, film_id) VALUES ($1, $2)',
              [character.id, filmId]
            );
          }
        }
        
        await client.query('COMMIT');
        return character;
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    },
    
    assignPilot: async (_, { starshipId, characterId }) => {
      // Verify both exist
      const characterCheck = await db.query('SELECT id FROM characters WHERE id = $1', [characterId]);
      const starshipCheck = await db.query('SELECT id FROM starships WHERE id = $1', [starshipId]);
      
      if (!characterCheck.rows[0]) throw new Error('Character not found');
      if (!starshipCheck.rows[0]) throw new Error('Starship not found');
      
      // Insert relationship (ignore if already exists)
      await db.query(
        `INSERT INTO character_starships (character_id, starship_id) 
         VALUES ($1, $2) 
         ON CONFLICT (character_id, starship_id) DO NOTHING`,
        [characterId, starshipId]
      );
      
      // Return the updated starship
      const result = await db.query('SELECT * FROM starships WHERE id = $1', [starshipId]);
      return result.rows[0];
    },
    
    updatePlanetPopulation: async (_, { planetId, population }) => {
      const result = await db.query(
        'UPDATE planets SET population = $1 WHERE id = $2 RETURNING *',
        [population, planetId]
      );
      
      if (!result.rows[0]) throw new Error('Planet not found');
      return result.rows[0];
    }
  },
  
  // Field resolvers for relationships
  Character: {
    homeworld: async (character) => {
      if (!character.homeworld_id) return null;
      const result = await db.query('SELECT * FROM planets WHERE id = $1', [character.homeworld_id]);
      return result.rows[0];
    },
    
    starships: async (character) => {
      const result = await db.query(
        `SELECT s.* FROM starships s
         JOIN character_starships cs ON s.id = cs.starship_id
         WHERE cs.character_id = $1
         ORDER BY s.id`,
        [character.id]
      );
      return result.rows;
    },
    
    films: async (character) => {
      const result = await db.query(
        `SELECT f.*, f.episode_id as "episodeId" FROM films f
         JOIN character_films cf ON f.id = cf.film_id
         WHERE cf.character_id = $1
         ORDER BY f.episode_id`,
        [character.id]
      );
      return result.rows;
    }
  },
  
  Planet: {
    residents: async (planet) => {
      const result = await db.query(
        'SELECT * FROM characters WHERE homeworld_id = $1 ORDER BY name',
        [planet.id]
      );
      return result.rows;
    }
  },
  
  Starship: {
    pilots: async (starship) => {
      const result = await db.query(
        `SELECT c.* FROM characters c
         JOIN character_starships cs ON c.id = cs.character_id
         WHERE cs.starship_id = $1
         ORDER BY c.name`,
        [starship.id]
      );
      return result.rows;
    }
  },
  
  Film: {
    characters: async (film) => {
      const result = await db.query(
        `SELECT c.* FROM characters c
         JOIN character_films cf ON c.id = cf.character_id
         WHERE cf.film_id = $1
         ORDER BY c.name`,
        [film.id]
      );
      return result.rows;
    }
  }
};

module.exports = resolvers;