'use strict';

let Joi = require('joi');

module.exports = {
  path: '/user',

  primary_key: 'user_id',

  resource: 'users',

  params: Joi.object().keys({
    id: Joi.string().guid(),

    email: Joi.string().email()
  }),

  payload: Joi.object().keys({
    user_id: Joi.string().guid(),

    email: Joi.string().email().required(),

    password: Joi.string().required(),

    address: Joi.string().default(null),

    address_book: Joi.array().items(Joi.string()).default(null),

    postcards: Joi.array().items(Joi.string()).default(null),

    new_password: Joi.string().default(null)
  })
};
