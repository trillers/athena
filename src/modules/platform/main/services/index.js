var u = require('../../../../app/util');
var context = require('../../../../context');

var PlatformService = require('./PlatformService');

module.exports.platformService         = new PlatformService(context);

u.extend(context.services, module.exports);