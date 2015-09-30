'use strict';

let Boom = require('boom');
let _ = require('underscore');

exports.register = (server, options, next) => {
  server.route(
    _.union([{
      method: 'GET',
      path: '/{path*}',
      handler: reply => reply(new Boom.notFound()),
      config: {
        description: 'not found'
      }
    }], require('./user'), require('./address'), require('./postcard'))
  );

  next();
};

exports.register.attributes = {
  name: 'plugins'
};
