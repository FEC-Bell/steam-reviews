const path = require('path');

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      user: 'postgres',
      password: process.env.PG_PASS,
      database: 'steam_reviews'
    },
    migrations: {
      directory: path.resolve(__dirname, 'db', 'migrations')
    },
    seeds: {
      directory: path.resolve(__dirname, 'db', 'seeds')
    }
  },
  production: {
    client: 'pg',
    connection: process.env.PGDB_URI,
    migrations: {
      directory: path.resolve(__dirname, 'db', 'migrations')
    },
    seeds: {
      directory: path.resolve(__dirname, 'db', 'seeds', 'production')
    }
  }
};