// Sample Star Wars data
const characters = [
  {
    id: '1',
    name: 'Luke Skywalker',
    height: 172,
    mass: 77,
    homeworld: '1',
    starships: ['1', '2'],
    films: ['1', '2', '3', '4']
  },
  {
    id: '2',
    name: 'Darth Vader',
    height: 202,
    mass: 136,
    homeworld: '1',
    starships: ['3'],
    films: ['1', '2', '3', '5']
  },
  {
    id: '3',
    name: 'Leia Organa',
    height: 150,
    mass: 49,
    homeworld: '2',
    starships: [],
    films: ['1', '2', '3', '4']
  },
  {
    id: '4',
    name: 'Han Solo',
    height: 180,
    mass: 80,
    homeworld: '3',
    starships: ['4', '5'],
    films: ['1', '2', '3']
  },
  {
    id: '5',
    name: 'Yoda',
    height: 66,
    mass: 17,
    homeworld: null,
    starships: [],
    films: ['2', '3', '5', '6']
  }
];

const planets = [
  {
    id: '1',
    name: 'Tatooine',
    population: 200000,
    climate: 'arid',
    terrain: 'desert',
    residents: ['1', '2']
  },
  {
    id: '2',
    name: 'Alderaan',
    population: 2000000000,
    climate: 'temperate',
    terrain: 'grasslands, mountains',
    residents: ['3']
  },
  {
    id: '3',
    name: 'Corellia',
    population: 3000000000,
    climate: 'temperate',
    terrain: 'plains, urban, hills, forests',
    residents: ['4']
  },
  {
    id: '4',
    name: 'Hoth',
    population: 0,
    climate: 'frozen',
    terrain: 'tundra, ice caves, mountain ranges',
    residents: []
  },
  {
    id: '5',
    name: 'Dagobah',
    population: 0,
    climate: 'murky',
    terrain: 'swamp, jungles',
    residents: []
  }
];

const starships = [
  {
    id: '1',
    name: 'X-wing',
    model: 'T-65 X-wing',
    manufacturer: 'Incom Corporation',
    length: 12.5,
    crew: 1,
    passengers: 0,
    pilots: ['1']
  },
  {
    id: '2',
    name: 'Imperial shuttle',
    model: 'Lambda-class T-4a shuttle',
    manufacturer: 'Sienar Fleet Systems',
    length: 20,
    crew: 6,
    passengers: 20,
    pilots: ['1', '2']
  },
  {
    id: '3',
    name: 'TIE Advanced x1',
    model: 'Twin Ion Engine Advanced x1',
    manufacturer: 'Sienar Fleet Systems',
    length: 9.2,
    crew: 1,
    passengers: 0,
    pilots: ['2']
  },
  {
    id: '4',
    name: 'Millennium Falcon',
    model: 'YT-1300 light freighter',
    manufacturer: 'Corellian Engineering Corporation',
    length: 34.37,
    crew: 4,
    passengers: 6,
    pilots: ['4', '1']
  },
  {
    id: '5',
    name: 'Slave 1',
    model: 'Firespray-31-class patrol and attack',
    manufacturer: 'Kuat Systems Engineering',
    length: 21.5,
    crew: 1,
    passengers: 6,
    pilots: []
  }
];

const films = [
  {
    id: '1',
    title: 'A New Hope',
    episodeId: 4,
    releaseDate: '1977-05-25',
    director: 'George Lucas',
    characters: ['1', '2', '3', '4']
  },
  {
    id: '2',
    title: 'The Empire Strikes Back',
    episodeId: 5,
    releaseDate: '1980-05-17',
    director: 'Irvin Kershner',
    characters: ['1', '2', '3', '4', '5']
  },
  {
    id: '3',
    title: 'Return of the Jedi',
    episodeId: 6,
    releaseDate: '1983-05-25',
    director: 'Richard Marquand',
    characters: ['1', '2', '3', '4', '5']
  },
  {
    id: '4',
    title: 'The Force Awakens',
    episodeId: 7,
    releaseDate: '2015-12-11',
    director: 'J.J. Abrams',
    characters: ['1', '3']
  },
  {
    id: '5',
    title: 'The Phantom Menace',
    episodeId: 1,
    releaseDate: '1999-05-19',
    director: 'George Lucas',
    characters: ['2', '5']
  },
  {
    id: '6',
    title: 'Attack of the Clones',
    episodeId: 2,
    releaseDate: '2002-05-16',
    director: 'George Lucas',
    characters: ['5']
  }
];

module.exports = {
  characters,
  planets,
  starships,
  films
};