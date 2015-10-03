'use strict';

let Boom = require('boom');

exports.register = (server, options, next) => {
  server.register([
    require('./address'),
    require('./auth'),
    require('./postcard'),
    require('./user')
  ], err =>  {
    if (err) return new Boom.wrap(err);
  });

  next();
};

exports.register.attributes = {
  name: 'plugins'
};
