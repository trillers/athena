var u = require('../../../../app/util');
var context = require('../../../../context');

var PlatformUser = require('./PlatformUser');

module.exports.platformUser        = new PlatformUser(context);

u.extend(context.kvs, module.exports);