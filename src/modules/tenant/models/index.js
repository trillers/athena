var u = require('../../../app/util');
var context = require('../../../context');

var Tenant = require('./Tenant');
var TenantMember = require('./TenantMember');

module.exports.Tenant        = Tenant(context.domainBuilder.main);
module.exports.TenantMember  = TenantMember(context.domainBuilder.main);

u.extend(context.models, module.exports);