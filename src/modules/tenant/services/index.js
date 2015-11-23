var assert = require('assert');
var common = require('../../../common');
var context = require('../../../context');
var _exports = {services: {}};
var TenantService = require('./TenantService');
var PlatformTenantService = require('./PlatformTenantService');
var TenantMemberService = require('./TenantMemberService');

//assert.ok(this.redis = context.redis.main, 'no redis main client');

context.services.tenantService       = _exports.services.tenantService        = new TenantService(context);
context.services.platformTenantService       = _exports.services.platformTenantService        = new PlatformTenantService(context);
context.services.tenantMemberService       = _exports.services.tenantMemberService        = new TenantMemberService(context);

module.exports = _exports;