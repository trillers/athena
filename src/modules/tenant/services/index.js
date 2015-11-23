var assert = require('assert');
var context = require('../../../context');
var TenantService = require('./TenantService');
var PlatformTenantService = require('./PlatformTenantService');
var TenantMemberService = require('./TenantMemberService');
var _exports = {services: {}};

_exports.tenantService         = new TenantService(context);
_exports.platformTenantService = new PlatformTenantService(context);
_exports.tenantMemberService   = new TenantMemberService(context);

module.exports = context.services = _exports;