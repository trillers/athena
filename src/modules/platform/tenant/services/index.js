var Promise = require('bluebird');
var u = require('../../../../app/util');
var context = require('../../../../context');

var PlatformTenantService = require('./PlatformTenantService');
var ExternalTenantService = require('./ExternalTenantService');

module.exports.platformTenantService = Promise.promisifyAll(new PlatformTenantService(context));
module.exports.externalTenantService = Promise.promisifyAll(new ExternalTenantService(context));

u.extend(context.services, module.exports);