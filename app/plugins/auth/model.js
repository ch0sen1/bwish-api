'use strict';

let userSchema = require('../user/model').payload;

module.exports = {
  path: '/auth',

  resource: 'users',

  payload: userSchema
};
