# Star Wars GraphQL Learning Project

A hands-on project to learn GraphQL fundamentals using the Star Wars universe as a fun, relatable data model.

## Quick Start

The easiest way to start the entire application:

```bash
./start.sh
```

This will:
1. Start PostgreSQL database in Docker
2. Install dependencies for both server and client
3. Start the GraphQL server (http://localhost:4000)
4. Start the React client (http://localhost:3000)

To stop everything:
```bash
./stop.sh
```

## What You'll Learn

- **GraphQL Schema Design**: Types, queries, mutations, and relationships
- **Apollo Server**: Setting up a GraphQL server with Node.js
- **Apollo Client**: Consuming GraphQL APIs in React
- **Real-time Updates**: How mutations update the UI
- **Query Variables**: Dynamic queries with parameters
- **Nested Queries**: Fetching related data efficiently

## Project Structure

```
learn-graphql/
├── server/           # Backend GraphQL server
│   ├── index.js     # Apollo Server setup
│   ├── schema.js    # GraphQL type definitions
│   ├── resolvers.js # Query/mutation logic
│   └── db/          # Database connection and setup
└── client/          # Frontend React app
    ├── src/
    │   ├── apollo-client.js    # Apollo Client setup
    │   ├── components/         # React components
    │   └── queries/            # GraphQL queries/mutations
    └── package.json
```

## Manual Setup

If you prefer to start components individually:

### 1. Start PostgreSQL
```bash
docker compose up -d
```

### 2. Start the GraphQL Server
```bash
cd server
npm install
npm start
```

The server will start at http://localhost:4000 with GraphQL Playground.

### 3. Start the React Client
In a new terminal:
```bash
cd client
npm install
npm start
```

The React app will open at http://localhost:3000

## Try These Exercises

### 1. Explore the GraphQL Playground

Visit http://localhost:4000 and try these queries:

```graphql
# Get all characters with their homeworlds
query {
  characters {
    name
    homeworld {
      name
      climate
    }
  }
}

# Search for a character
query {
  searchCharacters(name: "Luke") {
    name
    starships {
      name
      model
    }
  }
}

# Add a new character
mutation {
  addCharacter(input: {
    name: "Ahsoka Tano"
    height: 170
    homeworldId: "1"
  }) {
    id
    name
    homeworld {
      name
    }
  }
}
```

### 2. Understand Query Flexibility

GraphQL lets you request exactly what you need. Compare these queries:

```graphql
# Minimal data
query {
  characters {
    name
  }
}

# Detailed data with relationships
query {
  characters {
    name
    height
    mass
    homeworld {
      name
      climate
      residents {
        name
      }
    }
    starships {
      name
      pilots {
        name
      }
    }
  }
}
```

### 3. Explore the React App

- **Characters Tab**: View all characters, add new ones
- **Planets Tab**: Explore planets and update populations
- **Starships Tab**: Assign pilots to starships
- **Films Tab**: See the chronological order of films

### 4. Modify the Code

Try these challenges:

1. Add a new field to Character (e.g., `species`)
2. Create a mutation to remove a pilot from a starship
3. Add a search feature to the Planets tab
4. Create a new query to get characters by homeworld

## Key GraphQL Concepts Demonstrated

### Schema-First Design
The schema (`schema.js`) defines the structure of your API before implementation.

### Resolvers
Resolvers (`resolvers.js`) contain the logic for fetching and manipulating data from the PostgreSQL database.

### Relationships
See how Characters, Planets, Starships, and Films are connected through field resolvers.

### Mutations
Learn how to modify data and see real-time UI updates.

### Apollo Cache
Notice how the UI updates automatically after mutations without refetching.

### Database Translation (PostgreSQL version)
The database version demonstrates how GraphQL translates database relationships:
- Foreign keys become named relationships (`planet_id` → `homeworld`)
- Junction tables become arrays (`character_starships` → `starships: [Starship]`)
- Complex queries are hidden behind simple field names
- See `server/examples/` for patterns on translating messy databases

## Next Steps

1. Add subscriptions for real-time updates
2. Implement pagination for large datasets
3. Add authentication and authorization
4. Add more complex database relationships and queries
5. Explore GraphQL directives and custom scalars

## Resources

- [GraphQL Documentation](https://graphql.org/learn/)
- [Apollo Server Docs](https://www.apollographql.com/docs/apollo-server/)
- [Apollo Client Docs](https://www.apollographql.com/docs/react/)

May the Force be with your GraphQL journey! 🚀