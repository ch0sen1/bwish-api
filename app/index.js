'use strict';

let Hapi = require('hapi');
let Util = require('util');

let Config = require('../config');

let server = new Hapi.Server({
  connections: {
    routes: {
      cors: {
        origin: Config.CORS,
        credentials: true
      },
      json: {
        space: 2
      }
    }
  }
});

server.connection({
  host: '0.0.0.0',
  port: Config.PORT
});

server.register([
  require('./plugins')
], err => {
  if (err) throw err;

  server.start(err => {
    if (err) return Util.log('Error:', err.message);
    Util.log(`Server started on port ${Config.PORT}`);
  });
});

process.on('SIGTERM', () => server.stop({timeout: 5 * 1000}, () => process.exit(0)));

module.exports = server;
