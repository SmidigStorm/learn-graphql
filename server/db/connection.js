const { Pool } = require('pg');

// Create a connection pool
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'starwars',
  user: 'jedi',
  password: 'force_awakens',
  max: 20, // maximum number of clients in the pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test the connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};