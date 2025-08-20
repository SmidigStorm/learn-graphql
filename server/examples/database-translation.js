// Example: How GraphQL translates database relationships

// DATABASE SCHEMA (PostgreSQL style):
// - characters table: id, name, height, mass, planet_id
// - character_starship junction table: character_id, starship_id
// - film_character junction table: film_id, character_id

// GRAPHQL SCHEMA makes it human-readable:
const typeDefs = `
  type Character {
    id: ID!
    name: String!
    height: Int
    mass: Int
    
    # Instead of "planet_id", we have a meaningful relationship:
    homeworld: Planet
    
    # Instead of "character_starship" junction table:
    starships: [Starship!]!
    
    # Instead of "film_character" junction table:
    appearsIn: [Film!]!  # or "films" - your choice!
  }
`;

// RESOLVER translates database queries to GraphQL:
const resolvers = {
  Character: {
    // Foreign key relationship
    homeworld: async (character, _, { dataSources }) => {
      // SQL: SELECT * FROM planets WHERE id = character.planet_id
      return dataSources.planetAPI.getById(character.planet_id);
    },
    
    // Many-to-many relationship
    starships: async (character, _, { dataSources }) => {
      // SQL: SELECT s.* FROM starships s 
      //      JOIN character_starship cs ON s.id = cs.starship_id
      //      WHERE cs.character_id = character.id
      return dataSources.starshipAPI.getByCharacterId(character.id);
    },
    
    // Another many-to-many with better naming
    appearsIn: async (character, _, { dataSources }) => {
      // SQL: SELECT f.* FROM films f
      //      JOIN film_character fc ON f.id = fc.film_id
      //      WHERE fc.character_id = character.id
      return dataSources.filmAPI.getByCharacterId(character.id);
    }
  }
};

// EXAMPLE WITH REAL DATABASE QUERIES:
class CharacterDataSource {
  async getCharacterWithRelations(id) {
    // Raw PostgreSQL query
    const rawQuery = `
      SELECT 
        c.*,
        p.name as planet_name,
        array_agg(DISTINCT s.name) as starship_names,
        array_agg(DISTINCT f.title) as film_titles
      FROM characters c
      LEFT JOIN planets p ON c.planet_id = p.id
      LEFT JOIN character_starship cs ON c.id = cs.character_id
      LEFT JOIN starships s ON cs.starship_id = s.id
      LEFT JOIN film_character fc ON c.id = fc.character_id
      LEFT JOIN films f ON fc.film_id = f.id
      WHERE c.id = $1
      GROUP BY c.id, p.name
    `;
    
    // But in GraphQL, the user just writes:
    // query {
    //   character(id: "1") {
    //     name
    //     homeworld { name }
    //     starships { name }
    //     appearsIn { title }
    //   }
    // }
  }
}