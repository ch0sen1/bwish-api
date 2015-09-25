'use strict';

let Boom = require('boom');
let pg = require('pg');
let uuid = require('node-uuid');
let _ = require('underscore');

let Config = require('../../../config');
let model = require('./model');

pg.defaults.database = Config.PG.database;

// removes clients from pool and return boom error
let handleError = (err, client, done) => {
  // no error occurred
  if (!err) return;

  // an error occured, remove the client from the pool
  if (client) done(client);

  return new Boom.badImplementation(err);
};

module.exports = [
  {
    method: 'GET',
    path: model.path,
    handler: (request, reply) => {
      pg.connect((err, client, done) => {
        if (err) return reply(handleError(err, client, done));

        client.query ({
          text: `SELECT *
          FROM ${model.table}`,
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
      description: `get all ${model.table}`
    }
  }, {
    method: 'GET',
    path: `${model.path}/{id}`,
    handler:  (request, reply) => {
      pg.connect((err, client, done) => {
        if (err) return reply(handleError(err, client, done));

        client.query ({
          text: `SELECT *
          FROM ${model.table}
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
      description: `get ${model.table}`
    }
  }, {
    method: 'POST',
    path: model.path,
    handler: (request, reply) => {
      pg.connect((err, client, done) => {
        if (err) return reply(handleError(err, client, done));

        // generate primary_key value
        request.payload[model.primary_key] = uuid.v4();

        let keys = Object.keys(request.payload);
        let valuesList = _.reduce(keys, (memo, val, index) => {
          if (index < keys.length - 1) return `${memo}$${index + 1}, `;
          else return `${memo}$${keys.length}`;
        }, '');

        client.query ({
          text: `INSERT INTO ${model.table} (${keys.toString()}) VALUES (${valuesList})`,
          values: _.map(keys, key => request.payload[key])
        }, err => {
          if (err) return reply(handleError(err, client, done));

          // remove client from pool
          done();

          return reply(request.payload);
        });
      });
    },
    config: {
      description: `add ${model.table}`,
      validate: {
        payload: model.schema
      }
    }
  }, {
    method: 'PUT',
    path: `${model.path}/{id}`,
    handler: (request, reply) => {
      pg.connect((err, client, done) => {
        if (err) return reply(handleError(err, client, done));

        // prevent changing primary_key
        request.payload[model.primary_key] = uuid.unparse(uuid.parse(request.params.id));

        let keys = Object.keys(request.payload);
        let valuesList = _.reduce(keys, (memo, val, index) => {
          if (index < keys.length - 1) return `${memo}${val}=$${index + 1}, `;
          else return `${memo}${val}=$${keys.length}`;
        }, '');

        client.query ({
          text: `UPDATE ${model.table}
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
    },
    config: {
      description: `update ${model.table}`,
      validate: {
        payload: model.schema
      }
    }
  }, {
    method: 'DELETE',
    path: `${model.path}/{id}`,
    handler: (request, reply) => {
      pg.connect((err, client, done) => {
        if (err) return reply(handleError(err, client, done));

        client.query ({
          text: `DELETE FROM ${model.table} WHERE ${model.primary_key}=$1`,
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
      description: `delete ${model.table}`
    }
  }
];
