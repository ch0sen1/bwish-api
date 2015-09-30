'use strict';

let Joi = require('joi');

module.exports = {
  path: '/address',

  params: Joi.object().keys({
    id: Joi.string().required()
  }),

  payload: Joi.object().keys({
    description: Joi.string().default(null),

    name: Joi.string().max(50),

    company: Joi.string().max(200),

    email: Joi.string().email().default(null),

    phone: Joi.string().default(null),

    address_line1: Joi.string().required(),

    address_line2: Joi.string(),

    address_city: Joi.string().required(),

    address_state: Joi.string().max(2).required(),

    address_zip: Joi.number().required(),

    address_country: Joi.string().max(2).required(),

    metadata: Joi.object().pattern(/^.{1,40}/, Joi.string().max(500)).max(20)
  }).or('name', 'company'),

  verifyAddress: Joi.object().keys({
    address_line1: Joi.string(),

    address_line2: Joi.string(),

    address_city: Joi.string(),

    address_state: Joi.string().max(2),

    address_zip: Joi.number(),

    address_country: Joi.string().max(2)
  }),

  query: Joi.object().keys({
    count: Joi.number().max(100).default(10),

    metadata: Joi.object().pattern(/^.{1,40}/, Joi.string().max(500)).max(20),

    offset: Joi.number().default(0)
  })
};
