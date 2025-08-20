const { characters, planets, starships, films } = require('./data');

const resolvers = {
  Query: {
    // Character queries
    character: (_, { id }) => characters.find(c => c.id === id),
    characters: () => characters,
    searchCharacters: (_, { name }) => 
      characters.filter(c => c.name.toLowerCase().includes(name.toLowerCase())),
    
    // Planet queries
    planet: (_, { id }) => planets.find(p => p.id === id),
    planets: () => planets,
    
    // Starship queries
    starship: (_, { id }) => starships.find(s => s.id === id),
    starships: () => starships,
    
    // Film queries
    film: (_, { id }) => films.find(f => f.id === id),
    films: () => films,
    filmsByEpisode: () => [...films].sort((a, b) => a.episodeId - b.episodeId),
  },
  
  Mutation: {
    addCharacter: (_, { input }) => {
      const newCharacter = {
        id: String(characters.length + 1),
        name: input.name,
        height: input.height || null,
        mass: input.mass || null,
        homeworld: input.homeworldId || null,
        starships: input.starshipIds || [],
        films: input.filmIds || []
      };
      characters.push(newCharacter);
      return newCharacter;
    },
    
    assignPilot: (_, { starshipId, characterId }) => {
      const starship = starships.find(s => s.id === starshipId);
      const character = characters.find(c => c.id === characterId);
      
      if (!starship) throw new Error('Starship not found');
      if (!character) throw new Error('Character not found');
      
      if (!starship.pilots.includes(characterId)) {
        starship.pilots.push(characterId);
      }
      
      if (!character.starships.includes(starshipId)) {
        character.starships.push(starshipId);
      }
      
      return starship;
    },
    
    updatePlanetPopulation: (_, { planetId, population }) => {
      const planet = planets.find(p => p.id === planetId);
      if (!planet) throw new Error('Planet not found');
      
      planet.population = population;
      return planet;
    }
  },
  
  // Field resolvers for relationships
  Character: {
    homeworld: (character) => {
      if (!character.homeworld) return null;
      return planets.find(p => p.id === character.homeworld);
    },
    starships: (character) => {
      return starships.filter(s => character.starships.includes(s.id));
    },
    films: (character) => {
      return films.filter(f => character.films.includes(f.id));
    }
  },
  
  Planet: {
    residents: (planet) => {
      return characters.filter(c => planet.residents.includes(c.id));
    }
  },
  
  Starship: {
    pilots: (starship) => {
      return characters.filter(c => starship.pilots.includes(c.id));
    }
  },
  
  Film: {
    characters: (film) => {
      return characters.filter(c => film.characters.includes(c.id));
    }
  }
};

module.exports = resolvers;