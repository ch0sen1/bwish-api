'use strict';

let Boom = require('boom');
let Lob = require('../../lib/lob');

let model = require('./model');

exports.register = (server, options, next) => {
  server.route([
    {
      method: 'GET',
      path: model.path,
      handler: (request, reply) => {
        Lob.postcards.list(request.query, (err, res) => {
          if (err) return reply(new Boom.create(err.status_code, err.message));

          return reply(res);
        });
      },
      config: {
        description: `get all postcard`,

        validate: {
          query: model.query
        }
      }
    }, {
      method: 'GET',
      path: `${model.path}/{id}`,
      handler:  (request, reply) => {
        Lob.postcards.retrieve(request.params.id, (err, res) => {
          if (err) return reply(new Boom.create(err.status_code, err.message));

          return reply(res);
        });
      },
      config: {
        description: `get postcard`,

        validate: {
          params: model.params
        }
      }
    }, {
      method: 'POST',
      path: model.path,
      handler: (request, reply) => {
        Lob.postcards.create(request.payload, (err, res) => {
          if (err) return reply(new Boom.create(err.status_code, err.message));

          return reply(res);
        });
      },
      config: {
        description: `add postcard`,

        validate: {
          payload: model.payload
        }
      }
    }
  ]);

  next();
};

exports.register.attributes = {
  name: 'postcard'
};
