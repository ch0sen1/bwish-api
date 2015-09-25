'use strict';

var Joi = require('joi');

module.exports = {
  user_id: Joi.string().guid().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  address: Joi.string().guid(),
  address_book: Joi.array().items(Joi.string().guid())
};
