'use strict';

let Boom = require('boom');
let hash = require('password-hash');
let jwt = require('jsonwebtoken');
let pg = require('pg');

let Config = require('../../../config');
let model = require('./model');

pg.defaults.database = Config.PG.database;

// removes clients from pool and return boom error
let handleError = (err, client, done) => {
  // an error occured, remove the client from the pool
  if (client) done(client);

  return new Boom.wrap(err);
};

exports.register = function (server, options, next) {
  server.register(require('hapi-auth-jwt2'), err =>  {
    if (err) return new Boom.wrap(err);

    server.auth.strategy('jwt', 'jwt', true, {
      key: Config.JWT_SECRET,
      validateFunc: (decoded, request, callback) => {
        if (!decoded.id) return callback(null, false);
        else return callback(null, true);
      },
      verifyOptions: {algorithms: ['HS256']}
    });
  });

  server.route({
    method: 'POST',
    path: model.path,
    handler: (request, reply) => {
      pg.connect((err, client, done) => {
        if (err) return reply(handleError(err, client, done));

        client.query ({
          text: `SELECT *
          FROM ${model.resource}
          WHERE email=$1`,
          values: [request.payload.email]
        }, (err, result) => {
          if (err) return reply(handleError(err, client, done));

          // remove client from pool
          done();

          // check result length
          if (result.rows.length !== 1) return reply(new Boom.notFound(`email '${request.payload.email}' not found`));

          // check for password
          if (!hash.verify(request.payload.password, result.rows[0].password)) return reply(new Boom.unauthorized('invalid password'));

          // add user_id to payload
          request.payload.id = result.rows[0].user_id;

          delete request.payload.password;
          delete request.payload.new_password;

          // return jwt
          return reply(jwt.sign(request.payload, Config.JWT_SECRET, {
            expiresIn: '2 days',
            audience: 'web',
            issuer: 'bwish-api'
          }));
        });
      });
    },
    config: {
      auth: false,

      description: `authenticate user`,

      validate: {
        payload: model.payload
      }
    }
  });

  next();
};

exports.register.attributes = {
  name: 'auth'
};
