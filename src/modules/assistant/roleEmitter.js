var RoleEmitter = require('./common/RoleEmitter');
var roleEmitter = new RoleEmitter();

require('../cs/handlers/CsHandler')(roleEmitter);
require('../admin/handlers/AdminHandler')(roleEmitter);
require('../customer/handlers/customerSiteHandler')(roleEmitter);

module.exports = roleEmitter;