var u = require('../../../app/util');
var context = require('../../../context');

var TenantService = require('./TenantService');
var TenantMemberService = require('./TenantMemberService');

module.exports.tenantService         = new TenantService(context);
module.exports.tenantMemberService   = new TenantMemberService(context);

u.extend(context.services, module.exports);