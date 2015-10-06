'use strict';

let Boom = require('boom');
let hash = require('password-hash');
let pg = require('pg');
let uuid = require('node-uuid');
let _ = require('underscore');

let Config = require('../../../config');
let model = require('./model');

pg.defaults.database = Config.PG.database;

// removes clients from pool and return boom error
let handleError = (err, client, done) => {
  // an error occured, remove the client from the pool
  if (client) done(client);

  return new Boom.wrap(err);
};

exports.register = (server, options, next) => {
  server.route([
    {
      method: 'GET',
      path: model.path,
      handler: (request, reply) => {
        pg.connect((err, client, done) => {
          if (err) return reply(handleError(err, client, done));

          client.query ({
            text: `SELECT *
            FROM ${model.resource}`,
            values: []
          }, (err, result) => {
            if (err) return reply(handleError(err, client, done));

            // remove client from pool
            done();

            return reply(result.rows);
          });
        });
      },
      config: {
        description: `get all ${model.resource}`
      }
    }, {
      method: 'GET',
      path: `${model.path}/{id}`,
      handler:  (request, reply) => {
        pg.connect((err, client, done) => {
          if (err) return reply(handleError(err, client, done));

          client.query ({
            text: `SELECT *
            FROM ${model.resource}
            WHERE ${model.primary_key}=$1`,
            values: [request.params.id]
          }, (err, result) => {
            if (err) return reply(handleError(err, client, done));

            // remove client from pool
            done();

            return reply(result.rows);
          });
        });
      },
      config: {
        description: `get ${model.resource}`,

        validate: {
          params: model.params
        }
      }
    }, {
      method: 'GET',
      path: `${model.path}/email/{email}`,
      handler:  (request, reply) => {
        pg.connect((err, client, done) => {
          if (err) return reply(handleError(err, client, done));

          client.query ({
            text: `SELECT *
            FROM ${model.resource}
            WHERE email=$1`,
            values: [request.params.email]
          }, (err, result) => {
            if (err) return reply(handleError(err, client, done));

            // remove client from pool
            done();

            return reply(result.rows);
          });
        });
      },
      config: {
        description: `get ${model.resource} by email`,

        validate: {
          params: model.params
        }
      }
    }, {
      method: 'POST',
      path: model.path,
      handler: (request, reply) => {
        pg.connect((err, client, done) => {
          if (err) return reply(handleError(err, client, done));

          // sanitize payload
          delete request.payload.new_password;

          // generate primary_key value
          request.payload[model.primary_key] = uuid.v4();

          // salt and hash password
          if (!hash.isHashed(request.payload.password)) request.payload.password = hash.generate(request.payload.password);

          client.query ({
            text: `SELECT *
            FROM ${model.resource}
            WHERE email=$1`,
            values: [request.payload.email]
          }, (err, result) => {
            if (err) return reply(handleError(err, client, done));

            if (result.rows.length > 0) return reply(new Boom.unauthorized('email already exists'));

            let keys = Object.keys(request.payload);
            let valuesList = _.reduce(keys, (memo, val, index) => {
              if (index < keys.length - 1) return `${memo}$${index + 1}, `;
              else return `${memo}$${keys.length}`;
            }, '');

            client.query ({
              text: `INSERT INTO ${model.resource} (${keys.toString()}) VALUES (${valuesList})`,
              values: _.map(keys, key => request.payload[key])
            }, err => {
              if (err) return reply(handleError(err, client, done));

              // remove client from pool
              done();

              // sanitize payload
              delete request.payload.password;

              return reply(request.payload);
            });
          });
        });
      },
      config: {
        auth: false,

        description: `add ${model.resource}`,

        validate: {
          payload: model.payload
        }
      }
    }, {
      method: 'PUT',
      path: `${model.path}/{id}`,
      handler: (request, reply) => {
        pg.connect((err, client, done) => {
          if (err) return reply(handleError(err, client, done));

          // prevent changing primary_key and email
          if (request.payload[model.primary_key]) delete request.payload[model.primary_key];
          if (request.payload[model.email]) delete request.payload[model.email];

          client.query ({
            text: `SELECT *
            FROM ${model.resource}
            WHERE ${model.primary_key}=$1`,
            values: [request.params.id]
          }, (err, result) => {
            if (err) return reply(handleError(err, client, done));

            // check for password
            if (!hash.verify(request.payload.password, result.rows[0].password)) return reply(new Boom.unauthorized('invalid password'));

            // remove password from payload
            delete request.payload.password;

            // update password
            if (hash.isHashed(request.payload.new_password)) {
              request.payload.password = request.payload.new_password;

              delete request.payload.new_password;
            } else if (request.payload.new_password) {
              request.payload.password = hash.generate(request.payload.new_password);

              delete request.payload.new_password;
            }

            let keys = Object.keys(request.payload);
            let valuesList = _.reduce(keys, (memo, val, index) => {
              if (index < keys.length - 1) return `${memo}${val}=$${index + 1}, `;
              else return `${memo}${val}=$${keys.length}`;
            }, '');

            return client.query ({
              text: `UPDATE ${model.resource}
              SET ${valuesList}
              WHERE ${model.primary_key}='${request.params.id}'`,
              values: _.map(keys, key => request.payload[key])
            }, err => {
              if (err) return reply(handleError(err, client, done));

              // remove client from pool
              done();

              return reply(request.payload);
            });
          });
        });
      },
      config: {
        description: `update ${model.resource}`,

        validate: {
          params: model.params,

          payload: model.payload
        }
      }
    }, {
      method: 'DELETE',
      path: `${model.path}/{id}`,
      handler: (request, reply) => {
        pg.connect((err, client, done) => {
          if (err) return reply(handleError(err, client, done));

          client.query ({
            text: `SELECT *
            FROM ${model.resource}
            WHERE ${model.primary_key}=$1`,
            values: [request.params.id]
          }, (err, result) => {
            if (err) return reply(handleError(err, client, done));

            // check email
            if (request.payload.email !== result.rows[0].email) return reply(new Boom.unauthorized('invalid email'));

            // check for password
            if (!hash.verify(request.payload.password, result.rows[0].password)) return reply(new Boom.unauthorized('invalid password'));

            return client.query ({
              text: `DELETE FROM ${model.resource} WHERE ${model.primary_key}=$1`,
              values: [request.params.id]
            }, (err, result) => {
              if (err) return reply(handleError(err, client, done));

              // remove client from pool
              done();

              return reply(result.rows);
            });
          });
        });
      },
      config: {
        description: `delete ${model.resource}`,

        validate: {
          params: model.params,

          payload: model.payload
        }
      }
    }
  ]);

  next();
};

exports.register.attributes = {
  name: 'user'
};
