'use strict';

let Joi = require('joi');

module.exports = {
  path: '/user',

  primary_key: 'user_id',

  table: 'users',

  schema: Joi.object().keys({
    user_id: Joi.string().guid(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    address: Joi.string().guid().default(null),
    address_book: Joi.array().items(Joi.string().guid()).default(null)
  })
};
