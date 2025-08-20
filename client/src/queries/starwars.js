import { gql } from '@apollo/client';

// Query to get all characters
export const GET_CHARACTERS = gql`
  query GetCharacters {
    characters {
      id
      name
      height
      mass
      homeworld {
        id
        name
      }
      starships {
        id
        name
      }
    }
  }
`;

// Query to get a single character with full details
export const GET_CHARACTER = gql`
  query GetCharacter($id: ID!) {
    character(id: $id) {
      id
      name
      height
      mass
      homeworld {
        id
        name
        climate
        terrain
      }
      starships {
        id
        name
        model
        manufacturer
      }
      films {
        id
        title
        episodeId
        director
      }
    }
  }
`;

// Query to search characters
export const SEARCH_CHARACTERS = gql`
  query SearchCharacters($name: String!) {
    searchCharacters(name: $name) {
      id
      name
      height
      homeworld {
        name
      }
    }
  }
`;

// Query to get all planets
export const GET_PLANETS = gql`
  query GetPlanets {
    planets {
      id
      name
      population
      climate
      terrain
      residents {
        id
        name
      }
    }
  }
`;

// Query to get all starships
export const GET_STARSHIPS = gql`
  query GetStarships {
    starships {
      id
      name
      model
      manufacturer
      length
      crew
      passengers
      pilots {
        id
        name
      }
    }
  }
`;

// Query to get films sorted by episode
export const GET_FILMS_BY_EPISODE = gql`
  query GetFilmsByEpisode {
    filmsByEpisode {
      id
      title
      episodeId
      releaseDate
      director
      characters {
        id
        name
      }
    }
  }
`;

// Mutation to add a new character
export const ADD_CHARACTER = gql`
  mutation AddCharacter($input: AddCharacterInput!) {
    addCharacter(input: $input) {
      id
      name
      height
      mass
      homeworld {
        name
      }
    }
  }
`;

// Mutation to assign a pilot to a starship
export const ASSIGN_PILOT = gql`
  mutation AssignPilot($starshipId: ID!, $characterId: ID!) {
    assignPilot(starshipId: $starshipId, characterId: $characterId) {
      id
      name
      pilots {
        id
        name
      }
    }
  }
`;

// Mutation to update planet population
export const UPDATE_PLANET_POPULATION = gql`
  mutation UpdatePlanetPopulation($planetId: ID!, $population: Float!) {
    updatePlanetPopulation(planetId: $planetId, population: $population) {
      id
      name
      population
    }
  }
`;