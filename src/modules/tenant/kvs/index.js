var Promise = require('bluebird');
var u = require('../../../app/util');
var context = require('../../../context');

var Tenant = require('./Tenant');

module.exports.tenant = Promise.promisifyAll(new Tenant(context));

u.extend(context.kvs, module.exports);