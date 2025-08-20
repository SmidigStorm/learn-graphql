#!/bin/bash
# Wrapper script to use psql from Docker container
docker exec -i starwars_postgres psql "$@"