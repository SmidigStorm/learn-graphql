const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  // Enable GraphQL Playground
  introspection: true,
  playground: true,
  // Add context for better error messages
  context: ({ req }) => {
    return {};
  },
  formatError: (err) => {
    console.error(err);
    return err;
  }
});

server.listen({ port: 4000 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
  console.log(`🎮 GraphQL Playground available at ${url}`);
  console.log('\n📝 Try these example queries in the playground:');
  console.log('\n1. Get all characters with their relationships:');
  console.log(`
query {
  characters {
    id
    name
    height
    homeworld {
      name
      population
    }
    starships {
      name
      model
    }
    films {
      title
      episode_id
    }
  }
}
  `);
  console.log('\n2. Search for a character:');
  console.log(`
query {
  searchCharacters(name: "Luke") {
    name
    homeworld {
      name
      residents {
        name
      }
    }
  }
}
  `);
  console.log('\n3. Add a new character:');
  console.log(`
mutation {
  addCharacter(input: {
    name: "Rey"
    height: 170
    homeworldId: 1
    starshipIds: [1]
    filmIds: [4]
  }) {
    id
    name
    homeworld {
      name
    }
  }
}
  `);
});