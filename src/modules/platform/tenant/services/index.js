var u = require('../../../../app/util');
var context = require('../../../../context');

var PlatformTenantService = require('./PlatformTenantService');
var ExternalTenantService = require('./ExternalTenantService');

module.exports.platformTenantService = new PlatformTenantService(context);
module.exports.externalTenantService = new ExternalTenantService(context);

u.extend(context.services, module.exports);