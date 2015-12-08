var Promise = require('bluebird');
var u = require('../../../../app/util');
var context = require('../../../../context');

var Platform = require('./Platform');

module.exports.platform = Promise.promisifyAll(new Platform(context));

u.extend(context.kvs, module.exports);