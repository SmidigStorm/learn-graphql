# PostgreSQL Database Setup

## Quick Start

1. Start PostgreSQL with Docker Compose:
```bash
# From the root directory (learn-graphql/)
docker-compose up -d
```

2. Start the GraphQL server with database:
```bash
cd server
npm run start:db
```

## Database Schema

The database uses a normalized structure with proper relationships:

### Tables:
- **characters** - Star Wars characters with foreign key to planets
- **planets** - Planets with population, climate, and terrain
- **starships** - Spacecraft with specifications
- **films** - Movies with episode numbers and release dates
- **character_starships** - Many-to-many junction table
- **character_films** - Many-to-many junction table

### Key Differences from In-Memory Version:

1. **IDs are auto-generated** - PostgreSQL SERIAL type
2. **Proper foreign keys** - Database enforces referential integrity
3. **Indexes for performance** - On foreign keys and junction tables
4. **Transactions** - Mutations use transactions for data consistency

## Connection Details

- Host: localhost
- Port: 5432
- Database: starwars
- Username: jedi
- Password: force_awakens

## Useful Commands

```bash
# Connect to database with psql
docker exec -it starwars_postgres psql -U jedi -d starwars

# View all tables
\dt

# Describe a table
\d characters

# Run a query
SELECT c.name, p.name as homeworld 
FROM characters c 
LEFT JOIN planets p ON c.homeworld_id = p.id;

# See junction table relationships
SELECT c.name as character, s.name as starship
FROM character_starships cs
JOIN characters c ON cs.character_id = c.id
JOIN starships s ON cs.starship_id = s.id
ORDER BY c.name;
```

## Reset Database

To reset the database:
```bash
docker-compose down -v
docker-compose up -d
```

This will recreate the database with initial data from `init.sql`.