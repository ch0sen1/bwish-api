'use strict';

// set up for default/development environment
let config = {
  CORS: ['*'],
  PORT: 4000,
  PG: {
    // user: process.env.User
    // database: process.env.User
    // password: null
    // port: 5432
    // host: 'localhost'
    // ssl: false
    database: 'bwish'
  },
  LOB_API_KEY: process.env.LOB_API_KEY,
  JWT_SECRET: process.env.JWT_SECRET
};

// set up for production environment
if (process.env.NODE_ENV === 'production') {
  config.CORS = ['http://bwish-ember.herokuapp.com'];
}

module.exports = config;
