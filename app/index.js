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
], function (err) {
  if (err) throw err;

  server.start(function (err) {
    if (err) return Util.log('Error:', err.message);
    Util.log('Server started on port ' + Config.PORT);
  });
});

process.on('SIGTERM', function () {
  server.stop({timeout: 5 * 1000}, function () {
    process.exit(0);
  });
});

module.exports = server;
