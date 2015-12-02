var assert = require('assert');
var context = require('../../../../context');
var Platform = require('./Platform');
var _exports = {};

_exports.platform        = new Platform(context);

module.exports = context.kvs = _exports;