'use strict';

let Joi = require('joi');

let addressSchema = require('../address/model').payload;

module.exports = {
  path: '/postcard',

  params: Joi.object().keys({
    id: Joi.string().required()
  }),

  payload: Joi.object().keys({
    description: Joi.string().default(null),

    to: Joi.alternatives().try(
      Joi.string(),

      addressSchema
    ).required(),

    from: Joi.alternatives().try(
      Joi.string(),

      addressSchema
    ).required(),

    message: Joi.string().max(350),

    front: Joi.alternatives().try(
      Joi.string().uri(),

      Joi.string()
    ).required(),

    back: Joi.alternatives().try(
      Joi.string().uri(),

      Joi.string()
    ).required(),

    setting: Joi.number().valid(1001, 1002).default(1001),

    data: Joi.object(),

    metadata: Joi.object().pattern(/^.{1,40}/, Joi.string().max(500)).max(20)
  }).xor('message', 'back'),

  query: Joi.object().keys({
    count: Joi.number().max(100).default(10),

    metadata: Joi.object().pattern(/^.{1,40}/, Joi.string().max(500)).max(20),

    offset: Joi.number().default(0)
  })
};
