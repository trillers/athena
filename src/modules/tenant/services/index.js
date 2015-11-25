var u = require('../../../app/util');
var context = require('../../../context');
var TenantService = require('./TenantService');
var PlatformTenantService = require('./PlatformTenantService');
var TenantMemberService = require('./TenantMemberService');
var _exports = {};

_exports.tenantService         = new TenantService(context);
_exports.platformTenantService = new PlatformTenantService(context);
_exports.tenantMemberService   = new TenantMemberService(context);

u.extend(context.services, _exports);
module.exports = context.services = _exports;