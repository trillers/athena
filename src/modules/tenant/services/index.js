var u = require('../../../app/util');
var context = require('../../../context');

var TenantService = require('./TenantService');
var PlatformTenantService = require('./PlatformTenantService');
var ExternalTenantService = require('./ExternalTenantService');
var TenantMemberService = require('./TenantMemberService');

module.exports.tenantService         = new TenantService(context);
module.exports.platformTenantService = new PlatformTenantService(context);
module.exports.externalTenantService = new ExternalTenantService(context);
module.exports.tenantMemberService   = new TenantMemberService(context);

u.extend(context.services, module.exports);