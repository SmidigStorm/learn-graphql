#!/bin/bash

# Colors for output
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Stopping GraphQL Learning Application...${NC}"

# Stop all node processes
echo -e "${YELLOW}Stopping Node processes...${NC}"
pkill -f "node" 2>/dev/null

# Stop PostgreSQL database
echo -e "${YELLOW}Stopping PostgreSQL database...${NC}"
docker compose down

echo -e "${RED}All services stopped.${NC}"