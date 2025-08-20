# Claude.md - Project Context for AI Assistants

## Project Overview
This is a GraphQL learning project using the Star Wars universe as a data model. It consists of:
- **Server**: Apollo GraphQL server with PostgreSQL database
- **Client**: React application with Apollo Client
- **Database**: PostgreSQL with Star Wars data (characters, planets, starships, films)

## Key Commands
- **Start everything**: `./start.sh`
- **Stop everything**: `./stop.sh` or Ctrl+C
- **Start server only**: `cd server && npm start`
- **Start client only**: `cd client && npm start`
- **Start database**: `docker compose up -d`
- **Stop database**: `docker compose down`
- **Reset database**: `docker compose down -v && docker compose up -d`

## Project Structure
```
learn-graphql/
├── server/               # GraphQL server
│   ├── index.js         # Apollo Server setup
│   ├── schema.js        # GraphQL type definitions
│   ├── resolvers.js     # Database query logic
│   └── db/              # Database connection and SQL
│       ├── connection.js
│       └── init.sql     # Database schema and seed data
├── client/              # React frontend
│   └── src/
│       ├── components/  # UI components for each entity
│       ├── queries/     # GraphQL queries and mutations
│       └── apollo-client.js
└── docker-compose.yml   # PostgreSQL configuration
```

## Important Technical Details

### Database
- PostgreSQL 17 Alpine running in Docker
- Database name: `starwars`
- User: `jedi`
- Password: `force_awakens`
- Port: 5432
- Auto-initializes with schema and seed data from `server/db/init.sql`

### GraphQL Server
- Runs on http://localhost:4000
- GraphQL Playground available at the same URL
- Uses connection pooling for PostgreSQL
- Implements proper error handling and logging

### React Client
- Runs on http://localhost:3000
- Uses Apollo Client with caching
- Real-time UI updates after mutations
- Four main tabs: Characters, Planets, Starships, Films

## Common Issues and Solutions

### PostgreSQL Version Mismatch
If you see "database files are incompatible with server":
```bash
docker compose down -v  # Remove old volume
docker compose up -d    # Start fresh
```

### Port Already in Use
- Server (4000): Check for other Node processes
- Client (3000): Check for other React apps
- Database (5432): Check for local PostgreSQL

### Database Connection Issues
The server retries connection 3 times with exponential backoff. Check:
1. Docker is running: `docker ps`
2. Database is ready: `docker compose logs postgres`
3. Credentials match in `server/db/connection.js`

## Recent Changes
- Migrated from in-memory data to PostgreSQL-only implementation
- Removed files: `data.js`, `index-db.js`, `resolvers-db.js`
- Consolidated to single server entry point
- Added convenience scripts: `start.sh` and `stop.sh`

## Development Workflow
1. Make schema changes in `server/schema.js`
2. Update resolvers in `server/resolvers.js`
3. For database schema changes, update `server/db/init.sql` and reset database
4. Test queries in GraphQL Playground before updating client
5. Update React components and queries as needed

## Testing Queries
The server startup logs show example queries. Key operations:
- Query all characters with relationships
- Search characters by name
- Add new characters with mutations
- Update planet populations
- Assign pilots to starships

## Important Notes
- The project uses CommonJS modules (not ES6)
- No authentication/authorization implemented (learning project)
- Database resets on volume removal (data not persistent)
- All IDs in database are integers, not strings

## V8 Memory Optimization
To prevent V8 JavaScript engine crashes and memory issues:

### File Operations
- **Avoid large files**: Don't read files >10MB directly
- **Use .clignore**: Project includes .clignore to exclude node_modules and other large directories
- **Target specific paths**: Use precise file paths instead of broad directory searches

### Memory Management
- **Clear context regularly**: Use `/clear` command to free memory in long sessions
- **Restart for long tasks**: Restart Claude Code before major refactoring operations
- **Break up large tasks**: Split complex operations into smaller chunks

### Known Large Directories
- `client/node_modules`: ~443MB (excluded via .clignore)
- `server/node_modules`: ~31MB (excluded via .clignore)

### If Crashes Occur
- Save work frequently using git commits
- Report persistent issues at: https://github.com/anthropics/claude-code/issues
- Consider increasing Node memory if configurable: `NODE_OPTIONS="--max-old-space-size=4096"`