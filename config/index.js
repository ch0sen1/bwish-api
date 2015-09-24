'use strict';

// set up for default/development environment
let config = {
  CORS: ['*'],
  PORT: 4000,
  LOB_API_KEY: process.env.LOB_API_KEY
};

// set up for production environment
if (process.env.NODE_ENV === 'production') {
  config.CORS = ['http://bwish-ember.herokuapp.com'];
}

module.exports = config;
