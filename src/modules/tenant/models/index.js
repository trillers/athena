var context = require('../../../context');
var Tenant = require('./Tenant');
var TenantMember = require('./TenantMember');
var _exports = {};

_exports.Tenant        = Tenant(context.domainBuilder.main);
_exports.TenantMember  = TenantMember(context.domainBuilder.main);

module.exports = context.models = _exports;