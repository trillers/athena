var Promise = require('bluebird');
var u = require('../../../../app/util');
var context = require('../../../../context');

var PlatformUser = require('./PlatformUser');

module.exports.platformUser = Promise.promisifyAll(new PlatformUser(context));

u.extend(context.kvs, module.exports);