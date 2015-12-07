var Promise = require('bluebird');
var u = require('../../../../app/util');
var context = require('../../../../context');

var PlatformUserService = require('./PlatformUserService');

module.exports.platformUserService = Promise.promisifyAll(new PlatformUserService(context));

u.extend(context.services, module.exports);