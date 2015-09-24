'use strict';

var Joi = require('joi');

module.exports = {
  email: Joi.string().email().required(),
  first_name: Joi.string(),
  last_name: Joi.string()
};
