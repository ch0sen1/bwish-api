'use strict';

var Boom = require('boom');

exports.register = function (server, options, next) {
  server.route(
    [
      {
        method: 'GET',
        path: '/',
        handler: function (req, reply) {
          reply(new Boom.notFound());
        },
        config: {
          description: 'not found 404 error'
        }
      }
    ].concat(require('./user'))
  );

  next();
};

exports.register.attributes = {
  name: 'plugins'
};
