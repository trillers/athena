var Promise = require('bluebird');
var u = require('../../../app/util');
var context = require('../../../context');

var TenantService = require('./TenantService');
var TenantMemberService = require('./TenantMemberService');

module.exports.tenantService         = Promise.promisifyAll(new TenantService(context));
module.exports.tenantMemberService   = Promise.promisifyAll(new TenantMemberService(context));

u.extend(context.services, module.exports);