var assert = require('assert');
var common = require('../../../common');
var context = require('../../../context');
var _exports = {models: {}};
var Tenant = require('./Tenant');
var TenantMember = require('./TenantMember');

//assert.ok(this.redis = context.redis.main, 'no redis main client');

context.models.Tenant       = _exports.models.Tenant        = Tenant(context.domainBuilder.main);
context.models.TenantMember = _exports.models.TenantMember  = TenantMember(context.domainBuilder.main);

module.exports = _exports;