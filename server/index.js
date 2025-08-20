const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  // Enable GraphQL Playground
  introspection: true,
  playground: true
});

server.listen({ port: 4000 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
  console.log(`🎮 GraphQL Playground available at ${url}`);
  console.log('\n📝 Try these example queries in the playground:');
  console.log('\n1. Get all characters:');
  console.log(`
query {
  characters {
    name
    height
    homeworld {
      name
    }
  }
}
  `);
  console.log('\n2. Search for a character:');
  console.log(`
query {
  searchCharacters(name: "Luke") {
    name
    starships {
      name
      model
    }
    films {
      title
      episodeId
    }
  }
}
  `);
  console.log('\n3. Get planet with residents:');
  console.log(`
query {
  planet(id: "1") {
    name
    climate
    residents {
      name
      height
    }
  }
}
  `);
});