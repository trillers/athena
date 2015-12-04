var u = require('../../../../app/util');
var context = require('../../../../context');

var PlatformUserService = require('./PlatformUserService');

module.exports.platformUserService         = new PlatformUserService(context);

u.extend(context.services, module.exports);