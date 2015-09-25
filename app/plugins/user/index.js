'use strict';

let model = require('./model');
let path = '/user';

module.exports = [
  {
    method: 'GET',
    path: path,
    handler: function (request, reply) {
      return reply('hello users');
    },
    config: {
      description: 'all users'
    }
  }, {
    method: 'GET',
    path: path + '/{id}',
    handler: function (request, reply) {
      return reply('hello user: ' + encodeURIComponent(request.params.id));
    },
    config: {
      description: 'a specific user'
    }
  }, {
    method: 'POST',
    path: path,
    handler: function (request, reply) {
      return reply('hello new user');
    },
    config: {
      description: 'a new user',
      validate: {
        payload: model
      }
    }
  }, {
    method: 'PUT',
    path: path + '/{id}',
    handler: function (request, reply) {
      return reply('changed user: ' + encodeURIComponent(request.params.id));
    },
    config: {
      description: 'update a user',
      validate: {
        payload: model
      }
    }
  }, {
    method: 'DELETE',
    path: path + '/{id}',
    handler: function (request, reply) {
      return reply('deleted user: ' + encodeURIComponent(request.params.id));
    },
    config: {
      description: 'delete a user'
    }
  }
];
