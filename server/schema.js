const { gql } = require('apollo-server');

const typeDefs = gql`
  type Character {
    id: ID!
    name: String!
    height: Int
    mass: Int
    homeworld: Planet
    starships: [Starship!]!
    films: [Film!]!
  }

  type Planet {
    id: ID!
    name: String!
    population: Float
    climate: String
    terrain: String
    residents: [Character!]!
  }

  type Starship {
    id: ID!
    name: String!
    model: String
    manufacturer: String
    length: Float
    crew: Int
    passengers: Int
    pilots: [Character!]!
  }

  type Film {
    id: ID!
    title: String!
    episodeId: Int!
    releaseDate: String
    director: String
    characters: [Character!]!
  }

  type Query {
    # Character queries
    character(id: ID!): Character
    characters: [Character!]!
    searchCharacters(name: String!): [Character!]!
    
    # Planet queries
    planet(id: ID!): Planet
    planets: [Planet!]!
    
    # Starship queries
    starship(id: ID!): Starship
    starships: [Starship!]!
    
    # Film queries
    film(id: ID!): Film
    films: [Film!]!
    filmsByEpisode: [Film!]!
  }

  type Mutation {
    # Add a new character
    addCharacter(input: AddCharacterInput!): Character!
    
    # Assign a pilot to a starship
    assignPilot(starshipId: ID!, characterId: ID!): Starship!
    
    # Update planet population
    updatePlanetPopulation(planetId: ID!, population: Float!): Planet!
  }

  input AddCharacterInput {
    name: String!
    height: Int
    mass: Int
    homeworldId: ID
    starshipIds: [ID!]
    filmIds: [ID!]
  }
`;

module.exports = typeDefs;