var RoleMsgDispatcher = require('./common/RoleMsgDispatcher');
var dispatcher = new RoleMsgDispatcher();

//require('../cs/handlers/CsHandler')(dispatcher);
//require('../admin/handlers/AdminHandler')(dispatcher);
//require('../customer/handlers/customerSiteHandler')(dispatcher);

module.exports = dispatcher;