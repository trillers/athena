var RoleEmitter = require('./common/TenantRoleEmitter');
var roleEmitter = new RoleEmitter();

require('../customer/handlers/customerSiteHandler')(roleEmitter);
require('../platform/handlers/PoHandler')(roleEmitter);

module.exports = roleEmitter;