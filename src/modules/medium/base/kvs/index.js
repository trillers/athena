var assert = require('assert');
var context = require('../../../context');
var Tenant = require('./Tenant');
var Platform = require('./Platform');
var _exports = {};

_exports.tenant        = new Tenant(context);
_exports.platform        = new Platform(context);

module.exports = context.kvs = _exports;