'use strict';

let Lob = require('lob');

let Config = require('../../config');

module.exports = Lob(Config.LOB_API_KEY);
