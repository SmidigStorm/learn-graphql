const { gql } = require('apollo-server');

const typeDefs = gql`
  """
  A character in the Star Wars universe
  """
  type Character {
    """
    Unique identifier for the character
    """
    id: ID!
    
    """
    The name of this character
    """
    name: String!
    
    """
    The height of the character in centimeters
    """
    height: Int
    
    """
    The mass of the character in kilograms
    """
    mass: Int
    
    """
    The planet this character was born on or inhabits
    """
    homeworld: Planet
    
    """
    List of starships this character has piloted
    """
    starships: [Starship!]!
    
    """
    Characters this character has killed
    """
    kills: [Kill!]!
    
    """
    The kill event where this character was the victim (if deceased)
    """
    death: Kill
    
    """
    Total number of confirmed kills
    """
    killCount: Int!
  }

  """
  A planet in the Star Wars universe
  """
  type Planet {
    """
    Unique identifier for the planet
    """
    id: ID!
    
    """
    The name of this planet
    """
    name: String!
    
    """
    The average population of sentient beings inhabiting this planet
    """
    population: Float
    
    """
    The climate of this planet. Comma-separated if diverse
    Examples: "arid", "temperate", "tropical", "frozen", "murky, humid"
    """
    climate: String
    
    """
    The terrain of this planet. Comma-separated if diverse
    Examples: "desert", "grasslands", "mountains", "jungle, rainforests"
    """
    terrain: String
    
    """
    Characters who live on or come from this planet
    """
    residents: [Character!]!
  }

  """
  A starship or vehicle in the Star Wars universe
  """
  type Starship {
    """
    Unique identifier for the starship
    """
    id: ID!
    
    """
    The name of this starship
    Examples: "Millennium Falcon", "X-wing", "Death Star"
    """
    name: String!
    
    """
    The model or official name of this starship
    Example: "T-65 X-wing"
    """
    model: String
    
    """
    The manufacturer of this starship
    Example: "Incom Corporation"
    """
    manufacturer: String
    
    """
    The length of this starship in meters
    """
    length: Float
    
    """
    The number of crew members required to operate this starship
    """
    crew: Int
    
    """
    The number of non-essential passengers this starship can transport
    """
    passengers: Int
    
    """
    Characters who have piloted this starship
    """
    pilots: [Character!]!
  }

  """
  A kill event between two characters
  """
  type Kill {
    """
    Unique identifier for the kill event
    """
    id: ID!
    
    """
    The character who performed the kill
    """
    killer: Character!
    
    """
    The character who was killed
    """
    victim: Character!
    
    """
    The method or weapon used for the kill
    Examples: "Lightsaber", "Blaster", "Force Lightning"
    """
    method: String
    
    """
    The location where the kill occurred
    Examples: "Death Star", "Mos Eisley Cantina"
    """
    location: String
    
    """
    Detailed description of the kill event
    """
    description: String
    
    """
    Timestamp when the kill occurred (in-universe or real-world release date)
    """
    occurredAt: String
  }

  """
  Root query type for reading data
  """
  type Query {
    """
    Fetch a single character by ID
    Returns null if character not found
    """
    character(
      """
      The unique identifier of the character
      """
      id: ID!
    ): Character
    
    """
    Fetch all characters in the database
    Returns an empty list if no characters exist
    """
    characters: [Character!]!
    
    """
    Search for characters by name
    Case-insensitive partial match
    """
    searchCharacters(
      """
      The name or partial name to search for
      Example: "sky" will match "Luke Skywalker" and "Anakin Skywalker"
      """
      name: String!
    ): [Character!]!
    
    """
    Fetch a single planet by ID
    Returns null if planet not found
    """
    planet(
      """
      The unique identifier of the planet
      """
      id: ID!
    ): Planet
    
    """
    Fetch all planets in the database
    Returns an empty list if no planets exist
    """
    planets: [Planet!]!
    
    """
    Fetch a single starship by ID
    Returns null if starship not found
    """
    starship(
      """
      The unique identifier of the starship
      """
      id: ID!
    ): Starship
    
    """
    Fetch all starships in the database
    Returns an empty list if no starships exist
    """
    starships: [Starship!]!
    
    """
    Fetch all kill events in the database
    Useful for statistics, browsing, or filtering
    Returns kills sorted by occurred_at timestamp
    """
    kills(
      """
      Filter by killing method (optional)
      Example: "Lightsaber", "Blaster"
      """
      method: String
      
      """
      Filter by location (optional)
      Example: "Death Star", "Naboo"
      """
      location: String
    ): [Kill!]!
  }

  """
  Root mutation type for modifying data
  """
  type Mutation {
    """
    Add a new character to the database
    Returns the created character with generated ID
    """
    addCharacter(
      """
      The character data to create
      """
      input: AddCharacterInput!
    ): Character!
    
    """
    Assign a character as a pilot to a starship
    Creates a many-to-many relationship
    Returns the updated starship
    """
    assignPilot(
      """
      The ID of the starship to assign the pilot to
      """
      starshipId: ID!
      
      """
      The ID of the character to assign as pilot
      """
      characterId: ID!
    ): Starship!
    
    """
    Update the population of a planet
    Returns the updated planet
    """
    updatePlanetPopulation(
      """
      The ID of the planet to update
      """
      planetId: ID!
      
      """
      The new population value
      Can be a decimal number for large populations (e.g., 1.5 for 1.5 billion)
      """
      population: Float!
    ): Planet!
    
    """
    Record a kill event between two characters
    Note: Each character can only be killed once (enforced by database)
    Returns the created kill event
    """
    recordKill(
      """
      The kill event data
      """
      input: RecordKillInput!
    ): Kill!
  }

  """
  Input type for creating a new character
  """
  input AddCharacterInput {
    """
    The name of the character (required)
    Must be unique in the database
    """
    name: String!
    
    """
    The height of the character in centimeters (optional)
    """
    height: Int
    
    """
    The mass of the character in kilograms (optional)
    """
    mass: Int
    
    """
    The ID of the character's homeworld planet (optional)
    Must reference an existing planet
    """
    homeworldId: ID
    
    """
    List of starship IDs this character has piloted (optional)
    All IDs must reference existing starships
    """
    starshipIds: [ID!]
  }
  
  """
  Input type for recording a kill event
  """
  input RecordKillInput {
    """
    The ID of the character who performed the kill (required)
    Must reference an existing character
    """
    killerId: ID!
    
    """
    The ID of the character who was killed (required)
    Must reference an existing character
    Cannot be the same as killerId (no self-kills)
    """
    victimId: ID!
    
    """
    The method or weapon used (optional)
    Example: "Lightsaber", "Blaster", "Force Lightning"
    """
    method: String
    
    """
    The location where it occurred (optional)
    Example: "Death Star", "Tatooine"
    """
    location: String
    
    """
    Detailed description of the event (optional)
    """
    description: String
    
    """
    When it occurred (optional)
    ISO 8601 format or descriptive string
    """
    occurredAt: String
  }
`;

module.exports = typeDefs;