#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}Starting GraphQL Learning Application...${NC}"
echo ""

# Start PostgreSQL database
echo -e "${YELLOW}Starting PostgreSQL database...${NC}"
docker compose up -d

# Wait for database to be ready
echo -e "${YELLOW}Waiting for database to be ready...${NC}"
sleep 5

# Install and start server
echo -e "${YELLOW}Starting GraphQL server...${NC}"
cd server
npm install
npm start &
SERVER_PID=$!
cd ..

# Wait for server to start
echo -e "${YELLOW}Waiting for server to start...${NC}"
sleep 3

# Install and start client
echo -e "${YELLOW}Starting React client...${NC}"
cd client
npm install
npm start &
CLIENT_PID=$!
cd ..

echo ""
echo -e "${GREEN}Application started successfully!${NC}"
echo -e "${GREEN}GraphQL Server: http://localhost:4000${NC}"
echo -e "${GREEN}React Client: http://localhost:3000${NC}"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop all services${NC}"

# Wait for user to press Ctrl+C
trap 'echo -e "\n${YELLOW}Stopping services...${NC}"; kill $SERVER_PID $CLIENT_PID 2>/dev/null; docker compose down; exit' INT
wait