const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { express: voyagerMiddleware } = require('graphql-voyager/middleware');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

async function startServer() {
  const app = express();

  // Create Apollo Server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    playground: true,
    context: ({ req }) => {
      return {};
    },
    formatError: (err) => {
      console.error(err);
      return err;
    }
  });

  // Start Apollo Server
  await server.start();

  // Apply Apollo middleware
  server.applyMiddleware({ app, path: '/graphql' });

  // Add Voyager middleware
  app.use('/voyager', voyagerMiddleware({ 
    endpointUrl: '/graphql',
    displayOptions: {
      rootType: 'Query',
      skipRelay: false,
      showLeafFields: true,
      sortByAlphabet: true,
      hideRoot: false
    }
  }));

  // Add a root route with links
  app.get('/', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Star Wars GraphQL API</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              max-width: 800px;
              margin: 50px auto;
              padding: 20px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              min-height: 100vh;
            }
            .container {
              background: white;
              border-radius: 10px;
              padding: 40px;
              box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            }
            h1 {
              color: #333;
              margin-bottom: 30px;
              font-size: 2.5em;
            }
            .links {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin-top: 30px;
            }
            .link-card {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 30px;
              border-radius: 8px;
              text-decoration: none;
              transition: transform 0.2s, box-shadow 0.2s;
              text-align: center;
            }
            .link-card:hover {
              transform: translateY(-5px);
              box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            }
            .link-card h2 {
              margin: 0 0 10px 0;
              font-size: 1.5em;
            }
            .link-card p {
              margin: 0;
              opacity: 0.9;
              font-size: 0.95em;
            }
            .info {
              margin-top: 30px;
              padding: 20px;
              background: #f5f5f5;
              border-radius: 5px;
              color: #666;
            }
            .emoji {
              font-size: 2em;
              margin-bottom: 10px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🚀 Star Wars GraphQL API</h1>
            <p>Welcome to your GraphQL learning environment! Explore the Star Wars universe through GraphQL.</p>
            
            <div class="links">
              <a href="/graphql" class="link-card">
                <div class="emoji">🎮</div>
                <h2>GraphQL Playground</h2>
                <p>Write and test queries interactively</p>
              </a>
              
              <a href="/voyager" class="link-card">
                <div class="emoji">🗺️</div>
                <h2>GraphQL Voyager</h2>
                <p>Visualize the schema as an interactive graph</p>
              </a>
            </div>
            
            <div class="info">
              <h3>📚 Quick Start:</h3>
              <ul>
                <li><strong>Playground:</strong> Write queries, explore docs, test mutations</li>
                <li><strong>Voyager:</strong> See relationships between types visually</li>
                <li><strong>Client App:</strong> Visit <a href="http://localhost:3000">http://localhost:3000</a></li>
              </ul>
            </div>
          </div>
        </body>
      </html>
    `);
  });

  const PORT = 4000;
  app.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}`);
    console.log(`🎮 GraphQL Playground available at http://localhost:${PORT}/graphql`);
    console.log(`🗺️  GraphQL Voyager available at http://localhost:${PORT}/voyager`);
    console.log(`🏠 Home page at http://localhost:${PORT}`);
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
  });
}

startServer().catch(err => {
  console.error('Error starting server:', err);
});