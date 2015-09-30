'use strict';

let Boom = require('boom');
let Lob = require('../../lib/lob');

let model = require('./model');

module.exports = [
  {
    method: 'GET',
    path: model.path,
    handler: (request, reply) => {
      Lob.addresses.list(request.query, (err, res) => {
        if (err) return reply(new Boom.create(err.status_code, err.message));

        return reply(res);
      });
    },
    config: {
      description: `get all address`,
      validate: {
        query: model.query
      }
    }
  }, {
    method: 'GET',
    path: `${model.path}/{id}`,
    handler:  (request, reply) => {
      Lob.addresses.retrieve(request.params.id, (err, res) => {
        if (err) return reply(new Boom.create(err.status_code, err.message));

        return reply(res);
      });
    },
    config: {
      description: `get address`,
      validate: {
        params: model.params
      }
    }
  }, {
    method: 'POST',
    path: model.path,
    handler: (request, reply) => {
      Lob.addresses.create(request.payload, (err, res) => {
        if (err) return reply(new Boom.create(err.status_code, err.message));

        return reply(res);
      });
    },
    config: {
      description: `add address`,
      validate: {
        payload: model.payload
      }
    }
  }, {
    method: 'POST',
    path: `${model.path}/verify`,
    handler: (request, reply) => {
      Lob.verification.verify(request.payload, (err, res) => {
        if (err) return reply(new Boom.create(err.status_code, err.message));

        return reply(res);
      });
    },
    config: {
      description: `verify address`,
      validate: {
        payload: model.verifyAddress
      }
    }
  }, {
    method: 'DELETE',
    path: `${model.path}/{id}`,
    handler: (request, reply) => {
      Lob.addresses.delete(request.params.id, (err, res) => {
        if (err) return reply(new Boom.create(err.status_code, err.message));

        return reply(res);
      });
    },
    config: {
      description: `delete address`,
      validate: {
        params: model.params
      }
    }
  }
];
